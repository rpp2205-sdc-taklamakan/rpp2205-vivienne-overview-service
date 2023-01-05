drop database if exists SDC;
create database SDC;
use SDC;
create table Products (
  Product_id int primary key,
  Name varchar(255),
  Slogan varchar(10000),
  Description TEXT,
  Category varchar(255),
  Default_price int
);
load data infile '/tmp/product.csv'
into table Products
Fields terminated by ','
Enclosed by '"'
lines terminated by '\n'
ignore 1 rows;

create table Reviews (
  Product_id int,
  Ratings int,
  foreign key (Product_id) references Products(Product_id)
);

drop table  if exists Styles;

create table Styles (
  Id int  primary key,
  Product_id int,
  Name varchar(255),
  Sale_price varchar(220) default null,
  Original_price int,
  Default_style varchar(10),
  foreign key (Product_id) references Products(Product_id)
);

load data infile '/tmp/styles.csv'
into table Styles
Fields terminated by ','
Enclosed by '"'
lines terminated by '\n'
ignore 1 rows;

drop table  if exists Skus;

create table Skus (
  Id int auto_increment primary key,
  Style_id int,
  Size varchar(255),
  Quanlity int,
  foreign key (Style_id) references Styles(Id)
);

load data infile '/tmp/skus.csv'
into table Skus
Fields terminated by ','
Enclosed by '"'
lines terminated by '\n'
ignore 1 rows;

drop table  if exists Photos;

create table Photos (
  Id varchar(20) primary key,
  Style_id int,
  Url text,
  Thumbnail_url text,
  foreign key (Style_id) references Styles(Id)
);

load data infile '/tmp/photos.csv'
into table Photos
Fields terminated by ','
Enclosed by ''
lines terminated by '\n'
ignore 1 rows;

drop table if exists Features;

create table Features (
  Id int auto_increment primary key,
  Product_id int,
  Feature varchar(100),
  Value varchar(100),
  foreign key (Product_id) references Products(Product_id)
);

load data infile '/tmp/features.csv'
into table features
Fields terminated by ','
Enclosed by '"'
lines terminated by '\n'
ignore 1 rows;

