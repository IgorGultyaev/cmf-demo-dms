package db.migration.common.data;

import static java.util.Objects.requireNonNull;
import static org.apache.commons.lang3.exception.ExceptionUtils.wrapAndThrow;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.io.IOUtils;
import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import ru.croc.ctp.cmf.dms.dictionary.employee.domain.Employee;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.annotation.Nullable;

/**
 * Устанавливает аватары сотрудникам.
 *
 * @author Dmitry Malenok
 */
public final class V01_02_00_20180507164322__DemoDms_Add_Avatars implements SpringJdbcMigration {

    /**
     * SLQ запрос на установку параметров аватара.
     */
    private static final String SQL_SET_AVATAR = "update "
            + Employee.TABLE_NAME
            + " set "
            + Employee.Property.AVATAR
            + " = ?"
            + ", "
            + Employee.Property.AVATAR
            + "_size = ?"
            + ", "
            + Employee.Property.AVATAR
            + "_file_name = ?"
            + ", "
            + Employee.Property.AVATAR
            + "_mime_content_type = ?"
            + " where id = ?";

    @Override
    public void migrate(@SuppressWarnings("null") final JdbcTemplate jdbcTemplate) throws Exception {
        try (final InputStream avatarStream = getClass().getResourceAsStream("avatar/avatar_ivanov.svg")) {
            updateAvatar(jdbcTemplate, "employee1", requireNonNull(avatarStream), "avatar_ivanov.svg", "image/svg+xml");
        }

        try (final InputStream avatarStream = getClass().getResourceAsStream("avatar/avatar_petrov.svg")) {
            updateAvatar(jdbcTemplate, "employee2", requireNonNull(avatarStream), "avatar_petrov.svg", "image/svg+xml");
        }

        try (final InputStream avatarStream = getClass().getResourceAsStream("avatar/avatar_kirillovall.svg")) {
            updateAvatar(jdbcTemplate,
                    "employee_kirillovall",
                    requireNonNull(avatarStream),
                    "avatar_kirillovall.svg",
                    "image/svg+xml");
        }
    }

    /**
     * Устанавливает аватар для указанного сотрудника.
     *
     * @param jdbcTemplate
     *            объект доступа к операциям над БД через jdbc
     * @param employeeId
     *            идентификатор сотрудника
     * @param avatarStream
     *            бинарный поток, содержащий идентификатор аватара
     * @param avatarFileName
     *            имя файла аватара, устанавливаемое в БД
     * @param avatarContentType
     *            тип контента аватара
     */
    @SuppressFBWarnings("SIC_INNER_SHOULD_BE_STATIC_ANON") // Выполняется один раз при накатывании.
    void updateAvatar(final JdbcOperations jdbcTemplate,
            final String employeeId,
            final InputStream avatarStream,
            final String avatarFileName,
            final String avatarContentType) {
        try {
            final ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            IOUtils.copy(avatarStream, buffer);
            final byte[] avatar = buffer.toByteArray();

            try (final InputStream avatarInnerStream = new ByteArrayInputStream(avatar)) {
                jdbcTemplate.execute(SQL_SET_AVATAR, new PreparedStatementCallback<Void>() {

                    @Nullable
                    @Override
                    public Void doInPreparedStatement(final PreparedStatement ps)
                            throws SQLException, DataAccessException {
                        ps.setBlob(1, avatarInnerStream);
                        ps.setLong(2, avatar.length);
                        ps.setString(3, avatarFileName);
                        ps.setString(4, avatarContentType);
                        ps.setString(5, employeeId);
                        ps.executeUpdate();
                        return null;
                    }
                });
            }
        } catch (final IOException exception) {
            wrapAndThrow(exception);
        }
    }
}
