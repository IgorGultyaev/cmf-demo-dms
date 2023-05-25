package ru.croc.ctp.cmf.demodms.dictionary.correspondent.datasources

import ru.croc.ctp.cmf.demodms.dictionary.correspondent.AbstractCorrespondentControllerApiPath
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.AbstractCorrespondent
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.jpa.datasource.PagingJpaDataSourceLoader

/**
 * Загрузчик данных справочника корреспондентов.
 */
@XFWDataSource(AbstractCorrespondentControllerApiPath.DATASOURCE_CORRESPONDENT_DICTIONARY_PATH)
abstract class CorrespondentDataSourceLoader extends PagingJpaDataSourceLoader<AbstractCorrespondent, String> {

    /**
     * Наименование корреспондента для фильтрации по имени.
     */
    protected String name;
    
    /**
     * Флаг, указывающий необходимость выдачи удалённых сущностей.
     */
    protected Boolean deleted;
}
