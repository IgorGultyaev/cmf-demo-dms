package ru.croc.ctp.cmf.demodms.document.incoming.journal;

import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalRecordKey;
import ru.croc.ctp.cmf.dms.journal.JournalRecordModifier;

/**
 * Сущность, обрабатывающая изменение информации в журнале входящих документов.
 */
public interface IncomingDocumentJournalRecordModifier
        extends JournalRecordModifier<IncomingDocumentJournalCause, String, String, IncomingDocumentJournalRecordKey,
                IncomingDocumentJournalRecord, IncomingDocumentJournalRecordModifier> {
}
