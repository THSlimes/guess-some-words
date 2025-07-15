import { ProviderContext } from "../engine/providers/Provider";
import Dictionary from "./Dictionary";

interface Phrase {
    /** Lookup key for a Dictionary's Provider */
    dictKey: string,
    /** ProviderContext to use when evaluating Dictionary's Provider */
    ctx: ProviderContext
}

type Applicator<T> = (item: T, str: string) => void;

interface PhraseApplicator<T> {
    phrase: Phrase,
    applicator: Applicator<T>
}

export default class PhraseManager {

    private dict: Dictionary;

    private readonly items: WeakMap<PhraseApplicator<any>, any> = new WeakMap();
    private readonly phraseApplicators: Set<PhraseApplicator<any>> = new Set();

    public constructor(dict: Dictionary) {
        this.dict = dict;
    }


    /**
     * Sets the current Dictionary and reapplies any phrases.
     * @param dict new Dictionary
     */
    public setDictionary(dict: Dictionary) {

        if (dict !== this.dict) {
            this.dict = dict;

            for (const phraseApplicator of this.phraseApplicators) {
                const item = this.items.get(phraseApplicator);

                if (item === undefined) this.phraseApplicators.delete(phraseApplicator); // item got garbage collected
                else { // item still in memory
                    const { dictKey, ctx } = phraseApplicator.phrase;

                    // evaluate to string
                    const provider = this.dict.lookup(dictKey);
                    const str = String(provider?.apply(ctx) ?? dictKey);

                    // apply string
                    phraseApplicator.applicator(item, str);
                }
            }
        }
    }

    private register<T>(dictKey: string, ctx: ProviderContext, item: T, applicator: Applicator<T>) {
        const phraseApplicator: PhraseApplicator<T> = { phrase: { dictKey, ctx }, applicator };

        // register
        this.phraseApplicators.add(phraseApplicator);
        this.items.set(phraseApplicator, item);

        // initial application
        const provider = this.dict.lookup(dictKey);
        const str = String(provider?.apply(ctx) ?? dictKey);

        applicator(item, str);
    }

    public registerTextContent(dictKey: string, ctx: ProviderContext, item: Element) {
        return this.register(
            dictKey,
            ctx,
            item,
            (item, str) => item.textContent = str,
        );
    }

    public registerTitle(dictKey: string, ctx: ProviderContext, item: HTMLElement) {
        return this.register(
            dictKey,
            ctx,
            item,
            (item, str) => item.title = str,
        );
    }

}