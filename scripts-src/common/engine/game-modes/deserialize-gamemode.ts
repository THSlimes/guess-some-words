import { deserializeProvider } from "../providers/deserialize-provider";
import { NullaryProvider } from "../providers/Provider";
import { NUMBER } from "../types";
import GameMode from "./GameMode";
import SerializedGameMode from "./SerializedGameMode";

export default function deserializeGameMode(serialized: SerializedGameMode): GameMode {
    serialized = SerializedGameMode.upgradeToLatest(serialized); // upgrade to latest version

    const name = serialized.name;
    const description = serialized.description;
    const performanceMetric = serialized.performanceMetric ?
        deserializeProvider(serialized.performanceMetric, NUMBER) :
        new NullaryProvider(NUMBER, ctx => -ctx.getNumberVar(GameMode.TEAM_NAME_VARNAME))

    return new GameMode({ name, description, performanceMetric });
}