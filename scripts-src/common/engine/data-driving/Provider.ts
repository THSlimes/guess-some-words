import { BOOLEAN, DDValue, getType, NUMBER, STRING, Type } from "./types";

type ArgTypes<Args extends any[]> = { [I in keyof Args]: Type<Args[I]> };

export abstract class Provider<Args extends any[], R> {

    public readonly argTypes: ArgTypes<Args>;
    public readonly returnType: Type<R>;
    public readonly apply: (...args: Args) => R;

    public constructor(argTypes: ArgTypes<Args>, returnType: Type<R>, impl: (...args: Args) => R) {
        this.argTypes = argTypes;
        this.returnType = returnType;

        this.apply = impl;
    }

}

export class NullaryProvider<R> extends Provider<[], R> {

    public constructor(returnType: Type<R>, impl: () => R) {
        super([], returnType, impl);
    }

    public chain<N>(next: UnaryProvider<R, N>): NullaryProvider<N> {
        return new NullaryProvider(
            next.returnType,
            () => next.apply(this.apply())
        );
    }

    public chainLHS<RHS, N>(next: BinaryProvider<R, RHS, N>): UnaryProvider<RHS, N> {
        return new UnaryProvider(
            next.rhsType,
            next.returnType,
            rhs => next.apply(this.apply(), rhs)
        );
    }

    public chainRHS<LHS, N>(next: BinaryProvider<LHS, R, N>): UnaryProvider<LHS, N> {
        return new UnaryProvider(
            next.lhsType,
            next.returnType,
            lhs => next.apply(lhs, this.apply())
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

    public constructor(argType: Type<A>, returnType: Type<R>, impl: (arg: A) => R) {
        super([argType], returnType, impl);
    }

    public chain<N>(next: UnaryProvider<R, N>): UnaryProvider<A, N> {
        return new UnaryProvider(
            this.argType,
            next.returnType,
            arg => next.apply(this.apply(arg))
        );
    }

    public chainLHS<RHS, N>(next: BinaryProvider<R, RHS, N>): BinaryProvider<A, RHS, N> {
        return new BinaryProvider(
            this.argType,
            next.rhsType,
            next.returnType,
            (arg: A, rhs: RHS) => next.apply(this.apply(arg), rhs)
        );
    }

    public chainRHS<LHS, N>(next: BinaryProvider<LHS, R, N>): BinaryProvider<LHS, A, N> {
        return new BinaryProvider(
            next.lhsType,
            this.argType,
            next.returnType,
            (lhs: LHS, arg: A) => next.apply(lhs, this.apply(arg))
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

    public constructor(lhsType: Type<LHS>, rhsType: Type<RHS>, returnType: Type<R>, impl: (lhs: LHS, rhs: RHS) => R, isCommutative = false) {
        super([lhsType, rhsType], returnType, impl);

        this.isCommutative = isCommutative;
    }

    public chain<N>(next: UnaryProvider<R, N>): BinaryProvider<LHS, RHS, N> {
        return new BinaryProvider(
            this.lhsType,
            this.rhsType,
            next.returnType,
            (lhs: LHS, rhs: RHS) => next.apply(this.apply(lhs, rhs))
        );
    }

}