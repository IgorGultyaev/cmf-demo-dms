import * as core from "core";
import {Application} from "core";
import {currencyListOptions} from "app/ui/dictionary/currency/CurrencySharedOptions";
import {Currency} from "app/domain/model-classes";
import * as DictionaryObjectSelector from "dms/modules/dictionary/common/DictionaryObjectSelector";
import * as CurrencyObjectFilter from "app/ui/dictionary/currency/CurrencyObjectFilter";

/**
 * Парт для выбора валюты.
 */
class CurrencyObjectSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:" + Currency.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CurrencyObjectSelector.Options = {
        filter: CurrencyObjectFilter.PART_NAME
    };

    /**
     * Опции компонента.
     */
    options: CurrencyObjectSelector.Options;

    /**
     * @constructor
     *
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor(app: Application, options?: CurrencyObjectSelector.Options) {
        options = CurrencyObjectSelector.mixOptions(options, currencyListOptions(app));

        options.filterOptions = options.filterOptions || {};
        core.lang.append(options.filterOptions, {
            allowDeleted: options.allowDeleted
        });

        super(app, CurrencyObjectSelector.mixOptions(options, CurrencyObjectSelector.DEFAULT_OPTIONS));
    }
}

namespace CurrencyObjectSelector {

    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {
    }
}

export = CurrencyObjectSelector;

core.createModule((app: Application) => {
    app.registerPart(CurrencyObjectSelector.PART_NAME, (options?: CurrencyObjectSelector.Options) => {
        return new CurrencyObjectSelector(app, options);
    });
});

