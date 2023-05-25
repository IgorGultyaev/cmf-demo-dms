package ru.croc.ctp.cmf.demodms.document.incoming.journal.datasources

import java.util.List
import ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentControllerApiPath
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalFilter
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext

/**
 * Загрузчик данных для журнала входящих документов.
 */
@XFWDataSourceComponent
@XFWDataSource(IncomingDocumentControllerApiPath.DATASOURCE_INCOMING_JOURNAL)
class IncomingDocumentJournalDataSourceLoader extends AbstractIncomingDocumentJournalDataSourceLoader<IncomingDocument, IncomingDocument> {
    
    /**
     * Фильтр.
     */
    protected IncomingDocumentJournalFilter filter;
    
    override protected createQuery(GeneralLoadContext<IncomingDocument, Object> loadContext) {
        return createCommissionQuery(loadContext);
    }
    
    override protected transform(List<IncomingDocument> queryResult, GeneralLoadContext<IncomingDocument, Object> loadContext) {
        obtainResult(loadContext).getData().addAll(queryResult);
    }    
}
