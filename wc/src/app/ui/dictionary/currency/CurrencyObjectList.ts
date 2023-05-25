import * as core from "core";
import {Application} from "core";
import {Currency} from "app/domain/model-classes";
import * as DictionaryObjectList from "dms/modules/dictionary/common/DictionaryObjectList";
import {currencyListOptions} from "app/ui/dictionary/currency/CurrencySharedOptions";
import {DictionarySecurityOperationsMixin} from "dms/modules/dictionary/security/DictionarySecurityOperationsMixin";
import * as CurrencyObjectFilter from "app/ui/dictionary/currency/CurrencyObjectFilter";

/**
 * Список валют.
 */
class CurrencyObjectList extends DictionaryObjectList {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectList:" + Currency.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CurrencyObjectList.Options = {
        conflictChecker: {check: (id: string) => core.lang.resolved(false)}
    };

    /**
     * Опции компонента.
     */
    options: CurrencyObjectList.Options;

    /**
     * @constructor
     * @param {Application} app текущий экземпляр приложения.
     * @param {CurrencyObjectList.Options} options Опции компонента.
     */
    constructor(app: Application, options?: CurrencyObjectList.Options) {
        options = CurrencyObjectList.mixOptions(options, currencyListOptions(app));
        options.filter = options.filter || core.createPart(CurrencyObjectFilter.PART_NAME, {allowDeleted: true});
        super(app, CurrencyObjectList.mixOptions(options, CurrencyObjectList.DEFAULT_OPTIONS));
    }
}

DictionarySecurityOperationsMixin.mixinTo(CurrencyObjectList);

namespace CurrencyObjectList {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectList.Options {

    }
}

export = CurrencyObjectList;

core.createModule((app: Application) => {
    app.registerPart(CurrencyObjectList.PART_NAME, (options?: CurrencyObjectList.Options) => {
        return new CurrencyObjectList(app, options);
    });
});

