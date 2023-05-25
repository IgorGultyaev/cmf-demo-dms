package ru.croc.ctp.cmf.demodms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import ru.croc.ctp.cmf.demodms.config.CmfDemoDmsConfig;

/**
 * Основной класс приложения.
 *
 * @author Dmitry Malenok
 */
@Configuration
@Import({ CmfDemoDmsConfig.class })
/*
 * Аннотация EnableAutoConfiguration нужна именно тут. IDEA не находит её, если задана в импортированном конфиге. Также
 * см. рекомендации в документации SpringBoot:
 * https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/reference/htmlsingle/#using-boot-auto-configuration
 */
@EnableAutoConfiguration
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    /**
     * Метод запуска приложения.
     *
     * @param args
     *            аргументы запуска приложения
     */
    public static void main(final String[] args) {
        SpringApplication.run(Application.class, args);
    }
}