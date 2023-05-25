import * as resources from "i18n!app/nls/resources";
import {ObjectList} from "core.ui";
import {Application} from "core";
import {Contractor} from "app/domain/model-ext";
import {DELETED_COLUMN} from "dms/modules/dictionary/common/DictionaryObjectList";
import * as DataSource from "lib/data/DataSource";

/**
 * Общие опции для справочника контрагентов.
 */
namespace ContractorSharedOptions {

    /**
     * Опции списка справочника контрагентов.
     * @param app экземпляр приложения
     */
    export function contractorListOptions(app: Application): ObjectList.Options {
        return {
            entityType: Contractor.meta.name,
            title: resources["part.contractor"],
            dataSource: new DataSource(app, {
                name: "dictionary/contractor",
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
                {name: Contractor.meta.props.name.name},
                {name: Contractor.meta.props.shortName.name},
                {name: Contractor.meta.props.ogrn.name},
                {name: Contractor.meta.props.inn.name},
                {name: Contractor.meta.props.kpp.name},
                {name: Contractor.meta.props.comment.name}
            ]
        }
    }

}

export = ContractorSharedOptions;