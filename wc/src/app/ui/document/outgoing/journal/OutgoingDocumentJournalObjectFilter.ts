import outgoingDocumentJournalPartsTemplate = require("xhtmpl!app/ui/document/outgoing/journal/templates/outgoingDocumentJournalParts.hbs");
import ObjectFilter = require("lib/ui/editor/ObjectFilter");
import * as core from "core";
import {Application} from "core";
import {OutgoingDocumentJournalFilter} from "app/domain/model-classes";

/**
 * Фильтр журнала исходящих документов.
 */
class OutgoingDocumentJournalObjectFilter extends ObjectFilter {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectFilter:" + OutgoingDocumentJournalFilter.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentJournalObjectFilter.Options = {
        type: OutgoingDocumentJournalFilter.meta.name,
        pages: [{
            template: outgoingDocumentJournalPartsTemplate,
            cssColumnPrefix: "col-sm-",
            properties: [{
                name: "regNumber",
            }, {
                name: "identifier",
            }, {
                name: "summary"
            }, {
                name: "status",
                presentation: "dropdown"
            }, {
                name: "performer"
            }, {
                name: "regDateFrom"
            }, {
                name: "regDateTo"
            }, {
                name: "createdFrom",
            }, {
                name: "createdTo"
            }, {
                name: "correspondent"
            }, {
                name: "nomenclatureCase",
            }]
        }]
    };

    /**
     * @constructs
     * @param {OutgoingDocumentJournalObjectFilter.Options} options Опции компонента.
     */
    constructor(options?: OutgoingDocumentJournalObjectFilter.Options) {
        super(OutgoingDocumentJournalObjectFilter.mixOptions(options, OutgoingDocumentJournalObjectFilter.DEFAULT_OPTIONS));
    }
}

namespace OutgoingDocumentJournalObjectFilter {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectFilter.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentJournalObjectFilter.PART_NAME, (options?: OutgoingDocumentJournalObjectFilter.Options) => {
        return new OutgoingDocumentJournalObjectFilter(options);
    });
});

export = OutgoingDocumentJournalObjectFilter;