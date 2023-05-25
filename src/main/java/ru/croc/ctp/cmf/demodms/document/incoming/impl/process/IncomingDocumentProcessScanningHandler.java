package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.repo.IncomingDocumentRepository;
import ru.croc.ctp.cmf.process.ProcessMethod;

/**
 * Обработчик, содержащий бизнес логику автоматических действий (включая разрешение условия) подпроцесса сканирования
 * входящего документа.
 */
@Component("processIncomingDocumentScanningHandler")
public class IncomingDocumentProcessScanningHandler {

    /**
     * Репозиторий работы с документом.
     */
    @Autowired
    IncomingDocumentRepository documentRepository;

    /**
     * Определяет, требуется ли создание задачи на прикрепление оригинала.
     *
     * @param documentId
     *            идентификатор исходящего документа
     * @return <code>true</code> - требуется, иначе - <code>false</code>
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public boolean checkIfScanningRequired(final String documentId) {
        final IncomingDocument document = documentRepository.findById(documentId).get();
        return !document.primaryAttachment().isPresent();
    }
}
