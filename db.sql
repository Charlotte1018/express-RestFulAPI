-- hello world db.sql;
CREATE DATABASE `eth_wallet` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `eth_wallet`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

  