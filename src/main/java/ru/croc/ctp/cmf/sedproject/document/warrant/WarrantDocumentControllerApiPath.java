package ru.croc.ctp.cmf.sedproject.document.warrant;

import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL;

import ru.croc.ctp.cmf.demodms.document.DocumentControllerApiPath;

/**
 * Пути к внешнему API работы с доверенностями.
 * 
 * @author Dmitry Malenok
 */
public final class WarrantDocumentControllerApiPath {

    /**
     * Относительный путь API доверенности.
     */
    public static final String RELATIVE_WARRANT = "/warrant";

    /**
     * Путь ко всем API доверенностей.
     */
    public static final String PATH_WARRANT = DocumentControllerApiPath.PATH_DOCUMENT + RELATIVE_WARRANT;

    /**
     * Базовый относительный путь к API источников данных доверенностей.
     */
    public static final String DATASOURCE_BASE_WARRANT =
            DocumentControllerApiPath.DATASOURCE_BASE_DOCUMENT + RELATIVE_WARRANT;

    /**
     * URL API журнала доверенностей.
     */
    public static final String DATASOURCE_WARRANT_JOURNAL = DATASOURCE_BASE_WARRANT + RELATIVE_PATH_JOURNAL;

    /**
     * URL API журнала доверенностей.
     */
    public static final String API_INCOMING_JOURNAL = PATH_WARRANT + RELATIVE_PATH_JOURNAL;
}
