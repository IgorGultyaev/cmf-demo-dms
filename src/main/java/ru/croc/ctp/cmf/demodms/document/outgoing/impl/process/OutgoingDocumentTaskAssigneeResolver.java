package ru.croc.ctp.cmf.demodms.document.outgoing.impl.process;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Collections.singletonList;
import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.security.role.RoleParamsBuilder.roleParamsBuilder;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.domain.repo.OutgoingDocumentRepository;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentType;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.document.process.assignee.impl.DocumentTaskAssigneeResolver;
import ru.croc.ctp.cmf.dms.security.role.DmsRoleName;
import ru.croc.ctp.cmf.process.ProcessMethod;
import ru.croc.ctp.cmf.security.role.RoleParams;
import ru.croc.ctp.cmf.security.role.RoleService;
import ru.croc.ctp.cmf.task.camunda.ProcessTaskAssigneeConverter;
import ru.croc.ctp.jxfw.core.domain.DomainObjectIdentity;

import java.text.MessageFormat;
import java.util.Collection;
import java.util.Collections;

/**
 * Определитель исполнителей общих задач для исходящего документа.
 *
 * @author Dmitry Malenok
 */
@SuppressFBWarnings("FCCD_FIND_CLASS_CIRCULAR_DEPENDENCY") // TODO: подумать, что можно сделать.
@Component("processOutgoingDocumentTaskAssigneeResolver")
public class OutgoingDocumentTaskAssigneeResolver implements DocumentTaskAssigneeResolver<OutgoingDocument> {

//**************************
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveOutgoRegistrationTaskAssigneeIds(final String documentId) {
        final OutgoingDocument document = documentRepository.findById(documentId).get();
        final RoleParams registratorRoleParams = roleParamsBuilder().withRoleName(DmsRoleName.ROLE_DOCUMENT_REGISTRATOR)
                .withRoleParam(requireNonNull(Company.TYPE_NAME), document.getOrganization().getId())
                .withRoleParam(requireNonNull(DocumentType.TYPE_NAME), document.getDocumentType().getId())
                .build();
        final DomainObjectIdentity<?> registratorIdentity =
                roleService.resolveOrCreateAccessorsGroupIdentity(registratorRoleParams);

        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(registratorIdentity));
    }
//*********************

    /**
     * Репозиторий работы с документом.
     */
    private final OutgoingDocumentRepository documentRepository;

    /**
     * Сервис конвертации информации об исполнителях задач в строковое представление для обработки движком процессов и
     * обратно.
     */
    private final ProcessTaskAssigneeConverter processTaskAssigneeConverter;

    /**
     * Сервис работы с ролями.
     */
    private final RoleService roleService;

    /**
     * Constructor.
     *
     * @param documentRepository
     *            репозиторий работы с документом
     * @param processTaskAssigneeConverter
     *            сервис конвертации информации об исполнителях задач в строковое представление для обработки движком
     *            процессов и обратно
     * @param roleService
     *            сервис работы с ролями
     */
    public OutgoingDocumentTaskAssigneeResolver(final OutgoingDocumentRepository documentRepository,
            final ProcessTaskAssigneeConverter processTaskAssigneeConverter,
            final RoleService roleService) {
        this.documentRepository = documentRepository;
        this.processTaskAssigneeConverter = processTaskAssigneeConverter;
        this.roleService = roleService;
    }

    @Transactional(readOnly = true)
    @ProcessMethod
    @Override
    public Collection<String> resolveCreationTaskAssigneeIds(final OutgoingDocument document) {
        final EmployeePosition performer = document.getPerformer();
        checkArgument(performer != null, "Performer is not defined for document " + document);
        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(performer));
    }

    @Transactional(readOnly = true)
    @ProcessMethod
    @Override
    public Collection<String> resolveRefineTaskAssigneeIds(final OutgoingDocument document) {
        return resolveCreationTaskAssigneeIds(document);
    }

    @ProcessMethod
    @Override
    public Collection<String> resolveRegistrationTaskAssigneeIds(final OutgoingDocument document) {
        return Collections.emptyList();
    }

    @ProcessMethod
    @Override
    public Collection<String> resolveAttachOriginalTaskAssigneeIds(final OutgoingDocument document) {
        return Collections.emptyList();
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи на ручную отправку документа и возвращает
     * коллекцию из найденных идентификаторов.
     *
     * @param documentId
     *            идентификатор документа, для которого производится определение
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveSendDocumentTaskAssigneeIds(final String documentId) {
        final OutgoingDocument document = documentRepository.findById(requireNonNull(documentId))
                .orElseThrow(() -> new IllegalArgumentException(
                        MessageFormat.format("Document with the pointed ID is not found id={0}", documentId)));
        final EmployeePosition performer = document.getPerformer();
        checkArgument(performer != null, "Performer is not defined for document " + document);
        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(performer));
    }
}
