package ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.DeliveryOption;

import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Репозиторий опций доставки.
 */
public interface DeliveryOptionRepository
        extends JpaRepository<DeliveryOption, String>, QuerydslPredicateExecutor<DeliveryOption> {

    /**
     * Получение не удаленных опций досатвки по имени.
     *
     * @param name
     *            имя
     * @return список опций доставки
     */
    List<DeliveryOption> findByNameAndDeletedFalse(String name);

    /**
     * Определяет и возвращает опцию доставки, соответствующую указанному системному именованному идентификатору.
     * 
     * @param systemName
     *            системный именованный идентификатор, для которого определяется объект
     * @return опцию доставки, соответствующую указанному системному именованному идентификатору, или <code>null</code>,
     *         если объекта с таким идентификатором нет
     */
    @Nullable
    DeliveryOption findOneBySystemName(@Nonnull String systemName);
}
