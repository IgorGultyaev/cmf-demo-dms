INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_work', 'Рабочий', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_home', 'Домашний', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_other', 'Другой', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_mobile', 'Мобильный', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_personal', 'Личный', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_law', 'Юридический', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_correspondentcontactkind (id, name, creation_time, last_modified_time, ts) VALUES ('id_correspondent_contact_kind_mail', 'Почтовый', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_work', 'id_correspondent_contact_type_email');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_work', 'id_correspondent_contact_type_phone');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_work', 'id_correspondent_contact_type_fax');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_work', 'id_correspondent_contact_type_url');

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_home', 'id_correspondent_contact_type_email');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_home', 'id_correspondent_contact_type_phone');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_home', 'id_correspondent_contact_type_fax');

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_other', 'id_correspondent_contact_type_email');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_other', 'id_correspondent_contact_type_phone');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_other', 'id_correspondent_contact_type_fax');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_other', 'id_correspondent_contact_type_url');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_other', 'id_correspondent_contact_type_address');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_other', 'id_correspondent_contact_type_address');

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_mobile', 'id_correspondent_contact_type_phone');

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_personal', 'id_correspondent_contact_type_url');

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_law', 'id_correspondent_contact_type_address');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_law', 'id_correspondent_contact_type_address');

INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_mail', 'id_correspondent_contact_type_address');
INSERT INTO correspondentcontactkinds_correspondentcontacttypes (correspondentcontactkind_id, correspondentcontacttype_id)
VALUES ('id_correspondent_contact_kind_mail', 'id_correspondent_contact_type_address');