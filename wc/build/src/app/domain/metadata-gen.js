define(["require", "exports", "app/domain/metadata", "dms/modules/dictionary/extension/domain/metadata-dms-dictionary-all-extension", "dms/modules/task/domain/metadata-dms-task-extension", "dms/modules/mainPage/domain/metadata-dms-mainpage-extension", "dms/modules/document/approval/domain/metadata-dms-document-approval-extension", "dms/modules/document/domain/metadata-dms-document-extension", "dms/modules/commission/domain/metadata-dms-commission-extension"], function (require, exports, metadata, extendDictionaryAllMetadata, extendTaskMetadata, extendMainPageMetadata, extendDocumentApprovalMetadata, extendDocumentMetadata, extendCommissionMetadata) {
    "use strict";
    extendDictionaryAllMetadata(metadata);
    extendTaskMetadata(metadata);
    extendMainPageMetadata(metadata);
    extendDocumentApprovalMetadata(metadata);
    extendDocumentMetadata(metadata);
    extendCommissionMetadata(metadata);
    return metadata;
});
//# sourceMappingURL=metadata-gen.js.map