import * as core from "core";
import { searchDocumentTypesRegistry } from "dms/modules/search/SearchDocumentTypesRegistry";
import { IncomingDocument } from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";

core.createModule( "registerIncomingDocumentInSearchComponents", app => {
    searchDocumentTypesRegistry.register( IncomingDocument, "id_documentType_incomingDocument",
        resources["part.search.filter.incoming"] );
} );

