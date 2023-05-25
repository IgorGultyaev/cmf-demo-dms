# cmf-demo-dms

Демо-приложение КСЭД 3.0.

# Сборки
## Обычная сборка

```sh
mvn clean install
```

## Сборки без минификации JavaScript
### Сборка self-contained springboot приложения с трансформером Aspose:

```sh
mvn clean package -P dev
```

### Сборка self-contained springboot приложения с трансформером JodConverter:

```sh
mvn clean package -Djod -P dev
```

### Сборка self-contained springboot приложения без запуска тестов:

```sh
mvn clean package -DskipTests -P dev
```

## Сборки дистрибутива с минификацией JavaScript
### Сборка self-contained springboot приложения с трансформером Aspose:

```sh
mvn clean package
```

### Сборка self-contained springboot приложения с трансформером JodConverter:

```sh
mvn clean package -Djod
```

## Сборки только web части
### Сборка только JavaScript части без минификации JavaScript
В каталоге wc:

```sh
npm run build
```

### Сборка только JavaScript части с минификацией JavaScript
В каталоге wc:

```sh
npm run prod
```

### Запуск дополнительного сервера с возможностью hot reload
В каталоге wc:

```sh
npm run start
```

Приложение становится доступно по адресу http://localhost:9090/

### Сборка и запуск UI unit тестов
В каталоге wc:

```sh
npx grunt
```

### Сборка и запуск UI unit тестов в хроме в режиме hot reload
В каталоге wc:

```sh
npm run wuwatch
```

Страница с тестами доступна по адресу (при запуске окно хром открывается автоматически) http://localhost:9090/?suites=dist/tests/unit.js