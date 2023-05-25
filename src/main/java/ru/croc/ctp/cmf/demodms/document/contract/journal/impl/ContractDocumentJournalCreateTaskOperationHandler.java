package ru.croc.ctp.cmf.demodms.document.contract.journal.impl;

import static ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalCause.CDJC_RECEIVED_TASK;

import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.journal.ContractDocumentJournalRecordModifier;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.task.Task;
import ru.croc.ctp.cmf.task.operation.CreateTaskEvent;
import ru.croc.ctp.cmf.task.operation.CreateTaskOperationHandler;

/**
 * Создаёт записи в журнале для тех, кто получил задачи по документу Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
@Component
public class ContractDocumentJournalCreateTaskOperationHandler implements CreateTaskOperationHandler {

    /**
     * Сервис модификации записи вхождения в журнал документов Договор.
     */
    @Autowired
    ObjectFactory<ContractDocumentJournalRecordModifier> modifierFactory;

    @Override
    public void onApplicationEvent(final CreateTaskEvent event) {
        final Task task = event.getTask();
        if (!ContractDocument.class.getName().equals(task.getTaskEntityType())) {
            return;
        }

        final String taskEntityId = task.getTaskEntityId();
        final ContractDocumentJournalRecordModifier modifier = modifierFactory.getObject();
        modifier.withEntityId(taskEntityId).withCause(CDJC_RECEIVED_TASK).withOldValue(null);
        task.getAssignees()
                .stream()
                .filter(info -> EmployeePosition.TYPE_NAME.equals(info.getAssigneeType()))
                .map(info -> info.getAssigneeId())
                .distinct()
                .sequential()
                .forEach(employeePositionId -> {
                    modifier.withNewValueId(employeePositionId).update();
                });
    }
}
