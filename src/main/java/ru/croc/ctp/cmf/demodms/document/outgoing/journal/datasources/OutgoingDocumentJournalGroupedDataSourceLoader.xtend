package ru.croc.ctp.cmf.demodms.document.outgoing.journal.datasources

import com.querydsl.core.Tuple
import com.querydsl.jpa.JPQLQuery
import java.util.List
import java.util.Map
import org.springframework.beans.factory.annotation.Autowired
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalFilter
import ru.croc.ctp.cmf.demodms.document.outgoing.OutgoingDocumentControllerApiPath
import ru.croc.ctp.cmf.dms.journal.CommonGroupingByJournalHandler
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext

@XFWDataSourceComponent
@XFWDataSource(OutgoingDocumentControllerApiPath.DATASOURCE_OUTGOING_JOURNAL_GROUPING_BY)
class OutgoingDocumentJournalGroupedDataSourceLoader extends AbstractOutgoingDocumentJournalDataSourceLoader<Map<String, Object>, Tuple> {

    /**
     * Фильтр.
     */
    protected OutgoingDocumentJournalFilter filter;

    /**
     * Общий обработчик журналов с группировкой.
     */
    @Autowired
    protected CommonGroupingByJournalHandler groupingByJournalHandler;

    override protected JPQLQuery<Tuple> createQuery(GeneralLoadContext<Map<String, Object>, Object> loadContext) {
        return groupingByJournalHandler.createCommonQuery(OutgoingDocument, loadContext).where(
            createPredicate(loadContext));

    }

    override protected void transform(List<Tuple> queryResult,
        GeneralLoadContext<Map<String, Object>, Object> loadContext) {
        groupingByJournalHandler.transform(queryResult, loadContext);
    }
}