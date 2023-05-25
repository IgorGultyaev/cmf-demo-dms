package ru.croc.ctp.cmf.demodms.document.impl.process;

import static org.apache.commons.lang3.StringUtils.isEmpty;
import static ru.croc.ctp.cmf.dms.audit.DmsAuditEventTypeSystemName.AETSN_REGISTERED;
import static ru.croc.ctp.cmf.security.permission.conveyer.ExcludingObjectsCmfSecurityConveyerOperationWrapper.newExcludingObjectsWrapper;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.core.jpa.StoreContextBuilder;
import ru.croc.ctp.cmf.core.regnumber.RegNumberGenerationContextFactory;
import ru.croc.ctp.cmf.dms.audit.raw.RawAuditCreatorFactory;
import ru.croc.ctp.cmf.dms.document.domain.AbstractDocument;
import ru.croc.ctp.cmf.dms.document.domain.repo.AbstractDocumentRepository;
import ru.croc.ctp.cmf.process.ProcessMethod;
import ru.croc.ctp.jxfw.core.store.StoreContext;
import ru.croc.ctp.jxfw.core.store.UnitOfWorkMultiStoreService;

import java.time.LocalDate;

/**
 * Обработчик, содержащий бизнес логику автоматических действий (включая разрешение условия) общего подпроцесса
 * регистрации документа.
 *
 * @author Dmitry Malenok
 */
@Component("processDocumentRegistrationHandler")
public class DocumentProcessRegistrationHandler {

    /**
     * Репозиторий работы с документом.
     */
    private final AbstractDocumentRepository documentRepository;

    /**
     * Фабрика объектов контекста генерации регистрационного номера.
     */
    private final RegNumberGenerationContextFactory regNumberGenerationContextFactory;

    /**
     * Сервис сохранения UoW.
     */
    private final UnitOfWorkMultiStoreService storeService;

    /**
     * Фабрика создателей записи оперативного аудита.
     */
    private final RawAuditCreatorFactory<?> auditCreatorFactory;

    /**
     * Constructor.
     * 
     * @param documentRepository
     *            репозиторий работы с документом
     * @param regNumberGenerationContextFactory
     *            фабрика объектов контекста генерации регистрационного номера
     * @param storeService
     *            сервис сохранения UoW
     * @param auditCreatorFactory
     *            фабрика создателей записи оперативного аудита
     */
    public DocumentProcessRegistrationHandler(AbstractDocumentRepository documentRepository,
            RegNumberGenerationContextFactory regNumberGenerationContextFactory,
            UnitOfWorkMultiStoreService storeService,
            RawAuditCreatorFactory<?> auditCreatorFactory) {
        this.documentRepository = documentRepository;
        this.regNumberGenerationContextFactory = regNumberGenerationContextFactory;
        this.storeService = storeService;
        this.auditCreatorFactory = auditCreatorFactory;
    }

    /**
     * Выполняет логику активности по регистрации документа.
     *
     * @param documentId
     *            идентификатор обрабатываемого документа
     */
    @Transactional
    @ProcessMethod
    public void register(final String documentId) {
        final StoreContext context = StoreContextBuilder.newStoreContextBuilder().build();
        final AbstractDocument document = documentRepository.findById(documentId).get();
        if (isEmpty(document.getRegNumber())) {
            final String regNumber =
                    regNumberGenerationContextFactory.newContext().setObject(document).generateRegNumber();
            document.setRegNumber(regNumber);
            context.add(document);
            newExcludingObjectsWrapper(context).exclude(document);
        }
        if (document.getRegDate() == null) {
            document.setRegDate(LocalDate.now());
            context.add(document);
            newExcludingObjectsWrapper(context).exclude(document);
        }

        if (!context.getDomainObjects().isEmpty()) {
            storeService.store(context);
            auditCreatorFactory.newAuditCreator().withActionType(AETSN_REGISTERED).withObject(document).create();
        }
    }
}
