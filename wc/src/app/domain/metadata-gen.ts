/**
 */
import metadata = require( "app/domain/metadata" );
import extendDictionaryAllMetadata = require( "dms/modules/dictionary/extension/domain/metadata-dms-dictionary-all-extension" );
extendDictionaryAllMetadata( metadata );
export = metadata;