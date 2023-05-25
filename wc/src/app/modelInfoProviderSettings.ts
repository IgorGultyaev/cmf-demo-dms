import * as core from "core";
import {CompanyCorrespondent, CompanyPersonCorrespondent, PersonCorrespondent} from "app/domain/model-classes";
import {modelInfoProvider} from "dms/modules/info/ModelInfoProvider";
import domainResources = require("i18n!app/domain/nls/resources");
import SimplePropertiesInfoView = require("dms/modules/info/SimplePropertiesInfoView");
import * as orgStrResources from "i18n!dms/modules/dictionary/orgstructure/nls/resources";

modelInfoProvider.registerProvider<CompanyCorrespondent>(CompanyCorrespondent.meta.name, {
    hasInfo: function (object) {
        return !!object;
    },
    createTitle: function (object) {
        return core.lang.resolved(domainResources["model.CompanyCorrespondent"]);
    },
    createBodyPart: function (object) {
        return core.lang.resolved(new SimplePropertiesInfoView({
                properties: [
                    {
                        name: domainResources["model.CompanyCorrespondent.shortName"],
                        value: object.shortName()
                    }
                ]
            })
        );
    }
});

modelInfoProvider.registerProvider<CompanyPersonCorrespondent>(CompanyPersonCorrespondent.meta.name, {
    hasInfo: function (object) {
        return !!object;
    },
    createTitle: function (object) {
        return core.lang.resolved(domainResources["model.CompanyPersonCorrespondent"]);
    },
    createBodyPart: function (object) {
        return core.lang.resolved(new SimplePropertiesInfoView({
                properties: [
                    {
                        //TODO: а почему не своё название?
                        name: orgStrResources["infoviewprovider.employeePosition.name"],
                        //TODO: а почему не object.name()?
                        value: object.firstName() + " " + object.secondName() + " " + object.patronymic()
                    }
                ]
            })
        );
    }
});

modelInfoProvider.registerProvider<PersonCorrespondent>(PersonCorrespondent.meta.name, {
    hasInfo: function (object) {
        return !!object;
    },
    createTitle: function (object) {
        return core.lang.resolved(domainResources["model.PersonCorrespondent"]);
    },
    createBodyPart: function (object) {
        return core.lang.resolved(new SimplePropertiesInfoView({
            properties: [
                {
                    //TODO: а почему не своё название?
                    name: orgStrResources["infoviewprovider.employeePosition.name"],
                    //TODO: а почему не object.name()?
                    value: object.firstName() + " " + object.secondName() + " " + object.patronymic()
                }
            ]
        }));
    }
});