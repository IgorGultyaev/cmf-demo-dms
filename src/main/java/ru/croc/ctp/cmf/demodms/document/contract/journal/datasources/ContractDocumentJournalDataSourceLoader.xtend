package ru.croc.ctp.cmf.demodms.document.contract.journal.datasources

import java.util.List
import ru.croc.ctp.cmf.demodms.document.contract.ContractDocumentControllerApiPath
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalFilter
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext

/**
 * Загрузчик данных для журнала документов Договор.
 */
@XFWDataSourceComponent
@XFWDataSource(ContractDocumentControllerApiPath.DATASOURCE_CONTRACT_JOURNAL)
class ContractDocumentJournalDataSourceLoader extends AbstractContractDocumentJournalDataSourceLoader<ContractDocument, ContractDocument> {

    /**
     * Фильтр.
     */
    protected ContractDocumentJournalFilter filter;

    override protected createQuery(GeneralLoadContext<ContractDocument, Object> loadContext) {
        return createContractQuery(loadContext);
    }

    override protected transform(List<ContractDocument> queryResult, GeneralLoadContext<ContractDocument, Object> loadContext) {
        obtainResult(loadContext).getData().addAll(queryResult);
    }
}
