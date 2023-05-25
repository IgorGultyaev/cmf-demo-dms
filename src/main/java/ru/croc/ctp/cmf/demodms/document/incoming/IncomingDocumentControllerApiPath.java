package ru.croc.ctp.cmf.demodms.document.incoming;

import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL;
import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL_GROUPING_BY;

import ru.croc.ctp.cmf.demodms.document.DocumentControllerApiPath;

/**
 * Пути к внешнему API работы с входящими документами.
 */
public final class IncomingDocumentControllerApiPath {

    /**
     * Относительный путь API входящего документа.
     */
    public static final String RELATIVE_INCOMING = "/incoming";

    /**
     * Путь ко всем API входящего документа.
     */
    public static final String PATH_INCOMING = DocumentControllerApiPath.PATH_DOCUMENT + RELATIVE_INCOMING;

    /**
     * Базовый относительный путь к API источников данных входящих документов.
     */
    public static final String DATASOURCE_BASE_INCOMING =
            DocumentControllerApiPath.DATASOURCE_BASE_DOCUMENT + RELATIVE_INCOMING;

    /**
     * URL источника данных журнала входящих документов.
     */
    public static final String DATASOURCE_INCOMING_JOURNAL = DATASOURCE_BASE_INCOMING + RELATIVE_PATH_JOURNAL;

    /**
     * URL API журнала входящих документов.
     */
    public static final String API_INCOMING_JOURNAL = PATH_INCOMING + RELATIVE_PATH_JOURNAL;

    /**
     * URL источника данных журнала входящих документов с группировкой по полю.
     */
    public static final String DATASOURCE_INCOMING_JOURNAL_GROUPING_BY =
            DATASOURCE_BASE_INCOMING + RELATIVE_PATH_JOURNAL_GROUPING_BY;

    /**
     * URL API журнала входящих документов с группировкой по полю.
     */
    public static final String API_INCOMING_JOURNAL_GROUPING_BY = PATH_INCOMING + RELATIVE_PATH_JOURNAL_GROUPING_BY;

    /**
     * Относительный путь API аннулирования документа.
     */
    public static final String RELATIVE_INCOMING_REVOKE = "/revoke";

    /**
     * Путь API аннулирования документа.
     */
    public static final String API_INCOMING_REVOKE = PATH_INCOMING + RELATIVE_INCOMING_REVOKE;

}
