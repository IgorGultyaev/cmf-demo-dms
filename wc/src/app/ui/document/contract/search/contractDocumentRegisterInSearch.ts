import * as core from "core";
import {searchDocumentTypesRegistry} from "dms/modules/search/SearchDocumentTypesRegistry";
import {ContractDocument} from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";

core.createModule("registerContractDocumentInSearchComponents", app => {
    searchDocumentTypesRegistry.register(ContractDocument, "id_documentType_contractDocument",
        resources["part.search.filter.contract"]);
});
