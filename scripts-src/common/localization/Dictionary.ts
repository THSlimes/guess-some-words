import { NullaryProvider } from "../engine/data-driving/Provider";

type Translations = Record<string, NullaryProvider<string>>;

export default class Dictionary {

    private readonly locale: Intl.Locale;
    private translations: Translations = {};

    public constructor(locale: string) {
        this.locale = new Intl.Locale(locale);
    }

    public localeMatchScore(target: Intl.Locale): number {
        if (target.language !== this.locale.language) return 0;
        else if (target.script !== this.locale.script) return 1;
        else if (target.region !== this.locale.region) return 2;
        else return 3;
    }

    public register(translations: Translations): this {
        this.translations = { ...this.translations, ...translations };

        return this;
    }

    public lookup(key: string): NullaryProvider<string> | undefined {
        return this.translations[key];
    }

}