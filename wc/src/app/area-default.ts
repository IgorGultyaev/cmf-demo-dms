import * as core from "core";
import {Application} from "lib/core";
import {Area} from "lib/core.composition";
import DashboardView = require("cmf/modules/dashboard/DashboardView");
import * as MainInboxPart from "dms/modules/task/MainInboxPart";
import * as taskResources from "i18n!dms/modules/task/nls/resources";
import * as resources from "i18n!app/nls/resources";

core.createAreaModule("main", function (app: Application, area: Area): void {
    area.title = resources["area.main"];

    //Регистрируется такой же парт под другим имененм
    //см. CMF-1518
    const manInboxPartNameForNavMenu: string = "ManInboxNavMenu";
    app.registerPart(manInboxPartNameForNavMenu, function (options) {
        return new MainInboxPart(app, options);
    });

    area.addState({
        name: "mainInbox",
        title: taskResources["part.mainInbox"]
    }, {
        main: manInboxPartNameForNavMenu,
    });

    area.addState({
        name: "mainPagePart",
        title: resources["part.mainPagePart"]
    }, {
        main: "MainPagePart"
    });

    area.addState({
        name: "search",
        title: resources["part.search"]
    }, {
        main: "AdvancedSearchObjectList"
    });

    area.addState({
        name: "dashboard",
        title: resources["area.dashboard"]
    }, {
        main: "DashboardView",
    });

    area.setDefaultState("mainPagePart");
});
