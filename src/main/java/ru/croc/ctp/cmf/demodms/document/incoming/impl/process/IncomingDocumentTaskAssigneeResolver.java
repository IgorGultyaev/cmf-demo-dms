package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Collections.singletonList;
import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.security.role.RoleParamsBuilder.roleParamsBuilder;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddressee;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.repo.IncomingDocumentAddresseeRepository;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.repo.IncomingDocumentRepository;
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
 * Определитель исполнителей общих задач для входящего документа.
 */
@Component("processIncomingDocumentTaskAssigneeResolver")
public class IncomingDocumentTaskAssigneeResolver {

    /**
     * Репозиторий работы с документом.
     */
    private final IncomingDocumentRepository documentRepository;

    /**
     * Репозиторий работы с адресатами.
     */
    private final IncomingDocumentAddresseeRepository incomingDocumentAddresseeRepository;

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
     * @param incomingDocumentAddresseeRepository
     *            репозиторий работы с адресатами
     * @param processTaskAssigneeConverter
     *            сервис конвертации информации об исполнителях задач в строковое представление для обработки движком
     *            процессов и обратно
     * @param roleService
     *            сервис работы с ролями
     */
    public IncomingDocumentTaskAssigneeResolver(final IncomingDocumentRepository documentRepository,
            final IncomingDocumentAddresseeRepository incomingDocumentAddresseeRepository,
            final ProcessTaskAssigneeConverter processTaskAssigneeConverter,
            final RoleService roleService) {
        this.documentRepository = documentRepository;
        this.incomingDocumentAddresseeRepository = incomingDocumentAddresseeRepository;
        this.processTaskAssigneeConverter = processTaskAssigneeConverter;
        this.roleService = roleService;
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи на регистрацию документа и возвращает
     * коллекцию из найденных идентификаторов.
     *
     * @param documentId
     *            идентификатор документа, для которого производится определение
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveRegistrationTaskAssigneeIds(final String documentId) {
        final IncomingDocument document = documentRepository.findById(requireNonNull(documentId)).get();
        final EmployeePosition registrator = document.getRegistrator();
        checkArgument(registrator != null, "Registrator is not defined for document " + document);
        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(registrator));
    }

    /**
     * Для указанного документа определяет идентификаторы исполнителей задачи на прикрепление оригинала и возвращает
     * коллекцию из найденных идентификаторов.
     *
     * @param documentId
     *            идентификатор документа, для которого производится определение
     * @return идентификаторы исполнителей задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public Collection<String> resolveScanningTaskAssigneeIds(final String documentId) {
        final IncomingDocument document = documentRepository.findById(requireNonNull(documentId)).get();

        final RoleParams registratorRoleParams = roleParamsBuilder().withRoleName(DmsRoleName.ROLE_DOCUMENT_REGISTRATOR)
                .withRoleParam(requireNonNull(Company.TYPE_NAME), document.getOrganization().getId())
                .withRoleParam(requireNonNull(DocumentType.TYPE_NAME), document.getDocumentType().getId())
                .build();
        final DomainObjectIdentity<?> registratorIdentity =
                roleService.resolveOrCreateAccessorsGroupIdentity(registratorRoleParams);

        return singletonList(processTaskAssigneeConverter.assigneeToProcessEngine(registratorIdentity));
    }

    /**
     * Для указанного адрессата определяет идентификатор исполнителя задачи на рассмотрение и возвращает его
     * идентификатор.
     *
     * @param addresseeId
     *            идентификатор адрессата, для которого производится определение
     * @return идентификатор исполнителя задачи
     */
    @Transactional(readOnly = true)
    @ProcessMethod
    public String resolveReviewTaskAssigneeId(final String addresseeId) {
        final IncomingDocumentAddressee addressee = incomingDocumentAddresseeRepository.findById(addresseeId).get();
        checkArgument(addressee != null, "Addressee with the pointed ID is not found id=" + addresseeId);
        return requireNonNull(
                processTaskAssigneeConverter.assigneeToProcessEngine(requireNonNull(addressee.getAddressee())));
    }
}
