import * as core from "core";
import {Currency} from "app/domain/model-ext";
import * as peDictionaryDropDown from "dms/modules/dictionary/common/peDictionaryDropDown";
import * as CurrencyObjectSelector from "app/ui/dictionary/currency/CurrencyObjectSelector";

core.ui.PropertyEditor.DefaultMapping.register(propMd => {
    if (!!propMd.ref && (propMd.ref === Currency.meta.name || propMd.ref.name === Currency.meta.name)) {
        return peDictionaryDropDown.factory(CurrencyObjectSelector.PART_NAME, {
            showInfoButton: false
        });
    }

    return null;
}, {vt: "object", priority: 5});
