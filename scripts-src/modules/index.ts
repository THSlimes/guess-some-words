import { deserializeProvider, SerializedProviderArg } from "../common/engine/data-driving/deserialize-provider";
import "../common/ui/Responsive";

console.log("hi");

const test: SerializedProviderArg = {
    name: "pick n returned",
    lhs: "abc".split(""),
    rhs: 5
};

const deserialized = deserializeProvider(test);

for (let i = 0; i < 100; i++) {
    console.log(i + 1, deserialized.apply());
}