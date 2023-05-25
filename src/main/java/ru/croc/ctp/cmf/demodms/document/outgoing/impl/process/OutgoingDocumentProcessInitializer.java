package ru.croc.ctp.cmf.demodms.document.outgoing.impl.process;

import static java.util.Objects.requireNonNull;
import static java.util.Optional.ofNullable;
import static ru.croc.ctp.cmf.core.jpa.StoreContextBuilder.newStoreContextBuilder;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_CREATION;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.lang.exception.NestableRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.core.regnumber.RegNumberGenerationContextFactory;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentAddressee;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentSubType;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentTemplate;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.service.DocumentTemplateService;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.QEmployeePosition;
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
 * Сервис, предоставляющий логику исполнения автоматических шагов по созданию исходящего документа.
 *
 * @author Dmitry Malenok
 */
@SuppressFBWarnings("CE_CLASS_ENVY") // Здесь производится инициализация кучи полей.
@Component("processOutgoingDocumentInitializer")
class OutgoingDocumentProcessInitializer {

    /**
     * Сервис работы с шаблонами документов.
     */
    @Autowired
    DocumentTemplateService documentTemplateService;

    /**
     * Сервис работы с сотрудниками в должности.
     */
    @Autowired
    EmployeePositionService employeePositionService;

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
     * Фабрика объектов контекста генерации регистрационного номера.
     */
    @Autowired
    RegNumberGenerationContextFactory regNumberGenerationContextFactory;

    /**
     * Репозиторий работы со статусами документов.
     */
    @Autowired
    DocumentStatusRepository documentStatusRepository;

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
     * Создаёт по переданному шаблону и сохраняет исходящий документ.
     *
     * @param templateId
     *            идентификатор шаблона исходящего документа
     * @return идентификатор созданного документа
     */
    @Transactional
    @ProcessMethod
    public String create(final String templateId) {
        final EmployeePosition currentUserEmployeePosition = resolveCurrentUserEmployeePosition();

        final DocumentTemplate documentTemplate = documentTemplateService.getObjectById(templateId);
        final DocumentSubType documentType = documentTemplate.getParent();

        final OutgoingDocument document = new OutgoingDocument();
        document.setId(UUID.randomUUID().toString());
        document.setNew(true);
        document.setCreationDate(LocalDate.now());
        document.setAuthor(currentUserEmployeePosition);
        document.setPerformer(currentUserEmployeePosition);
        document.setDocumentType(documentType);
        document.setOrganization(documentTemplate.getCompany());
        document.setStatus(documentStatusRepository.findOneBySystemName(DSSN_CREATION));
        document.setIdentifier(regNumberGenerationContextFactory.newContext()
                .setObject(document)
                // TODO: использовать константу
                .setType("identifier")
                .generateRegNumber());
        document.setAclId("acl_" + document.getId());
        final StoreContext storeContext = newStoreContextBuilder().addDomain(document).build();
        copyFromTemplate(documentTemplate, document, storeContext);
        unitOfWorkService.store(storeContext);

        final String documentId = document.getId();
        return requireNonNull(documentId);
    }

    /**
     * Копирование информации из шаблона документа в создаваемый документ.
     * 
     * @param documentTemplate
     *            шаблон документа
     * @param document
     *            создаваемый документ
     * @param storeContext
     *            контекст сохранения
     */
    protected void copyFromTemplate(final DocumentTemplate documentTemplate,
            final OutgoingDocument document,
            StoreContext storeContext) {
        final OutgoingDocument template = (OutgoingDocument) requireNonNull(documentTemplate.getDocument());
        commonDocumentAttributesCopier.copy(template, document, storeContext);
        ofNullable(template.getPaper()).ifPresent(value -> document.setPaper(value));
        ofNullable(template.getRegistrator()).ifPresent(value -> document.setRegistrator(value));
        ofNullable(template.getSignatory()).ifPresent(value -> document.setSignatory(value));
        ofNullable(template.getUrgent()).ifPresent(value -> document.setUrgent(value));
        ofNullable(template.getSheetsAmount()).ifPresent(value -> document.setSheetsAmount(value));
        ofNullable(template.getAnnexSheetsAmount()).ifPresent(value -> document.setAnnexSheetsAmount(value));
        template.getAddressees().forEach(sourceAddressee -> {
            final OutgoingDocumentAddressee addressee = new OutgoingDocumentAddressee();
            addressee.setNew(true);
            addressee.setId(UUID.randomUUID().toString());
            addressee.setDocument(document);
            ofNullable(sourceAddressee.getAddress()).ifPresent(value -> addressee.setAddress(value));
            ofNullable(sourceAddressee.getCorrespondent()).ifPresent(value -> addressee.setCorrespondent(value));
            ofNullable(sourceAddressee.getEmail()).ifPresent(value -> addressee.setEmail(value));
            ofNullable(sourceAddressee.getFax()).ifPresent(value -> addressee.setFax(value));
            ofNullable(sourceAddressee.getDeliveryOption()).ifPresent(value -> addressee.setDeliveryOption(value));
            document.getAddressees().add(addressee);
            storeContext.add(addressee);
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
