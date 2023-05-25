import * as core from "core";
import { searchDocumentTypesRegistry } from "dms/modules/search/SearchDocumentTypesRegistry";
import { OutgoingDocument } from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";

core.createModule( "registerOutgoingDocumentInSearchComponents", app => {
    searchDocumentTypesRegistry.register( OutgoingDocument, "id_documentType_outgoingDocument",
        resources["part.search.filter.outgoing"] );
} );

