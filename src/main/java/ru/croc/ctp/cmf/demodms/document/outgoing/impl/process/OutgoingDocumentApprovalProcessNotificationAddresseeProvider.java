package ru.croc.ctp.cmf.demodms.document.outgoing.impl.process;

import static java.util.Collections.singletonList;

import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.document.approval.ApprovalProcessNotificationAddresseeProvider;

import java.util.Collection;

/**
 * Поставщик информации об адресатах, которым необходимо рассылать нотификации о процессе согласования исходящего
 * документа.
 *
 * @author Dmitry Malenok
 */
@Component(ApprovalProcessNotificationAddresseeProvider.APNAP_BEAN_NAME_PREFIX + OutgoingDocument.TYPE_NAME)
public class OutgoingDocumentApprovalProcessNotificationAddresseeProvider
        implements ApprovalProcessNotificationAddresseeProvider<OutgoingDocument> {

    @Override
    public Collection<? extends EmployeePosition>
            resolveCompleteApprovalProcessNotificationAddressees(final OutgoingDocument approvingObject) {
        return singletonList(approvingObject.getPerformer());
    }

    @Override
    public Collection<? extends EmployeePosition>
            resolveCompleteApprovalTaskNotificationAddressees(final OutgoingDocument approvingObject) {
        return singletonList(approvingObject.getPerformer());
    }
}
