import * as core from "core";
import {Application} from "core";
import {Contractor, ContractorCreationParams} from "app/domain/model-classes";
import * as DictionaryObjectList from "dms/modules/dictionary/common/DictionaryObjectList";
import {contractorListOptions} from "app/ui/dictionary/contractor/ContractorSharedOptions";
import {DictionarySecurityOperationsMixin} from "dms/modules/dictionary/security/DictionarySecurityOperationsMixin";
import * as ContractorObjectFilter from "app/ui/dictionary/contractor/ContractorObjectFilter";
import * as ContractorCreationObjectEditor from "app/ui/dictionary/contractor/ContractorCreationObjectEditor";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";

/**
 * Список контрагентов.
 */
class ContractorObjectList extends DictionaryObjectList {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectList:" + Contractor.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractorObjectList.Options = {
        conflictChecker: {check: (id: string) => core.lang.resolved(false)}
    };

    /**
     * Опции компонента.
     */
    options: ContractorObjectList.Options;

    /**
     * @constructor
     * @param {Application} app текущий экземпляр приложения.
     * @param {ContractorObjectList.Options} options Опции компонента.
     */
    constructor(app: Application, options?: ContractorObjectList.Options) {
        options = ContractorObjectList.mixOptions(options, contractorListOptions(app));
        options.filter = options.filter || core.createPart(ContractorObjectFilter.PART_NAME, {allowDeleted: true});
        super(app, ContractorObjectList.mixOptions(options, ContractorObjectList.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected doCreate(args: any): any {
        args = args || {};
        const that = this;

        // Будем создавать Контрагента через промежуточную форму для возможности указания корреспондента
        this.executePartCommand({
            part: ContractorCreationObjectEditor.PART_NAME,
            partOptions: {
                type: ContractorCreationParams.meta.name
            }
        }, args, "Create").closed
            .then((result: ObjectEditor.Result) => {
                if (result && result.success) {
                    // Перезагружаем список после того, как создали нового КА
                    that.reload();
                }
            });
    }
}

DictionarySecurityOperationsMixin.mixinTo(ContractorObjectList);

namespace ContractorObjectList {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectList.Options {

    }
}

export = ContractorObjectList;

core.createModule((app: Application) => {
    app.registerPart(ContractorObjectList.PART_NAME, (options?: ContractorObjectList.Options) => {
        return new ContractorObjectList(app, options);
    });
});

