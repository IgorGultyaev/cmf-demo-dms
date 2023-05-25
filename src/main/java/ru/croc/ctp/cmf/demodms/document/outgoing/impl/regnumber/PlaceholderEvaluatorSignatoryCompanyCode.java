package ru.croc.ctp.cmf.demodms.document.outgoing.impl.regnumber;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Objects.requireNonNull;

import org.apache.commons.lang.Validate;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.core.regnumber.PlaceholderEvaluator;
import ru.croc.ctp.cmf.core.regnumber.RegNumberGenerationContext;
import ru.croc.ctp.cmf.core.regnumber.ValidationError;
import ru.croc.ctp.cmf.core.regnumber.impl.ValidationErrorBuilderImpl;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.AbstractOrgStructureElement;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Department;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.OrgStructureRootElement;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Position;

import java.util.Collection;
import java.util.Collections;

/**
 * Вычислитель placeholder'а, возвращающего код организации подписанта.
 * 
 * @author Vladislav Volokh
 */
@Component
public class PlaceholderEvaluatorSignatoryCompanyCode implements PlaceholderEvaluator {

    /**
     * Ошибка неверной структуры организации.
     */
    private static final String ERROR_INCORRECT_ORGANIZATIONAL_STRUCTURE =
            "Found root element before element of type Company - incorrect organizational structure (%s)";

    @Override
    public String evaluate(String placeholderParams, RegNumberGenerationContext context) {
        Object target = context.getObject();

        requireNonNull(target, "Object is null");

        OutgoingDocument document;

        checkArgument(target instanceof OutgoingDocument, "Target object is not of type OutgoingDocument");

        document = ((OutgoingDocument) context.getObject());

        AbstractOrgStructureElement orgStructureElement = document.getSignatory();
        requireNonNull(orgStructureElement, "Document signatory is null");

        while (!(orgStructureElement instanceof Company)) {
            if (orgStructureElement instanceof EmployeePosition) {
                orgStructureElement = ((EmployeePosition) orgStructureElement).getParent();
            } else if (orgStructureElement instanceof Position) {
                orgStructureElement = ((Position) orgStructureElement).getParent();
            } else {
                orgStructureElement = ((Department) orgStructureElement).getParent();
            }

            Validate.isTrue(!(orgStructureElement instanceof OrgStructureRootElement),
                    ERROR_INCORRECT_ORGANIZATIONAL_STRUCTURE,
                    orgStructureElement);

            requireNonNull(orgStructureElement);
        }

        return requireNonNull(((Company) orgStructureElement).getCode(),
                "Signatory's organisation has null organisation code");
    }

    @Override
    public Collection<ValidationError> validate(String placeholderParams, RegNumberGenerationContext context) {
        Object target = context.getObject();
        checkArgument(target instanceof OutgoingDocument, "Target object is not OutgoingDocument " + target);

        final OutgoingDocument document = (OutgoingDocument) target;

        AbstractOrgStructureElement orgStructureElement = document.getSignatory();
        if (orgStructureElement == null) {
            return Collections
                    .singletonList(new ValidationErrorBuilderImpl().setErrorMessage("Document signatory is null")
                            .setSeverity("ERROR")
                            .build());
        }

        while (!(orgStructureElement instanceof Company)) {
            if (orgStructureElement instanceof EmployeePosition) {
                orgStructureElement = ((EmployeePosition) orgStructureElement).getParent();
            } else if (orgStructureElement instanceof Position) {
                orgStructureElement = ((Position) orgStructureElement).getParent();
            } else {
                orgStructureElement = ((Department) orgStructureElement).getParent();
            }
            Validate.isTrue(!(orgStructureElement instanceof OrgStructureRootElement),
                    ERROR_INCORRECT_ORGANIZATIONAL_STRUCTURE,
                    orgStructureElement);
            requireNonNull(orgStructureElement);
        }

        if (((Company) orgStructureElement).getCode() == null) {
            return Collections.singletonList(new ValidationErrorBuilderImpl()
                    .setErrorMessage("Signatory's organisation has null organisation code")
                    .setSeverity("ERROR")
                    .build());
        }

        return Collections.emptyList();
    }
}
