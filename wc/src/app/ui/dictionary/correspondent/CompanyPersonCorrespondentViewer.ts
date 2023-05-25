import * as core from "core";
import {Application} from "core";
import {CompanyPersonCorrespondent} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");

/**
 * Парт для просмотра сущностей CompanyPersonCorrespondent.
 */
class CompanyPersonCorrespondentViewer extends ObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:CompanyPersonCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CompanyPersonCorrespondentViewer.Options = {
        type: "CompanyPersonCorrespondent",
        pages: [{
            properties: [
                "secondName",
                "firstName",
                "patronymic",
                "name",
                "position",
                "department",
                "primary",
                "deleted",
                "parent",
                "comment",
                CorrespondentHelpers.contactsViewerPeOptions]
        }]
    };

    /**
     * Опции компонента.
     */
    options: CompanyPersonCorrespondentViewer.Options;

    /**
     * Тип модели.
     */
    viewModel: CompanyPersonCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: CompanyPersonCorrespondentViewer.Options) {
        super(CompanyPersonCorrespondentViewer.mixOptions(options, CompanyPersonCorrespondentViewer.DEFAULT_OPTIONS));
    }
}

namespace CompanyPersonCorrespondentViewer {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectViewer.Options {

    }
}

export = CompanyPersonCorrespondentViewer;

core.createModule((app: Application) => {
    app.registerPart(CompanyPersonCorrespondentViewer.PART_NAME, (options?: CompanyPersonCorrespondentViewer.Options) => {
        return new CompanyPersonCorrespondentViewer(options);
    });
});