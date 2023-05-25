import * as core from "core";
import {Application} from "core";
import {Contractor, ContractorFilter} from "app/domain/model-ext";
import * as ObjectFilter from "lib/ui/editor/ObjectFilter";

/**
 * Фильтр списка контрагентов.
 */
class ContractorObjectFilter extends ObjectFilter {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectFilter:" + Contractor.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractorObjectFilter.Options = {
        type: ContractorFilter.meta.name
    };

    /**
     * Опции компонента.
     */
    options: ContractorObjectFilter.Options;

    /**
     * @constructor
     * @param {ContractorObjectFilter.Options} options Опции компонента.
     */
    constructor(options?: ContractorObjectFilter.Options) {
        super(ContractorObjectFilter.mixOptions(options, ContractorObjectFilter.DEFAULT_OPTIONS));

        const properties = [ContractorFilter.meta.props.searchString.name];
        if (typeof options.allowDeleted != "undefined" && options.allowDeleted != null && options.allowDeleted === true) {
            properties.push(ContractorFilter.meta.props.allowDeleted.name);
        }

        options = ContractorObjectFilter.mixOptions(options, {
            pages: [{
                properties: properties
            }]
        });
        super(ContractorObjectFilter.mixOptions(options, ContractorObjectFilter.DEFAULT_OPTIONS));
    }
}

namespace ContractorObjectFilter {
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

export = ContractorObjectFilter;

core.createModule((app: Application) => {
    app.registerPart(ContractorObjectFilter.PART_NAME, (options?: ContractorObjectFilter.Options) => {
        return new ContractorObjectFilter(options);
    });
});

