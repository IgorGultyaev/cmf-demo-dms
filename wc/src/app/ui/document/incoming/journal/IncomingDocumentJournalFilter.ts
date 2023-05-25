/**
 * Фильтр журнала входящих документов
 */
import core = require( "core" );
import incomingDocumentJournalFilterTemplate = require("xhtmpl!app/ui/document/incoming/journal/templates/incomingDocumentJournalFilterTemplate.hbs");


core.createModule(function (app) {
    app.registerPart("ObjectFilter:IncomingDocumentJournalFilter", function (options) {
        return core.ui.ObjectFilter.create(core.lang.extend({
            type: "IncomingDocumentJournalFilter",
            pages: [{
                template: incomingDocumentJournalFilterTemplate,
                cssColumnPrefix: "col-sm-",
                properties: [{
                    name: "regNumber",
                }, {
                    name: "identifier",
                }, {
                    name: "regDateFrom"
                }, {
                    name: "regDateTo"
                }, {
                    name: "summary"
                }, {
                    name: "status",
                    presentation: "dropdown"
                }, {
                    name: "organization"
                }, {
                    name: "correspondentExternal"
                }, {
                    name: "envelopeNumber"
                }, {
                    name: "referenceNumber"
                }, {
                    name: "nomenclatureCase",
                }]
            }]
        }, options));
    });
});