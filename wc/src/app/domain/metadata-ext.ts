import metadata = require( "app/domain/metadata" );
import core = require( "core" );
import * as dictResources from "i18n!dms/modules/dictionary/common/nls/resources";
import extendDictionaryAllMetadata = require( "dms/modules/dictionary/extension/domain/metadata-dms-dictionary-all-extension" );
import extendTaskMetadata = require( "dms/modules/task/domain/metadata-dms-task-extension" );
import extendMainPageMetadata = require( "dms/modules/mainPage/domain/metadata-dms-mainpage-extension" );
import extendDocumentApprovalMetadata = require( "dms/modules/document/approval/domain/metadata-dms-document-approval-extension" );
import extendDocumentMetadata = require( "dms/modules/document/domain/metadata-dms-document-extension" );
import extendCommissionMetadata = require( "dms/modules/commission/domain/metadata-dms-commission-extension" );
import resources = require( "i18n!app/domain/nls/resources" );
import customResources = require( "i18n!app/nls/resources" );

extendDictionaryAllMetadata( metadata );
extendTaskMetadata( metadata );
extendMainPageMetadata( metadata );
extendDocumentApprovalMetadata( metadata );
extendDocumentMetadata( metadata );
extendCommissionMetadata( metadata );


metadata.entities.DeliveryType.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.DeliveryOption.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.CorrespondentAddress.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.CorrespondentContactDefault.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.CorrespondentContactKind.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.CorrespondentContactType.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.PersonCorrespondent.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.CompanyPersonCorrespondent.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.CompanyCorrespondent.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.AbstractCorrespondent.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.AbstractCorrespondentContact.formatters = {
    "default": function() {
        return this.name();
    }
};

metadata.entities.Currency.formatters = {
    "default": function () {
        return this.name();
    }
};

metadata.entities.ContractRevokeReason.formatters = {
    "default": function () {
        return this.name();
    }
};

metadata.entities.Contractor.formatters = {
    "default": function () {
        return this.name();
    }
};

/**
 * Отключение обязательности полей ACL у Контрагента Договора.
 */
metadata.entities.ContractDocumentContractor.props.aclId.nullable = true;

// TODO: убрать, когда поля, заполняемые на сервере при первом сохранении, перестанут валидироваться (CMF-371)
core.lang.forEach( metadata.entities, function( entityDescr, entityName ) {
    if ( entityDescr.props ) {
        core.lang.forEach( entityDescr.props, function( propDescr, propName ) {
            if ( ( propName != "name" ) && ( propName != "systemName" ) && propDescr.readOnly && !( propDescr.nullable ) ) {
                propDescr.nullable = true;
            }
        }, this );
    }
}, this );

export = metadata;
