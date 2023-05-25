package ru.croc.ctp.cmf.demodms.dictionary.currency;

import ru.croc.ctp.cmf.demodms.dictionary.DictionaryControllerApiPath;

/**
 * Пути к внешнему API работы со справочником валют.
 *
 * @see DictionaryControllerApiPath
 * @author Andrei Dubonos
 * @since 2019.04.02
 */
public class CurrencyControllerApiPath {

    /**
     * Путь контроллера справочника.
     */
    private static final String CURRENCY_CONTROLLER = "/currency";

    /**
     * Полный путь до контроллера справочника валют.
     */
    public static final String BASE_CURRENCY_DICTIONARY_PATH =
            DictionaryControllerApiPath.PATH_DICTIONARY + CURRENCY_CONTROLLER;

    /**
     * Относительный путь до контроллера справочника валют.
     */
    public static final String DATASOURCE_CURRENCY_DICTIONARY_PATH =
            DictionaryControllerApiPath.DATASOURCE_BASE_DICTIONARY + CURRENCY_CONTROLLER;

}
