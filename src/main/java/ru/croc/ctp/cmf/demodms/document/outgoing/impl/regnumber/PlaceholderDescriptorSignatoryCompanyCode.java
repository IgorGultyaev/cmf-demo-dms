package ru.croc.ctp.cmf.demodms.document.outgoing.impl.regnumber;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.core.regnumber.PlaceholderDescriptor;
import ru.croc.ctp.cmf.core.regnumber.PlaceholderEvaluator;
import ru.croc.ctp.cmf.core.regnumber.RegNumberGenerationContext;

/**
 * Дескриптор placeholder'а, возвращающего код подразделения верхнего уровня (организации), к которому принадлежит
 * подписант.
 *
 * @author Vladislav Volokh
 */
@Component
public class PlaceholderDescriptorSignatoryCompanyCode implements PlaceholderDescriptor {

    @Autowired
    private PlaceholderEvaluatorSignatoryCompanyCode evaluator;

    @Override
    public String getDescriptor() {
        return "КОПодписанта";
    }

    @Override
    public String getTextDescription(RegNumberGenerationContext context) {
        return "Код подразделения верхнего уровня (организации), к которому принадлежит подписант";
    }

    @Override
    public PlaceholderEvaluator getEvaluator() {
        return evaluator;
    }
}
