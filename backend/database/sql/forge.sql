DROP DATABASE IF EXISTS `forge`;
DROP USER IF EXISTS 'forgeserver';

CREATE DATABASE `forge`;
CREATE USER 'forgeserver'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON `forge`.* TO 'forgeserver'@'%';
