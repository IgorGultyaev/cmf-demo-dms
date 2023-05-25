package ru.croc.ctp.cmf.sedproject.document.warrant.impl.process;

import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.core.jpa.StoreContextBuilder.newStoreContextBuilder;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_CREATION;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.lang.exception.NestableRuntimeException;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentSubType;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentTemplate;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.service.DocumentTemplateService;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Department;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.QEmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.service.EmployeePositionService;
import ru.croc.ctp.cmf.dms.document.approval.ApprovalService;
import ru.croc.ctp.cmf.dms.document.domain.repo.DocumentStatusRepository;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.jxfw.core.store.UnitOfWorkMultiStoreService;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.UUID;

/**
 * Обработчик, содержащий бизнес логику автоматических действий подпроцесса создания доверенности.
 */
@Component("processWarrantInitializer")
public class WarrantProcessInitializer {

    /**
     * Сервис сохранения UoW.
     */
    @Autowired
    UnitOfWorkMultiStoreService unitOfWorkService;

    /**
     * Сервис работы с сотрудниками.
     */
    @Autowired
    private EmployeePositionService employeePositionService;

    /**
     * Репозиторий работы со статусами документов.
     */
    @Autowired
    DocumentStatusRepository documentStatusRepository;

    /**
     * Сервис работы с очередями согласования.
     */
    @Autowired
    ApprovalService approvalQueueService;

    /**
     * Сервис работы с шаблонами документов.
     */
    @Autowired
    DocumentTemplateService documentTemplateService;

    /**
     * Создаёт доверенность по переданному шаблону.
     *
     * @param templateId
     *            идентификатор шаблона
     * @return идентификатор созданного документа
     */
    public String create(String templateId) {

        final EmployeePosition currentUserEmployeePosition = resolveCurrentUserEmployeePosition();

        final DocumentTemplate documentTemplate = documentTemplateService.getObjectById(templateId);
        final DocumentSubType documentType = documentTemplate.getParent();

        final LocalDate now = LocalDate.now();
        final WarrantDocument warrant = new WarrantDocument();

        warrant.setId(UUID.randomUUID().toString());
        warrant.setCreationDate(now);
        warrant.setAuthor(currentUserEmployeePosition);
        warrant.setOrganization(resolveDocumentCompany(currentUserEmployeePosition));
        warrant.setDocumentType(documentType);
        warrant.setPerformer(currentUserEmployeePosition);
        warrant.setIdentifier(UUID.randomUUID().toString());
        warrant.setStatus(documentStatusRepository.findOneBySystemName(DSSN_CREATION));
        warrant.setRegistrator(currentUserEmployeePosition);
        warrant.setNew(true);

        warrant.setStartDate(now);
        warrant.setPeriod(Duration.ofDays(30));
        warrant.setAclId("acl_" + warrant.getId());

        unitOfWorkService.store(newStoreContextBuilder().addDomain(warrant).build());

        final String warrantId = warrant.getId();
        return requireNonNull(warrantId);
    }

    /**
     * Создаёт шаблон кейса согласования доверенности и возвращает его идентификатор.
     *
     * @param documentId
     *            идентификатор документа, к которому прикрепляется шаблон
     * @return идентификатор шаблона кейса согласования исходящего документа
     */
    @SuppressFBWarnings("WEM_WEAK_EXCEPTION_MESSAGING") // До рефакторинга сойдёт.
    public String attachProcess(final String documentId) {
        throw new NotImplementedException("The operation is not implemented");
    }

    /**
     * Определяет и возвращает для текущего сотрудника объект сотрудника в должности.
     *
     * @return для текущего сотрудника объект сотрудника в должности
     */
    EmployeePosition resolveCurrentUserEmployeePosition() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final DmsUserDetails principal = (DmsUserDetails) authentication.getPrincipal();
        final Iterable<EmployeePosition> employeePositions = employeePositionService
                .getObjects(QEmployeePosition.employeePosition.employee.user.id.eq(principal.getUserId()));
        final Iterator<EmployeePosition> iterator = employeePositions.iterator();
        if (!iterator.hasNext()) {
            throw new NestableRuntimeException("Unable to resolve employee position of current user: " + principal);
        }

        final EmployeePosition result = iterator.next();
        return requireNonNull(result);
    }

    /**
     * Реализует временный алгоритм определения организации документа по создающему его пользователю.
     *
     * @param employeePosition
     *            пользователь в должности
     * @return организацию документа
     */
    Company resolveDocumentCompany(final EmployeePosition employeePosition) {
        Department department = employeePosition.getParent().getParent();
        while (!(department instanceof Company)) {
            department = department.getParent();
        }
        return (Company) department;
    }
}
