-- Начальное наполнение справочника типов связей.

-- +В ответ на+

-- прямая
insert into cmf_relation_type (id, name, system_name, deleted, creation_time, last_modified_time, ts) values ('id_RelationType_InResponseTo_straight', 'В ответ на', 'RelationType_InResponseTo_straight', false, '2018-08-16 16:48:14', '2018-08-16 16:48:14', 1);
insert into cmf_relationtype_objecttype_source (relation_type_id, object_type_id) values ('id_RelationType_InResponseTo_straight', 'id_documentType_incomingDocument');
insert into cmf_relationtype_objecttype_target (relation_type_id, object_type_id) values ('id_RelationType_InResponseTo_straight', 'id_documentType_outgoingDocument');

-- обратная
insert into cmf_relation_type (id, name, system_name, deleted, creation_time, last_modified_time, ts) values ('id_RelationType_InResponseTo_reverse', 'В ответ на', 'RelationType_InResponseTo_reverse', false, '2018-08-16 16:49:09', '2018-08-16 16:49:09', 1);
insert into cmf_relationtype_objecttype_source (relation_type_id, object_type_id) values ('id_RelationType_InResponseTo_reverse', 'id_documentType_outgoingDocument');
insert into cmf_relationtype_objecttype_target (relation_type_id, object_type_id) values ('id_RelationType_InResponseTo_reverse', 'id_documentType_incomingDocument');

-- связь
update cmf_relation_type set reverse_id='id_RelationType_InResponseTo_reverse' where id='id_RelationType_InResponseTo_straight';
update cmf_relation_type set reverse_id='id_RelationType_InResponseTo_straight' where id='id_RelationType_InResponseTo_reverse';

-- -В ответ на-