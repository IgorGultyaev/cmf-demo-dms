package ru.croc.ctp.cmf.demodms.document.outgoing.journal.impl;

import static java.lang.Boolean.FALSE;
import static java.util.Objects.requireNonNull;
import static java.util.Optional.ofNullable;
import static ru.croc.ctp.cmf.dms.document.DmsDocumentStatusSystemName.DDSSN_TEMPLATE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.core.jpa.service.BeforeJpaStoreEvent;
import ru.croc.ctp.cmf.core.jpa.service.BeforeJpaStoreEventListener;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.domain.repo.OutgoingDocumentRepository;
import ru.croc.ctp.cmf.demodms.document.outgoing.journal.OutgoingDocumentJournalRecordModifier;

import java.util.Optional;

/**
 * Производит обновление доступности исходящего документа в журнале на основе информации в UoW.
 *
 * @author Dmitry Malenok
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class OutgoingDocumentJournalRecordUpdateHandler implements BeforeJpaStoreEventListener {

    /**
     * Репозиторий работы с документами.
     */
    @Autowired
    OutgoingDocumentRepository documentRepository;

    /**
     * Контекст приложения.
     */
    @Autowired
    ApplicationContext applicationContext;

    /**
     * Инстанс самого себя.
     * <p/>
     * Нужен для того, чтобы обработалась аннотация {@link Transactional} при вызове.
     */
    @Autowired
    OutgoingDocumentJournalRecordUpdateHandler self;

    @Override
    public void onApplicationEvent(final BeforeJpaStoreEvent event) {
        final OutgoingDocumentJournalRecordModifier modifier =
                applicationContext.getBean(OutgoingDocumentJournalRecordModifier.class);
        event.getAcceptedOnlyObjects()
                .stream()
                .sequential()
                .filter(item -> item instanceof OutgoingDocument)
                .map(item -> (OutgoingDocument) item)
                .filter(document -> ofNullable(document.getStatus())
                        .map(status -> !DDSSN_TEMPLATE.equals(status.getSystemName()))
                        .orElse(FALSE))
                .forEach(document -> {
                    final String documentId = document.getId();
                    final Optional<OutgoingDocument> storedDocument =
                            self.getStoredDocument(requireNonNull(documentId));

                    modifier.withCause(OutgoingDocumentJournalCause.ODJC_AUTHOR)
                            .withEntityId(requireNonNull(documentId))
                            .withNewValue(document.getAuthor())
                            .withOldValue(storedDocument.map(value -> value.getAuthor()).orElse(null))
                            .update();
                });
    }

    /**
     * Получает объект документа из хранилища по его идентификатору.
     * <p/>
     * <b>Внимание!</b> Внутренние вызовы только через {@link #self}.
     * 
     * @param documentId
     *            идентификатор документа
     * @return объект поручения из хранилища, либо <code>null</code>, если такого нет
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public Optional<OutgoingDocument> getStoredDocument(final String documentId) {
        return documentRepository.findById(documentId);
    }

}
