package ru.croc.ctp.cmf.demodms.document.domain;

/**
 * Причины добавления исходящего документа в журнал.
 * 
 * @author Dmitry Malenok
 */
public enum OutgoingDocumentJournalCause {

    /**
     * Автор документа.
     */
    ODJC_AUTHOR,

    /**
     * Получал задачу по документу.
     */
    ODJC_RECEIVED_TASK
}
