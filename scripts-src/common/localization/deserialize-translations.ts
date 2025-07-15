import { deserializeProvider, isSerializedProviderArg, SerializedProviderArg } from "../engine/providers/deserialize-provider";
import { Translations } from "./Dictionary";

type SerializedTranslations = Record<string, SerializedProviderArg>;
export function isSerializedTranslations(v: unknown): v is SerializedTranslations {
    return typeof v === "object"
        && v !== null
        && Object.values(v).every(isSerializedProviderArg)
}

export function deserializeTranslations(serialized: SerializedTranslations): Translations {
    return Object.fromEntries(
        Object.entries(serialized).map(([k, v]) => [k, deserializeProvider(v)])
    );
}

export function loadTranslations(locale: string | Intl.Locale): Promise<Translations> {
    locale = locale.toString();
    if (!locale.endsWith(".json")) locale += ".json";

    return fetch(locale)
        .then(res => {
            if (res.ok) return res.json();
            else throw new Error("language file not found");
        })
        .then(obj => {
            if (isSerializedTranslations(obj)) return deserializeTranslations(obj);
            else throw new TypeError("invalid language file");
        })
}