-- Скрипт начального наполнения справочника контрагентов.

insert into cmf_contractor (id, correspondent_id, name, short_name, ogrn, inn, kpp, comment, deleted, creation_time, last_modified_time, ts) values ('id_Contractor_Croc', 'id_correspondent_croc', 'ЗАО «КРОК Инкорпорейтед»', 'КРОК', '1027700094949', '7701004101', '770101001', 'Компания КРОК', false, '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_contractor (id, correspondent_id, name, short_name, ogrn, inn, kpp, comment, deleted, creation_time, last_modified_time, ts) values ('id_Contractor_DeveloperCompany', null, 'ООО «Разработка программного обеспечения»', 'Разработка программного обеспечения', '1234567890123', '1234567890', '123456789', 'Компания по разработке программного обеспечения', false, '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
