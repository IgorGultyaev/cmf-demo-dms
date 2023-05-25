package ru.croc.ctp.cmf.demodms.document.incoming;

/**
 * Наименование шаблонов процессов входящего документа.
 * 
 * @author Dmitry Malenok
 */
public final class IncomingDocumentProcessDefinitionName {

    /**
     * Наименования шаблона основного процесса входящего документа.
     */
    public static final String PROCESS_INCOMING_DOCUMENT_MAIN = "IncomingDocumentMainProcess";

    /**
     * Наименования шаблона подпроцесса создания входящего документа.
     */
    public static final String SUBPROCESS_INCOMING_DOCUMENT_CREATION = "IncomingDocumentCreationSubProcess";

    /**
     * Наименования шаблона подпроцесса регистрации входящего документа.
     */
    public static final String SUBPROCESS_INCOMING_DOCUMENT_REGISTRATION = "IncomingDocumentRegistrationSubProcess";

    /**
     * Наименования шаблона подпроцесса сканирования входящего документа.
     */
    public static final String SUBPROCESS_INCOMING_DOCUMENT_SCANNING = "IncomingDocumentScanningSubProcess";

    /**
     * Наименования шаблона подпроцесса исполнения входящего документа.
     */
    public static final String SUBPROCESS_INCOMING_DOCUMENT_EXECUTION = "incomingDocumentExecutionSubProcess";

    /**
     * Наименования шаблона подпроцесса завершения входящего документа.
     */
    public static final String SUBPROCESS_INCOMING_DOCUMENT_COMPLETION = "incomingDocumentCompletionSubProcess";

    /**
     * Наименования шаблона подпроцесса аннулирования входящего документа.
     */
    public static final String SUBPROCESS_INCOMING_DOCUMENT_CANCELLATION = "incomingDocumentCancellationProcess";
}
