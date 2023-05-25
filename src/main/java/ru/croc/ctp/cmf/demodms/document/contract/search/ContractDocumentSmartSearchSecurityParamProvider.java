package ru.croc.ctp.cmf.demodms.document.contract.search;

import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.QContractDocument;
import ru.croc.ctp.cmf.dms.search.index.SmartSearchSecurityParamProvider;
import ru.croc.ctp.cmf.security.permission.AclSupported;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Реализация провайдера информации о сущностях, ссылающихся на переданные ACL для документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.27
 */
@Component
public class ContractDocumentSmartSearchSecurityParamProvider implements SmartSearchSecurityParamProvider {

    @Autowired
    private JPQLQueryFactory jpqlQueryFactory;

    @Override
    public List<Class<? extends AclSupported<?>>> getSupportedTypes() {
        return Collections.singletonList(ContractDocument.class);
    }

    @Override
    public Map<Class<? extends AclSupported<?>>, List<? extends Serializable>> getItemToIndex(List<String> aclIds) {
        List<? extends Serializable> ids = jpqlQueryFactory.select(QContractDocument.contractDocument.id)
                .from(QContractDocument.contractDocument)
                .where(QContractDocument.contractDocument.aclId.in(aclIds))
                .fetch();
        return Collections.singletonMap(ContractDocument.class, ids);
    }
}
