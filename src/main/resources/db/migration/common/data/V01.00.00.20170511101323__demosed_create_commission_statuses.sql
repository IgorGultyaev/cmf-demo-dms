-- Создание статусов поручений, исполнителей поручений и их отчётов.
-- Поручение
insert into cmf_commission_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionStatus_Draft', 'CommissionStatus_Draft', 'Проект', '2017-05-11 10:14:10', '2017-05-11 10:14:10', 1);
insert into cmf_commission_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionStatus_Execution', 'CommissionStatus_Execution', 'Исполнение', '2017-05-11 10:14:30', '2017-05-11 10:14:30', 1);
insert into cmf_commission_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionStatus_Executed', 'CommissionStatus_Executed', 'Исполнен', '2017-05-11 10:15:02', '2017-05-11 10:15:02', 1);
insert into cmf_commission_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionStatus_Revoked', 'CommissionStatus_Revoked', 'Отозвано', '2017-05-11 10:15:44', '2017-05-11 10:15:44', 1);
insert into cmf_commission_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionStatus_Familiarization', 'CommissionStatus_Familiarization', 'Ознакомление', '2017-05-11 10:17:35', '2017-05-11 10:17:35', 1);
insert into cmf_commission_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionStatus_Acquainted', 'CommissionStatus_Acquainted', 'Ознакомление завершено', '2017-05-11 10:20:41', '2017-05-11 10:20:41', 1);

-- Исполнитель поручения
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Draft', 'CommissionPerformerStatus_Draft', 'Проект', '2017-05-11 10:22:15', '2017-05-11 10:22:15', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Execution', 'CommissionPerformerStatus_Execution', 'Исполнение', '2017-05-11 10:23:10', '2017-05-11 10:23:10', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Executed', 'CommissionPerformerStatus_Executed', 'Исполнен', '2017-05-11 10:24:45', '2017-05-11 10:24:45', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Revoked', 'CommissionPerformerStatus_Revoked', 'Отозвано', '2017-05-11 10:24:59', '2017-05-11 10:24:59', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_OnReview', 'CommissionPerformerStatus_OnReview', 'Проверка отчёта', '2017-05-15 10:16:22', '2017-05-15 10:16:22', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Refinement', 'CommissionPerformerStatus_Refinement', 'Доработка отчета', '2017-05-15 10:17:43', '2017-05-15 10:17:43', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Familiarization', 'CommissionPerformerStatus_Familiarization', 'Ознакомление', '2017-05-11 10:25:20', '2017-05-11 10:25:20', 1);
insert into cmf_commission_performer_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerStatus_Acquainted', 'CommissionPerformerStatus_Acquainted', 'Ознакомление завершено', '2017-05-11 10:26:53', '2017-05-11 10:26:53', 1);

-- Отчёт по поручению
insert into cmf_commission_pr_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerReportStatus_Draft', 'CommissionPerformerReportStatus_Draft', 'Проект', '2017-05-11 10:35:11', '2017-05-11 10:35:11', 1);
insert into cmf_commission_pr_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerReportStatus_OnReview', 'CommissionPerformerReportStatus_OnReview', 'Отправлен', '2017-05-11 10:37:02', '2017-05-11 10:37:02', 1);
insert into cmf_commission_pr_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerReportStatus_Approved', 'CommissionPerformerReportStatus_Approved', 'Принят', '2017-05-11 10:38:09', '2017-05-11 10:38:09', 1);
insert into cmf_commission_pr_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerReportStatus_Rejected', 'CommissionPerformerReportStatus_Rejected', 'Отклонён', '2017-05-11 10:39:11', '2017-05-11 10:39:11', 1);
insert into cmf_commission_pr_status (id, system_name, name, creation_time, last_modified_time, ts) values ('id_CommissionPerformerReportStatus_Revoked', 'CommissionPerformerReportStatus_Revoked', 'Отозван', '2017-05-11 10:40:23', '2017-05-11 10:40:23', 1);
