package ru.croc.ctp.cmf.demodms.document.outgoing.impl;

import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.core.jpa.store.ResultObjectUpdater.newResultObjectUpdater;
import static ru.croc.ctp.cmf.dms.document.approval.domain.ApprovalQueueType.SIGN;

import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.core.jpa.service.BeforeJpaStoreEvent;
import ru.croc.ctp.cmf.core.jpa.store.ResultObjectUpdater;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.document.approval.domain.ApprovalEntityState;
import ru.croc.ctp.cmf.dms.document.approval.domain.ApprovalIteration;
import ru.croc.ctp.cmf.dms.document.approval.domain.ApprovalQueue;
import ru.croc.ctp.cmf.dms.document.approval.domain.Approver;
import ru.croc.ctp.cmf.dms.document.approval.domain.QApprovalIteration;
import ru.croc.ctp.cmf.dms.document.approval.domain.repo.ApprovalIterationRepository;
import ru.croc.ctp.jxfw.core.domain.DomainObject;
import ru.croc.ctp.jxfw.core.store.StoreContext;
import ru.croc.ctp.jxfw.core.store.events.BeforeStoreEvent;
import ru.croc.ctp.jxfw.jpa.hibernate.impl.util.ProxyHelper;

import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Nonnull;

/**
 * Установщик подписанта исходящего документа при изменении очередей подписания.
 *
 * @author Dmitry Malenok
 */
@Component
@Order(1000)
public class OutgoingDocumentSignerUpdateHandler {

    /**
     * Репозиторий работы с кругами согласования.
     */
    private final ApprovalIterationRepository approvalIterationRepository;

    /**
     * Constructor.
     * 
     * @param approvalIterationRepository
     *            репозиторий работы с кругами согласования
     */
    public OutgoingDocumentSignerUpdateHandler(final ApprovalIterationRepository approvalIterationRepository) {
        this.approvalIterationRepository = approvalIterationRepository;
    }

    /**
     * {@inheritDoc}.
     * <p/>
     * Осуществляет поиск документов, у которых изменился подписант или очередь подписания, вычисление нового подписанта
     * и его установка (если изменился).
     */
    @EventListener
    public void updateSignatory(final BeforeStoreEvent event) {
        final List<? extends DomainObject<?>> domainObjects = event.getStoreContext().getDomainObjects();
        @SuppressWarnings("null")
        @Nonnull
        final Map<?, ? extends DomainObject<?>> idToAcceptedObject =
                domainObjects.stream().collect(Collectors.toMap(object -> object.getId(), Function.identity()));

        final List<OutgoingDocument> documents = Stream
                .concat(domainObjects.stream()
                        .filter(object -> object instanceof Approver)
                        .map(object -> (Approver) object)
                        .map(approver -> approver.getQueue()),
                        domainObjects.stream()
                                .filter(object -> object instanceof ApprovalQueue)
                                .map(object -> (ApprovalQueue) object))
                .filter(queue -> SIGN == queue.getQueueType() && queue.getIteration() != null)
                .map(queue -> ProxyHelper.initializeAndUnproxy(queue.getIteration().getDocument()))
                .sequential()
                .distinct()
                .filter(document -> document instanceof OutgoingDocument)
                .map(document -> (OutgoingDocument) document)
                .collect(Collectors.toList());

        documents.forEach(document -> {
            processDocument(requireNonNull(document), event, idToAcceptedObject);
        });

    }

    /**
     * Проверяет изменился ли подписант у указанного документа, при изменении устанавливает нового.
     *
     * @param document
     *            проверяемый документ
     * @param event
     *            событие сохранения UoW
     * @param idToAcceptedObject
     *            таблица соответствия идентификаторов объектов из {@link BeforeJpaStoreEvent#getAcceptedOnlyObjects()}
     *            его значению.
     * @see OutgoingDocument#setSignatory(EmployeePosition)
     */
    void processDocument(final OutgoingDocument document,
            final BeforeStoreEvent event,
            final Map<?, ? extends DomainObject<?>> idToAcceptedObject) {
        final ApprovalIteration iteration = approvalIterationRepository
                .findOne(QApprovalIteration.approvalIteration.document.eq(document)
                        .and(QApprovalIteration.approvalIteration.state
                                .eq(ApprovalEntityState.METADATA.convertToInt(ApprovalEntityState.PLANNED))))
                .orElse(null);
        if (iteration == null) {
            return;
        }

        final List<ApprovalQueue> queues = iteration.getQueues();
        final StoreContext storeContext = requireNonNull(event.getStoreContext());
        Optional<ApprovalQueue> lastSignQueue = Optional.empty();
        for (final ListIterator<ApprovalQueue> queuesIt = queues.listIterator(queues.size()); !lastSignQueue.isPresent()
                && queuesIt.hasPrevious();) {
            final ApprovalQueue queue = queuesIt.previous();
            if (!queue.isRemoved() && SIGN == queue.getQueueType()) {
                lastSignQueue = Optional.of(queue);
            }
        }

        final Optional<EmployeePosition> lastSigner =
                lastSignQueue.map(queue -> resolveLastApprover(requireNonNull(queue))).orElseGet(Optional::empty);
        final Optional<EmployeePosition> previousSigner = Optional.ofNullable(document.getSignatory());
        if (!lastSigner.equals(previousSigner)) {
            final ResultObjectUpdater resultObjectUpdater = newResultObjectUpdater(storeContext);
            document.setSignatory(lastSigner.orElse(null));
            resultObjectUpdater.update(document, (object, dto) -> {
                dto.addProperty(OutgoingDocument.Property.SIGNATORY, lastSigner.map(item -> item.getId()).orElse(null));
            });
        }
    }

    /**
     * Определяет и возвращает последнего согласующего в очереди.
     *
     * @param queue
     *            очередь, для которой производится определение
     * @return контейнер, содержащий последнего согласующего в очереди, либо пустой контейнер, если такого нет
     */
    protected Optional<EmployeePosition> resolveLastApprover(final ApprovalQueue queue) {
        final List<Approver> approvers = queue.getApprovers();

        Optional<EmployeePosition> lastSigner = Optional.empty();
        for (final ListIterator<Approver> approversIt = approvers.listIterator(approvers.size()); approversIt
                .hasPrevious();) {
            final Approver approver = approversIt.previous();
            if (!approver.isRemoved()) {
                lastSigner = Optional.ofNullable(approver.getApprover());
                break;
            }
        }
        return lastSigner;
    }
}
