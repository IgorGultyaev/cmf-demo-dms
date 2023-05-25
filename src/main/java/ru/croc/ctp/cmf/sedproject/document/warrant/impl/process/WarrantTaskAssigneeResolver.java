package ru.croc.ctp.cmf.sedproject.document.warrant.impl.process;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Collections.singletonList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.document.process.assignee.impl.DocumentTaskAssigneeResolver;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.cmf.task.camunda.ProcessTaskAssigneeConverter;

import java.util.Collection;

/**
 * Определитель исполнителей общих задач для доверенности.
 */
@Component("processWarrantTaskAssigneeResolver")
public class WarrantTaskAssigneeResolver implements DocumentTaskAssigneeResolver<WarrantDocument> {

    /**
     * Сервис конвертации информации об исполнителях задач в строковое представление для обработки движком процессов и
     * обратно.
     */
    @Autowired
    private ProcessTaskAssigneeConverter processTaskAssigneeConverter;

    @Override
    public Collection<String> resolveCreationTaskAssigneeIds(WarrantDocument document) {
        final EmployeePosition performer = document.getPerformer();
        checkArgument(performer != null, "Performer is not defined for document " + document);
        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(performer));
    }

    @Override
    public Collection<String> resolveRefineTaskAssigneeIds(WarrantDocument document) {
        return resolveCreationTaskAssigneeIds(document);
    }

    @Override
    public Collection<String> resolveRegistrationTaskAssigneeIds(WarrantDocument document) {
        final EmployeePosition registrator = document.getRegistrator();
        checkArgument(registrator != null, "Registrator is not defined for document " + document);
        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(registrator));
    }

    @Override
    public Collection<String> resolveAttachOriginalTaskAssigneeIds(WarrantDocument document) {
        // Никогда не вызывается.
        throw new UnsupportedOperationException();
    }
}
