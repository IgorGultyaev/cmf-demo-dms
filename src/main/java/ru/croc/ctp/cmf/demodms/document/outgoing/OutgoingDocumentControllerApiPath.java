package ru.croc.ctp.cmf.demodms.document.outgoing;

import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL;
import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL_GROUPING_BY;

import ru.croc.ctp.cmf.demodms.document.DocumentControllerApiPath;

/**
 * Пути к внешнему API работы с исходящими документами.
 * 
 * @author Dmitry Malenok
 */
public final class OutgoingDocumentControllerApiPath {

    /**
     * Относительный путь API исходящего документа.
     */
    public static final String RELATIVE_OUTGOING = "/outgoing";

    /**
     * Путь ко всем API исходящего документа.
     */
    public static final String PATH_OUTGOING = DocumentControllerApiPath.PATH_DOCUMENT + RELATIVE_OUTGOING;

    /**
     * Базовый относительный путь к API источников данных исходящих документов.
     */
    public static final String DATASOURCE_BASE_OUTGOING =
            DocumentControllerApiPath.DATASOURCE_BASE_DOCUMENT + RELATIVE_OUTGOING;

    /**
     * URL источника данных журнала исходящих документов.
     */
    public static final String DATASOURCE_OUTGOING_JOURNAL = DATASOURCE_BASE_OUTGOING + RELATIVE_PATH_JOURNAL;

    /**
     * URL API журнала исходящих документов.
     */
    public static final String API_OUTGOING_JOURNAL = PATH_OUTGOING + RELATIVE_PATH_JOURNAL;

    /**
     * URL источника данных журнала исходящих документов с группировкой по полю.
     */
    public static final String DATASOURCE_OUTGOING_JOURNAL_GROUPING_BY =
            DATASOURCE_BASE_OUTGOING + RELATIVE_PATH_JOURNAL_GROUPING_BY;

    /**
     * URL API журнала исходящих документов с группировкой по полю.
     */
    public static final String API_OUTGOING_JOURNAL_GROUPING_BY = PATH_OUTGOING + RELATIVE_PATH_JOURNAL_GROUPING_BY;
}
