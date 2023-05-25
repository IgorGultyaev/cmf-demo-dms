package ru.croc.ctp.cmf.demodms.dictionary.currency.datasources

import ru.croc.ctp.cmf.demodms.dictionary.currency.CurrencyControllerApiPath
import ru.croc.ctp.cmf.demodms.dictionary.currency.domain.Currency
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.jpa.datasource.PagingJpaDataSourceLoader

/**
 * Загрузчик источника данных валют.
 */
@XFWDataSource(CurrencyControllerApiPath.DATASOURCE_CURRENCY_DICTIONARY_PATH)
abstract class CurrencyDataSourceLoader extends PagingJpaDataSourceLoader<Currency, String> {

    /**
     * Подстрока, по которой производится фильтрация валюты (по Коду, Наименованию, Обозначению).
     */
    protected String searchString;

    /**
     * Флаг, указывающий необходимость выдачи удалённых сущностей.
     */
    protected Boolean allowDeleted;
}
