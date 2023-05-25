package ru.croc.ctp.cmf.demodms.document.contract.journal.datasources

import com.querydsl.core.Tuple
import java.util.Map
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext
import java.util.List
import ru.croc.ctp.cmf.demodms.document.contract.ContractDocumentControllerApiPath
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalFilter
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument
import org.springframework.beans.factory.annotation.Autowired
import ru.croc.ctp.cmf.dms.journal.CommonGroupingByJournalHandler
import com.querydsl.jpa.JPQLQuery

/**
 * Загрузчик данных для журнала с группировкой для документов Договор.
 */
@XFWDataSourceComponent
@XFWDataSource(ContractDocumentControllerApiPath.DATASOURCE_CONTRACT_JOURNAL_GROUPING_BY)
class ContractDocumentJournalGroupedDataSourceLoader extends AbstractContractDocumentJournalDataSourceLoader<Map<String, Object>, Tuple> {

    /**
     * Фильтр.
     */
    protected ContractDocumentJournalFilter filter;

    /**
     * Общий обработчик журналов с группировкой.
     */
    @Autowired
    protected CommonGroupingByJournalHandler groupingByJournalHandler;

    override protected JPQLQuery<Tuple> createQuery(GeneralLoadContext<Map<String, Object>, Object> loadContext) {
        return groupingByJournalHandler.createCommonQuery(ContractDocument, loadContext).where(
            createPredicate(loadContext));

    }

    override protected void transform(List<Tuple> queryResult,
        GeneralLoadContext<Map<String, Object>, Object> loadContext) {
        groupingByJournalHandler.transform(queryResult, loadContext);
    }
}
