-- Создание типов задач (требование: ФТ52)
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Create_Project', 'TaskType_Document_Create_Project', 'Создание проекта документа', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Refine', 'TaskType_Document_Refine', 'Доработка (проект документа)', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Approve_Common', 'TaskType_Document_Approve_Common', 'Согласование', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Approve_Additional', 'TaskType_Document_Approve_Additional', 'Дополнительное согласование', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Sign_Common', 'TaskType_Document_Sign_Common', 'Подписание', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Register', 'TaskType_Document_Register', 'Регистрация документа', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Attach_Original', 'TaskType_Document_Attach_Original', 'Прикрепление подлинника', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);

insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_Send', 'TaskType_Document_Send', 'Отправить документ', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);

insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Document_On_Review', 'TaskType_Document_On_Review', 'Рассмотрение', '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);

-- Задачи по поручениям
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Commission_Execution', 'TaskType_Commission_Execution', 'Исполнение', '2017-05-15 11:01:34', '2017-05-15 11:01:34', 1); 
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Commission_Refinement', 'TaskType_Commission_Refinement', 'Доработка (поручение)', '2017-05-15 11:02:12', '2017-05-15 11:02:12', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Commission_Familiarization', 'TaskType_Commission_Familiarization', 'Ознакомление', '2017-05-15 11:03:32', '2017-05-15 11:03:32', 1);
insert into cmf_task_type (id, system_name, name, creation_time, last_modified_time, ts) values ('id_TaskType_Commission_OnReview', 'TaskType_Commission_OnReview', 'Проверка отчета', '2017-05-15 11:05:26', '2017-05-15 11:05:26', 1);
