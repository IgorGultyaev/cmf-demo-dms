package ru.croc.ctp.cmf.demodms.security.role;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import ru.croc.ctp.cmf.security.role.domain.facade.webclient.RoleDescriptorDefaultController;

/**
 * Конфигурация подсистемы ролей приложения.
 * 
 * @author Dmitry Malenok
 */
@Configuration
@ComponentScan(basePackageClasses = RoleDescriptorDefaultController.class)
public class RoleConfig {

}
