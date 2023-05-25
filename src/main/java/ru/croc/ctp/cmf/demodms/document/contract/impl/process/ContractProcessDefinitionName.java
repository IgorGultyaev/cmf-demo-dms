package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

/**
 * Наименование шаблонов процессов документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.25
 */
public class ContractProcessDefinitionName {

    /**
     * Наименования шаблона основного процесса документа.
     */
    public static final String PROCESS_CONTRACT_DOCUMENT_MAIN = "ContractDocumentMainProcess";

    /**
     * Наименования шаблона подпроцесса создания документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_INIT = "ContractDocumentInitSubProcess";

    /**
     * Наименования шаблона подпроцесса создания проекта документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_CREATION = "ContractDocumentCreationSubProcess";

    /**
     * Наименования шаблона подпроцесса регистрации документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_REGISTRATION = "ContractDocumentRegistrationSubProcess";

    /**
     * Наименования шаблона подпроцесса прикрепления подлинника документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_ATTACH_ORIGINAL =
            "ContractDocumentAttachOriginalSubProcess";

    /**
     * Наименования шаблона подпроцесса приёма на хранение документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_TAKE_STORAGE = "ContractDocumentTakeStorageSubProcess";

    /**
     * Наименования шаблона подпроцесса закрытия (прекращения) документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_TERMINATION = "ContractDocumentTerminationSubProcess";

    /**
     * Наименования шаблона подпроцесса аннулирования документа.
     */
    public static final String SUBPROCESS_CONTRACT_DOCUMENT_REVOKE = "ContractDocumentRevokeSubProcess";
}
