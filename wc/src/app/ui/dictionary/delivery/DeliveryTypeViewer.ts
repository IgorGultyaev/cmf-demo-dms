import * as core from "core";
import {Application} from "core";
import {DeliveryType} from "app/domain/model-classes";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");

/**
 * Парт для просмотра DeliveryType.
 */
class DeliveryTypeViewer extends ObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:DeliveryType";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DeliveryTypeViewer.Options = {
        pages: [{
            properties: ["name"]
        }]
    };

    /**
     * Опции компонента.
     */
    options: DeliveryTypeViewer.Options;

    /**
     * Тип модели.
     */
    viewModel: DeliveryType;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: DeliveryTypeViewer.Options) {
        super(DeliveryTypeViewer.mixOptions(options, DeliveryTypeViewer.DEFAULT_OPTIONS));
    }
}

namespace DeliveryTypeViewer {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectViewer.Options {

    }
}

export = DeliveryTypeViewer;

core.createModule((app: Application) => {
    app.registerPart(DeliveryTypeViewer.PART_NAME, (options?: DeliveryTypeViewer.Options) => {
        return new DeliveryTypeViewer(options);
    });
});

