create database facturacion;

use facturacion;

create table usuarios(
id_usuario int not null primary key auto_increment,
nombre varchar(100) not null,
correo varchar(500) not null,
usuario varchar(50) not null,
contrasena varchar(50) not null);

select * from usuarios;

drop database facturacion;