package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

import static ru.croc.ctp.cmf.security.permission.conveyer.ExcludingObjectsCmfSecurityConveyerOperationWrapper.newExcludingObjectsWrapper;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.core.jpa.StoreContextBuilder;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.repo.ContractDocumentRepository;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.repo.EmployeePositionRepository;
import ru.croc.ctp.cmf.process.ProcessMethod;
import ru.croc.ctp.jxfw.core.store.StoreContext;
import ru.croc.ctp.jxfw.core.store.UnitOfWorkMultiStoreService;

/**
 * Обработчик, содержащий бизнес логику автоматических действий (включая разрешение условия) подпроцесса регистрации
 * документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.29
 */
@Component("processContractDocumentRegistrationHandler")
public class ContractDocumentProcessRegistrationHandler {

    /**
     * Репозиторий работы с документом Договор.
     */
    private final ContractDocumentRepository documentRepository;

    /**
     * Репозиторий работы с сотрудниками в должности.
     */
    private final EmployeePositionRepository employeePositionRepository;

    /**
     * Сервис сохранения UoW.
     */
    private final UnitOfWorkMultiStoreService storeService;

    /**
     * Constructor.
     * 
     * @param documentRepository
     *            репозиторий работы с документом Договор
     * @param employeePositionRepository
     *            репозиторий работы с сотрудниками в должности
     * @param storeService
     *            сервис сохранения UoW
     */
    public ContractDocumentProcessRegistrationHandler(final ContractDocumentRepository documentRepository,
            final EmployeePositionRepository employeePositionRepository,
            final UnitOfWorkMultiStoreService storeService) {
        this.documentRepository = documentRepository;
        this.employeePositionRepository = employeePositionRepository;
        this.storeService = storeService;
    }

    /**
     * Устанавливает регистратора документа Договор.
     * 
     * @param documentId
     *            идентификатор документа, в котором устанавливается регистратор
     * @param registratorId
     *            идентификатор сотрудника в должности, устанавливаемого в качестве регистратора
     */
    @Transactional
    @ProcessMethod
    public void assignRegistrator(final String documentId, final String registratorId) {
        final ContractDocument document = documentRepository.findById(documentId).get();
        final EmployeePosition registrator = employeePositionRepository.findById(registratorId).get();
        document.setRegistrator(registrator);
        final StoreContext context = StoreContextBuilder.newStoreContextBuilder().addDomain(document).build();
        newExcludingObjectsWrapper(context).exclude(document);
        storeService.store(context);
    }
}
