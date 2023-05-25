package ru.croc.ctp.cmf.sedproject.document;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import ru.croc.ctp.cmf.sedproject.document.warrant.WarrantDocumentConfig;

/**
 * Конфигурация подсистемы работы с документами.
 */
@Configuration
@Import({ WarrantDocumentConfig.class })
public class DocumentConfig {

}
