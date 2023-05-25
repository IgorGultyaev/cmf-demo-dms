package ru.croc.ctp.cmf.demodms.document.outgoing.journal.datasources

import java.util.List
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalFilter
import ru.croc.ctp.cmf.demodms.document.outgoing.OutgoingDocumentControllerApiPath
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext

/**
 * Загрузчик данных для журнала исходящих документов.
 */
@XFWDataSourceComponent
@XFWDataSource(OutgoingDocumentControllerApiPath.DATASOURCE_OUTGOING_JOURNAL)
class OutgoingDocumentJournalDataSourceLoader extends AbstractOutgoingDocumentJournalDataSourceLoader<OutgoingDocument, OutgoingDocument> {

    /**
     * Фильтр.
     */
    protected OutgoingDocumentJournalFilter filter;

    override protected createQuery(GeneralLoadContext<OutgoingDocument, Object> loadContext) {
        return createCommissionQuery(loadContext);
    }

    override protected transform(List<OutgoingDocument> queryResult,
        GeneralLoadContext<OutgoingDocument, Object> loadContext) {
        obtainResult(loadContext).getData().addAll(queryResult);
    }
}
