import * as core from "core";
import {ContractRevokeReason} from "app/domain/model-ext";
import * as peDictionaryDropDown from "dms/modules/dictionary/common/peDictionaryDropDown";
import * as ContractRevokeReasonObjectSelector
    from "app/ui/dictionary/contractrevokereason/ContractRevokeReasonObjectSelector";

core.ui.PropertyEditor.DefaultMapping.register(propMd => {
    if (!!propMd.ref && (propMd.ref === ContractRevokeReason.meta.name || propMd.ref.name === ContractRevokeReason.meta.name)) {
        return peDictionaryDropDown.factory(ContractRevokeReasonObjectSelector.PART_NAME, {
            showInfoButton: false
        });
    }

    return null;
}, {vt: "object", priority: 5});
