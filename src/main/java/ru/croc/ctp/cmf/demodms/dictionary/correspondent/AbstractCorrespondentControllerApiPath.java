package ru.croc.ctp.cmf.demodms.dictionary.correspondent;

import ru.croc.ctp.cmf.demodms.dictionary.DictionaryControllerApiPath;

/**
 * Пути к внешнему API работы с исходящими документами.
 *
 * @author Mikhail Kondratev
 */
public class AbstractCorrespondentControllerApiPath {

    /**
     * Пусть контроллера справочника.
     */
    private static final String CORRESPONDENT_CONTROLLER = "/correspondent";

    /**
     * Полный пусть до контроллера справочника корреспондентов.
     */
    public static final String BASE_CORRESPONDENT_DICTIONARY_PATH =
            DictionaryControllerApiPath.PATH_DICTIONARY + CORRESPONDENT_CONTROLLER;

    /**
     * Относительный путь до контроллера справочника корреспондентов.
     */
    public static final String DATASOURCE_CORRESPONDENT_DICTIONARY_PATH =
            DictionaryControllerApiPath.DATASOURCE_BASE_DICTIONARY + CORRESPONDENT_CONTROLLER;
}
