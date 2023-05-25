package ru.croc.ctp.cmf.demodms.document.incoming.journal.impl;

import static ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalCause.IDJC_RECIEVED_TASK;

import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.IncomingDocumentJournalRecordModifier;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.task.Task;
import ru.croc.ctp.cmf.task.operation.CreateTaskEvent;
import ru.croc.ctp.cmf.task.operation.CreateTaskOperationHandler;

/**
 * Создаёт записи в журнале для тех, кто получил задачи по входящему документу.
 */
@Component
public class IncomingDocumentJournalCreateTaskOperationHandler implements CreateTaskOperationHandler {

    /**
     * Сервис модификации записи вхождения в журнал входящего.
     */
    @Autowired
    ObjectFactory<IncomingDocumentJournalRecordModifier> modifierFactory;

    @Override
    public void onApplicationEvent(final CreateTaskEvent event) {
        final Task task = event.getTask();
        if (!IncomingDocument.class.getName().equals(task.getTaskEntityType())) {
            return;
        }

        final String taskEntityId = task.getTaskEntityId();
        final IncomingDocumentJournalRecordModifier modifier = modifierFactory.getObject();
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
