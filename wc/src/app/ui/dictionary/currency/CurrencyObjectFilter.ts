import * as core from "core";
import {Application} from "core";
import {Currency, CurrencyFilter} from "app/domain/model-classes";
import * as ObjectFilter from "lib/ui/editor/ObjectFilter";

/**
 * Фильтр списка валют.
 */
class CurrencyObjectFilter extends ObjectFilter {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectFilter:" + Currency.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CurrencyObjectFilter.Options = {
        type: CurrencyFilter.meta.name
    };

    /**
     * Опции компонента.
     */
    options: CurrencyObjectFilter.Options;

    /**
     * @constructor
     * @param {CurrencyObjectFilter.Options} options Опции компонента.
     */
    constructor(options?: CurrencyObjectFilter.Options) {
        super(CurrencyObjectFilter.mixOptions(options, CurrencyObjectFilter.DEFAULT_OPTIONS));

        const properties = [CurrencyFilter.meta.props.searchString.name];
        if (typeof options.allowDeleted != "undefined" && options.allowDeleted != null && options.allowDeleted === true) {
            properties.push(CurrencyFilter.meta.props.allowDeleted.name);
        }

        options = CurrencyObjectFilter.mixOptions(options, {
            pages: [{
                properties: properties
            }]
        });
        super(CurrencyObjectFilter.mixOptions(options, CurrencyObjectFilter.DEFAULT_OPTIONS));
    }
}

namespace CurrencyObjectFilter {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectFilter.Options {

        /**
         * Разрешено ли выбирать удалённые элементы.
         */
        allowDeleted?: boolean;
    }
}

export = CurrencyObjectFilter;

core.createModule((app: Application) => {
    app.registerPart(CurrencyObjectFilter.PART_NAME, (options?: CurrencyObjectFilter.Options) => {
        return new CurrencyObjectFilter(options);
    });
});

