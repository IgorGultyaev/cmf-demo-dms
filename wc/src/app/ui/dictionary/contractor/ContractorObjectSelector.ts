import * as core from "core";
import {Application} from "core";
import {contractorListOptions} from "app/ui/dictionary/contractor/ContractorSharedOptions";
import {Contractor} from "app/domain/model-classes";
import * as DictionaryObjectSelector from "dms/modules/dictionary/common/DictionaryObjectSelector";
import * as ContractorObjectFilter from "app/ui/dictionary/contractor/ContractorObjectFilter";

/**
 * Парт для выбора контрагента.
 */
class ContractorObjectSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:" + Contractor.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractorObjectSelector.Options = {
        filter: ContractorObjectFilter.PART_NAME
    };

    /**
     * Опции компонента.
     */
    options: ContractorObjectSelector.Options;

    /**
     * @constructor
     *
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor(app: Application, options?: ContractorObjectSelector.Options) {
        options = ContractorObjectSelector.mixOptions(options, contractorListOptions(app));

        options.filterOptions = options.filterOptions || {};
        core.lang.append(options.filterOptions, {
            allowDeleted: options.allowDeleted
        });

        super(app, ContractorObjectSelector.mixOptions(options, ContractorObjectSelector.DEFAULT_OPTIONS));
    }
}

namespace ContractorObjectSelector {

    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {
    }
}

export = ContractorObjectSelector;

core.createModule((app: Application) => {
    app.registerPart(ContractorObjectSelector.PART_NAME, (options?: ContractorObjectSelector.Options) => {
        return new ContractorObjectSelector(app, options);
    });
});

