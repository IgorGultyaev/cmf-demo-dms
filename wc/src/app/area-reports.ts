import * as core from "core";
import {Application} from "lib/core";
import {Area} from "lib/core.composition";
import resources = require("i18n!app/nls/resources");

core.createAreaModule("reports", function (app: Application, area: Area) {
    area.title = resources["area.reports"];

    area.addState({
        name: "ReportsList",
        title: resources["part.ReportsList"]
    }, {
        main: "ReportsList"
    });

    area.addState({
        name: "CreateDisciplineReport",
        title: resources["part.CreateDisciplineReport"]
    }, {
        main: "CreateDisciplineReport"
    });

    area.setDefaultState("ReportsList");
});