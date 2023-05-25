package ru.croc.ctp.cmf.demodms.document.incoming.impl;

import org.camunda.bpm.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentControllerApiPath;
import ru.croc.ctp.jxfw.core.facade.webclient.DomainResult;

import java.text.MessageFormat;

/**
 * Контроллер операций над входящими документами.
 */
@RestController()
@RequestMapping(IncomingDocumentControllerApiPath.PATH_INCOMING)
public class IncomingDocumentOperationController {

    private static final String MESSAGE_DOCUMENT_CANCEL = "MESSAGE_DOCUMENT_CANCEL_{0}";

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
    @RequestMapping(value = IncomingDocumentControllerApiPath.RELATIVE_INCOMING_REVOKE,
            method = { RequestMethod.POST, RequestMethod.GET })
    @Transactional
    public ResponseEntity<DomainResult>
            sendCommissions(@RequestParam(name = "documentId", required = true) final String documentId) {
        processRuntimeService.createMessageCorrelation(MessageFormat.format(MESSAGE_DOCUMENT_CANCEL, documentId))
                .correlateExclusively();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
