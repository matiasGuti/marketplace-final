create table usuarios (
	id_usuario serial primary key,
	nombre varchar(255) not null,
	email varchar(255) not null,
	password varchar(255) not null
);

create table carro (
	id_carro serial primary key,
	cantidad_total int,
	precio_total int,
	id_producto int references producto(id_producto)
);

create table productos (
	id_producto serial primary key,
	titulo varchar(255) not null,
	descripcion varchar(255) not null,
	precio int not null,
	imagen varchar not null,
	favoritos int not null,
	id_usuario int references usuarios(id_usuario)
);

create table favoritos (
	id_favorito serial primary key,
	id_usuario int references usuarios(id_usuario),
	id_producto int references producto(id_producto)
);