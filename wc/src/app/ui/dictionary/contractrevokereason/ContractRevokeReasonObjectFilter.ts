import * as core from "core";
import {Application} from "core";
import {ContractRevokeReason, ContractRevokeReasonFilter} from "app/domain/model-classes";
import * as ObjectFilter from "lib/ui/editor/ObjectFilter";

/**
 * Фильтр списка причин расторжения/аннулирования договоров.
 */
class ContractRevokeReasonObjectFilter extends ObjectFilter {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectFilter:" + ContractRevokeReason.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractRevokeReasonObjectFilter.Options = {
        type: ContractRevokeReasonFilter.meta.name
    };

    /**
     * Опции компонента.
     */
    options: ContractRevokeReasonObjectFilter.Options;

    /**
     * @constructor
     * @param {ContractRevokeReasonObjectFilter.Options} options Опции компонента.
     */
    constructor(options?: ContractRevokeReasonObjectFilter.Options) {
        super(ContractRevokeReasonObjectFilter.mixOptions(options, ContractRevokeReasonObjectFilter.DEFAULT_OPTIONS));

        const properties = [ContractRevokeReasonFilter.meta.props.searchString.name];
        if (typeof options.allowDeleted != "undefined" && options.allowDeleted != null && options.allowDeleted === true) {
            properties.push(ContractRevokeReasonFilter.meta.props.allowDeleted.name);
        }

        options = ContractRevokeReasonObjectFilter.mixOptions(options, {
            pages: [{
                properties: properties
            }]
        });
        super(ContractRevokeReasonObjectFilter.mixOptions(options, ContractRevokeReasonObjectFilter.DEFAULT_OPTIONS));
    }
}

namespace ContractRevokeReasonObjectFilter {
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

export = ContractRevokeReasonObjectFilter;

core.createModule((app: Application) => {
    app.registerPart(ContractRevokeReasonObjectFilter.PART_NAME, (options?: ContractRevokeReasonObjectFilter.Options) => {
        return new ContractRevokeReasonObjectFilter(options);
    });
});

