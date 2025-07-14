import { NullaryProvider, UnaryProvider } from "./Provider";
import { ALL_BINARY_PROVIDERS, ALL_NULLARY_PROVIDERS, ALL_TERNARY_PROVIDERS, ALL_UNARY_PROVIDERS } from "./standard-providers";
import { DDValue, isDDValue } from "./types";

interface SerializedNullaryProvider {
    name: string
}
function isSerializedNullaryProvider(v: unknown): v is SerializedNullaryProvider {
    return typeof v === "object"
        && v !== null
        && "name" in v
        && typeof v.name === "string";
}

interface SerializedUnaryProvider {
    name: string,
    arg: SerializedProviderArg
}
function isSerializedUnaryProvider(v: unknown): v is SerializedUnaryProvider {
    return typeof v === "object"
        && v !== null
        && "name" in v
        && typeof v.name === "string"
        && "arg" in v
        && isSerializedProviderArg(v.arg);
}

interface SerializedBinaryProvider {
    name: string,
    lhs: SerializedProviderArg,
    rhs: SerializedProviderArg
}
function isSerializedBinaryProvider(v: unknown): v is SerializedBinaryProvider {
    return typeof v === "object"
        && v !== null
        && "name" in v
        && typeof v.name === "string"
        && "lhs" in v
        && isSerializedProviderArg(v.lhs)
        && "rhs" in v
        && isSerializedProviderArg(v.rhs);
}

interface SerializedTernaryProvider {
    name: string,
    a: SerializedProviderArg,
    b: SerializedProviderArg,
    c: SerializedProviderArg
}
function isSerializedTernaryProvider(v: unknown): v is SerializedTernaryProvider {
    return typeof v === "object"
        && v !== null
        && "name" in v
        && typeof v.name === "string"
        && 'a' in v
        && isSerializedProviderArg(v.a)
        && 'b' in v
        && isSerializedProviderArg(v.b)
        && 'c' in v
        && isSerializedProviderArg(v.c);
}

export type SerializedProviderArg =
    DDValue |
    SerializedNullaryProvider |
    SerializedUnaryProvider |
    SerializedBinaryProvider |
    SerializedTernaryProvider;
export function isSerializedProviderArg(v: unknown): v is SerializedProviderArg {
    return isDDValue(v)
        || isSerializedNullaryProvider(v)
        || isSerializedUnaryProvider(v)
        || isSerializedBinaryProvider(v)
        || isSerializedTernaryProvider(v);
}

export function deserializeProvider(serialized: SerializedProviderArg): NullaryProvider<any> {
    if (isDDValue(serialized)) return NullaryProvider.literal(serialized);
    else if (isSerializedTernaryProvider(serialized)) {
        const ternaryProviderCollection = ALL_TERNARY_PROVIDERS[serialized.name];
        if (!ternaryProviderCollection) throw new ReferenceError(`no ternary provider with name "${serialized.name}" exists`);

        const aProvider = deserializeProvider(serialized.a);
        const bProvider = deserializeProvider(serialized.b);
        const cProvider = deserializeProvider(serialized.c);

        const ternaryProvider = ternaryProviderCollection.findImpl(aProvider.returnType, bProvider.returnType, cProvider.returnType);

        return new NullaryProvider(
            ternaryProvider.returnType,
            ctx => ternaryProvider.apply(
                ctx,
                aProvider.apply(ctx),
                bProvider.apply(ctx),
                cProvider.apply(ctx)
            )
        );
    }
    else if (isSerializedBinaryProvider(serialized)) {
        const binaryProviderCollection = ALL_BINARY_PROVIDERS[serialized.name];
        if (!binaryProviderCollection) throw new ReferenceError(`no binary provider with name "${serialized.name}" exists`);

        const lhsProvider = deserializeProvider(serialized.lhs);
        const rhsProvider = deserializeProvider(serialized.rhs);

        const binaryProvider = binaryProviderCollection.findImpl(lhsProvider.returnType, rhsProvider.returnType);

        return rhsProvider.chain(lhsProvider.chainLHS(binaryProvider));
    }
    else if (isSerializedUnaryProvider(serialized)) {
        const unaryProviderCollection = ALL_UNARY_PROVIDERS[serialized.name];
        if (!unaryProviderCollection) throw new ReferenceError(`no unary provider with name "${serialized.name}" exists`);

        const argProvider = deserializeProvider(serialized.arg);

        const unaryProvider = unaryProviderCollection.findImpl(argProvider.returnType);

        return argProvider.chain(unaryProvider);
    }
    else {
        const nullaryProvider = ALL_NULLARY_PROVIDERS[serialized.name];
        if (!nullaryProvider) throw new ReferenceError(`no nullary provider with name "${serialized.name}" exists`);

        return nullaryProvider;
    };
}