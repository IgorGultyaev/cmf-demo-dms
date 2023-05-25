package ru.croc.ctp.cmf.demodms.document.outgoing.impl.regnumber;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.core.regnumber.impl.AbstractPlaceholderResolver;
import ru.croc.ctp.cmf.dms.regnumber.impl.PlaceholderDescriptorCurrentYear;
import ru.croc.ctp.cmf.dms.regnumber.impl.PlaceholderDescriptorSubtypeNum;
import ru.croc.ctp.cmf.dms.regnumber.impl.PlaceholderDescriptorSystemTypeNum;
import ru.croc.ctp.cmf.dms.regnumber.impl.PlaceholderDescriptorTypeNum;

import javax.annotation.PostConstruct;

/**
 * Компонент, выбирающий для переданного placeholder'а необходимый PlaceholderEvaluator. Реализация для типа
 * OutgoingDocument демо-приложения.
 * 
 * @author Vladislav Volokh
 */
@Component
public class OutgoingDocumentPlaceholderResolver extends AbstractPlaceholderResolver {

    @Autowired
    private PlaceholderDescriptorCurrentYear year;

    @Autowired
    private PlaceholderDescriptorSubtypeNum subtypeNum;

    @Autowired
    private PlaceholderDescriptorTypeNum typeNum;

    @Autowired
    private PlaceholderDescriptorSignatoryCompanyCode signatoryCompanyCode;

    @Autowired
    private PlaceholderDescriptorSystemTypeNum systemTypeNum;

    @PostConstruct
    private void postConstruct() {
        descriptorMap.put(year.getDescriptor(), year);
        descriptorMap.put(subtypeNum.getDescriptor(), subtypeNum);
        descriptorMap.put(typeNum.getDescriptor(), typeNum);
        descriptorMap.put(signatoryCompanyCode.getDescriptor(), signatoryCompanyCode);
        descriptorMap.put(systemTypeNum.getDescriptor(), systemTypeNum);
    }
}
