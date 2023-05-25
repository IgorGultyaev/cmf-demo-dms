/** * Внимание!  * Используется только для генерации model-classes.d.ts, т.к. генератор не поддерживает ссылки от app. * Никуда не подключать!!! 
 */
import metadata = require( "app/domain/metadata" );
import extendDictionaryAllMetadata = require( "dms/modules/dictionary/extension/domain/metadata-dms-dictionary-all-extension" );import extendTaskMetadata = require( "dms/modules/task/domain/metadata-dms-task-extension" );import extendMainPageMetadata = require( "dms/modules/mainPage/domain/metadata-dms-mainpage-extension" );import extendDocumentApprovalMetadata = require( "dms/modules/document/approval/domain/metadata-dms-document-approval-extension" );import extendDocumentMetadata = require( "dms/modules/document/domain/metadata-dms-document-extension" );import extendCommissionMetadata = require( "dms/modules/commission/domain/metadata-dms-commission-extension" );
extendDictionaryAllMetadata( metadata );extendTaskMetadata( metadata );extendMainPageMetadata( metadata );extendDocumentApprovalMetadata( metadata );extendDocumentMetadata( metadata );extendCommissionMetadata( metadata );
export = metadata;
