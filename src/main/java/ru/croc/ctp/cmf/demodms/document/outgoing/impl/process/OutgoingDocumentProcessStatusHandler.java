package ru.croc.ctp.cmf.demodms.document.outgoing.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName;
import ru.croc.ctp.cmf.demodms.document.outgoing.OutgoingDocumentStatusSystemName;
import ru.croc.ctp.cmf.dms.document.DocumentStatusOperationService;
import ru.croc.ctp.cmf.process.ProcessMethod;

/**
 * Сервис, предоставляющий методы перевода исходящего документа, идущего по процессу, в одно из состояний исходящего
 * документа.
 * 
 * @author Dmitry Malenok
 */
@Component("processOutgoingDocumentStatusHandler")
public class OutgoingDocumentProcessStatusHandler {

    /**
     * Сервис операций над статусом документа.
     */
    @Autowired
    DocumentStatusOperationService statusOperationService;

    /**
     * Перевод документа в состояние "Аннулирован.
     * 
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToRevoked(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_REVOKED);
    }

    /**
     * Перевод документа в состояние "Отправка".
     * 
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToDispatch(final String documentId) {
        statusOperationService.switchTo(documentId, OutgoingDocumentStatusSystemName.ODSSN_DISPATCH);
    }

    /**
     * Перевод документа в состояние "Отправлен".
     * 
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToSent(final String documentId) {
        statusOperationService.switchTo(documentId, OutgoingDocumentStatusSystemName.ODSSN_SENT);
    }
}
