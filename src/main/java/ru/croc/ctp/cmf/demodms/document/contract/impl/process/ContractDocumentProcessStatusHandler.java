package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName;
import ru.croc.ctp.cmf.demodms.document.contract.ContractDocumentStatusSystemName;
import ru.croc.ctp.cmf.dms.document.DocumentStatusOperationService;
import ru.croc.ctp.cmf.process.ProcessMethod;

/**
 * Сервис, предоставляющий методы перевода документа Договор, идущего по процессу, в одно из состояний документа
 * Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.29
 */
@Component("processContractDocumentStatusHandler")
public class ContractDocumentProcessStatusHandler {

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
    @Transactional
    @ProcessMethod
    public void switchToRevoked(final String documentId) {
        statusOperationService.switchTo(documentId, DocumentStatusSystemName.DSSN_REVOKED);
    }

    /**
     * Перевод документа в состояние "Прием на хранение".
     *
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToTakeStorage(final String documentId) {
        statusOperationService.switchTo(documentId, ContractDocumentStatusSystemName.CDSSN_TAKE_STORAGE);
    }

    /**
     * Перевод документа в состояние "Прекращен".
     *
     * @param documentId
     *            идентификатор документа
     */
    @Transactional
    @ProcessMethod
    public void switchToTerminated(final String documentId) {
        statusOperationService.switchTo(documentId, ContractDocumentStatusSystemName.CDSSN_TERMINATED);
    }

}
