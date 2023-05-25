package ru.croc.ctp.cmf.sedproject.document.warrant.journal.impl;

import static ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalCause.IDJC_RECIEVED_TASK;

import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.WarrantJournalRecordModifier;
import ru.croc.ctp.cmf.task.Task;
import ru.croc.ctp.cmf.task.operation.CreateTaskEvent;
import ru.croc.ctp.cmf.task.operation.CreateTaskOperationHandler;

/**
 * Создаёт записи в журнале для тех, кто получил задачи по доверенности.
 */
@Component
public class WarrantJournalCreateTaskOperationHandler implements CreateTaskOperationHandler {

    /**
     * Сервис модификации записи вхождения в журнал доверенности.
     */
    @Autowired
    ObjectFactory<WarrantJournalRecordModifier> modifierFactory;

    @Override
    public void onApplicationEvent(final CreateTaskEvent event) {
        final Task task = event.getTask();
        if (!WarrantDocument.class.getName().equals(task.getTaskEntityType())) {
            return;
        }

        final String taskEntityId = task.getTaskEntityId();
        final WarrantJournalRecordModifier modifier = modifierFactory.getObject();
        modifier.withEntityId(taskEntityId).withCause(IDJC_RECIEVED_TASK).withOldValue(null);
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
