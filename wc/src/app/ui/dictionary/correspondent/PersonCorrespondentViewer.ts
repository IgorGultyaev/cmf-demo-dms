import * as core from "core";
import {Application} from "core";
import {PersonCorrespondent} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");

/**
 * Парт для просмотра сущностей PersonCorrespondent.
 */
class PersonCorrespondentViewer extends ObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:PersonCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: PersonCorrespondentViewer.Options = {
        type: PersonCorrespondent.meta.name,
        pages: [
            {
                properties: [
                    "secondName",
                    "firstName",
                    "patronymic",
                    {
                        name: "name",
                    },
                    "comment",
                    CorrespondentHelpers.contactsViewerPeOptions
                ]
            }
        ]

    };

    /**
     * Опции компонента.
     */
    options: PersonCorrespondentViewer.Options;

    /**
     * Тип модели.
     */
    viewModel: PersonCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: ObjectViewer.Options) {
        super(PersonCorrespondentViewer.mixOptions(options, PersonCorrespondentViewer.DEFAULT_OPTIONS));
    }
}

namespace PersonCorrespondentViewer {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectViewer.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(PersonCorrespondentViewer.PART_NAME, (options?: PersonCorrespondentViewer.Options) => {
        return new PersonCorrespondentViewer(options);
    });
});

export = PersonCorrespondentViewer;