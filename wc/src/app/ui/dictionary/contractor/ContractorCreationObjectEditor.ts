import * as core from "core";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";
import * as wcResources from "i18n!lib/nls/resources";
import * as Menu from "lib/ui/menu/Menu";
import * as ContractorObjectEditor from "app/ui/dictionary/contractor/ContractorObjectEditor";
import {ActionIcon} from "dms/modules/icons/Icons";
import {Contractor, ContractorCreationParams} from "app/domain/model-ext";
import ICommand = core.commands.ICommand;

/**
 * Редактор параметров создания контрагента.
 */
class ContractorCreationObjectEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:" + ContractorCreationParams.meta.name;

    /**
     * Опции компонента по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractorCreationObjectEditor.Options = {
        type: ContractorCreationParams.meta.name,
        title: ContractorCreationParams.meta.descr,
        pageValidation: "none",
        pages: [{
            name: "main",
            properties: [
                {name: ContractorCreationParams.meta.props.correspondent.name}
            ]
        }]
    };

    /**
     * Меню компонента по умолчанию.
     */
    static DEFAULT_MENUS: Menu.Options = {
        items: [
            {
                name: "CreateAndClose",
                title: wcResources["wizard.Forward"],
                icon: ActionIcon.CREATE,
            }, {
                name: "CancelAndClose",
                title: wcResources["cancel"],
                icon: ActionIcon.CLOSE
            }]
    };

    /**
     * Редактируемая модель.
     * Расширение объявления.
     */
    viewModel: ContractorCreationParams;

    /**
     * Опции редактора.
     * Расширение объявления.
     */
    options: ContractorCreationObjectEditor.Options;

    /**
     * @constructor
     * @param {ContractorCreationObjectEditor.Options} options Опции парта.
     */
    constructor(options?: ContractorCreationObjectEditor.Options) {
        const _options = ContractorCreationObjectEditor.mixOptions(options, ContractorCreationObjectEditor.DEFAULT_OPTIONS);
        super(_options);
    }


    /**
     * @inheritDoc
     */
    protected createCommands(): core.lang.Map<ICommand> {
        const commandCreateAndClose = core.commands.createBoundCommand(this.doCreateAndClose, this.canCreateAndClose, this);
        return core.lang.extend(super.createCommands(), {
            CreateAndClose: commandCreateAndClose
        });
    }

    /**
     * Выполняет команду создания контрагента.
     */
    protected doCreateAndClose(): void {
        const that = this;

        this.executePartCommand({
            part: ContractorObjectEditor.PART_NAME,
            partOptions: {
                type: Contractor.meta.name,
                onInitializing: function (editor: ContractorObjectEditor) {
                    const contractorCreationParams = that.viewModel;
                    const newContractor: Contractor = editor.viewModel;

                    const sourceCorrespondent = contractorCreationParams.correspondent();
                    if (sourceCorrespondent) {
                        // Инициализируем нового КА данными из выбранного Корреспондента
                        newContractor.correspondent(sourceCorrespondent);

                        newContractor.name(sourceCorrespondent.name());
                        newContractor.shortName(sourceCorrespondent.shortName());
                        newContractor.comment(sourceCorrespondent.comment());
                    }
                }
            } as ContractorObjectEditor.Options,
        }, {}, "Create").closed
            .then((result: ObjectEditor.Result) => {
                // Закрываем текущий редактор после заверешения работы с редактором КА
                // При этом далее пробрасываем результат закрытия
                that.navigationService.close(that.getCloseResult({success: result.success}));
            });
    }

    /**
     * Проверяет доступность выполнения команды создания контрагента.
     */
    protected canCreateAndClose(): boolean {
        return true;
    }

    /**
     * @inheritDoc
     */
    protected createMenuDefaults(): Menu.Options {
        return Menu.defaultsFor(ContractorCreationObjectEditor.DEFAULT_MENUS, this.name, this._getType());
    }
}


namespace ContractorCreationObjectEditor {

    /**
     * Интерфейс параметров компонента.
     */
    export interface Options extends ObjectEditor.Options {
    }
}

export = ContractorCreationObjectEditor;

core.createModule(function (app) {
    app.registerPart(ContractorCreationObjectEditor.PART_NAME, (options?: ContractorCreationObjectEditor.Options) => {
        return new ContractorCreationObjectEditor(options);
    });
});
