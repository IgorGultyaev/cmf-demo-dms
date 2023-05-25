package ru.croc.ctp.cmf.demodms.document.outgoing.journal.impl;

import static ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalCause.ODJC_RECEIVED_TASK;

import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.outgoing.journal.OutgoingDocumentJournalRecordModifier;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.task.Task;
import ru.croc.ctp.cmf.task.operation.CreateTaskEvent;
import ru.croc.ctp.cmf.task.operation.CreateTaskOperationHandler;

/**
 * Создаёт записи в журнале для тех, кто получил задачи по исходящему документу.
 *
 * @author Dmitry Malenok
 */
@Component
public class OutgoingDocumentJournalCreateTaskOperationHandler implements CreateTaskOperationHandler {

    /**
     * Сервис модификации записи вхождения в журнал исходящего.
     */
    @Autowired
    ObjectFactory<OutgoingDocumentJournalRecordModifier> modifierFactory;

    @Override
    public void onApplicationEvent(final CreateTaskEvent event) {
        final Task task = event.getTask();
        if (!OutgoingDocument.class.getName().equals(task.getTaskEntityType())) {
            return;
        }

        final OutgoingDocumentJournalRecordModifier modifier = modifierFactory.getObject();

        final String taskEntityId = task.getTaskEntityId();
        modifier.withEntityId(taskEntityId).withCause(ODJC_RECEIVED_TASK).withOldValue(null);
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
