-- Создание статусов документа.
-- Общие.
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Creation', 'DocumentStatus_Creation', 'Создание', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Revoked', 'DocumentStatus_Revoked', 'Аннулирован', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Approvement', 'DocumentStatus_Approvement', 'Согласование', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Signing', 'DocumentStatus_Signing', 'Подписание', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Refinement', 'DocumentStatus_Refinement', 'Доработка', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Registration', 'DocumentStatus_Registration', 'Регистрация', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Scanning', 'DocumentStatus_Scanning', 'Сканирование', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Performing', 'DocumentStatus_Performing', 'Исполнение', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Completed', 'DocumentStatus_Completed', 'Исполнен', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);

-- Исходящий.
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Outgoing_Dispatch', 'DocumentStatus_Outgoing_Dispatch', 'Отправка', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Outgoing_Sent', 'DocumentStatus_Outgoing_Sent', 'Отправлен', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);