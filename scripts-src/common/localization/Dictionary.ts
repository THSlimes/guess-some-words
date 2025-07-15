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
    

    public register(translations: Translations): this {
        this.translations = { ...this.translations, ...translations };

        return this;
    }

    public lookup(key: string): NullaryProvider<unknown> | undefined {
        return this.translations[key];
    }

}