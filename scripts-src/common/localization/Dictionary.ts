import { NullaryProvider } from "../engine/providers/Provider";

export type Translations = Record<string, NullaryProvider<unknown>>;

/**
 * A Dictionary object provides string translations for a specific locale.
 */
export default class Dictionary {

    private readonly locale: Intl.Locale;
    private translations: Translations = {};

    public constructor(locale: string | Intl.Locale) {
        this.locale = new Intl.Locale(locale);
    }

    public localeMatchScore(target: Intl.Locale | string): number {
        if (typeof target === "string") return this.localeMatchScore(new Intl.Locale(target));

        if (target.language !== this.locale.language) return 0;
        else if (target.script !== this.locale.script) return 1;
        else if (target.region !== this.locale.region) return 2;
        else return 3;
    }

    public register(translations: Translations): this {
        this.translations = { ...this.translations, ...translations };

        return this;
    }

    public lookup(key: string): NullaryProvider<unknown> | undefined {
        return this.translations[key];
    }

}