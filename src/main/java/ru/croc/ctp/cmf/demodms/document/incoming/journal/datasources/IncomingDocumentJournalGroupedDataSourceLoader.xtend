package ru.croc.ctp.cmf.demodms.document.incoming.journal.datasources

import com.querydsl.core.Tuple
import java.util.Map
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext
import java.util.List
import ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentControllerApiPath
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalFilter
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument
import org.springframework.beans.factory.annotation.Autowired
import ru.croc.ctp.cmf.dms.journal.CommonGroupingByJournalHandler
import com.querydsl.jpa.JPQLQuery

@XFWDataSourceComponent
@XFWDataSource(IncomingDocumentControllerApiPath.DATASOURCE_INCOMING_JOURNAL_GROUPING_BY)
class IncomingDocumentJournalGroupedDataSourceLoader extends AbstractIncomingDocumentJournalDataSourceLoader<Map<String, Object>, Tuple> {

    /**
     * Фильтр.
     */
    protected IncomingDocumentJournalFilter filter;

    /**
     * Общий обработчик журналов с группировкой.
     */
    @Autowired
    protected CommonGroupingByJournalHandler groupingByJournalHandler;

    override protected JPQLQuery<Tuple> createQuery(GeneralLoadContext<Map<String, Object>, Object> loadContext) {
        return groupingByJournalHandler.createCommonQuery(IncomingDocument, loadContext).where(
            createPredicate(loadContext));

    }

    override protected void transform(List<Tuple> queryResult,
        GeneralLoadContext<Map<String, Object>, Object> loadContext) {
        groupingByJournalHandler.transform(queryResult, loadContext);
    }
}
