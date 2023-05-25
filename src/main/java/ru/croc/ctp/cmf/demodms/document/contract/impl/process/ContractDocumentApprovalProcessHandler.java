package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

import static java.util.Collections.singletonList;
import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_APPROVEMENT;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_REFINEMENT;
import static ru.croc.ctp.cmf.demodms.document.DocumentStatusSystemName.DSSN_SIGNING;
import static ru.croc.ctp.cmf.security.permission.conveyer.ExcludingObjectsCmfSecurityConveyerOperationWrapper.newExcludingObjectsWrapper;

import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.repo.ContractDocumentRepository;
import ru.croc.ctp.cmf.dms.document.DocumentStatusOperationService;
import ru.croc.ctp.cmf.dms.document.approval.ApprovingObjectProcessHandler;
import ru.croc.ctp.cmf.dms.document.approval.ApprovingObjectProcessHandlerDispatcher;
import ru.croc.ctp.cmf.dms.document.approval.domain.ApprovalQueue;
import ru.croc.ctp.jxfw.core.domain.DomainObject;
import ru.croc.ctp.jxfw.core.domain.DomainObjectIdentity;
import ru.croc.ctp.jxfw.core.store.StoreContext;
import ru.croc.ctp.jxfw.jpa.hibernate.impl.util.ProxyHelper;

import java.text.MessageFormat;
import java.util.Collection;

/**
 * Обработчик операций процесса согласования документа Договор.
 * <p/>
 * TODO: избавиться от копипаста (сделать общее решение)<br/>
 * Копипаст из {@link ru.croc.ctp.cmf.demodms.document.outgoing.impl.process.OutgoingDocumentApprovalProcessHandler}
 *
 * @author Andrei Dubonos
 * @since 2019.03.29
 */
@Component("processContractDocumentApprovalHandler")
public class ContractDocumentApprovalProcessHandler implements ApprovingObjectProcessHandler {

    /**
     * Диспетчер обработчиков операций процесса согласования, связанных с согласуемым объектом.
     */
    private final ApprovingObjectProcessHandlerDispatcher approvingObjectProcessHandlerDispatcher;

    /**
     * Сервис операций над статусом документа.
     */
    private final DocumentStatusOperationService statusOperationService;

    /**
     * Репозиторий работы с документом Договор.
     */
    private final ContractDocumentRepository documentRepository;

    /**
     * Constructor.
     *
     * @param approvingObjectProcessHandlerDispatcher
     *            диспетчер обработчиков операций процесса согласования, связанных с согласуемым объектом
     * @param statusOperationService
     *            сервис операций над статусом документа
     * @param documentRepository
     *            репозиторий работы с документом Договор
     */
    public ContractDocumentApprovalProcessHandler(
            final ApprovingObjectProcessHandlerDispatcher approvingObjectProcessHandlerDispatcher,
            final DocumentStatusOperationService statusOperationService,
            final ContractDocumentRepository documentRepository) {
        this.approvingObjectProcessHandlerDispatcher = approvingObjectProcessHandlerDispatcher;
        this.statusOperationService = statusOperationService;
        this.documentRepository = documentRepository;
    }

    /**
     * Преобразует идентификатор документа Договор в строку, по которой можно однозначно восстановить полный
     * идентификатор документа Договор (DomainObjectIdentity).
     *
     * @param approvingObjectId
     *            идентификатор документа Договор
     * @return строку, по которой можно однозначно восстановить полный идентификатор документа Договор
     *         (DomainObjectIdentity)
     */
    public String createApprovingObjectIdentity(final String approvingObjectId) {
        // Обязательно читаем объект из репозитория, т.к. у этого типа документа могут быть и дочерние подтипы, идущие
        // по тому же процессу.
        return approvingObjectProcessHandlerDispatcher
                .approvingObjectIdentyToString(documentRepository.findById(approvingObjectId).get());
    }

    @Override
    public void beforeRefinement(final DomainObjectIdentity<String> processObjectIdentity, final StoreContext context) {
        statusOperationService.switchTo(requireNonNull(processObjectIdentity.getId()), DSSN_REFINEMENT, context);
        newExcludingObjectsWrapper(context).exclude(processObjectIdentity);
    }

    @Override
    public void beforeQueueStart(final DomainObjectIdentity<String> processObjectIdentity,
            final ApprovalQueue queue,
            final StoreContext context) {
        if (queue.getIteration() == null) {
            // Интересны только основные очереди.
            return;
        }
        // Обязательно распаковываем объект из репозитория, т.к. у этого типа документа могут быть и дочерние подтипы,
        // идущие по тому же процессу.
        final ContractDocument document = requireNonNull(ProxyHelper.initializeAndUnproxy(
                documentRepository.findById(requireNonNull(processObjectIdentity.getId())).get()));

        switch (queue.getQueueType()) {
            case APPROVE: {
                statusOperationService.switchTo(document, DSSN_APPROVEMENT, context);
                newExcludingObjectsWrapper(context).exclude(document);
                break;
            }
            case SIGN: {
                statusOperationService.switchTo(document, DSSN_SIGNING, context);
                newExcludingObjectsWrapper(context).exclude(document);
                break;
            }
            default: {
                throw new IllegalArgumentException(MessageFormat.format("Unsupported queue type of {0}", queue));
            }
        }
    }

    @Override
    public Collection<? extends DomainObject<?>>
            resolveRefineTaskAssigneeIds(final DomainObjectIdentity<String> processObjectIdentity) {
        return singletonList(
                documentRepository.findById(requireNonNull(processObjectIdentity.getId())).get().getPerformer());
    }
}
