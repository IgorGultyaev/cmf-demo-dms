package ru.croc.ctp.cmf.demodms.dictionary;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import ru.croc.ctp.cmf.demodms.dictionary.contractor.ContractorDictionaryConfig;
import ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.ContractRevokeReasonDictionaryConfig;
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.CorrespondentConfig;
import ru.croc.ctp.cmf.demodms.dictionary.currency.CurrencyDictionaryConfig;
import ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.DeliveryOptionDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.documentkind.DocumentKindDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.documenttype.DocumentTypeDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.employee.EmployeeDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.nomenclature.NomenclatureDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.OrgStructureDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.positiondescription.PositionDescriptionDictionaryConfig;
import ru.croc.ctp.cmf.dms.dictionary.security.DictionarySecurityConfig;
import ru.croc.ctp.cmf.dms.dictionary.user.UserDictionaryConfig;

/**
 * Конфигурация подсистемы справочников.
 * 
 * @author Dmitry Malenok
 */
@Configuration
@Import({ UserDictionaryConfig.class,
        EmployeeDictionaryConfig.class,
        OrgStructureDictionaryConfig.class,
        DeliveryOptionDictionaryConfig.class,
        PositionDescriptionDictionaryConfig.class,
        DocumentKindDictionaryConfig.class,
        DocumentTypeDictionaryConfig.class,
        DictionarySecurityConfig.class,
        CorrespondentConfig.class,
        NomenclatureDictionaryConfig.class,
        CurrencyDictionaryConfig.class,
        ContractRevokeReasonDictionaryConfig.class,
        ContractorDictionaryConfig.class })
public class DictionaryConfig {
}
