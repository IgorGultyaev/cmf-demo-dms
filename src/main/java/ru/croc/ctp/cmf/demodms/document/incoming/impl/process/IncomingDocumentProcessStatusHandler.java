package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName;
import ru.croc.ctp.cmf.dms.document.DocumentStatusOperationService;
import ru.croc.ctp.cmf.process.ProcessMethod;

/**
 * Сервис, предоставляющий методы перевода входящего документа, идущего по процессу, в одно из его состояний.
 */
@Component("processIncomingDocumentStatusHandler")
public class IncomingDocumentProcessStatusHandler {

    /**
     * Сервис операций над статусом документа.
     */
    @Autowired
    DocumentStatusOperationService statusOperationService;

    /**
     * Перевод документа в состояние "Исполнение".
     *
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToPerforming(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_PERFORMING);
    }

    /**
     * Перевод документа в состояние "Исполнен".
     *
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToCompleted(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_COMPLETED);
    }

}
