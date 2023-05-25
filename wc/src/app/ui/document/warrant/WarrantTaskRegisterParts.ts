/**
 * Карточка задачи на создание доверенности.
 */
import core = require( "core" );
import WarrantTaskEditor = require("./WarrantTaskEditor");
import resources = require( "i18n!app/nls/resources" );

core.createModule(function (app) {
    app.registerPart("TaskPart:TaskType_Document_Register:WarrantDocument", function (options) {
        return new WarrantTaskEditor(core.lang.extend({
            leftMenu: {
                update: [{
                    name: "CompleteTask",
                    title: resources["part.task.completeRegistration"]
                }]
            },
        }, options));
    })

});