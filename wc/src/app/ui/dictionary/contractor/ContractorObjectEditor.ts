import * as core from "core";
import {Application} from "core";
import {Contractor} from "app/domain/model-classes";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";

/**
 * Редактор контрагента.
 */
class ContractorObjectEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:" + Contractor.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractorObjectEditor.Options = {
        preloads: [
            Contractor.meta.props.correspondent.name
        ],
        blockingSave: true,
        pages: [
            {
                properties: [
                    {name: Contractor.meta.props.name.name},
                    {name: Contractor.meta.props.shortName.name},
                    {name: Contractor.meta.props.ogrn.name},
                    {name: Contractor.meta.props.inn.name},
                    {name: Contractor.meta.props.kpp.name},
                    {name: Contractor.meta.props.comment.name},
                    {name: Contractor.meta.props.correspondent.name, readOnly: true}
                ]
            }
        ]
    };

    /**
     * Опции компонента.
     */
    options: ContractorObjectEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: Contractor;

    /**
     * @constructor
     * @param {ContractorObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: ContractorObjectEditor.Options) {
        super(ContractorObjectEditor.mixOptions(options, ContractorObjectEditor.DEFAULT_OPTIONS));
    }
}

namespace ContractorObjectEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

export = ContractorObjectEditor;

core.createModule((app: Application) => {
    app.registerPart(ContractorObjectEditor.PART_NAME, (options?: ContractorObjectEditor.Options) => {
        return new ContractorObjectEditor(options);
    });
});

