import * as core from "core";
import {Application} from "core";
import {CorrespondentContactDefault} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");

/**
 * Редактор для сущности CorrespondentContactDefault.
 */
class CorrespondentContactDefaultEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:CorrespondentContactDefault";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CorrespondentContactDefaultEditor.Options = {
        type: CorrespondentContactDefault.meta.name,
    };

    /**
     * Опции компонента.
     */
    options: CorrespondentContactDefaultEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: CorrespondentContactDefault;

    /**
     * @constructor
     * @param {CorrespondentContactDefaultEditor.Options} options Опции компонента.
     */
    constructor(options?: CorrespondentContactDefaultEditor.Options) {
        const defaultOptions: CorrespondentContactDefaultEditor.Options = CorrespondentContactDefaultEditor.mixOptions(
            CorrespondentHelpers.contactEditorOptions,
            CorrespondentContactDefaultEditor.DEFAULT_OPTIONS
        );

        defaultOptions.pages = [{
            properties: [
                "name",
                {
                    name: CorrespondentContactDefault.meta.props.contactKind.name, 
                    contactTypeId: options.contactTypeId
                },
                "primary",
                "comment"
            ]
        }];

        super(CorrespondentContactDefaultEditor.mixOptions(options, defaultOptions));
    }
}

namespace CorrespondentContactDefaultEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {
        contactTypeId?: string;
    }
}

core.createModule((app: Application) => {
    app.registerPart(CorrespondentContactDefaultEditor.PART_NAME, (options?: CorrespondentContactDefaultEditor.Options) => {
        return new CorrespondentContactDefaultEditor(options);
    });
});

export = CorrespondentContactDefaultEditor;