package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;

import com.querydsl.jpa.JPQLQueryFactory;
import org.camunda.bpm.engine.TaskService;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.QIncomingDocumentAddressee;
import ru.croc.ctp.cmf.dms.task.DocumentTaskTypeSystemName;
import ru.croc.ctp.cmf.dms.task.info.TaskAdditionalInfoContext;
import ru.croc.ctp.cmf.dms.task.info.TaskAdditionalInfoProvider;
import ru.croc.ctp.cmf.task.Task;
import ru.croc.ctp.jxfw.core.domain.DomainObject;
import ru.croc.ctp.jxfw.core.load.LoadResult;

/**
 * Определитель сотрудника, который назначен рассматривающим задачи на рассмотрение документа.
 * <p/>
 * TODO: подумать, не сделать ли основным объектом задачи адресата. Перед выдачей задачи делать inboxItem, после
 * завершения - удалять. Тогда всё можно будет взять прямо из задачи без этого сервиса.
 *
 * @author Dmitry Malenok
 */
@Component(TaskAdditionalInfoProvider.TAIP_BEAN_PREFIX + "DOCUMENT_REVIEWER")
public class ReviewerTaskAdditionalInfoProvider implements TaskAdditionalInfoProvider {

    /**
     * Наименование переменной процесса, в которой лежит идентификатор адресата рассматривающего документ.
     */
    private static final String PROCESS_VARIABLE_ADDRESSEE = "addressee";

    /**
     * Сервис задач Camunda.
     */
    private final TaskService camundaTaskService;

    /**
     * Фабрика JPA запросов QueryDSL.
     */
    private final JPQLQueryFactory jpqlQueryFactory;

    /**
     * Constructor.
     *
     * @param camundaTaskService
     *            сервис задач Camunda
     * @param jpqlQueryFactory
     *            фабрика JPA запросов QueryDSL
     */
    public ReviewerTaskAdditionalInfoProvider(final TaskService camundaTaskService,
            final JPQLQueryFactory jpqlQueryFactory) {
        this.camundaTaskService = camundaTaskService;
        this.jpqlQueryFactory = jpqlQueryFactory;
    }

    @Override
    public LoadResult<? extends DomainObject<?>> provideAdditionalInfo(final TaskAdditionalInfoContext context) {
        final Task task = context.getTask();
        if (!DocumentTaskTypeSystemName.TASK_TYPE_DOCUMENT_ON_REVIEW.equals(task.getTaskType().getSystemName())) {
            return new LoadResult<>(emptyList(), emptyList(), emptyMap());
        }
        final String externalTaskId = task.getExternalTaskId();
        final String reviewerId = (String) camundaTaskService.getVariable(externalTaskId, PROCESS_VARIABLE_ADDRESSEE);

        return new LoadResult<>(jpqlQueryFactory.select(QIncomingDocumentAddressee.incomingDocumentAddressee.addressee)
                .from(QIncomingDocumentAddressee.incomingDocumentAddressee)
                .where(QIncomingDocumentAddressee.incomingDocumentAddressee.id.eq(reviewerId))
                .fetch(), emptyList(), emptyMap());
    }

}
