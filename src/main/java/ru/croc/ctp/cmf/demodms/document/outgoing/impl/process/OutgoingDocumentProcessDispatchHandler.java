package ru.croc.ctp.cmf.demodms.document.outgoing.impl.process;

import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.DeliveryOptionSystemName.DELIVERYTYPE_SED;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.DeliveryOption;
import ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.repo.DeliveryOptionRepository;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentDeliveryStatus;
import ru.croc.ctp.cmf.demodms.document.domain.QOutgoingDocumentAddressee;
import ru.croc.ctp.cmf.demodms.document.domain.repo.OutgoingDocumentRepository;
import ru.croc.ctp.cmf.process.ProcessMethod;

import java.text.MessageFormat;

/**
 * Обработчик, содержащий бизнес логику автоматических действий (включая разрешение условия) общего подпроцесса отправки
 * исходящего документа.
 * 
 * @author Dmitry Malenok
 */
@Component("processOutgoingDocumentDispatchHandler")
public class OutgoingDocumentProcessDispatchHandler {

    /**
     * Репозиторий работы с документом.
     */
    @Autowired
    OutgoingDocumentRepository documentRepository;

    /**
     * Репозиторий способов отправки/доставки.
     */
    @Autowired
    DeliveryOptionRepository deliveryOptionRepository;

    @Autowired
    private JPQLQueryFactory queryFactory;

    /**
     * Выполняет логику активности по автоматической отправке документов.
     * 
     * @param documentId
     *            идентификатор исходящего документа
     */
    public void sendDocuments(final String documentId) {
        // TODO: наполнить
    }

    /**
     * Проставляет адресатам документа статус "На отправке".
     * 
     * @param documentId
     *            идентификатор исходящего документа
     */
    @Transactional
    @ProcessMethod
    public void setDeliveryStatusesToAddressees(final String documentId) {
        documentRepository.findById(requireNonNull(documentId))
                .orElseThrow(() -> new IllegalArgumentException(
                        MessageFormat.format("Document with the pointed ID is not found id={0}", documentId)));

        QOutgoingDocumentAddressee outgoingDocumentAddressee = QOutgoingDocumentAddressee.outgoingDocumentAddressee;
        BooleanBuilder builder = new BooleanBuilder(outgoingDocumentAddressee.document.id.eq(documentId));

        DeliveryOption deliveryOption = deliveryOptionRepository.findOneBySystemName(DELIVERYTYPE_SED);
        if (deliveryOption != null) {
            builder.and(outgoingDocumentAddressee.deliveryOption.id.eq(deliveryOption.getId()));
        }

        queryFactory.update(outgoingDocumentAddressee)
                .set(outgoingDocumentAddressee.deliveryStatus,
                        OutgoingDocumentDeliveryStatus.METADATA.convertToInt(OutgoingDocumentDeliveryStatus.SENDING))
                .where(builder)
                .execute();
    }

    /**
     * Определяет, требуется ли создание задачи на ручную отправку документа.
     * 
     * @param documentId
     *            идентификатор исходящего документа
     * @return <code>true</code> - требуется, иначе - <code>false</code>
     */
    public boolean checkIfUserTaskRequired(final String documentId) {
        // TODO: наполнить
        return true;
    }
}
