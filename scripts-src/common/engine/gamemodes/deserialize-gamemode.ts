import { deserializeProvider } from "../providers/deserialize-provider";
import { NullaryProvider } from "../providers/Provider";
import { NUMBER } from "../types";
import Gamemode from "./Gamemode";
import SerializedGamemode from "./SerializedGamemode";

export default function deserializeGamemode(serialized: SerializedGamemode): Gamemode {
    serialized = SerializedGamemode.upgradeToLatest(serialized); // upgrade to latest version

    const name = serialized.name;
    const description = serialized.description;
    const performanceMetric = serialized.performanceMetric ?
        deserializeProvider(serialized.performanceMetric, NUMBER) :
        new NullaryProvider(NUMBER, ctx => -ctx.getNumberVar(Gamemode.TEAM_NAME_VARNAME))

    return new Gamemode({ name, description, performanceMetric });
}