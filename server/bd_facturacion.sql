create database facturacion;

use facturacion;

create table usuarios(
id_usuario int not null primary key auto_increment,
nombre varchar(100) not null,
correo varchar(500) not null,
usuario varchar(50) not null,
contrasena varchar(50) not null);

create table facturas(
id_factura int not null primary key auto_increment,
fecha date not null,
cliente varchar(50) not null,
cedulaNit int not null,
descripcion varchar (100) not null,
cantidad int not null,
precioUnitario int not null,
precioTotal int not null);

select * from usuarios;
select * from facturas;

drop database facturacion;