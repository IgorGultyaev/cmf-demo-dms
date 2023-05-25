import * as core from "core";
import {Application} from "core";
import resources = require("i18n!app/nls/resources");
import OutgoingDocumentTaskBaseEditor = require("app/ui/document/outgoing/OutgoingDocumentTaskBaseEditor");

/**
 * Парт для создания проекта исходящего документа.
 */
class OutgoingDocumentTaskCreateProjectPart extends OutgoingDocumentTaskBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Create_Project:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskCreateProjectPart.Options = {
        subtitle: resources["part.task.createDocumentProject"]
    };

    /**
     * @constructs
     * @param {OutgoingDocumentTaskCreateProjectPart.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentTaskCreateProjectPart.Options) {
        super(OutgoingDocumentTaskCreateProjectPart.mixOptions(options, OutgoingDocumentTaskCreateProjectPart.DEFAULT_OPTIONS));
    }
}

namespace OutgoingDocumentTaskCreateProjectPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentTaskBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTaskCreateProjectPart.PART_NAME, (options?: OutgoingDocumentTaskCreateProjectPart.Options) => {
        return new OutgoingDocumentTaskCreateProjectPart(options);
    });
});
