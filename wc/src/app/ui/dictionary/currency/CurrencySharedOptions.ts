import * as  core from "core";
import {Application} from "core";
import * as resources from "i18n!app/nls/resources";
import {ObjectList} from "core.ui";
import {Currency} from "app/domain/model-ext";
import {DELETED_COLUMN} from "dms/modules/dictionary/common/DictionaryObjectList";

/**
 * Общие опции для справочника валют.
 */
namespace CurrencySharedOptions {

    /**
     * Опции списка справочника валют.
     * @param app экземпляр приложения
     */
    export function currencyListOptions(app: Application): ObjectList.Options {
        return {
            entityType: Currency.meta.name,
            title: resources["part.currency"],
            dataSource: new core.data.DataSource(app, {
                name: "dictionary/currency",
                supportQuery: false
            }),
            autoLoad: true,
            paging: {
                pageSize: 10,
                force: true,
                mode: "pages"
            },
            columns: [
                DELETED_COLUMN,
                {name: Currency.meta.props.codeAlfa.name},
                {name: Currency.meta.props.name.name},
                {name: Currency.meta.props.codeNumber.name}
            ]
        }
    }

}

export = CurrencySharedOptions;