-- Скрипт начального наполнения справочника способов отправки/доставки.

INSERT INTO cmf_deliveryoption (id, system_name, name, delivery_type_id, deleted, creation_time, last_modified_time, ts) VALUES ('id_DeliveryOption_Fax', 'DeliveryOption_Fax', 'Факс',   null, false, '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_deliveryoption (id, system_name, name, delivery_type_id, deleted, creation_time, last_modified_time, ts) VALUES ('id_DeliveryOption_EMail', 'DeliveryOption_E_Mail', 'E-mail',   null, false, '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_deliveryoption (id, system_name, name, delivery_type_id, deleted, creation_time, last_modified_time, ts) VALUES ('id_DeliveryOption_Letter', null, 'Письмо',   'id_DeliveryType_PlainLetter', false, '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_deliveryoption (id, system_name, name, delivery_type_id, deleted, creation_time, last_modified_time, ts) VALUES ('id_DeliveryOption_Parcel', null, 'Посылка',   'id_DeliveryType_PlainLetter', false, '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);
INSERT INTO cmf_deliveryoption (id, system_name, name, delivery_type_id, deleted, creation_time, last_modified_time, ts) VALUES ('id_DeliveryOption_InsuredLetter', null, 'Ценное письмо',   null, false, '2016-11-01 12:09:10', '2016-11-01 12:09:10', 1);