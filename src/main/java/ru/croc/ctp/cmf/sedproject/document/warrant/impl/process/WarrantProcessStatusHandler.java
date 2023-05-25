package ru.croc.ctp.cmf.sedproject.document.warrant.impl.process;

import static java.util.Collections.singletonList;
import static java.util.Objects.requireNonNull;
import static ru.croc.ctp.cmf.dms.security.permission.DmsObjectPermission.OBPERM_READ;
import static ru.croc.ctp.cmf.sedproject.document.warrant.security.WarrantAclPurpose.WAP_CONFIDANT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.document.DocumentStatusOperationService;
import ru.croc.ctp.cmf.security.permission.ObjectPermissionService;
import ru.croc.ctp.cmf.sedproject.document.warrant.WarrantStatusSystemName;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.repo.WarrantDocumentRepository;

/**
 * Сервис, предоставляющий методы перевода доверенности, идущей по процессу, в одно из её состояний.
 */
@Component("processWarrantStatusHandler")
public class WarrantProcessStatusHandler {

    /**
     * Сервис операций над статусом документа.
     */
    @Autowired
    DocumentStatusOperationService statusOperationService;

    /**
     * Сервис работы с правами на объекты системы.
     */
    @Autowired
    ObjectPermissionService objectPermissionService;

    /**
     * Репозиторий работы с доверенностью.
     */
    @Autowired
    WarrantDocumentRepository documentRepository;

    /**
     * Перевод доверенности в состояние "Отменен".
     *
     * @param warrantId
     *            идентификатор доверенности
     */
    public void switchToCancelled(final String warrantId) {
        statusOperationService.switchTo(warrantId, WarrantStatusSystemName.WSSN_CANCELLED);
    }

    /**
     * Перевод доверенности в состояние "Действует".
     *
     * @param warrantId
     *            идентификатор доверенности
     */
    @Transactional
    public void switchToActive(final String warrantId) {
        statusOperationService.switchTo(warrantId, WarrantStatusSystemName.WSSN_ACTIVE);

        grantReadAccessToConfidant(warrantId);
    }

    /**
     * Выдаёт права на чтение документа доверенному лицу документа.
     * 
     * @param warrantId
     *            идентификатор доверенности
     */
    void grantReadAccessToConfidant(final String warrantId) {
        final WarrantDocument document = documentRepository.findById(warrantId).get();
        final EmployeePosition confidant = requireNonNull(document.getConfidant());
        objectPermissionService.saveAcls(singletonList(objectPermissionService.newAclItemLeafBuilder(document)
                .withAccessor(confidant)
                .withAclPurpose(WAP_CONFIDANT)
                .withAllow(OBPERM_READ)
                .build()));
    }

    /**
     * Перевод доверенности в состояние "Нотариальное заверение".
     *
     * @param warrantId
     *            идентификатор доверенности
     */
    public void switchToNotarization(final String warrantId) {
        statusOperationService.switchTo(warrantId, WarrantStatusSystemName.WSSN_NOTARIZATION);
    }
}
