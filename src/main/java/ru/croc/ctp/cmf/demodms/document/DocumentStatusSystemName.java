package ru.croc.ctp.cmf.demodms.document;

/**
 * Системные идентификаторы статуса документа.
 * 
 * @author Dmitry Malenok
 * @see ru.croc.ctp.cmf.dms.document.domain.DocumentStatus
 */
public final class DocumentStatusSystemName {

    /**
     * Создание.
     */
    public static final String DSSN_CREATION = "DocumentStatus_Creation";

    /**
     * Аннулирован.
     */
    public static final String DSSN_REVOKED = "DocumentStatus_Revoked";

    /**
     * Согласование.
     */
    public static final String DSSN_APPROVEMENT = "DocumentStatus_Approvement";

    /**
     * Подписание.
     */
    public static final String DSSN_SIGNING = "DocumentStatus_Signing";

    /**
     * Доработка.
     */
    public static final String DSSN_REFINEMENT = "DocumentStatus_Refinement";

    /**
     * Регистрация.
     */
    public static final String DSSN_REGISTRATION = "DocumentStatus_Registration";

    /**
     * Сканирование.
     */
    public static final String DSSN_SCANNING = "DocumentStatus_Scanning";

    /**
     * Исполнение.
     */
    public static final String DSSN_PERFORMING = "DocumentStatus_Performing";

    /**
     * Исполнен.
     */
    public static final String DSSN_COMPLETED = "DocumentStatus_Completed";
}
