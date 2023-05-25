package ru.croc.ctp.cmf.demodms.document.incoming.journal.impl;

import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_PROTOTYPE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.IncomingDocumentJournalRecordModifier;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalRecordKey;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.repo.IncomingDocumentJournalRecordRepository;
import ru.croc.ctp.cmf.dms.journal.AbstractJournalRecordModifier;

/**
 * Имплементация сущности, обрабатывающей изменение информации в журнале входящих документов.
 */
@Component
@Scope(value = SCOPE_PROTOTYPE)
public class IncomingDocumentJournalRecordModifierImpl extends
        AbstractJournalRecordModifier<IncomingDocumentJournalCause, String, String, IncomingDocumentJournalRecordKey,
                IncomingDocumentJournalRecord, IncomingDocumentJournalRecordModifier>
        implements IncomingDocumentJournalRecordModifier {

    /**
     * Устанавливает репозиторий работы объектами хранения информации о внесении записи в журнале.
     *
     * @param recordRepository
     *            устанавливаемый репозиторий работы объектами хранения информации о внесении записи в журнале
     */
    @Autowired
    public void setRecordRepository(final IncomingDocumentJournalRecordRepository recordRepository) {
        super.setRecordRepository(recordRepository);
    }

    @Override
    protected IncomingDocumentJournalRecord createNewJournalRecord() {
        return new IncomingDocumentJournalRecord();
    }

    @Override
    protected IncomingDocumentJournalRecordKey createNewJournalRecordKey(final String entityId,
            final String participantId,
            final IncomingDocumentJournalCause cause) {
        return new IncomingDocumentJournalRecordKey(entityId, participantId, cause);
    }
}
