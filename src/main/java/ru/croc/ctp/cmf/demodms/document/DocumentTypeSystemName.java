package ru.croc.ctp.cmf.demodms.document;

/**
 * Класс констант, содержащий предопределённые cистемные именованные идентификатор типов документов приложения.
 */
public class DocumentTypeSystemName {

    /**
     * Исходящий документ.
     * 
     * @deprecated следует использовать system name
     */
    @Deprecated
    public static final String ID_DOCUMENTTYPE_OUTGOINGDOCUMENT = "id_documentType_outgoingDocument";

    /**
     * Исходящий документ (подтип).
     * 
     * @deprecated ты попал, т.к. system name для этой константы нет
     */
    @Deprecated
    public static final String ID_DOCUMENTSUBTYPE_OUTGOINGDOCUMENT = "id_documentSubType_outgoingDocument";

    /**
     * Общий тип исходящих документов.
     */
    public static final String DOCUMENT_TYPE_OUTGOING = "DocumentType_Outgoing";

    /**
     * Общий тип входящих документов.
     */
    public static final String DOCUMENT_TYPE_INCOMING = "DocumentType_Incoming";

}
