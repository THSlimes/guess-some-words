import { BinaryProvider, TernaryProvider, UnaryProvider } from "./Provider";
import { Type } from "../types";

export class UnaryProviderCollection<M extends UnaryProvider<any, any>[]> {

    public readonly name: string;
    private readonly providers: M;

    public constructor(name: string, ...providers: M) {
        this.name = name;

        this.providers = providers;
    }

    public findImpl<A>(argType: Type<A>): Extract<M[number], UnaryProvider<A, any>> {
        for (const p of this.providers) {
            if (argType.extends(p.argType)) return p as Extract<M[number], UnaryProvider<A, any>>;
        }

        throw new TypeError(`no ${this.name} implementation found for ${argType.name} argument type`);
    }

}

export class BinaryProviderCollection<M extends BinaryProvider<any, any, any>[]> {

    public readonly name: string;
    private readonly providers: M;

    public constructor(name: string, ...providers: M) {
        this.name = name;

        this.providers = providers;
    }

    public findImpl<LHS, RHS>(lhsType: Type<LHS>, rhsType: Type<RHS>): Extract<M[number], BinaryProvider<LHS, RHS, any>> {
        for (const p of this.providers) {
            if (lhsType.extends(p.lhsType) && rhsType.extends(p.rhsType)) {
                return p as Extract<M[number], BinaryProvider<LHS, RHS, any>>;
            }
            else if (p.isCommutative && lhsType.extends(p.rhsType) && rhsType.extends(p.lhsType)) {
                return new BinaryProvider(
                    p.rhsType,
                    p.lhsType,
                    p.returnType,
                    (ctx, rhs, lhs) => p.apply(ctx, lhs, rhs)
                ) as Extract<M[number], BinaryProvider<LHS, RHS, any>>;
            }
        }

        throw new TypeError(`no ${this.name} implementation found for (${lhsType.name}, ${rhsType.name}) argument types`);
    }

}

export class TernaryProviderCollection<M extends TernaryProvider<any, any, any, any>[]> {

    public readonly name: string;
    private readonly providers: M;

    public constructor(name: string, ...providers: M) {
        this.name = name;

        this.providers = providers;
    }

    public findImpl<A, B, C>(aType: Type<A>, bType: Type<B>, cType: Type<C>): Extract<M[number], TernaryProvider<A, B, C, any>> {
        for (const p of this.providers) {
            if (aType.extends(p.aType) && bType.extends(p.bType) && cType.extends(p.cType)) {
                return p as Extract<M[number], TernaryProvider<A, B, C, any>>;
            }
        }

        throw new TypeError(`no ${this.name} implementation found for (${aType.name}, ${bType.name}, ${cType.name}) argument types`);
    }

}