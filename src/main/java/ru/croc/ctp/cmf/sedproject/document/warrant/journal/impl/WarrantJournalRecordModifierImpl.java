package ru.croc.ctp.cmf.sedproject.document.warrant.journal.impl;

import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_PROTOTYPE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.dms.journal.AbstractJournalRecordModifier;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.WarrantJournalRecordModifier;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalCause;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalRecord;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalRecordKey;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.repo.WarrantJournalRecordRepository;

/**
 * Имплементация сущности, обрабатывающей изменение информации в журнале доверенностей.
 */
@Component
@Scope(value = SCOPE_PROTOTYPE)
public class WarrantJournalRecordModifierImpl extends AbstractJournalRecordModifier<WarrantJournalCause, String, String,
        WarrantJournalRecordKey, WarrantJournalRecord, WarrantJournalRecordModifier>
        implements WarrantJournalRecordModifier {

    /**
     * Устанавливает репозиторий работы объектами хранения информации о внесении записи в журнале.
     *
     * @param recordRepository
     *            устанавливаемый репозиторий работы объектами хранения информации о внесении записи в журнале
     */
    @Autowired
    public void setRecordRepository(final WarrantJournalRecordRepository recordRepository) {
        super.setRecordRepository(recordRepository);
    }

    @Override
    protected WarrantJournalRecord createNewJournalRecord() {
        return new WarrantJournalRecord();
    }

    @Override
    protected WarrantJournalRecordKey createNewJournalRecordKey(final String entityId,
            final String participantId,
            final WarrantJournalCause cause) {
        return new WarrantJournalRecordKey(entityId, participantId, cause);
    }
}
