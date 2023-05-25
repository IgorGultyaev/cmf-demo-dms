package ru.croc.ctp.cmf.sedproject.document.warrant.journal;

import ru.croc.ctp.cmf.dms.journal.JournalRecordModifier;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalCause;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalRecord;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalRecordKey;

/**
 * Сущность, обрабатывающая изменение информации в журнале доверенностей.
 */
public interface WarrantJournalRecordModifier extends JournalRecordModifier<WarrantJournalCause, String, String,
        WarrantJournalRecordKey, WarrantJournalRecord, WarrantJournalRecordModifier> {

}
