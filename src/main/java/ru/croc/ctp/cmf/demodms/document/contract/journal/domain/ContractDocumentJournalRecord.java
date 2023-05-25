package ru.croc.ctp.cmf.demodms.document.contract.journal.domain;

import static ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey.ColumnName.COLUMN_JOURNAL_RECORD_KEY_ENTITY_ID;
import static ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey.ColumnName.COLUMN_JOURNAL_RECORD_KEY_PARTICIPANT_ID;

import ru.croc.ctp.cmf.dms.journal.domain.AbstractJournalRecord;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * Класс объекта хранения информации о записи в журнале документов Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
@Entity
@Table(name = ContractDocumentJournalRecord.TABLE_NAME, indexes = {
        @Index(columnList = COLUMN_JOURNAL_RECORD_KEY_ENTITY_ID + "," + COLUMN_JOURNAL_RECORD_KEY_PARTICIPANT_ID) })
public class ContractDocumentJournalRecord
        extends AbstractJournalRecord<String, String, ContractDocumentJournalCause, ContractDocumentJournalRecordKey> {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_journal_contract";

}