import core = require( "core" );
import * as model from "app/domain/model-classes";
import "dms/modules/dictionary/extension/domain/model-dms-dictionary-all-extension";
import "dms/modules/task/domain/model-dms-task-extension";
import "dms/modules/document/domain/model-dms-document-extension";
import "dms/modules/commission/domain/model-dms-commission-extension";

model.PersonCorrespondent.prototype.name = function() {
    var result = "";
    if ( typeof this.secondName() == 'string' && this.secondName().trim() ) {
        result = this.secondName();
    }
    if ( typeof this.firstName() == 'string' && this.firstName().trim() ) {
        result += " " + this.firstName();
    }
    if ( typeof this.patronymic() == 'string' && this.patronymic().trim() ) {
        result += " " + this.patronymic();
    }
    return result;
};

model.CompanyPersonCorrespondent.prototype.name = function() {
    var result = "";
    if ( typeof this.secondName() == 'string' && this.secondName().trim() ) {
        result = this.secondName();
    }
    if ( typeof this.firstName() == 'string' && this.firstName().trim() ) {
        result += " " + this.firstName();
    }
    if ( typeof this.patronymic() == 'string' && this.patronymic().trim() ) {
        result += " " + this.patronymic();
    }
    return result;
};

export = model;
