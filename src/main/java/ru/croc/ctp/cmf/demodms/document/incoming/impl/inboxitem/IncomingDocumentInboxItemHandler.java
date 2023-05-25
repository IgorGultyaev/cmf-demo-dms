package ru.croc.ctp.cmf.demodms.document.incoming.impl.inboxitem;

import static java.util.Objects.requireNonNull;
import static org.springframework.transaction.annotation.Propagation.MANDATORY;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.service.IncomingDocumentService;
import ru.croc.ctp.cmf.dms.document.domain.DocumentAttachment;
import ru.croc.ctp.cmf.dms.task.domain.InboxItem;
import ru.croc.ctp.cmf.dms.task.domain.repo.InboxItemRepository;
import ru.croc.ctp.cmf.task.inboxitem.InboxItemHandler;
import ru.croc.ctp.jxfw.core.domain.DomainObject;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Обработчик модели, создающий и обновляющий сущности {@link InboxItem} для переданной модели входящего документа.
 */
@Component(IncomingDocumentInboxItemHandler.NAME)
public class IncomingDocumentInboxItemHandler implements InboxItemHandler<IncomingDocument, String> {

    /**
     * Идентификатор бина для ссылки.
     */
    public static final String NAME = "ru.croc.ctp.cmf.dms.task.inboxitem.impl.IncomingDocumentInboxItemHandler";

    /**
     * Репозиторий работы с объектами сущности, хранящей информацию об объекте задачи для отображения в inbox.
     */
    @Autowired
    InboxItemRepository inboxItemRepository;

    /**
     * Сервис работы с входящими документами.
     */
    @Autowired
    IncomingDocumentService incomingDocumentService;

    @Transactional(propagation = MANDATORY)
    @Override
    public void process(IncomingDocument model, List<? extends DomainObject<?>> uow) {

        final String modelId = requireNonNull(model.getId());
        final InboxItem storedInboxItem = inboxItemRepository.findById(modelId).orElse(null);

        final InboxItem inboxItem;

        if (model.isRemoved()) {
            if (storedInboxItem != null) {
                inboxItemRepository.delete(storedInboxItem);
            }
            return;
        }

        if (storedInboxItem == null) {
            inboxItem = new InboxItem();
            inboxItem.setId(model.getId());
            inboxItem.setEntityType(model.getClass().getName());
        } else {
            inboxItem = storedInboxItem;
        }

        updateAndSaveInboxItem(inboxItem, model, uow);
    }

    /**
     * На основе переданной модели документа обновляет информацию в <code>inboxItem</code> и сохраняет её в базе.
     *
     * @param inboxItem
     *            обновляемая сущность
     * @param model
     *            документ, на основе данных из которой производится обновление
     * @param uow
     *            сохраняемый UoW
     */
    // TODO: могут ли задачи этого процесса быть срочными? что еще может обновляться?
    void updateAndSaveInboxItem(final InboxItem inboxItem,
            final IncomingDocument model,
            final List<? extends DomainObject<?>> uow) {
        inboxItem.setDescription(model.getSummary());
        inboxItem.setDocumentKind(model.getDocumentKind());
        inboxItem.setDocumentType(model.getDocumentType());
        inboxItem.setHasAttachment(resolveHasAttachments(model, uow));
        inboxItem.setIdentifier(model.getIdentifier());
        inboxItem.setRegNumber(model.getRegNumber());
        inboxItem.setDocumentRegDate(model.getRegDate());
        inboxItem.setHasAttachment(resolveHasAttachments(model, uow));
        inboxItemRepository.save(inboxItem);
    }

    /**
     * Определяет наличие вложений у модели документа.
     * <p/>
     * Здесь нельзя просто взять и посмотреть список вложений у документа, т.к. jxfw в случае, если операции
     * производятся только на вложением, не обновляет список вложений документа. Потому пытаемся определить наличие
     * новых вложений по содержимому UoW.
     * <p/>
     * Удалить, когда поправят JXFW-638.
     *
     * @param model
     *            документ, на основе данных из которой производится обновление
     * @param uow
     *            сохраняемый UoW
     * @return <code>true</code> - у документа есть вложения, иначе - <code>false</code>
     */
    boolean resolveHasAttachments(final IncomingDocument model, final List<? extends DomainObject<?>> uow) {
        final Set<String> attachmentsIds = model.getAttachment()
                .stream()
                .filter(attachment -> attachment != null)
                .map(attachment -> attachment.getId())
                .collect(Collectors.toSet());
        uow.stream()
                .filter(object -> object instanceof DocumentAttachment)
                .map(object -> (DocumentAttachment) object)
                .filter(attachment -> (StringUtils.equals(attachment.getDocument().getId(), model.getId())))
                .forEach(attachment -> {
                    if (attachment.isRemoved()) {
                        attachmentsIds.remove(attachment.getId());
                    } else {
                        attachmentsIds.add(attachment.getId());
                    }
                });
        final boolean hasAttachments = !attachmentsIds.isEmpty();
        return hasAttachments;
    }
}
