import * as core from "core";
import {DeliveryOption} from "app/domain/model-classes";
import DeliveryOptionSelector = require("app/ui/dictionary/delivery/DeliveryOptionSelector");
import peDictionaryDropDown =require("dms/modules/dictionary/common/peDictionaryDropDown");

core.ui.PropertyEditor.DefaultMapping.register(function (propMd) {
    if (!!propMd.ref && (propMd.ref === DeliveryOption.meta.name || propMd.ref.name === DeliveryOption.meta.name)) {
        return peDictionaryDropDown.factory(DeliveryOptionSelector.PART_NAME, {
            showInfoButton: false
        });
    }

    return null;
}, {vt: "object", priority: 5});