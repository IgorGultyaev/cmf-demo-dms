import core = require( "core" );
import {Area} from "lib/core.composition";
import {Application} from "lib/core";
import * as commissionResources from "i18n!dms/modules/commission/nls/resources";
import resources = require( "i18n!app/nls/resources" );

core.createAreaModule("journals", function (app: Application, area: Area): void {
    area.title = resources["area.journals"];

    area.addState({
        name: "OutgoingDocumentJournal",
        title: resources["part.outgoingDocumentJournal"]
    }, {
        main: "OutgoingDocumentJournal"
    });

    area.addState({
        name: "IncomingDocumentJournal",
        title: resources["part.incomingDocumentJournal"]
    }, {
        main: "IncomingDocumentJournal"
    });

    area.addState({
        name: "CommissionJournal",
        title: commissionResources["part.journal.commissionJournal"]
    }, {
        main: "CommissionJournal"
    });

    area.addState({
        name: "WarrantJournal",
        title: resources["part.journal.warrantJournal"]
    }, {
        main: "WarrantJournal"
    });

    area.addState({
        name: "ContractDocumentJournal",
        title: resources["part.contractDocumentJournal"]
    }, {
        main: "ContractDocumentJournal"
    });

    area.setDefaultState("OutgoingDocumentJournal");
});
