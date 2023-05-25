package ru.croc.ctp.cmf.demodms.document.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName;
import ru.croc.ctp.cmf.dms.document.DocumentStatusOperationService;

/**
 * Сервис, предоставляющий методы перевода документа, идущего по процессу, в одно из общих состояний.
 * 
 * @author Dmitry Malenok
 */
@Component("processDocumentStatusHandler")
public class DocumentProcessStatusHandler {

    /**
     * Сервис операций над статусом документа.
     */
    @Autowired
    DocumentStatusOperationService statusOperationService;

    /**
     * Перевод документа в состояние "Аннулирован".
     * 
     * @param documentId
     *            идентификатор документа
     */
    public void switchToRevoked(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_REVOKED);
    }

    /**
     * Перевод документа в состояние "Согласование".
     * 
     * @param documentId
     *            идентификатор документа
     */
    public void switchToApprovement(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_APPROVEMENT);
    }

    /**
     * Перевод документа в состояние "Подписание".
     * 
     * @param documentId
     *            идентификатор документа
     */
    public void switchToSigning(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_SIGNING);
    }

    /**
     * Перевод документа в состояние "Доработка".
     * 
     * @param documentId
     *            идентификатор документа
     */
    public void switchToRefinement(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_REFINEMENT);
    }

    /**
     * Перевод документа в состояние "Регистрация".
     * 
     * @param documentId
     *            идентификатор документа
     */
    public void switchToRegistration(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_REGISTRATION);
    }

    /**
     * Перевод документа в состояние "Сканирование".
     * 
     * @param documentId
     *            идентификатор документа
     */
    public void switchToScanning(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_SCANNING);
    }
}
