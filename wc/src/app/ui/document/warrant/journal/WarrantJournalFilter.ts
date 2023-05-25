import core = require( "core" );

core.createModule(function (app) {
    app.registerPart("ObjectFilter:WarrantJournalFilter", function(options) {
        return core.ui.ObjectFilter.create(core.lang.extend({
            type : "WarrantJournalFilter",
            pages : [ {
                cssColumnPrefix: "col-sm-",
                properties : [ {
                    name : "regNumber",
                }, {
                    name : "identifier",
                }, {
                    name : "startDate"
                }, {
                    name : "status",
                    presentation : "dropdown"
                }, {
                    name : "organization"
                }]
            } ]
        }, options));
    });


})