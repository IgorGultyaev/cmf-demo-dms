package ru.croc.ctp.cmf.demodms.document.contract.journal;

import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalRecordKey;
import ru.croc.ctp.cmf.dms.journal.JournalRecordModifier;

/**
 * Сущность, обрабатывающая изменение информации в журнале документов Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
public interface ContractDocumentJournalRecordModifier
        extends JournalRecordModifier<ContractDocumentJournalCause, String, String, ContractDocumentJournalRecordKey,
                ContractDocumentJournalRecord, ContractDocumentJournalRecordModifier> {
}
