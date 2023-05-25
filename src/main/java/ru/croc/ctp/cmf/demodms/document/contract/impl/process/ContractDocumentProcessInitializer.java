package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

import static java.util.Objects.requireNonNull;
import static java.util.Optional.ofNullable;
import static ru.croc.ctp.cmf.core.jpa.StoreContextBuilder.newStoreContextBuilder;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_CREATION;

import org.apache.commons.lang.exception.NestableRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.core.regnumber.RegNumberGenerationContextFactory;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocumentContractor;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentSubType;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentTemplate;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.service.DocumentSubTypeService;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.service.DocumentTemplateService;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.QEmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.service.CompanyService;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.service.EmployeePositionService;
import ru.croc.ctp.cmf.dms.document.approval.ApprovalService;
import ru.croc.ctp.cmf.dms.document.domain.repo.DocumentStatusRepository;
import ru.croc.ctp.cmf.dms.document.template.CommonDocumentAttachmentCopier;
import ru.croc.ctp.cmf.dms.document.template.CommonDocumentAttributesCopier;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;
import ru.croc.ctp.cmf.process.ProcessMethod;
import ru.croc.ctp.jxfw.core.store.StoreContext;
import ru.croc.ctp.jxfw.core.store.UnitOfWorkMultiStoreService;

import java.time.LocalDate;
import java.util.Iterator;
import java.util.UUID;

/**
 * Обработчик, содержащий бизнес логику автоматических действий подпроцесса создания документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.22
 */
@Component("processContractDocumentInitializer")
public class ContractDocumentProcessInitializer {

    /**
     * Сервис работы с шаблонами документов.
     */
    @Autowired
    DocumentTemplateService documentTemplateService;

    /**
     * Репозиторий работы с типами документов.
     */
    @Autowired
    DocumentSubTypeService documentSubTypeService;

    /**
     * Сервис работы с сотрудниками.
     */
    @Autowired
    EmployeePositionService employeePositionService;

    /**
     * Репозиторий работы со статусами документа.
     */
    @Autowired
    DocumentStatusRepository documentStatusRepository;

    /**
     * Сервис работы с организациями.
     */
    @Autowired
    CompanyService companyService;

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
     * Сервис работы с очередями согласования.
     */
    @Autowired
    ApprovalService approvalQueueService;

    /**
     * Сервис копирования базовых атрибутов карточки документа из шаблона в объект документа.
     */
    @Autowired
    CommonDocumentAttributesCopier commonDocumentAttributesCopier;

    /**
     * Сервис копирования вложений из шаблона в объект документа.
     */
    @Autowired
    CommonDocumentAttachmentCopier commonDocumentAttachmentCopier;

    /**
     * Создаёт по переданному шаблону и сохраняет документ Договор.
     *
     * @param templateId
     *            идентификатор шаблона документа Договор
     * @return идентификатор созданного документа
     */
    @Transactional
    @ProcessMethod
    public String create(final String templateId) {
        final EmployeePosition currentUserEmployeePosition = resolveCurrentUserEmployeePosition();

        final DocumentTemplate documentTemplate = documentTemplateService.getObjectById(templateId);
        final DocumentSubType documentType = documentTemplate.getParent();

        final ContractDocument document = new ContractDocument();
        document.setNew(true);
        document.setId(UUID.randomUUID().toString());
        document.setCreationDate(LocalDate.now());
        document.setCreatedBasedOn(documentTemplate);

        document.setAuthor(currentUserEmployeePosition);
        document.setPerformer(currentUserEmployeePosition);

        document.setOrganization(documentTemplate.getCompany());
        document.setDocumentType(documentType);

        document.setStatus(documentStatusRepository.findOneBySystemName(DSSN_CREATION));
        document.setIdentifier(regNumberGenerationContextFactory.newContext()
                .setObject(document)
                .setType(ContractDocument.Property.IDENTIFIER)
                .generateRegNumber());
        document.setAclId("acl_" + document.getId());

        final StoreContext storeContext = newStoreContextBuilder().addDomain(document).build();
        copyFromTemplate(documentTemplate, document, storeContext);

        unitOfWorkService.store(storeContext);

        final String documentId = document.getId();
        return requireNonNull(documentId);
    }

    /**
     * Копирует информацию из шаблона документа в создаваемый документ.
     * 
     * @param documentTemplate
     *            шаблон документа
     * @param document
     *            создаваемый документ
     * @param storeContext
     *            контекст сохранения
     */
    protected void copyFromTemplate(final DocumentTemplate documentTemplate,
            final ContractDocument document,
            final StoreContext storeContext) {
        final ContractDocument template = (ContractDocument) requireNonNull(documentTemplate.getDocument());
        // Копируем базовые атрибуты документа
        commonDocumentAttributesCopier.copy(template, document, storeContext);

        // Копируем остальные атрибуты
        ofNullable(template.getCost()).ifPresent(document::setCost);
        ofNullable(template.getCurrency()).ifPresent(document::setCurrency);
        ofNullable(template.getCostRub()).ifPresent(document::setCostRub);
        ofNullable(template.getSettlementType()).ifPresent(document::setSettlementType);
        ofNullable(template.getDeterminingCost()).ifPresent(document::setDeterminingCost);
        ofNullable(template.getConditionIntoForce()).ifPresent(document::setConditionIntoForce);
        ofNullable(template.getPreparedByContractor()).ifPresent(document::setPreparedByContractor);
        ofNullable(template.getUrgent()).ifPresent(document::setUrgent);
        ofNullable(template.getProtocolDisagreements()).ifPresent(document::setProtocolDisagreements);
        ofNullable(template.getPaper()).ifPresent(document::setPaper);
        ofNullable(template.getProtocolApproveDisagreements()).ifPresent(document::setProtocolApproveDisagreements);
        ofNullable(template.getCurator()).ifPresent(document::setCurator);
        ofNullable(template.getSignatory()).ifPresent(document::setSignatory);
        ofNullable(template.getWarrantName()).ifPresent(document::setWarrantName);
        ofNullable(template.getSigningDate()).ifPresent(document::setSigningDate);
        ofNullable(template.getAgreementDate()).ifPresent(document::setAgreementDate);
        ofNullable(template.getDurationFromDate()).ifPresent(document::setDurationFromDate);
        ofNullable(template.getDurationToDate()).ifPresent(document::setDurationToDate);
        ofNullable(template.getCompletedDate()).ifPresent(document::setCompletedDate);
        ofNullable(template.getSheetsAmount()).ifPresent(document::setSheetsAmount);
        ofNullable(template.getAnnexSheetsAmount()).ifPresent(document::setAnnexSheetsAmount);
        ofNullable(template.getNotes()).ifPresent(document::setNotes);
        ofNullable(template.getDealWithInterest()).ifPresent(document::setDealWithInterest);
        ofNullable(template.getGreatlyDeal()).ifPresent(document::setGreatlyDeal);
        ofNullable(template.getBigDeal()).ifPresent(document::setBigDeal);
        ofNullable(template.getPropertyTransfer()).ifPresent(document::setPropertyTransfer);
        ofNullable(template.getOfficialRegistration()).ifPresent(document::setOfficialRegistration);
        ofNullable(template.getTerminationDate()).ifPresent(document::setTerminationDate);
        ofNullable(template.getTerminationReason()).ifPresent(document::setTerminationReason);

        template.getContractors().forEach(sourceContractor -> {
            final ContractDocumentContractor contractor = new ContractDocumentContractor();
            contractor.setNew(true);
            contractor.setId(UUID.randomUUID().toString());
            contractor.setDocument(document);
            ofNullable(sourceContractor.getContractor()).ifPresent(contractor::setContractor);
            document.getContractors().add(contractor);
            storeContext.add(contractor);
        });

        commonDocumentAttachmentCopier.copy(template, document, storeContext);
        approvalQueueService.copyLastIteration(template, document, storeContext);
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
