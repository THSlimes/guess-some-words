import FunctionUtil from "../../util/FunctionUtil";
import { BOOLEAN, BOOLEAN_ARRAY, getType, NUMBER, NUMBER_ARRAY, STRING, STRING_ARRAY, Type } from "../types";

type ProviderVar =
    string | string[] |
    number | number[] |
    boolean | boolean[];

interface VarsCollection<T extends ProviderVar> {
    type: Type<T>, vars: Record<string, T>
}

type VarSetter<T> = (name: string, value: T) => void;
type VarGetter<T> = (name: string, defaultTo?: T) => T;

export class ProviderContext {

    private readonly variableCollections: VarsCollection<any>[] = [
        { type: STRING, vars: {} } as VarsCollection<string>,
        { type: NUMBER, vars: {} } as VarsCollection<number>,
        { type: BOOLEAN, vars: {} } as VarsCollection<boolean>,
        { type: STRING_ARRAY, vars: {} } as VarsCollection<string[]>,
        { type: NUMBER_ARRAY, vars: {} } as VarsCollection<number[]>,
        { type: BOOLEAN_ARRAY, vars: {} } as VarsCollection<boolean[]>,
    ];


    private getVar<T extends ProviderVar>(type: Type<T>, name: string, defaultTo?: T): T {
        for (const collection of this.variableCollections) {
            if (collection.type.extends(type)) {
                const out = collection.vars[name] ?? defaultTo;
                if (out === undefined) throw new ReferenceError(`undefined ${type.name} variable "${name}"`);
            }
        }

        throw new TypeError(`unsupported variable type "${type.name}"`);
    }


    private setVar<T extends ProviderVar>(type: Type<T>, name: string, value: T) {
        for (const collection of this.variableCollections) {
            if (collection.type.extends(type)) collection.vars[name] = value;
        }

        throw new TypeError(`unsupported variable type "${type.name}"`);
    }

    public readonly setStringVar: VarSetter<string> = FunctionUtil.curry(STRING, this.setVar);
    public readonly getStringVar: VarGetter<string> = FunctionUtil.curry(STRING, this.getVar);

    public readonly setNumberVar: VarSetter<number> = FunctionUtil.curry(NUMBER, this.setVar);
    public readonly getNumberVar: VarGetter<number> = FunctionUtil.curry(NUMBER, this.getVar);

    public readonly setBooleanVar: VarSetter<boolean> = FunctionUtil.curry(BOOLEAN, this.setVar);
    public readonly getBooleanVar: VarGetter<boolean> = FunctionUtil.curry(BOOLEAN, this.getVar);

    public readonly setStringArrayVar: VarSetter<string[]> = FunctionUtil.curry(STRING_ARRAY, this.setVar);
    public readonly getStringArrayVar: VarGetter<string[]> = FunctionUtil.curry(STRING_ARRAY, this.getVar);

    public readonly setNumberArrayVar: VarSetter<number[]> = FunctionUtil.curry(NUMBER_ARRAY, this.setVar);
    public readonly getNumberArrayVar: VarGetter<number[]> = FunctionUtil.curry(NUMBER_ARRAY, this.getVar);

    public readonly setBooleanArrayVar: VarSetter<boolean[]> = FunctionUtil.curry(BOOLEAN_ARRAY, this.setVar);
    public readonly getBooleanArrayVar: VarGetter<boolean[]> = FunctionUtil.curry(BOOLEAN_ARRAY, this.getVar);

    /**
     * Makes a deep-copy of this ProviderContext
     */
    public copy(): ProviderContext {
        const out = new ProviderContext();

        // copy over variables
        for (let i = 0; i < this.variableCollections.length; i++) { // only works because all variableCollections have the same type order
            out.variableCollections[i].vars = { ...this.variableCollections[i].vars };
        }

        return out;
    }



    public static fromVars(vars: Record<string, string | number | boolean>): ProviderContext {
        const out = new ProviderContext();

        // copy over variables
        for (const k in vars) {
            const v = vars[k];

            out.setVar(getType(v), k, v);
        }

        return out;
    }

}

type ArgTypes<Args extends any[]> = { [I in keyof Args]: Type<Args[I]> };

export abstract class Provider<Args extends any[], R> {

    public readonly argTypes: ArgTypes<Args>;
    public readonly returnType: Type<R>;
    public readonly apply: (ctx: ProviderContext, ...args: Args) => R;

    public constructor(argTypes: ArgTypes<Args>, returnType: Type<R>, impl: (ctx: ProviderContext, ...args: Args) => R) {
        this.argTypes = argTypes;
        this.returnType = returnType;

        this.apply = impl;
    }

}

export class NullaryProvider<R> extends Provider<[], R> {

    public constructor(returnType: Type<R>, impl: (ctx: ProviderContext) => R) {
        super([], returnType, impl);
    }

    public chain<N>(next: UnaryProvider<R, N>): NullaryProvider<N> {
        return new NullaryProvider(
            next.returnType,
            ctx => next.apply(ctx, this.apply(ctx))
        );
    }

    public chainLHS<RHS, N>(next: BinaryProvider<R, RHS, N>): UnaryProvider<RHS, N> {
        return new UnaryProvider(
            next.rhsType,
            next.returnType,
            (ctx, rhs) => next.apply(ctx, this.apply(ctx), rhs)
        );
    }

    public chainRHS<LHS, N>(next: BinaryProvider<LHS, R, N>): UnaryProvider<LHS, N> {
        return new UnaryProvider(
            next.lhsType,
            next.returnType,
            (ctx, lhs) => next.apply(ctx, lhs, this.apply(ctx))
        );
    }



    public static literal<V>(value: V): NullaryProvider<V> {
        return new NullaryProvider(
            getType(value),
            () => value
        );
    }

}

export class UnaryProvider<A, R> extends Provider<[A], R> {

    public get argType() {
        return this.argTypes[0];
    }

    public constructor(argType: Type<A>, returnType: Type<R>, impl: (ctx: ProviderContext, arg: A) => R) {
        super([argType], returnType, impl);
    }

    public chain<N>(next: UnaryProvider<R, N>): UnaryProvider<A, N> {
        return new UnaryProvider(
            this.argType,
            next.returnType,
            (ctx, arg) => next.apply(ctx, this.apply(ctx, arg))
        );
    }

    public chainLHS<RHS, N>(next: BinaryProvider<R, RHS, N>): BinaryProvider<A, RHS, N> {
        return new BinaryProvider(
            this.argType,
            next.rhsType,
            next.returnType,
            (ctx, arg: A, rhs: RHS) => next.apply(ctx, this.apply(ctx, arg), rhs)
        );
    }

    public chainRHS<LHS, N>(next: BinaryProvider<LHS, R, N>): BinaryProvider<LHS, A, N> {
        return new BinaryProvider(
            next.lhsType,
            this.argType,
            next.returnType,
            (ctx, lhs: LHS, arg: A) => next.apply(ctx, lhs, this.apply(ctx, arg))
        );
    }

}

export class BinaryProvider<LHS, RHS, R> extends Provider<[LHS, RHS], R> {

    public get lhsType() {
        return this.argTypes[0];
    }

    public get rhsType() {
        return this.argTypes[1];
    }

    public readonly isCommutative: boolean;

    public constructor(lhsType: Type<LHS>, rhsType: Type<RHS>, returnType: Type<R>, impl: (ctx: ProviderContext, lhs: LHS, rhs: RHS) => R, isCommutative = false) {
        super([lhsType, rhsType], returnType, impl);

        this.isCommutative = isCommutative;
    }

    public chain<N>(next: UnaryProvider<R, N>): BinaryProvider<LHS, RHS, N> {
        return new BinaryProvider(
            this.lhsType,
            this.rhsType,
            next.returnType,
            (ctx, lhs: LHS, rhs: RHS) => next.apply(ctx, this.apply(ctx, lhs, rhs))
        );
    }

}

export class TernaryProvider<A, B, C, R> extends Provider<[A, B, C], R> {

    public get aType() {
        return this.argTypes[0];
    }

    public get bType() {
        return this.argTypes[1];
    }

    public get cType() {
        return this.argTypes[2];
    }

    public constructor(aType: Type<A>, bType: Type<B>, cType: Type<C>, returnType: Type<R>, impl: (ctx: ProviderContext, a: A, b: B, c: C) => R) {
        super([aType, bType, cType], returnType, impl);
    }

    public chain<N>(next: UnaryProvider<R, N>): TernaryProvider<A, B, C, N> {
        return new TernaryProvider(
            this.aType,
            this.bType,
            this.cType,
            next.returnType,
            (ctx: ProviderContext, a: A, b: B, c: C) => next.apply(ctx, this.apply(ctx, a, b, c))
        );
    }

}