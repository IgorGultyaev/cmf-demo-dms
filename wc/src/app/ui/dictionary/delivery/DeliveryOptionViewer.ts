import * as core from "core";
import {Application} from "core";
import {DeliveryOption} from "app/domain/model-classes";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");

/**
 * Парт для просмотра DeliveryOption.
 */
class DeliveryOptionViewer extends ObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:DeliveryOption";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DeliveryOptionViewer.Options = {
        pages: [{
            properties: ["name", "deliveryType", "deleted"]
        }]
    };

    /**
     * Опции компонента.
     */
    options: DeliveryOptionViewer.Options;

    /**
     * Тип модели.
     */
    viewModel: DeliveryOption;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: DeliveryOptionViewer.Options) {
        super(DeliveryOptionViewer.mixOptions(options, DeliveryOptionViewer.DEFAULT_OPTIONS));
    }
}

namespace DeliveryOptionViewer {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectViewer.Options {

    }
}

export = DeliveryOptionViewer;

core.createModule((app: Application) => {
    app.registerPart(DeliveryOptionViewer.PART_NAME, (options?: DeliveryOptionViewer.Options) => {
        return new DeliveryOptionViewer(options);
    });
});

