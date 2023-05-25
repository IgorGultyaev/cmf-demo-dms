import dashboardTemplate = require("xhtmpl!./ui/templates/dashboard.hbs");
import MainPagePart = require("dms/modules/mainPage/MainPagePart");
import View = require("lib/ui/handlebars/View");
import * as core from "core";
import "app/ui/document/DocumentParts";
import "app/ui/dictionary/DictionaryParts";
import "app/widgets";
import {Application} from "lib/core";

core.createModule(function (app: Application): void {
    app.registerPart("Dashboard", function () {
        return View.create({
            template: dashboardTemplate
        });
    });

    app.registerPart("MainPagePart", function () {
        return new MainPagePart(app);
    });
});