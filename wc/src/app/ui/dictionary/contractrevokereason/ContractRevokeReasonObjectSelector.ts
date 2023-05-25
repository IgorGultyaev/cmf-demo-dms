import * as core from "core";
import {Application} from "core";
import {contractRevokeReasonListOptions} from "app/ui/dictionary/contractrevokereason/ContractRevokeReasonSharedOptions";
import {ContractRevokeReason} from "app/domain/model-classes";
import * as DictionaryObjectSelector from "dms/modules/dictionary/common/DictionaryObjectSelector";
import * as ContractRevokeReasonObjectFilter
    from "app/ui/dictionary/contractrevokereason/ContractRevokeReasonObjectFilter";

/**
 * Парт для выбора причины расторжения/аннулирования договоров.
 */
class ContractRevokeReasonObjectSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:" + ContractRevokeReason.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractRevokeReasonObjectSelector.Options = {
        filter: ContractRevokeReasonObjectFilter.PART_NAME
    };

    /**
     * Опции компонента.
     */
    options: ContractRevokeReasonObjectSelector.Options;

    /**
     * @constructor
     *
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor(app: Application, options?: ContractRevokeReasonObjectSelector.Options) {
        options = ContractRevokeReasonObjectSelector.mixOptions(options, contractRevokeReasonListOptions(app));

        options.filterOptions = options.filterOptions || {};
        core.lang.append(options.filterOptions, {
            allowDeleted: options.allowDeleted
        });

        super(app, ContractRevokeReasonObjectSelector.mixOptions(options, ContractRevokeReasonObjectSelector.DEFAULT_OPTIONS));
    }
}

namespace ContractRevokeReasonObjectSelector {

    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {
    }
}

export = ContractRevokeReasonObjectSelector;

core.createModule((app: Application) => {
    app.registerPart(ContractRevokeReasonObjectSelector.PART_NAME, (options?: ContractRevokeReasonObjectSelector.Options) => {
        return new ContractRevokeReasonObjectSelector(app, options);
    });
});

