export abstract class Type<T> {

    public readonly name;

    protected constructor(name: string) {
        this.name = name;
    }

    /** Gives the array Type of this Type */
    public array(): ArrayType<T> {
        return new ArrayType(this);
    }

    /** Determines whether this Type extends the given Type */
    public abstract extends<U>(other: Type<U>): T extends U ? true : false;

    /** Checks whether the given value is assignable to this Type */
    public abstract isAssignable(v: unknown): v is T;
}

export type TypeOf<T extends Type<any>> = T extends Type<infer I> ? I : never;

enum Primitive {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean"
}
interface PrimitiveTypeMap {
    [Primitive.STRING]: string,
    [Primitive.NUMBER]: number,
    [Primitive.BOOLEAN]: boolean,
}

class PrimitiveType<P extends Primitive> extends Type<PrimitiveTypeMap[P]> {

    private readonly primitive: P;

    public constructor(primitive: P) {
        super(primitive);

        this.primitive = primitive;
    }

    public extends<U>(other: Type<U>): PrimitiveTypeMap[P] extends U ? true : false {
        return (
            other instanceof PrimitiveType &&
            other.primitive === this.primitive
        ) as PrimitiveTypeMap[P] extends U ? true : false;
    }

    public isAssignable(v: unknown): v is PrimitiveTypeMap[P] {
        return typeof v === this.primitive;
    }

}

/** The primitive string type */
export const STRING = new PrimitiveType(Primitive.STRING);
/** The primitive number type */
export const NUMBER = new PrimitiveType(Primitive.NUMBER);
/** The primitive boolean type */
export const BOOLEAN = new PrimitiveType(Primitive.BOOLEAN);

class ArrayType<T> extends Type<T[]> {

    private readonly elementType: Type<T>;

    public constructor(elementType: Type<T>) {
        super(elementType.name + "[]");

        this.elementType = elementType;
    }

    public extends<U>(other: Type<U>): T[] extends U ? true : false {
        return (
            other instanceof ArrayType &&
            this.elementType.extends(other.elementType)
        ) as T[] extends U ? true : false;
    }
    public isAssignable(v: unknown): v is T[] {
        return Array.isArray(v) && v.every(e => this.elementType.isAssignable(e));
    }

}

/** Type of an array of strings */
export const STRING_ARRAY = STRING.array();
/** Type of an array of numbers */
export const NUMBER_ARRAY = NUMBER.array();
/** Type of an array of booleans */
export const BOOLEAN_ARRAY = BOOLEAN.array();

export type DDValue = PrimitiveTypeMap[Primitive] | DDValue[];
export function isDDValue(v: unknown): v is DDValue {
    if (Array.isArray(v)) {
        if (v.length === 0) return true; // no elements to check
        else { // check array elements
            const firstType = typeof v[0];

            for (let i = 0; i < v.length; i++) {
                const e = v[i];
                if (!isDDValue(e) || typeof e !== firstType) return false; // element does not match
            }

            return true;
        }
    }
    else { // check primitive type
        const type = typeof v;
        return type === "string" || type === "number" || type === "boolean";
    }
}

export function getType<V>(v: V): Type<V> {
    switch (typeof v) {
        case "string": return STRING as any;
        case "number": return NUMBER as any;
        case "boolean": return BOOLEAN as any;
        case "object":
            if (v !== null && Array.isArray(v)) {
                if (v.length === 0) throw new TypeError("cannot find type of zero-length array");
                else return getType(v[0]).array() as any;
            }
        default:
            throw new TypeError(`could not find type of value ${JSON.stringify(v)}`);
    }
}