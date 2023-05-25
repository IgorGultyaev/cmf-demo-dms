package ru.croc.ctp.cmf.demodms.dictionary.contractor;

import ru.croc.ctp.cmf.demodms.dictionary.DictionaryControllerApiPath;

/**
 * Пути к внешнему API работы со справочником контрагментов.
 *
 * @see DictionaryControllerApiPath
 * @author Andrei Dubonos
 * @since 2019.04.22
 */
public class ContractorControllerApiPath {

    /**
     * Путь контроллера справочника.
     */
    private static final String CONTRACTOR_CONTROLLER = "/contractor";

    /**
     * Полный путь до контроллера справочника контрагентов.
     */
    public static final String BASE_CONTRACTOR_DICTIONARY_PATH =
            DictionaryControllerApiPath.PATH_DICTIONARY + CONTRACTOR_CONTROLLER;

    /**
     * Относительный путь до контроллера справочника контрагентов.
     */
    public static final String DATASOURCE_CONTRACTOR_DICTIONARY_PATH =
            DictionaryControllerApiPath.DATASOURCE_BASE_DICTIONARY + CONTRACTOR_CONTROLLER;

}
