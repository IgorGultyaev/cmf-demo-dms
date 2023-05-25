import * as core from "core";
import {Application} from "core";
import {ContractRevokeReason} from "app/domain/model-classes";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";

/**
 * Редактор причины расторжения/аннулирования договоров.
 */
class ContractRevokeReasonObjectEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:" + ContractRevokeReason.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractRevokeReasonObjectEditor.Options = {
        pages: [
            {
                properties: [
                    {name: ContractRevokeReason.meta.props.name.name}
                ]
            }
        ]
    };

    /**
     * Опции компонента.
     */
    options: ContractRevokeReasonObjectEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: ContractRevokeReason;

    /**
     * @constructor
     * @param {ContractRevokeReasonObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: ContractRevokeReasonObjectEditor.Options) {
        super(ContractRevokeReasonObjectEditor.mixOptions(options, ContractRevokeReasonObjectEditor.DEFAULT_OPTIONS));
    }
}

namespace ContractRevokeReasonObjectEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

export = ContractRevokeReasonObjectEditor;

core.createModule((app: Application) => {
    app.registerPart(ContractRevokeReasonObjectEditor.PART_NAME, (options?: ContractRevokeReasonObjectEditor.Options) => {
        return new ContractRevokeReasonObjectEditor(options);
    });
});

