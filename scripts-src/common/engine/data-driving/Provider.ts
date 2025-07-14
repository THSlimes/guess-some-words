import { getType, Type } from "./types";

export class ProviderContext {

    private readonly stringVars: Record<string, string> = {};
    private readonly numberVars: Record<string, number> = {};
    private readonly booleanVars: Record<string, boolean> = {};

    public setStringVar(name: string, value: string) {
        this.stringVars[name] = value;
    }

    public getStringVar(name: string, defaultTo?: string): string {
        const out = this.stringVars[name] ?? defaultTo;

        if (out === undefined) throw new ReferenceError(`undefined string variable "${name}"`);
        else return out;
    }

    public setNumberVar(name: string, value: number) {
        this.numberVars[name] = value;
    }

    public getNumberVar(name: string, defaultTo?: number): number {
        const out = this.numberVars[name] ?? defaultTo;

        if (out === undefined) throw new ReferenceError(`undefined string variable "${name}"`);
        else return out;
    }

    public setBooleanVar(name: string, value: boolean) {
        this.booleanVars[name] = value;
    }

    public getBooleanVar(name: string, defaultTo?: boolean): boolean {
        const out = this.booleanVars[name] ?? defaultTo;

        if (out === undefined) throw new ReferenceError(`undefined string variable "${name}"`);
        else return out;
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