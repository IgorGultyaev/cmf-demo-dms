/**
 * Карточка задачи на создание доверенности.
 */
import core = require( "core" );
import WarrantTaskEditor = require("./WarrantTaskEditor");

core.createModule(function (app) {
    app.registerPart("TaskPart:TaskType_Document_Create_Project:WarrantDocument", function (options) {
        return new WarrantTaskEditor(options);
    })

    app.registerPart("TaskPart:TaskType_Document_Refine:WarrantDocument", function (options) {
        return new WarrantTaskEditor(options);
    })
});