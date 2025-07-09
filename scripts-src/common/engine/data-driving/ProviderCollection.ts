import { BinaryProvider, Provider, UnaryProvider } from "./Provider";
import { BOOLEAN, NUMBER, STRING, Type, TypeOf } from "./types";

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
            if (lhsType.extends(p.lhsType) && rhsType.extends(p.rhsType)) return p as Extract<M[number], BinaryProvider<LHS, RHS, any>>;
        }

        throw new TypeError(`no ${this.name} implementation found for (${lhsType.name}, ${rhsType.name}) argument types`);
    }


}