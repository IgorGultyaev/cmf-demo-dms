package ru.croc.ctp.cmf.demodms.document.incoming.journal.domain;

import static ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey.ColumnName.COLUMN_JOURNAL_RECORD_KEY_ENTITY_ID;
import static ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey.ColumnName.COLUMN_JOURNAL_RECORD_KEY_PARTICIPANT_ID;

import ru.croc.ctp.cmf.dms.journal.domain.AbstractJournalRecord;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * Класс объекта хранения информации о записи в журнале входящих документов.
 */
@Entity
@Table(name = IncomingDocumentJournalRecord.TABLE_NAME, indexes = {
        @Index(columnList = COLUMN_JOURNAL_RECORD_KEY_ENTITY_ID + "," + COLUMN_JOURNAL_RECORD_KEY_PARTICIPANT_ID) })
public class IncomingDocumentJournalRecord
        extends AbstractJournalRecord<String, String, IncomingDocumentJournalCause, IncomingDocumentJournalRecordKey> {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_journal_incoming";

}
