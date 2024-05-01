DROP DATABASE IF EXISTS `forge-dev`;
DROP USER IF EXISTS 'forgedevserver';

CREATE DATABASE `forge-dev`;
CREATE USER 'forgedevserver'@'%' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON `forge-dev`.* TO 'forgedevserver'@'%';
