import * as core from "core";
import {Application} from "lib/core";
import {IPart} from "lib/ui/.ui";
import ObjectList = require("lib/ui/list/ObjectList");
import ObjectSelector = require("lib/ui/list/ObjectSelector");
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");

core.createModule("default-parts", function (app: Application): void {
    app.registerPart("ObjectViewer", function (options: any): IPart {
        return new ObjectViewer(options);
    });

    app.registerPart("ObjectEditor", function (options: any): IPart {
        return new ObjectEditor(options);
    });

    app.registerPart("ObjectSelector", function (options: any): IPart {
        return new ObjectSelector(app, options);
    });

    app.registerPart("ObjectList", function (options: any): IPart {
        return new ObjectList(app, options);
    });
});