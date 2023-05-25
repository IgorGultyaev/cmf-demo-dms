package ru.croc.ctp.cmf.demodms.document.outgoing.journal.impl;

import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_PROTOTYPE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalRecordKey;
import ru.croc.ctp.cmf.demodms.document.domain.repo.OutgoingDocumentJournalRecordRepository;
import ru.croc.ctp.cmf.demodms.document.outgoing.journal.OutgoingDocumentJournalRecordModifier;
import ru.croc.ctp.cmf.dms.journal.AbstractJournalRecordModifier;

/**
 * Имплементация сущности, обрабатывающей изменение информации в журнале исходящих документов.
 *
 * @author Dmitry Malenok
 */
@Component
@Scope(value = SCOPE_PROTOTYPE)
public class OutgoingDocumentJournalRecordModifierImpl extends
        AbstractJournalRecordModifier<OutgoingDocumentJournalCause, String, String, OutgoingDocumentJournalRecordKey,
                OutgoingDocumentJournalRecord, OutgoingDocumentJournalRecordModifier>
        implements OutgoingDocumentJournalRecordModifier {

    @Override
    protected OutgoingDocumentJournalRecord createNewJournalRecord() {
        return new OutgoingDocumentJournalRecord();
    }

    @Override
    protected OutgoingDocumentJournalRecordKey createNewJournalRecordKey(final String entityId,
            final String participantId,
            final OutgoingDocumentJournalCause cause) {
        return new OutgoingDocumentJournalRecordKey(entityId, participantId, cause);
    }

    /**
     * Устанавливает репозиторий работы объектами хранения информации о внесении записи в журнале.
     *
     * @param recordRepository
     *            устанавливаемый репозиторий работы объектами хранения информации о внесении записи в журнале
     */
    @Autowired
    public void setRecordRepository(final OutgoingDocumentJournalRecordRepository recordRepository) {
        super.setRecordRepository(recordRepository);
    }
}
