package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import static ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddresseeStatus.IDAS_NEW;
import static ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddresseeStatus.IDAS_ON_REVIEW;
import static ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddresseeStatus.IDAS_REVIWED;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddressee;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddresseeStatus;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.repo.IncomingDocumentAddresseeRepository;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.repo.IncomingDocumentRepository;
import ru.croc.ctp.cmf.process.ProcessMethod;

import java.text.MessageFormat;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Nonnull;

/**
 * Обработчик, содержащий бизнес логику автоматических действий (включая разрешение условия) подпроцесса исполнения
 * входящего документа.
 */
@Component("processIncomingDocumentExecutionHandler")
public class IncomingDocumentProcessExecutionHandler {

    /**
     * Репозиторий работы с документом.
     */
    @Autowired
    IncomingDocumentRepository documentRepository;

    /**
     * Репозиторий работы с адрессатами.
     */
    @Autowired
    IncomingDocumentAddresseeRepository incomingDocumentAddresseeRepository;

    /**
     * Получение адресатов документа, которым ещё не рассылались задачи на рассмотрение.
     *
     * @param documentId
     *            идентификатор документа
     * @return список идентификаторов адресатов, которым ещё не рассылались задачи на рассмотрение
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Set<String> getNewAddressees(final String documentId) {
        final IncomingDocument document = documentRepository.findById(documentId).get();
        @SuppressWarnings("null")
        @Nonnull
        final Set<String> result = document.getAddressees()
                .stream()
                .filter(addresse -> IDAS_NEW == addresse.getIncomingDocumentAddresseeStatus())
                .map(adressee -> adressee.getId())
                .collect(Collectors.toSet());
        return result;

    }

    /**
     * Перевод адресата в состояние "На рассмотрении".
     *
     * @param addresseeId
     *            идентификатор адресата
     */
    @Transactional
    @ProcessMethod
    public void switchToOnReview(final String addresseeId) {
        switchAdresseTo(addresseeId, IDAS_ON_REVIEW);
    }

    /**
     * Перевод адресата в состояние "Рассмотрен".
     *
     * @param addresseeId
     *            идентификатор адресата
     */
    @Transactional
    @ProcessMethod
    public void switchToReviewed(final String addresseeId) {
        switchAdresseTo(addresseeId, IDAS_REVIWED);
    }

    /**
     * Перевод адресата в указанное состояние.
     *
     * @param addresseeId
     *            идентификатор адресата
     * @param status
     *            состояние
     */
    private void switchAdresseTo(final String addresseeId, final IncomingDocumentAddresseeStatus status) {
        final IncomingDocumentAddressee addressee = incomingDocumentAddresseeRepository.findById(addresseeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        MessageFormat.format("Unable to find addressee: {0}", addresseeId)));
        addressee.setIncomingDocumentAddresseeStatus(status);
        incomingDocumentAddresseeRepository.save(addressee);
    }
}
