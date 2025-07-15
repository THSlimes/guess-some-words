import { loadTranslations } from "../../localization/deserialize-translations";
import Dictionary from "../../localization/Dictionary";
import PhraseManager from "../../localization/PhraseManager";
import Loading from "../Loading";

enum Language {
    ENGLISH = "en-US",
    DUTCH = "nl-NL",
}
const ALL_LANGUAGES = [Language.ENGLISH, Language.DUTCH];
const DEFAULT_LANGUAGE = Language.ENGLISH;

function isLanguage(v: unknown): v is Language {
    return Object.values(Language).some(p => v === p);
}

function localeMatchScore(a: Intl.Locale | string, b: Intl.Locale | string): number {
    if (typeof a === "string") a = new Intl.Locale(a);
    if (typeof b === "string") b = new Intl.Locale(b);

    if (a.language !== b.language) return 0;
    else if (a.script !== b.script) return 1;
    else if (a.region !== b.region) return 2;
    else return 3;
}

namespace Language {

    const LOCAL_STORAGE_KEY: string = "language";
    const BODY_ATTR_NAME: string = "language";

    export const DICTS_PROMISE: Promise<Record<Language, Dictionary>> =
        Promise.all(ALL_LANGUAGES.map(lang => loadTranslations(lang)))
            .then(translations => Object.fromEntries(
                ALL_LANGUAGES.map((l, i) => [l, new Dictionary(l).register(translations[i])])
            ) as Record<Language, Dictionary>);

    export const MANAGER_PROMISE: Promise<PhraseManager> = DICTS_PROMISE.then(dicts => new PhraseManager(dicts[get()]));

    /**
     * Gives the currently applied language.
     */
    export function get(): Language {
        const language = localStorage.getItem(LOCAL_STORAGE_KEY);

        return isLanguage(language) ? language : DEFAULT_LANGUAGE;
    }

    /**
     * Sets the current language.
     * @param language new language
     */
    export function set(language: Language) {
        localStorage.setItem(LOCAL_STORAGE_KEY, language);

        Loading.onceDOMContentLoaded()
            .then(() => {
                document.body.setAttribute(BODY_ATTR_NAME, language);
            });

        DICTS_PROMISE // set PhraseManager's dictionary
            .then(dicts => dicts[language])
            .then(dict => MANAGER_PROMISE.then(manager => manager.setDictionary(dict)))
    }

    /**
     * Cycles to the next language.
     * @returns the new language
     */
    export function setNext(): Language {
        const currentIndex = ALL_LANGUAGES.indexOf(get());

        const nextLanguage = ALL_LANGUAGES[(currentIndex + 1) % ALL_LANGUAGES.length];
        set(nextLanguage);

        return nextLanguage;
    }

    // set on load
    const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (isLanguage(savedLanguage)) set(savedLanguage);
    else set(ALL_LANGUAGES.find(lang => localeMatchScore(lang, navigator.language) > 0) ?? DEFAULT_LANGUAGE);

}

export default Language;