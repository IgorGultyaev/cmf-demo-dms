package ru.croc.ctp.cmf.sedproject.document.warrant.journal.datasources

import ru.croc.ctp.cmf.core.jpa.datasource.AbstractPagableJpaDataSourceLoader
import ru.croc.ctp.cmf.sedproject.document.warrant.WarrantDocumentControllerApiPath
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalFilter
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource

/**
 * Загрузчик данных для журнала доверенностей.
 */
@XFWDataSource(WarrantDocumentControllerApiPath.DATASOURCE_WARRANT_JOURNAL)
abstract class WarrantJournalDataSourceLoader extends AbstractPagableJpaDataSourceLoader<WarrantDocument> {
    
    /**
     * Фильтр.
     */
    protected WarrantJournalFilter filter;    
}