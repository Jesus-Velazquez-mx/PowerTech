CREATE DATABASE PowerTech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE PowerTech;

/* =========================
   USUARIOS
========================= */
CREATE TABLE USUARIOS (
  idUsuario      INT          NOT NULL AUTO_INCREMENT,
  nombre  VARCHAR(50)  NOT NULL,
  email          VARCHAR(120) NOT NULL,
  contrasena     VARCHAR(255) NOT NULL,
  PRIMARY KEY (idUsuario),
  CONSTRAINT UQ_USUARIOS_NombreUsuario UNIQUE (nombre),
  CONSTRAINT UQ_USUARIOS_Email        UNIQUE (email)
) ENGINE=InnoDB;

/* =========================
   EDIFICIOS
========================= */
CREATE TABLE EDIFICIOS (
  codigoEdificio  VARCHAR(10)  NOT NULL,
  idUsuario       INT          NOT NULL,
  nombreEdificio  VARCHAR(120) NOT NULL,
  horarioEntrada  TIME         NOT NULL,
  horarioSalida   TIME         NOT NULL,
  PRIMARY KEY (codigoEdificio),
  CONSTRAINT CK_EDIFICIOS_Horas CHECK (horarioEntrada < horarioSalida),
  CONSTRAINT FK_EDIFICIOS_USUARIOS
    FOREIGN KEY (idUsuario)
    REFERENCES USUARIOS (idUsuario)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

/* =========================
   SALAS
========================= */
CREATE TABLE SALAS (
  codigoSala     VARCHAR(10)  NOT NULL,
  codigoEdificio VARCHAR(10)  NOT NULL,
  nombreSala     VARCHAR(60)  NULL,
  PRIMARY KEY (codigoSala),
  CONSTRAINT FK_SALAS_EDIFICIOS
    FOREIGN KEY (codigoEdificio)
    REFERENCES EDIFICIOS (codigoEdificio)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

/* =========================
   DISPOSITIVOS
========================= */
CREATE TABLE DISPOSITIVOS (
  codigoDispositivo VARCHAR(10)  NOT NULL,
  codigoSala        VARCHAR(10)  NOT NULL,
  nombre            VARCHAR(100) NOT NULL,
  marca             VARCHAR(60)  NULL,
  tipo              CHAR(1)      NOT NULL,
  PRIMARY KEY (codigoDispositivo),
  CONSTRAINT CK_DISPOSITIVOS_Tipo CHECK (tipo IN ('C','A')),
  CONSTRAINT FK_DISPOSITIVOS_SALAS
    FOREIGN KEY (codigoSala)
    REFERENCES SALAS (codigoSala)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

/* =========================
   Subtipos de DISPOSITIVOS
========================= */
CREATE TABLE COMPUTADORAS (
  codigoDispositivo VARCHAR(10) NOT NULL,
  PRIMARY KEY (codigoDispositivo),
  CONSTRAINT FK_COMPUTADORAS_DISP
    FOREIGN KEY (codigoDispositivo)
    REFERENCES DISPOSITIVOS (codigoDispositivo)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE AIRES_ACONDICIONADOS (
  codigoDispositivo VARCHAR(10) NOT NULL,
  tipoUnidad        VARCHAR(30)  NULL,
  eficienciaSEER    DECIMAL(5,2) NULL,
  PRIMARY KEY (codigoDispositivo),
  CONSTRAINT FK_AIRES_DISP
    FOREIGN KEY (codigoDispositivo)
    REFERENCES DISPOSITIVOS (codigoDispositivo)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

/* =========================
   SENSORES
========================= */
CREATE TABLE SENSORES (
  codigoSensor      VARCHAR(10)   NOT NULL,
  codigoDispositivo VARCHAR(10)   NOT NULL,
  nombreSensor      VARCHAR(80)   NOT NULL,
  tipoSensor        VARCHAR(40)   NOT NULL,
  unidadMedida      VARCHAR(20)   NULL,
  umbralBajo        DECIMAL(18,4) NULL,
  umbralAlto        DECIMAL(18,4) NULL,
  activo            TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (codigoSensor),
  CONSTRAINT FK_SENSORES_DISPOSITIVOS
    FOREIGN KEY (codigoDispositivo)
    REFERENCES DISPOSITIVOS (codigoDispositivo)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

/* =========================
   LECTURAS
========================= */
CREATE TABLE LECTURAS (
  codigoSensor VARCHAR(10)   NOT NULL,
  fechaHora    DATETIME      NOT NULL,
  valor        DECIMAL(18,4) NOT NULL,
  detalle      VARCHAR(200)  NULL,
  PRIMARY KEY (codigoSensor, fechaHora),
  CONSTRAINT FK_LECTURAS_SENSORES
    FOREIGN KEY (codigoSensor)
    REFERENCES SENSORES (codigoSensor)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

/* =========================
   ALARMAS
========================= */
CREATE TABLE ALARMAS (
  codigoAlarma   VARCHAR(10)  NOT NULL,
  codigoEdificio VARCHAR(10)  NOT NULL,
  codigoSala     VARCHAR(10)  NOT NULL,
  codigoSensor   VARCHAR(10)  NOT NULL,
  tipoAlarma     VARCHAR(40)  NOT NULL,
  nivel          TINYINT      NOT NULL,
  estado         VARCHAR(15)  NOT NULL,
  fechaHora      DATETIME     NOT NULL DEFAULT (UTC_TIMESTAMP()),
  detalle        VARCHAR(400) NULL,
  PRIMARY KEY (codigoAlarma),

  CONSTRAINT CK_ALARMAS_Nivel  CHECK (nivel BETWEEN 1 AND 5),
  CONSTRAINT CK_ALARMAS_Estado CHECK (estado IN ('ACTIVA','ATENDIDA','CERRADA')),

  CONSTRAINT FK_ALARMAS_EDIFICIOS
    FOREIGN KEY (codigoEdificio)
    REFERENCES EDIFICIOS (codigoEdificio)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT FK_ALARMAS_SALAS
    FOREIGN KEY (codigoSala)
    REFERENCES SALAS (codigoSala)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,

  CONSTRAINT FK_ALARMAS_SENSORES
    FOREIGN KEY (codigoSensor)
    REFERENCES SENSORES (codigoSensor)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO USUARIOS (nombre, email, contrasena)
VALUES ('test', 'test@gmail.com', 'test');

select * from usuarios

