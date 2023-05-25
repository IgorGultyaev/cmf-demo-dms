package ru.croc.ctp.cmf.demodms.document.outgoing.journal;

import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalRecordKey;
import ru.croc.ctp.cmf.dms.journal.JournalRecordModifier;

/**
 * Сущность, обрабатывающая изменение информации в журнале исходящих документов.
 * 
 * @author Dmitry Malenok
 */
public interface OutgoingDocumentJournalRecordModifier
        extends JournalRecordModifier<OutgoingDocumentJournalCause, String, String, OutgoingDocumentJournalRecordKey,
                OutgoingDocumentJournalRecord, OutgoingDocumentJournalRecordModifier> {
}
