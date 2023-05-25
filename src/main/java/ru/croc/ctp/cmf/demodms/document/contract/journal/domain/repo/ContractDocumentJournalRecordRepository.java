package ru.croc.ctp.cmf.demodms.document.contract.journal.domain.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalRecordKey;

/**
 * Репозиторий работы с объектами хранения информации о записях в журнале документов Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
public interface ContractDocumentJournalRecordRepository
        extends JpaRepository<ContractDocumentJournalRecord, ContractDocumentJournalRecordKey>,
        QuerydslPredicateExecutor<ContractDocumentJournalRecord> {
}
