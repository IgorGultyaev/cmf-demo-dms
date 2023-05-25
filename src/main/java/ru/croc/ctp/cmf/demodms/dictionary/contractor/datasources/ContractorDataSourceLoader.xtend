package ru.croc.ctp.cmf.demodms.dictionary.contractor.datasources

import ru.croc.ctp.cmf.demodms.dictionary.contractor.ContractorControllerApiPath
import ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.Contractor
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.jpa.datasource.PagingJpaDataSourceLoader

/**
 * Загрузчик источника данных контрагентов.
 */
@XFWDataSource(ContractorControllerApiPath.DATASOURCE_CONTRACTOR_DICTIONARY_PATH)
abstract class ContractorDataSourceLoader extends PagingJpaDataSourceLoader<Contractor, String> {

    /**
     * Подстрока, по которой производится фильтрация контрагента (по всем полям).
     */
    protected String searchString;

    /**
     * Флаг, указывающий необходимость выдачи удалённых сущностей.
     */
    protected Boolean allowDeleted;
}
