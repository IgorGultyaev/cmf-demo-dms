package ru.croc.ctp.cmf.demodms.document.incoming.search;

import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.QIncomingDocument;
import ru.croc.ctp.cmf.dms.search.index.SmartSearchSecurityParamProvider;
import ru.croc.ctp.cmf.security.permission.AclSupported;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Реализация провайдера информации о сущностях, ссылающихся на переданные ACL для входящего документа.
 * 
 * @author Vladislav Volokh
 */
@Component
public class IncomingDocumentSmartSearchSecurityParamProvider implements SmartSearchSecurityParamProvider {

    @Autowired
    private JPQLQueryFactory jpqlQueryFactory;

    @Override
    public List<Class<? extends AclSupported<?>>> getSupportedTypes() {
        return Collections.singletonList(IncomingDocument.class);
    }

    @Override
    public Map<Class<? extends AclSupported<?>>, List<? extends Serializable>> getItemToIndex(List<String> aclIds) {
        List<? extends Serializable> ids = jpqlQueryFactory.select(QIncomingDocument.incomingDocument.id)
                .from(QIncomingDocument.incomingDocument)
                .where(QIncomingDocument.incomingDocument.aclId.in(aclIds))
                .fetch();
        return Collections.singletonMap(IncomingDocument.class, ids);
    }
}
