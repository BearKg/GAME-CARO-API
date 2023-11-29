CREATE DATABASE `caro`;
USE `caro`;
CREATE TABLE `caro`.`user`(
    `ID` VARCHAR(50) NOT NULL,
    `NAME` VARCHAR(20) NULL DEFAULT NULL,
    `USERNAME` VARCHAR(20) NOT NULL UNIQUE,
    `PASSWORD` VARCHAR(256) NOT NULL,
    `EMAIL` VARCHAR(50) NULL DEFAULT NULL,
    `ADMIN` BOOLEAN NOT NULL DEFAULT FALSE,
    `SCORE` INT NULL DEFAULT NULL,
    PRIMARY KEY(`ID`)
) ENGINE = InnoDB;
CREATE TABLE `caro`.`game`(
    `ID` VARCHAR(50) NOT NULL,
    `PLAYER_ID` VARCHAR(50) NOT NULL,
    `OPPONENT_NAME` VARCHAR(20) NULL DEFAULT NULL,
    `SCORE` INT NOT NULL DEFAULT '0',
    `GAME_TYPE` VARCHAR(10) NOT NULL,
    `DIFFICULTY` INT NOT NULL,
    `PLAY_TIME` INT NOT NULL,
    `START_TIME` DATETIME NOT NULL,
    `STATUS` VARCHAR(10) NOT NULL,
    `DATA` JSON NOT NULL,
    `NEXTMOVE` BOOLEAN NULL DEFAULT NULL,
    PRIMARY KEY(`ID`),
    FOREIGN KEY(`PLAYER_ID`) REFERENCES `user`(`ID`)
) ENGINE = InnoDB;
CREATE VIEW `caro`.`nguoichoi` AS SELECT `ID`, `NAME`, `USERNAME`, `PASSWORD`, `EMAIL`, `SCORE` FROM `user` WHERE `ADMIN` = FALSE;
CREATE VIEW `caro`.`admin` AS SELECT `ID`, `NAME`, `USERNAME`, `PASSWORD`, `EMAIL` FROM `user` WHERE `ADMIN` = TRUE;
CREATE VIEW `caro`.`banchoi` AS SELECT * FROM `game`;

CREATE DEFINER=`root`@`localhost` PROCEDURE `dangky`(
	IN `id` VARCHAR(50),
    IN `email` VARCHAR(50),
    IN `username` VARCHAR(20),
    IN `password` VARCHAR(256)
)
INSERT INTO `user`(`ID` ,`EMAIL`, `USERNAME`, `PASSWORD`) VALUES (id, email, username, password);

CREATE DEFINER=`root`@`localhost` PROCEDURE `themnguoichoi`(
    IN `id` VARCHAR(50),
    IN `name` VARCHAR(20),
    IN `username` VARCHAR(20),
    IN `password` VARCHAR(256),
    IN `email` VARCHAR(50),
    IN `admin` BOOLEAN
)
INSERT INTO `user` (`ID`, `NAME`, `USERNAME`, `PASSWORD`, `EMAIL`, `ADMIN`) VALUES (id, name, username, password, email, admin);

CREATE DEFINER=`root`@`localhost` PROCEDURE `suannguoichoi`(
    IN `id` VARCHAR(50),
    IN `name` VARCHAR(20),
    IN `username` VARCHAR(20),
    IN `password` VARCHAR(256),
    IN `email` VARCHAR(50),
    IN `admin` BOOLEAN,
    IN `score` INT
)
UPDATE `user` SET `NAME` = name, `USERNAME` = username, `PASSWORD` = password, `EMAIL` = email, `ADMIN` = admin, `SCORE` = score WHERE `ID` = id;

CREATE DEFINER=`root`@`localhost` PROCEDURE `xoanguoichoi`(
    IN `userId` VARCHAR(50)
)
DELETE FROM `user` WHERE `ID` = userId;

CREATE DEFINER=`root`@`localhost` PROCEDURE `thembanchoi`(
    IN `id` VARCHAR(50),
    IN `player_id` VARCHAR(50),
    IN `opponent_name` VARCHAR(20),
    IN `score` INT,
    IN `game_type` VARCHAR(10),
    IN `difficulty` INT,
    IN `play_time` INT,
    IN `start_time` DATETIME,
    IN `status` VARCHAR(10),
    IN `data` JSON,
    IN `nextmove` BOOLEAN
)
INSERT INTO `game` VALUES (id, player_id, opponent_name, score, game_type, difficulty, play_time, start_time, status, data, nextmove);

CREATE DEFINER=`root`@`localhost` PROCEDURE `suabanchoi`(
    IN `gameId` VARCHAR(50),
    IN `userId` VARCHAR(50),
    IN `score` INT,
    IN `play_time` INT,
    IN `status` VARCHAR(10),
    IN `data` JSON,
    IN `nextmove` BOOLEAN
)
UPDATE `game` SET `SCORE` = score, `PLAY_TIME` = play_time, `STATUS` = status, `DATA` = data, `NEXTMOVE` = nextmove WHERE `ID` = gameId AND `PLAYER_ID` = userId;




