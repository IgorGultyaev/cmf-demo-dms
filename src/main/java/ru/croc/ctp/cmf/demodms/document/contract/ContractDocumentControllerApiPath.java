package ru.croc.ctp.cmf.demodms.document.contract;

import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL;
import static ru.croc.ctp.cmf.dms.journal.JournalControllerApiPath.RELATIVE_PATH_JOURNAL_GROUPING_BY;

import ru.croc.ctp.cmf.demodms.document.DocumentControllerApiPath;

/**
 * Пути к внешнему API работы с документами Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
public class ContractDocumentControllerApiPath {

    /**
     * Относительный путь API документа Договор.
     */
    public static final String RELATIVE_CONTRACT = "/contract";

    /**
     * Путь ко всем API документа Договор.
     */
    public static final String PATH_CONTRACT = DocumentControllerApiPath.PATH_DOCUMENT + RELATIVE_CONTRACT;

    /**
     * Базовый относительный путь к API источников данных документов Договор.
     */
    public static final String DATASOURCE_BASE_CONTRACT =
            DocumentControllerApiPath.DATASOURCE_BASE_DOCUMENT + RELATIVE_CONTRACT;

    /**
     * URL источника данных журнала документов Договор.
     */
    public static final String DATASOURCE_CONTRACT_JOURNAL = DATASOURCE_BASE_CONTRACT + RELATIVE_PATH_JOURNAL;

    /**
     * URL API журнала документов Договор.
     */
    public static final String API_CONTRACT_JOURNAL = PATH_CONTRACT + RELATIVE_PATH_JOURNAL;

    /**
     * URL источника данных журнала документов Договор с группировкой по полю.
     */
    public static final String DATASOURCE_CONTRACT_JOURNAL_GROUPING_BY =
            DATASOURCE_BASE_CONTRACT + RELATIVE_PATH_JOURNAL_GROUPING_BY;

    /**
     * URL API журнала документов Договор с группировкой по полю.
     */
    public static final String API_CONTRACT_JOURNAL_GROUPING_BY = PATH_CONTRACT + RELATIVE_PATH_JOURNAL_GROUPING_BY;

    /**
     * Относительный путь API аннулирования документа.
     */
    public static final String RELATIVE_CONTRACT_REVOKE = "/revoke";

    /**
     * Путь API аннулирования документа.
     */
    public static final String API_CONTRACT_REVOKE = PATH_CONTRACT + RELATIVE_CONTRACT_REVOKE;
}
