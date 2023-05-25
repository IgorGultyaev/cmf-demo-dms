import * as core from "core";
import {Contractor} from "app/domain/model-ext";
import * as peDictionaryDropDown from "dms/modules/dictionary/common/peDictionaryDropDown";
import * as ContractorObjectSelector from "app/ui/dictionary/contractor/ContractorObjectSelector";

core.ui.PropertyEditor.DefaultMapping.register(propMd => {
    if (!!propMd.ref && (propMd.ref === Contractor.meta.name || propMd.ref.name === Contractor.meta.name)) {
        return peDictionaryDropDown.factory(ContractorObjectSelector.PART_NAME, {
            showInfoButton: false
        });
    }

    return null;
}, {vt: "object", priority: 5});
