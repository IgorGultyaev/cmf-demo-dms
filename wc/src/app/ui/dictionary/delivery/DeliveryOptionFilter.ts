import * as core from "core";
import {Application} from "core";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectList = require("lib/ui/list/ObjectList");
import ObjectSelector = require("lib/ui/list/ObjectSelector");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");
import ObjectFilter = require("lib/ui/editor/ObjectFilter");
import {DICTIONARY_FILTER_DEFAULT_OPTIONS} from "dms/modules/dictionary/common/DictionaryFilterDefaultOptions";
import {DeliveryOption} from "app/domain/model-classes";

/**
 * Фильтр для DeliveryOption.
 */
class DeliveryOptionFilter extends ObjectFilter {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectFilter:DeliveryOption";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DeliveryOptionFilter.Options = {
        type: DeliveryOption.meta.name
    };

    /**
     * Опции компонента.
     */
    options: DeliveryOptionFilter.Options;

    /**
     * Тип модели.
     */
    viewModel: DeliveryOption;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: DeliveryOptionFilter.Options) {
        options = DeliveryOptionFilter.mixOptions(options, DICTIONARY_FILTER_DEFAULT_OPTIONS);
        super(DeliveryOptionFilter.mixOptions(options, DeliveryOptionFilter.DEFAULT_OPTIONS));
    }
}

namespace DeliveryOptionFilter {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectFilter.Options {

    }
}

export = DeliveryOptionFilter;

core.createModule((app: Application) => {
    app.registerPart(DeliveryOptionFilter.PART_NAME, (options?: DeliveryOptionFilter.Options) => {
        return new DeliveryOptionFilter(options);
    });
});

