import * as core from "core";
import {Application} from "lib/core";
import {Area} from "lib/core.composition";
import * as userResources from  "i18n!dms/modules/dictionary/user/nls/resources";
import * as employeeResources from  "i18n!dms/modules/dictionary/employee/nls/resources";
import * as positionDescriptionResources from "i18n!dms/modules/dictionary/positionDescription/nls/resources";
import * as DocumentKindList from "dms/modules/document/dictionary/documentKind/DocumentKindList";
import * as NomenclatureTree from "dms/modules/document/dictionary/nomenclature/NomenclatureTree";
import * as DmsCalendarView from "dms/modules/dictionary/orgstructure/calendar/DmsCalendarView";
import * as WeekBasedWorkingTimeList from "dms/modules/dictionary/orgstructure/calendar/workingTime/WeekBasedWorkingTimeList";
import * as resources from "i18n!app/nls/resources";
import * as CurrencyObjectList from "app/ui/dictionary/currency/CurrencyObjectList";
import * as ContractRevokeReasonObjectList from "app/ui/dictionary/contractrevokereason/ContractRevokeReasonObjectList";
import * as ContractorObjectList from "app/ui/dictionary/contractor/ContractorObjectList";

core.createAreaModule("dictionary", function (app: Application, area: Area) {
    area.title = resources["area.dictionary"];

    area.addState({
        name: "documentKind",
        title: resources["part.documentKind"]
    }, {
        main: DocumentKindList.PART_NAME
    });

    area.addState({
        name: "PositionDescription",
        title: positionDescriptionResources["part.positiondescription"]
    }, "ObjectList:PositionDescription");

    area.addState({
        name: "abstractCorrespondent",
        title: resources["part.correspondent"]
    }, {
        main: "ObjectList:AbstractCorrespondent"
    });

    area.addState({
        name: "orgStructure",
        title: resources["part.orgStructure"]
    }, {
        main: "OrgStructureView"
    });

    area.addState({
        name: "User",
        title: userResources["part.users"]
    }, "ObjectList:User");

    area.addState({
        name: "Employee",
        title: employeeResources["part.employees"]
    }, "ObjectList:Employee");

    area.addState({
        name: "deliveryOption",
        title: resources["part.deliveryOption"]
    }, {
        main: "ObjectList:DeliveryOption"
    });

    area.addState({
        name: "documentType",
        title: resources["part.documentType"]
    }, {
        main: "ObjectTree:DocumentType"
    });

    area.addState({
        name: "nomenclatureTree",
        title: resources["part.nomenclatureTree"],
    }, {
        main: NomenclatureTree.PART_NAME
    });

    area.addState({
        name: "workingCalendar",
        title: resources["area.workingCalendar"]
    }, {
        main: DmsCalendarView.PART_NAME,
    });
    
    area.addState({
        name: "workingTime",
        title: resources["area.workingTime"]
    }, {
        main: WeekBasedWorkingTimeList.PART_NAME,
    });

    area.addState({
        name: "currency",
        title: resources["part.currency"]
    }, CurrencyObjectList.PART_NAME);

    area.addState({
        name: "contractRevokeReason",
        title: resources["part.contractRevokeReason"]
    }, ContractRevokeReasonObjectList.PART_NAME);

    area.addState({
        name: "contractor",
        title: resources["part.contractor"]
    }, ContractorObjectList.PART_NAME);

    area.setDefaultState("User");
});