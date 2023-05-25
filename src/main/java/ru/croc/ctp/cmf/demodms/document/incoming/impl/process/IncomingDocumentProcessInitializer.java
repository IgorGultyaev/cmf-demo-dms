package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.core.jpa.StoreContextBuilder.newStoreContextBuilder;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_REGISTRATION;

import org.apache.commons.lang.exception.NestableRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.core.regnumber.RegNumberGenerationContextFactory;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentSubType;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.service.DocumentSubTypeService;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.QEmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.service.CompanyService;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.service.EmployeePositionService;
import ru.croc.ctp.cmf.dms.document.domain.repo.DocumentStatusRepository;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;
import ru.croc.ctp.cmf.process.ProcessMethod;
import ru.croc.ctp.jxfw.core.store.UnitOfWorkMultiStoreService;

import java.time.LocalDate;
import java.util.Iterator;
import java.util.UUID;

/**
 * Обработчик, содержащий бизнес логику автоматических действий подпроцесса создания входящего документа.
 */

@Component("processIncomingDocumentInitializer")
public class IncomingDocumentProcessInitializer {

    /**
     * Репозиторий работы с типами документов.
     */
    @Autowired
    private DocumentSubTypeService documentSubTypeService;

    /**
     * Сервис работы с сотрудниками.
     */
    @Autowired
    private EmployeePositionService employeePositionService;

    /**
     * Репозиторий работы со статусами документа.
     */
    @Autowired
    private DocumentStatusRepository documentStatusRepository;

    /**
     * Сервис работы с организациями.
     */
    @Autowired
    private CompanyService companyService;

    /**
     * Фабрика объектов контекста генерации регистрационного номера.
     */
    @Autowired
    RegNumberGenerationContextFactory regNumberGenerationContextFactory;

    /**
     * Сервис сохранения UoW.
     */
    @Autowired
    UnitOfWorkMultiStoreService unitOfWorkService;

    /**
     * Создаёт по переданному подтипу и организации входящий документ.
     *
     * @param documentTypeId
     *            идентификатор подтипа входящего документа
     * @param organisationId
     *            идентификатор организации
     * @return идентификатор созданного документа
     */
    @Transactional
    @ProcessMethod
    public String create(String documentTypeId, String organisationId) {

        final EmployeePosition currentUserEmployeePosition = resolveCurrentUserEmployeePosition();
        final Company company = companyService.getObjectById(organisationId);

        final DocumentSubType documentSubType = documentSubTypeService.getObjectById(documentTypeId);
        final IncomingDocument document = new IncomingDocument();

        document.setId(UUID.randomUUID().toString());
        document.setCreationDate(LocalDate.now());
        document.setAuthor(currentUserEmployeePosition);
        document.setRegistrator(currentUserEmployeePosition);
        document.setOrganization(company);
        document.setDocumentType(documentSubType);
        document.setStatus(documentStatusRepository.findOneBySystemName(DSSN_REGISTRATION));
        document.setNew(true);
        document.setIdentifier(regNumberGenerationContextFactory.newContext()
                .setObject(document)
                // TODO: использовать константу
                .setType("identifier")
                .generateRegNumber());
        document.setAclId("acl_" + document.getId());
        unitOfWorkService.store(newStoreContextBuilder().addDomain(document).build());

        final String documentId = document.getId();
        return requireNonNull(documentId);
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
}
