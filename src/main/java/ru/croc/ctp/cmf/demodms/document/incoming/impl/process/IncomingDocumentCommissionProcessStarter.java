package ru.croc.ctp.cmf.demodms.document.incoming.impl.process;

import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentProcessDefinitionName.PROCESS_INCOMING_DOCUMENT_MAIN;
import static ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_EXECUTION;
import static ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddresseeStatus.IDAS_ON_REVIEW;

import com.google.common.collect.ImmutableSet;
import org.apache.commons.lang.exception.NestableRuntimeException;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddressee;
import ru.croc.ctp.cmf.dms.commission.CommissionProcessStarter;
import ru.croc.ctp.cmf.dms.commission.domain.Commission;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.QEmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.service.EmployeePositionService;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * Сущность, запускающая процесс работы над поручением для входящего документа.
 */
@Order
@Component
public class IncomingDocumentCommissionProcessStarter implements CommissionProcessStarter<IncomingDocument, String> {

    /**
     * Множество классов сущностей, для которых может быть запущен процесс.
     */
    @SuppressWarnings("null")
    private static final ImmutableSet<Class<? extends IncomingDocument>> SUPPORTED_OBJECT_TYPES =
            ImmutableSet.of(IncomingDocument.class);

    private static final String MESSAGE_START_BY_COMMISSION = "MESSAGE_INCOMING_DOCUMENT_START_BY_COMMISSION";

    private static final String MESSAGE_NEW_COMMISSION_TEMPLATE = "MESSAGE_INCOMING_DOCUMENT_NEW_COMMISSION_{0}";

    private static final String MESSAGE_NEW_COMMISSION_BY_REVIEWER_TEMPLATE =
            "MESSAGE_INCOMING_DOCUMENT_NEW_COMMISSION_BY_REVIEWER_{0}";

    /**
     * Сервис работы с движком процессов.
     */
    @Autowired
    private RuntimeService processRuntimeService;

    /**
     * Сервис работы с сотрудниками.
     */
    @Autowired
    EmployeePositionService employeePositionService;

    @Override
    public void startCommissionProcess(Commission commission, IncomingDocument parentObject) {
        final EmployeePosition currentEmployeePosition = resolveCurrentUserEmployeePosition();
        final IncomingDocumentAddressee currentIncomingDocumentAddressee = parentObject.getAddressees()
                .stream()
                .filter(incomingDocumentAddressee -> Objects.equals(incomingDocumentAddressee.getAddressee().getId(),
                        currentEmployeePosition.getId())
                        && incomingDocumentAddressee.getIncomingDocumentAddresseeStatus() == IDAS_ON_REVIEW)
                .findFirst()
                .orElse(null);

        if (currentIncomingDocumentAddressee != null) {
            sendCommissionForDocumentOnReview(commission, currentIncomingDocumentAddressee);
        } else {
            sendCommissionForDocument(parentObject, commission);
        }
    }

    private void sendCommissionForDocument(final IncomingDocument parentObject, final Commission commission) {
        ProcessInstance processInstance = processRuntimeService.createProcessInstanceQuery()
                .variableValueEquals("processObjectId", parentObject.getId())
                .processDefinitionKey(SUBPROCESS_INCOMING_DOCUMENT_EXECUTION)
                .singleResult();
        if (processInstance == null) {
            Map<String, Object> variables = new HashMap<>();
            variables.put("processObjectId", parentObject.getId());
            variables.put("commissionId", commission.getId());
            processRuntimeService.startProcessInstanceByMessage(MESSAGE_START_BY_COMMISSION,
                    PROCESS_INCOMING_DOCUMENT_MAIN,
                    variables);
        } else {
            processRuntimeService
                    .createMessageCorrelation(
                            MessageFormat.format(MESSAGE_NEW_COMMISSION_TEMPLATE, parentObject.getId()))
                    .setVariable("commissionId", commission.getId())
                    .correlateExclusively();
        }
    }

    private void sendCommissionForDocumentOnReview(final Commission commission,
            final IncomingDocumentAddressee addressee) {
        processRuntimeService
                .createMessageCorrelation(
                        MessageFormat.format(MESSAGE_NEW_COMMISSION_BY_REVIEWER_TEMPLATE, addressee.getId()))
                .setVariable("commissionId", commission.getId())
                .correlateExclusively();

    }

    @Override
    public Set<Class<? extends IncomingDocument>> getSupportedObjectTypes() {
        return SUPPORTED_OBJECT_TYPES;
    }

    /**
     * Определяет и возвращает для текущего сотрудника объект сотрудника в должности.
     *
     * @return для текущего сотрудника объект сотрудника в должности
     */
    protected EmployeePosition resolveCurrentUserEmployeePosition() {
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
