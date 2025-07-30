import { isSerializedProviderArg, SerializedProviderArg } from "../providers/deserialize-provider";

/** Version 1 of the GameMode data structure */
interface SerializedGameModeV1 {
    /** GameMode data structure version */
    version: 1,
    name: string,
    description: string,

    /** Serialized provider to calculate team performance */
    performanceMetric: SerializedProviderArg,
}
namespace SerializedGameModeV1 {
    export function is(v: unknown): v is SerializedGameModeV1 {
        return typeof v === "object"
            && v !== null
            && "version" in v && v.version === 1
            && "name" in v && typeof v.name === "string"
            && "description" in v && typeof v.description === "string"
            && (!("performanceMetric" in v) || isSerializedProviderArg(v.performanceMetric));
    }
}

// /** Version 2 of the GameMode data structure */
// interface SerializedGameModeV2 {
//     version: 2
// }
// namespace SerializedGameModeV2 {
//     export function is(v: unknown): v is SerializedGameModeV2 {
//         return typeof v === "object"
//             && v !== null
//             && "version" in v && v.version === 2;
//     }
// }

// /** Version 3 of the GameMode data structure */
// interface SerializedGameModeV3 {
//     version: 3
// }
// namespace SerializedGameModeV3 {
//     export function is(v: unknown): v is SerializedGameModeV3 {
//         return typeof v === "object"
//             && v !== null
//             && "version" in v && v.version === 3;
//     }
// }

type SerializedGameModeVLatest = SerializedGameModeV1;

type SerializedGamemode = SerializedGameModeV1;
// SerializedGameModeV1 |
// SerializedGameModeV2 |
// SerializedGameModeV3;
namespace SerializedGamemode {
    export function is(v: unknown): v is SerializedGamemode {
        return SerializedGameModeV1.is(v)
        // || SerializedGameModeV2.is(v)
        // || SerializedGameModeV3.is(v);
    }

    export function upgradeToLatest(gm: SerializedGamemode): SerializedGameModeVLatest {
        switch (gm.version) {
            case 1:
                return gm;
            // case 1:
            //     return upgradeToLatest({ ...gm, version: 2 });
            // case 2:
            //     return upgradeToLatest({ ...gm, version: 3 });
            // case 3:
            //     return gm;
        }
    }
}

export default SerializedGamemode;