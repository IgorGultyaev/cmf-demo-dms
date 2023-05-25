import * as core from "core";
import {
    AbstractCorrespondent,
    AbstractCorrespondentContact,
    CompanyCorrespondent,
    CorrespondentAddress,
    CorrespondentContactDefault,
    CorrespondentContactKind
} from "app/domain/model-classes";
import peDictionaryDropDown = require( "dms/modules/dictionary/common/peDictionaryDropDown" );
import AbstractCorrespondentContactSelector = require("app/ui/dictionary/correspondent/AbstractCorrespondentContactSelector");
import CorrespondentContactKindSelector = require("app/ui/dictionary/correspondent/CorrespondentContactKindSelector");
import AbstractCorrespondentSelector = require("app/ui/dictionary/correspondent/AbstractCorrespondentSelector");
import CompanyCorrespondentSelector = require("app/ui/dictionary/correspondent/CompanyCorrespondentSelector");
import peCorrespondentContact = require("app/ui/dictionary/correspondent/peCorrespondentContact");
import peCorrespondentContactKindLookup = require("app/ui/dictionary/correspondent/peCorrespondentContactKindLookup");

core.ui.PropertyEditor.DefaultMapping.register(propMd => {
    if (!!propMd.ref && (propMd.ref === AbstractCorrespondent.meta.name || propMd.ref.name === AbstractCorrespondent.meta.name)) {
        return peDictionaryDropDown.factory(AbstractCorrespondentSelector.PART_NAME);
    }

    if (!!propMd.ref && (propMd.ref === CompanyCorrespondent.meta.name || propMd.ref.name === CompanyCorrespondent.meta.name)) {
        return peDictionaryDropDown.factory(CompanyCorrespondentSelector.PART_NAME, {
            showInfoButton: false
        });
    }

    if (!!propMd.ref && (propMd.ref === CorrespondentContactKind.meta.name || propMd.ref.name === CorrespondentContactKind.meta.name)) {
        return peCorrespondentContactKindLookup.factory(CorrespondentContactKindSelector.PART_NAME, {
            showInfoButton: false
        });
    }
    if (!!propMd.ref && (propMd.ref === AbstractCorrespondentContact.meta.name || propMd.ref.name === AbstractCorrespondentContact.meta.name)) {
        return peCorrespondentContact.factory(AbstractCorrespondentContactSelector.PART_NAME, {
            correspondentId: undefined,
            showInfoButton: false
        });
    }
    if (!!propMd.ref && (propMd.ref === CorrespondentContactDefault.meta.name || propMd.ref.name === CorrespondentContactDefault.meta.name)) {
        return peCorrespondentContact.factory(AbstractCorrespondentContactSelector.PART_NAME, {
            correspondentId: undefined,
            showInfoButton: false
        });
    }
    if (!!propMd.ref && (propMd.ref === CorrespondentAddress.meta.name || propMd.ref.name === CorrespondentAddress.meta.name)) {
        return peCorrespondentContact.factory(AbstractCorrespondentContactSelector.PART_NAME, {
            correspondentId: undefined,
            showInfoButton: false
        });
    }

    return null;
}, {
    vt: "object",
    priority: 5
});