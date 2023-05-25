-- Создание дополнительных статусов документа Договор.

insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Contract_TakeStorage', 'DocumentStatus_Contract_TakeStorage', 'Прием на хранение', '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_document_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_DocumentStatus_Contract_Terminated', 'DocumentStatus_Contract_Terminated', 'Прекращен', '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
