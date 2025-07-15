import { ProviderContext } from "../common/engine/providers/Provider";
import Dictionary from "../common/localization/Dictionary";
import PhraseManager from "../common/localization/PhraseManager";
import { loadTranslations } from "../common/localization/deserialize-translations";
import Loading from "../common/ui/Loading";
import "../common/ui/Responsive";

import "../common/ui/header-footer";

console.log("hi");

Promise.all([
    loadTranslations("lang/en-US"),
    loadTranslations("lang/nl-NL"),
    Loading.onceDOMContentLoaded()
]).then(([enUS, nlNL]) => {
    const enUSDict = new Dictionary("en-US").register(enUS);
    const nlNLDict = new Dictionary("nl-NL").register(nlNL);
    const manager = new PhraseManager(enUSDict);

    const div = Loading.getElementById("content", HTMLDivElement).firstElementChild!;

    for (let i = 1; i < 10; i++) {
        const p = document.createElement('p');
        div.appendChild(p);

        let dictKey: string;
        switch (i) {
            case 1:
                dictKey = 'test.firstPhrase';
                break;
            case 2:
                dictKey = 'test.secondPhrase';
                break;
            case 3:
                dictKey = 'test.thirdPhrase';
                break;
            default:
                dictKey = 'test.nthPhrase';
                break;
        }

        manager.registerTextContent(dictKey, ProviderContext.fromVars({ n: i }), p);

    }

    setTimeout(() => {
        manager.setDictionary(nlNLDict)
    }, 5000);

});