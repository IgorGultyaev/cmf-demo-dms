import * as core from "core";
import {Application} from "core";
import {CompanyCorrespondent} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import ObjectViewer = require("lib/ui/editor/ObjectViewer");
import peObjectList = require("lib/ui/pe/peObjectList");

/**
 * Парт для просмотра сущностей CompanyCorrespondent.
 */
class CompanyCorrespondentViewer extends ObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:CompanyCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CompanyCorrespondentViewer.Options = {
        type: "CompanyCorrespondent",
        pages: [{
            properties: [
                "shortName",
                "name",
                "deleted",
                "comment",
                CorrespondentHelpers.contactsViewerPeOptions,
                {
                    name: "persons",
                    columns: [
                        {
                            name: "name",
                            formatterHtml: function (colId, col) {
                                const text = core.lang.encodeHtml(col.getter.call(this, col));
                                return "<a href='#' class='x-cmd-link'"
                                    + " data-cmd-name='ShowText' >" + text + "</a>";
                            }
                        },
                        "department",
                        "position",
                        "primary"
                    ],
                    PropertyEditor: peObjectList,
                    menuRow: {items: []},
                    menuSelection: {items: []},
                    commands: {
                        ShowText: core.createCommand({
                            execute: function (args) {
                                const obj = args.object;
                                if (!obj) {
                                    throw new Error("args.object must be specified");
                                }
                                return args.list.executePartCommand({
                                    part: "ObjectViewer:" + obj.meta.name,
                                    partOptions: {
                                        viewModel: obj,
                                        editorContext: args.list._createNestedEditorContext()
                                    }
                                }, args, "View").closed;
                            }
                        })
                    }
                }
            ]
        }]
    };

    /**
     * Опции компонента.
     */
    options: CompanyCorrespondentViewer.Options;

    /**
     * Тип модели.
     */
    viewModel: CompanyCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: CompanyCorrespondentViewer.Options) {
        super(CompanyCorrespondentViewer.mixOptions(options, CompanyCorrespondentViewer.DEFAULT_OPTIONS));
    }
}

namespace CompanyCorrespondentViewer {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectViewer.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(CompanyCorrespondentViewer.PART_NAME, (options?: CompanyCorrespondentViewer.Options) => {
        return new CompanyCorrespondentViewer(options);
    });
});

export = CompanyCorrespondentViewer;