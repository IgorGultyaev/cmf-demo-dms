package ru.croc.ctp.cmf.demodms.document.contract.impl.controller;

import org.camunda.bpm.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.croc.ctp.cmf.demodms.document.contract.ContractDocumentControllerApiPath;
import ru.croc.ctp.jxfw.core.facade.webclient.DomainResult;

import java.text.MessageFormat;

/**
 * Контроллер операций над документами Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.29
 */
@RestController()
@RequestMapping(ContractDocumentControllerApiPath.PATH_CONTRACT)
public class ContractDocumentOperationController {

    /**
     * Шаблон сообщения для Аннулирования документа Договор.
     * <p/>
     * Параметры:
     * <ol start="0">
     * <li>Идентификатор документа Договор, который должен быть аннулирован.
     * </ol>
     */
    private static final String MESSAGE_CONTRACT_DOCUMENT_REVOKE = "MESSAGE_CONTRACT_DOCUMENT_REVOKE_{0}";

    /**
     * Сервис работы с движком процессов.
     */
    @Autowired
    private RuntimeService processRuntimeService;

    /**
     * Метод обработки команды аннулирования документа.
     *
     * @param documentId
     *            идентификатор документа
     * @return статус
     */
    @RequestMapping(value = ContractDocumentControllerApiPath.RELATIVE_CONTRACT_REVOKE,
            method = { RequestMethod.POST, RequestMethod.GET })
    @Transactional
    public ResponseEntity<DomainResult>
            revokeDocument(@RequestParam(name = "documentId", required = true) final String documentId) {
        processRuntimeService
                .createMessageCorrelation(MessageFormat.format(MESSAGE_CONTRACT_DOCUMENT_REVOKE, documentId))
                .correlateExclusively();

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
