package ru.croc.ctp.cmf.demodms.document.contract.journal.impl;

import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_PROTOTYPE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.contract.journal.ContractDocumentJournalRecordModifier;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalCause;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalRecordKey;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.repo.ContractDocumentJournalRecordRepository;
import ru.croc.ctp.cmf.dms.journal.AbstractJournalRecordModifier;

/**
 * Имплементация сущности, обрабатывающей изменение информации в журнале документов Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
@Component
@Scope(value = SCOPE_PROTOTYPE)
public class ContractDocumentJournalRecordModifierImpl extends
        AbstractJournalRecordModifier<ContractDocumentJournalCause, String, String, ContractDocumentJournalRecordKey,
                ContractDocumentJournalRecord, ContractDocumentJournalRecordModifier>
        implements ContractDocumentJournalRecordModifier {

    @Override
    protected ContractDocumentJournalRecord createNewJournalRecord() {
        return new ContractDocumentJournalRecord();
    }

    @Override
    protected ContractDocumentJournalRecordKey createNewJournalRecordKey(final String entityId,
            final String participantId,
            final ContractDocumentJournalCause cause) {
        return new ContractDocumentJournalRecordKey(entityId, participantId, cause);
    }

    /**
     * Устанавливает репозиторий работы объектами хранения информации о внесении записи в журнале.
     *
     * @param recordRepository
     *            устанавливаемый репозиторий работы объектами хранения информации о внесении записи в журнале
     */
    @Autowired
    public void setRecordRepository(final ContractDocumentJournalRecordRepository recordRepository) {
        super.setRecordRepository(recordRepository);
    }
}
