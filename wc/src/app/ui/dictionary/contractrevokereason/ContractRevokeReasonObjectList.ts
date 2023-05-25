import * as core from "core";
import {Application} from "core";
import {ContractRevokeReason} from "app/domain/model-classes";
import * as DictionaryObjectList from "dms/modules/dictionary/common/DictionaryObjectList";
import {contractRevokeReasonListOptions} from "app/ui/dictionary/contractrevokereason/ContractRevokeReasonSharedOptions";
import {DictionarySecurityOperationsMixin} from "dms/modules/dictionary/security/DictionarySecurityOperationsMixin";
import * as ContractRevokeReasonObjectFilter
    from "app/ui/dictionary/contractrevokereason/ContractRevokeReasonObjectFilter";

/**
 * Список причин расторжения/аннулирования договоров.
 */
class ContractRevokeReasonObjectList extends DictionaryObjectList {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectList:" + ContractRevokeReason.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractRevokeReasonObjectList.Options = {
        conflictChecker: {check: (id: string) => core.lang.resolved(false)}
    };

    /**
     * Опции компонента.
     */
    options: ContractRevokeReasonObjectList.Options;

    /**
     * @constructor
     * @param {Application} app текущий экземпляр приложения.
     * @param {ContractRevokeReasonObjectList.Options} options Опции компонента.
     */
    constructor(app: Application, options?: ContractRevokeReasonObjectList.Options) {
        options = ContractRevokeReasonObjectList.mixOptions(options, contractRevokeReasonListOptions(app));
        options.filter = options.filter || core.createPart(ContractRevokeReasonObjectFilter.PART_NAME, {allowDeleted: true});
        super(app, ContractRevokeReasonObjectList.mixOptions(options, ContractRevokeReasonObjectList.DEFAULT_OPTIONS));
    }
}

DictionarySecurityOperationsMixin.mixinTo(ContractRevokeReasonObjectList);

namespace ContractRevokeReasonObjectList {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectList.Options {

    }
}

export = ContractRevokeReasonObjectList;

core.createModule((app: Application) => {
    app.registerPart(ContractRevokeReasonObjectList.PART_NAME, (options?: ContractRevokeReasonObjectList.Options) => {
        return new ContractRevokeReasonObjectList(app, options);
    });
});

