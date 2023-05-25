package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Collections.singletonList;
import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.security.role.RoleParamsBuilder.roleParamsBuilder;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.repo.ContractDocumentRepository;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentType;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.security.role.DmsRoleName;
import ru.croc.ctp.cmf.process.ProcessMethod;
import ru.croc.ctp.cmf.security.role.RoleParams;
import ru.croc.ctp.cmf.security.role.RoleService;
import ru.croc.ctp.cmf.task.camunda.ProcessTaskAssigneeConverter;
import ru.croc.ctp.jxfw.core.domain.DomainObjectIdentity;

import java.util.Collection;

/**
 * Определитель исполнителей общих задач для документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.20
 */
@Component("processContractDocumentTaskAssigneeResolver")
public class ContractDocumentTaskAssigneeResolver {

    /**
     * Репозиторий работы с документом.
     */
    private final ContractDocumentRepository documentRepository;

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
    public ContractDocumentTaskAssigneeResolver(final ContractDocumentRepository documentRepository,
            final ProcessTaskAssigneeConverter processTaskAssigneeConverter,
            final RoleService roleService) {
        this.documentRepository = documentRepository;
        this.processTaskAssigneeConverter = processTaskAssigneeConverter;
        this.roleService = roleService;
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи создания документа и возвращает коллекцию
     * из найденных идентификаторов.
     * 
     * @param documentId
     *            идентификатор документа, для которого требуется определить исполнителя
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveCreationTaskAssigneeIds(final String documentId) {
        final ContractDocument document = documentRepository.findById(documentId).get();
        final EmployeePosition performer = document.getPerformer();
        checkArgument(performer != null, "Performer is not defined for document " + document);
        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(performer));
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи доработки документа и возвращает коллекцию
     * из найденных идентификаторов.
     * 
     * @param documentId
     *            идентификатор документа, для которого требуется определить исполнителя
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveRefineTaskAssigneeIds(final String documentId) {
        return resolveCreationTaskAssigneeIds(documentId);
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи регистрации документа и возвращает
     * коллекцию из найденных идентификаторов.
     * 
     * @param documentId
     *            идентификатор документа, для которого требуется определить исполнителя
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveRegistrationTaskAssigneeIds(final String documentId) {
        final ContractDocument document = documentRepository.findById(documentId).get();
        final RoleParams registratorRoleParams = roleParamsBuilder().withRoleName(DmsRoleName.ROLE_DOCUMENT_REGISTRATOR)
                .withRoleParam(requireNonNull(Company.TYPE_NAME), document.getOrganization().getId())
                .withRoleParam(requireNonNull(DocumentType.TYPE_NAME), document.getDocumentType().getId())
                .build();
        final DomainObjectIdentity<?> registratorIdentity =
                roleService.resolveOrCreateAccessorsGroupIdentity(registratorRoleParams);

        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(registratorIdentity));
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи прикрепления подлинника документа и
     * возвращает коллекцию из найденных идентификаторов.
     * 
     * @param documentId
     *            идентификатор документа, для которого требуется определить исполнителя
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveAttachOriginalTaskAssigneeIds(final String documentId) {
        return resolveRegistrationTaskAssigneeIds(documentId);
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи приёма на хранение документа, и возвращает
     * коллекцию из найденных идентификаторов.
     *
     * @param documentId
     *            идентификатор документа, для которого производится определение
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveTakeStorageTaskAssigneeIds(final String documentId) {
        // TODO finance В первой версии Договоров рассылаем задачи на роль регистратора
        return resolveRegistrationTaskAssigneeIds(documentId);
    }
}