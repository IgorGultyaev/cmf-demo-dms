import * as core from "core";
import {Application} from "core";
import {DeliveryOption} from "app/domain/model-classes";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");

/**
 * Редактор для DeliveryOption.
 */
class DeliveryOptionEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:DeliveryOption";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DeliveryOptionEditor.Options = {
        blockingSave: true,
        pages: [{
            properties: [
                {
                    name: "name"
                }, {
                    name: "deliveryType",
                    presentation: "dropdown"
                }
            ]
        }]
    };

    /**
     * Опции компонента.
     */
    options: DeliveryOptionEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: DeliveryOption;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: DeliveryOptionEditor.Options) {
        super(DeliveryOptionEditor.mixOptions(options, DeliveryOptionEditor.DEFAULT_OPTIONS));
    }
}

namespace DeliveryOptionEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

export = DeliveryOptionEditor;

core.createModule((app: Application) => {
    app.registerPart(DeliveryOptionEditor.PART_NAME, (options?: DeliveryOptionEditor.Options) => {
        return new DeliveryOptionEditor(options);
    });
});

