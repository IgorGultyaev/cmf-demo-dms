import * as core from "core";
import {Application} from "core";
import * as resources from "i18n!app/nls/resources";
import {ObjectList} from "core.ui";
import {ContractRevokeReason} from "app/domain/model-ext";
import {DELETED_COLUMN} from "dms/modules/dictionary/common/DictionaryObjectList";

/**
 * Общие опции для справочника причин расторжения/аннулирования договора.
 */
namespace ContractRevokeReasonSharedOptions {

    /**
     * Опции списка справочника причин расторжения/аннулирования договоров.
     * @param app экземпляр приложения
     */
    export function contractRevokeReasonListOptions(app: Application): ObjectList.Options {
        return {
            entityType: ContractRevokeReason.meta.name,
            title: resources["part.contractRevokeReason"],
            dataSource: new core.data.DataSource(app, {
                name: "dictionary/contract_revoke_reason",
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
                {name: ContractRevokeReason.meta.props.name.name}
            ]
        }
    }

}

export = ContractRevokeReasonSharedOptions;