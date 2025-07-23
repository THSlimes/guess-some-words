# Guess Some Words

_Guess Some Words_ is a customizable web-based, word-guessing game.



## Provider System
Custom functionality is provided through JSON objects. To dynamically compute values at run-time, _providers_ can be used. These come in four kinds:

1. _Nullary providers_ - Providers which take zero arguments
1. _Unary providers_ - Providers which take one argument
1. _Binary providers_ - Providers which take two arguments
1. _Ternary providers_ - Providers which take three arguments

### Provider Context
Providers always operate within a specific _context_. This context contains information related to variables (and the current game). Some providers allow for the retrieval of context data.


### Nullary Providers

_Nullary providers_ are providers which do not take any arguments. They usually return values related to system information or constant values. They are represented by a JSON object containing only a string ```name``` property, or by a literal value: ```{ "name": "timestamp }```, ```"Hello World!"``` or ```[1, 2, 3]```.

| Name                   | Description                                 | Return Type |
| ---------------------- | ------------------------------------------- | ----------- |
| ```"random number"```  | Generates a random number within $[0,1)$    | number      |
| ```"random boolean"``` | Generates a random boolean (coin flip)      | boolean     |
| ```"timestamp"```      | Gives the current UNIX timestamp            | number      |
| ```"year"```           | Gives the current year                      | number      |
| ```"month"```          | Gives the current month                     | number      |
| ```"day"```            | Gives the current day of the month          | number      |
| ```"hours"```          | Gives the current hour of the day           | number      |
| ```"minutes"```        | Gives the current minute of the hour        | number      |
| ```"seconds"```        | Gives the current second of the minute      | number      |
| ```"milliseconds"```   | Gives the current millisecond of the second | number      |


### Unary Providers

_Unary Providers_ are providers which take a single argument. They are represented by a JSON object containing a string ```name``` and a ```arg``` property containing another providers. For example:

```json
{
    "name": "negate",
    "arg": true
}
```

#### Mathematical Operations

| Name                | Description                                                                                        | Argument Type | Return Type |
| ------------------- | -------------------------------------------------------------------------------------------------- | ------------- | ----------- |
| ```"negate"```      | Gives the argument's boolean complement                                                            | boolean       | boolean     |
| ```"negate"```      | Gives the argument's additive inverse                                                              | number        | number      |
| ```"invert"```      | Gives the argument's multiplicative inverse <br> _Throws an error if the argument is 0_            | number        | number      |
| ```"abs"```         | Gives the absolute value of the argument                                                           | number        | number      |
| ```"signum"```      | Gives the argument's signum (-1 for < 0, 0 for 0, or 1 for > 0)                                    | number        | number      |
| ```"square"```      | Computes the argument's square, $x^2$                                                              | number        | number      |
| ```"square root"``` | Computes the argument's square root $\sqrt{x}$ <br> _Throws an error if the argument is negative_  | number        | number      |
| ```"cube"```        | Computes the argument's cube $x^3$                                                                 | number        | number      |
| ```"cube root"```   | Computes the argument's cube root $\sqrt[3]{x}$ <br> _Throws an error if the argument is negative_ | number        | number      |
| ```"exp"```         | Computes $e^x$                                                                                     | number        | number      |
| ```"exp2"```        | Computes $2^x$                                                                                     | number        | number      |
| ```"exp10"```       | Computes $10^x$                                                                                    | number        | number      |
| ```"log"```         | Computes $\log_e{x}$ <br> _Throws an error if the argument is non-positive_                        | number        | number      |
| ```"log2"```        | Computes $\log_2{x}$ <br> _Throws an error if the argument is non-positive_                        | number        | number      |
| ```"log10"```       | Computes $\log_{10}{x}$ <br> _Throws an error if the argument is non-positive_                     | number        | number      |

#### Rounding

| Name          | Description                                     | Argument Type | Return Type |
| ------------- | ----------------------------------------------- | ------------- | ----------- |
| ```"round"``` | Rounds the argument to the nearest integer      | number        | number      |
| ```"floor"``` | Rounds the argument down to the nearest integer | number        | number      |
| ```"ceil"```  | Rounds the argument up to the nearest integer   | number        | number      |

#### Trigonometry

| Name               | Description                                   | Argument Type | Return Type |
| ------------------ | --------------------------------------------- | ------------- | ----------- |
| ```"cos"```        | Computes the argument's cosine                | number        | number      |
| ```"sin"```        | Computes the argument's sine                  | number        | number      |
| ```"tan"```        | Computes the argument's tangent               | number        | number      |
| ```"deg to rad"``` | Converts the argument from degrees to radians | number        | number      |
| ```"rad to deg"``` | Converts the argument from radians to degrees | number        | number      |

#### Random Operations

| Name            | Description                                          | Argument Type | Return Type |
| --------------- | ---------------------------------------------------- | ------------- | ----------- |
| ```"pick"```    | Randomly picks a string from the argument array      | string[]      | string      |
| ```"pick"```    | Randomly picks a number from the argument array      | number[]      | number      |
| ```"pick"```    | Randomly picks a boolean from the argument array     | boolean[]     | boolean     |
| ```"shuffle"``` | Puts the argument array's elements in a random order | string[]      | string[]    |
| ```"shuffle"``` | Puts the argument array's elements in a random order | number[]      | number[]    |
| ```"shuffle"``` | Puts the argument array's elements in a random order | boolean[]     | boolean[]   |

#### String Manipulation

| Name                   | Description                                                          | Argument Type | Return Type |
| ---------------------- | -------------------------------------------------------------------- | ------------- | ----------- |
| ```"lowercase"```      | Converts the argument string to lowercase                            | string        | string      |
| ```"uppercase"```      | Converts the argument string to uppercase                            | string        | string      |
| ```"capitalize"```     | Capitalizes the first character of the argument string               | string        | string      |
| ```"capitalize all"``` | Capitalizes the first character of every word in the argument string | string        | string      |
| ```"split"```          | Splits the argument string on every space                            | string        | string[]    |

#### Array Manipulation

| Name            | Description                                                                              | Argument Type | Return Type |
| --------------- | ---------------------------------------------------------------------------------------- | ------------- | ----------- |
| ```"array"```   | Puts the argument in a array                                                             | string        | string[]    |
| ```"array"```   | Puts the argument in a array                                                             | number        | number[]    |
| ```"array"```   | Puts the argument in a array                                                             | boolean       | boolean[]   |
| ```"length"```  | Gives the argument string's length                                                       | string        | number      |
| ```"length"```  | Gives the argument string's length                                                       | string        | number      |
| ```"length"```  | Gives the argument array's length                                                        | string[]      | number      |
| ```"length"```  | Gives the argument array's length                                                        | number[]      | number      |
| ```"length"```  | Gives the argument array's length                                                        | boolean[]     | number      |
| ```"reverse"``` | Reverses the argument string                                                             | string        | string      |
| ```"reverse"``` | Reverses the argument array                                                              | string[]      | string[]    |
| ```"reverse"``` | Reverses the argument array                                                              | number[]      | number[]    |
| ```"reverse"``` | Reverses the argument array                                                              | boolean[]     | boolean[]   |
| ```"sort"```    | Sorts the argument array alphabetically                                                  | string[]      | string[]    |
| ```"sort"```    | Sorts the argument array from smallest to largest                                        | number[]      | number[]    |
| ```"sort"```    | Sorts the argument array (`false` first, then `true`)                                    | boolean[]     | boolean[]   |
| ```"head"```    | Gives the argument string's first character                                              | string        | string      |
| ```"head"```    | Gives the argument array's first element <br> _An error is thrown if the array is empty_ | string[]      | string      |
| ```"head"```    | Gives the argument array's first element <br> _An error is thrown if the array is empty_ | number[]      | number      |
| ```"head"```    | Gives the argument array's first element <br> _An error is thrown if the array is empty_ | boolean[]     | boolean     |
| ```"last"```    | Gives the argument string's last character                                               | string        | string      |
| ```"last"```    | Gives the argument array's last element <br> _An error is thrown if the array is empty_  | string[]      | string      |
| ```"last"```    | Gives the argument array's last element <br> _An error is thrown if the array is empty_  | number[]      | number      |
| ```"last"```    | Gives the argument array's last element <br> _An error is thrown if the array is empty_  | boolean[]     | boolean     |
| ```"init"```    | Gives the argument string, except for the last character                                 | string        | string      |
| ```"init"```    | Gives the argument array, except for the last element                                    | string[]      | string[]    |
| ```"init"```    | Gives the argument array, except for the last element                                    | number[]      | number[]    |
| ```"init"```    | Gives the argument array, except for the last element                                    | boolean[]     | boolean[]   |
| ```"tail"```    | Gives the argument string, except for the first character                                | string        | string      |
| ```"tail"```    | Gives the argument array, except for the first element                                   | string[]      | string[]    |
| ```"tail"```    | Gives the argument array, except for the first element                                   | number[]      | number[]    |
| ```"tail"```    | Gives the argument array, except for the first element                                   | boolean[]     | boolean[]   |
| ```"join"```    | Joins together the arrays elements                                                       | string[]      | string      |

#### Type Conversion

| Name               | Description                                                     | Argument Type | Return Type |
| ------------------ | --------------------------------------------------------------- | ------------- | ----------- |
| ```"to string"```  | Gives back the argument                                         | string        | string      |
| ```"to string"```  | Converts the argument to a string                               | number        | string      |
| ```"to string"```  | Converts the argument to a boolean                              | boolean       | string      |
| ```"to number"```  | Parses the argument to a number                                 | string        | number      |
| ```"to number"```  | Gives back the argument                                         | number        | number      |
| ```"to number"```  | Gives `1` for `true`, and `0` for `false`                       | boolean       | number      |
| ```"to boolean"``` | Gives `false` if the argument string is empty, `true` otherwise | string        | boolean     |
| ```"to boolean"``` | Gives `false` if the argument is `0`, `true` otherwise          | number        | boolean     |
| ```"to boolean"``` | Gives back the argument                                         | boolean       | boolean     |


#### Context Variables
| Name                           | Description                                                                                                                | Argument Type | Return Type |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------- |
| ```"string variable"```        | Retrieves a string variable, with the argument being its name <br> _Throws an error if the variable does not exist_        | string        | string      |
| ```"number variable"```        | Retrieves a number variable, with the argument being its name <br> _Throws an error if the variable does not exist_        | string        | number      |
| ```"boolean variable"```       | Retrieves a boolean variable, with the argument being its name <br> _Throws an error if the variable does not exist_       | string        | boolean     |
| ```"string array variable"```  | Retrieves a string array variable, with the argument being its name <br> _Throws an error if the variable does not exist_  | string        | string      |
| ```"number array variable"```  | Retrieves a number array variable, with the argument being its name <br> _Throws an error if the variable does not exist_  | string        | number      |
| ```"boolean array variable"``` | Retrieves a boolean array variable, with the argument being its name <br> _Throws an error if the variable does not exist_ | string        | boolean     |


### Binary Providers

_Binary Providers_ are providers which take two arguments. They are represented by JSON objects with a string `name`, together with `lhs` and `rhs` properties, both being other providers:

```json
{
    "name": "add",
    "lhs": 1,
    "rhs": 2
}
```

Some binary providers are _commutative_, meaning that their result will be the same if the arguments are applied in the opposite order (i.e. switching the `lhs` and `rhs` values).

#### Mathematical Operations

| Name    | Description                               | LHS Type | RHS Type | Return Type | Commutative |
| ------- | ----------------------------------------- | -------- | -------- | ----------- | ----------- |
| `"add"` | Concatenates the arguments                | string   | string   | string      | ❌           |
| `"add"` | Sums up the arguments                     | number   | number   | number      | ✅           |
| `"add"` | Computes the disjunction of the arguments | boolean  | boolean  | boolean     | ✅           |
| `"add"` | `0` if LHS is `true`, `rhs` otherwise     | boolean  | number   | number      | ✅           |
| `"add"` | `""` if LHS is `true`, `rhs` otherwise    | boolean  | string   | string      | ✅           |
| `"sub"` | Computes `lhs - rhs`                      | number   | number   | number      | ❌           |
| `"sub"` | Computes `lhs && !rhs`                    | boolean  | boolean  | boolean     | ❌           |
| `"mul"` | Computes the product of the arguments     | number   | number   | number      | ✅           |
| `"mul"` | Computes the conjunction of the arguments | boolean  | boolean  | boolean     | ✅           |
| `"mul"` | `rhs` if LHS is `true`, `0` otherwise     | boolean  | number   | number      | ✅           |
| `"mul"` | `rhs` if LHS is `true`, `""` otherwise    | boolean  | string   | string      | ✅           |
| `"mul"` | Repeats the RHS `lhs` times               | number   | string   | string      | ✅           |
| `"div"` | Computes the quotient of the arguments    | number   | number   | number      | ❌           |
| `"div"` | Repeats the LHS by `1 / rhs` times        | string   | number   | string      | ❌           |
| `"mod"` | Computes the modulo of the arguments      | number   | number   | number      | ❌           |

#### Logical Operations

| Name     | Description                                         | LHS Type | RHS Type | Return Type | Commutative |
| -------- | --------------------------------------------------- | -------- | -------- | ----------- | ----------- |
| `"or"`   | Computes the disjunction of the arguments           | boolean  | boolean  | boolean     | ✅           |
| `"or"`   | `0` if LHS is `true`, `rhs` otherwise               | boolean  | number   | number      | ✅           |
| `"or"`   | `""` if LHS is `true`, `rhs` otherwise              | boolean  | string   | string      | ✅           |
| `"and"`  | Computes the conjunction of the arguments           | boolean  | boolean  | boolean     | ✅           |
| `"and"`  | `rhs` if LHS is `true`, `0` otherwise               | boolean  | number   | number      | ✅           |
| `"and"`  | `rhs` if LHS is `true`, `""` otherwise              | boolean  | string   | string      | ✅           |
| `"xor"`  | Computes the exclusive disjunction of the arguments | boolean  | boolean  | boolean     | ✅           |
| `"nand"` | Computes `lhs NAND rhs`                             | boolean  | boolean  | boolean     | ✅           |
| `"nor"`  | Computes `lhs NOR rhs`                              | boolean  | boolean  | boolean     | ✅           |
| `"xnor"` | Computes `lhs XNOR rhs`                             | boolean  | boolean  | boolean     | ✅           |

#### Bitwise Operations

| Name            | Description                               | LHS Type | RHS Type | Return Type | Commutative |
| --------------- | ----------------------------------------- | -------- | -------- | ----------- | ----------- |
| `"bitwise or"`  | Computes the bitwise OR of the arguments  | number   | number   | number      | ✅           |
| `"bitwise and"` | Computes the bitwise AND of the arguments | number   | number   | number      | ✅           |
| `"bitwise xor"` | Computes the bitwise XOR of the arguments | number   | number   | number      | ✅           |

#### Comparison Operations

| Name                      | Description                                                                  | LHS Type | RHS Type | Return Type | Commutative |
| ------------------------- | ---------------------------------------------------------------------------- | -------- | -------- | ----------- | ----------- |
| `"less than or equal"`    | Determines whether the LHS comes alphabetically before the RHS, or are equal | string   | string   | boolean     | ❌           |
| `"less than or equal"`    | Determines whether `lhs <= rhs`                                              | number   | number   | boolean     | ❌           |
| `"less than"`             | Determines whether the LHS comes alphabetically before the RHS               | string   | string   | boolean     | ❌           |
| `"less than"`             | Determines whether `lhs < rhs`                                               | number   | number   | boolean     | ❌           |
| `"equals"`                | Determines whether `lhs === rhs`                                             | string   | string   | boolean     | ✅           |
| `"equals"`                | Determines whether `lhs === rhs`                                             | number   | number   | boolean     | ✅           |
| `"equals"`                | Determines whether `lhs === rhs`                                             | boolean  | boolean  | boolean     | ✅           |
| `"not equals"`            | Determines whether `lhs !== rhs`                                             | string   | string   | boolean     | ✅           |
| `"not equals"`            | Determines whether `lhs !== rhs`                                             | number   | number   | boolean     | ✅           |
| `"not equals"`            | Determines whether `lhs !== rhs`                                             | boolean  | boolean  | boolean     | ✅           |
| `"less than"`             | Determines whether the LHS comes alphabetically after the RHS                | string   | string   | boolean     | ❌           |
| `"greater than"`          | Determines whether `lhs > rhs`                                               | number   | number   | boolean     | ❌           |
| `"less than or equal"`    | Determines whether the LHS comes alphabetically after the RHS, or are equal  | string   | string   | boolean     | ❌           |
| `"greater than or equal"` | Determines whether `lhs >= rhs`                                              | number   | number   | boolean     | ❌           |

#### Array Manipulation

| Name      | Description                                                                                                                                         | LHS Type  | RHS Type  | Return Type | Commutative |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | ----------- | ----------- |
| `"index"` | Gets an element from the LHS at the RHS index <br> _Throws an error if the RHS is not an integer_ <br> _Throws an error if the RHS is out of range_ | string[]  | number    | string      | ❌           |
| `"index"` | Gets an element from the LHS at the RHS index <br> _Throws an error if the RHS is not an integer_ <br> _Throws an error if the RHS is out of range_ | number[]  | number    | number      | ❌           |
| `"index"` | Gets an element from the LHS at the RHS index <br> _Throws an error if the RHS is not an integer_ <br> _Throws an error if the RHS is out of range_ | boolean[] | number    | boolean     | ❌           |
| `"join"`  | Puts the arguments in an array                                                                                                                      | string    | string    | string[]    | ❌           |
| `"join"`  | Puts the LHS in front of the elements of the RHS                                                                                                    | string    | string[]  | string[]    | ❌           |
| `"join"`  | Puts the elements of the LHS in front of the RHS                                                                                                    | string[]  | string    | string[]    | ❌           |
| `"join"`  | Puts the elements of the LHS in front of the elements of the RHS                                                                                    | string[]  | string[]  | string[]    | ❌           |
| `"join"`  | Puts the arguments in an array                                                                                                                      | number    | number    | number[]    | ❌           |
| `"join"`  | Puts the LHS in front of the elements of the RHS                                                                                                    | number    | number[]  | number[]    | ❌           |
| `"join"`  | Puts the elements of the LHS in front of the RHS                                                                                                    | number[]  | number    | number[]    | ❌           |
| `"join"`  | Puts the elements of the LHS in front of the elements of the RHS                                                                                    | number[]  | number[]  | number[]    | ❌           |
| `"join"`  | Puts the arguments in an array                                                                                                                      | boolean   | boolean   | boolean[]   | ❌           |
| `"join"`  | Puts the LHS in front of the elements of the RHS                                                                                                    | boolean   | boolean[] | boolean[]   | ❌           |
| `"join"`  | Puts the elements of the LHS in front of the RHS                                                                                                    | boolean[] | boolean   | boolean[]   | ❌           |
| `"join"`  | Puts the elements of the LHS in front of the elements of the RHS                                                                                    | boolean[] | boolean[] | boolean[]   | ❌           |

#### Random Operations

| Name                | Description                                                                                        | LHS Type    | RHS Type | Return Type | Commutative |
| ------------------- | -------------------------------------------------------------------------------------------------- | ----------- | -------- | ----------- | ----------- |
| `"pick n"`          | Picks `rhs` items from the `lhs` array <br> _Throws an error if the LHS is empty_                  | string[]    | number   | string[]    | ❌           |
| `"pick n"`          | Picks `rhs` items from the `lhs` array <br> _Throws an error if the LHS is empty_                  | number[]    | number   | number[]    | ❌           |
| `"pick n"`          | Picks `rhs` items from the `lhs` array <br> _Throws an error if the LHS is empty_                  | boolean[]   | number   | boolean[]   | ❌           |
| `"pick n"`          | Picks `rhs` items from the `lhs` array <br> _Throws an error if the LHS is empty_                  | string[][]  | number   | string[][]  | ❌           |
| `"pick n"`          | Picks `rhs` items from the `lhs` array <br> _Throws an error if the LHS is empty_                  | number[][]  | number   | number[][]  | ❌           |
| `"pick n"`          | Picks `rhs` items from the `lhs` array <br> _Throws an error if the LHS is empty_                  | boolean[][] | number   | boolean[][] | ❌           |
| `"pick n returned"` | Picks `rhs` items from the `lhs` array, with duplicates <br> _Throws an error if the LHS is empty_ | string[]    | number   | string[]    | ❌           |
| `"pick n returned"` | Picks `rhs` items from the `lhs` array, with duplicates <br> _Throws an error if the LHS is empty_ | number[]    | number   | number[]    | ❌           |
| `"pick n returned"` | Picks `rhs` items from the `lhs` array, with duplicates <br> _Throws an error if the LHS is empty_ | boolean[]   | number   | boolean[]   | ❌           |
| `"pick n returned"` | Picks `rhs` items from the `lhs` array, with duplicates <br> _Throws an error if the LHS is empty_ | string[][]  | number   | string[][]  | ❌           |
| `"pick n returned"` | Picks `rhs` items from the `lhs` array, with duplicates <br> _Throws an error if the LHS is empty_ | number[][]  | number   | number[][]  | ❌           |
| `"pick n returned"` | Picks `rhs` items from the `lhs` array, with duplicates <br> _Throws an error if the LHS is empty_ | boolean[][] | number   | boolean[][] | ❌           |
 

### Ternary Providers

_Ternary Providers_ are providers which take three arguments. They are represented by JSON objects with a string `name`, alongside an `a`, `b` and `c` properties, all three are other providers:

```json
{
    "name": "conditional",
    "a": true,
    "b": 0,
    "c": 1
}
```

| Name            | Description                               | A Type  | B Type  | C Type  | Return Type |
| --------------- | ----------------------------------------- | ------- | ------- | ------- | ----------- |
| `"conditional"` | Gives `b` is `a` is `true`, `c` otherwise | boolean | string  | string  | string      |
| `"conditional"` | Gives `b` is `a` is `true`, `c` otherwise | boolean | number  | number  | number      |
| `"conditional"` | Gives `b` is `a` is `true`, `c` otherwise | boolean | boolean | boolean | boolean     |