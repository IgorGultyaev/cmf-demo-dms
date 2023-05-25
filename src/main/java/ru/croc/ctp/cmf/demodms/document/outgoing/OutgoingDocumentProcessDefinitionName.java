package ru.croc.ctp.cmf.demodms.document.outgoing;

/**
 * Наименование шаблонов процессов исходящего документа.
 * 
 * @author Dmitry Malenok
 */
public final class OutgoingDocumentProcessDefinitionName {

    /**
     * Наименования шаблона основного процесса исходящего документа.
     */
    public static final String PROCESS_OUTGOING_DOCUMENT_MAIN = "OutgoingDocumentMainProcess";

    /**
     * Наименования шаблона подпроцесса создания исходящего документа.
     */
    public static final String SUBPROCESS_OUTGOING_DOCUMENT_INIT = "OutgoingDocumentInitSubProcess";

    /**
     * Наименования шаблона подпроцесса создания проекта документа.
     */
    public static final String SUBPROCESS_OUTGOING_DOCUMENT_CREATION = "OutgoingDocumentCreationSubProcess";

    /**
     * Наименования шаблона подпроцесса отправки исходящего документа.
     */
    public static final String SUBPROCESS_OUTGOING_DOCUMENT_DISPATCH = "OutgoingDocumentDispatchSubProcess";

    /**
     * Наименования шаблона подпроцесса аннулирования исходящего документа.
     */
    public static final String SUBPROCESS_OUTGOING_DOCUMENT_REVOKE = "OutgoingDocumentRevokeSubProcess";
}
