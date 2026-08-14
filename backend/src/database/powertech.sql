DROP DATABASE IF EXISTS PowerTech;
CREATE DATABASE PowerTech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

CREATE VIEW VISTA_REPORTE_SALA AS
SELECT 
    S.codigoSala,
    S.nombreSala,
    E.codigoEdificio,
    E.nombreEdificio,
    -- Dato Principal: % de Dispositivos sin alarmas activas (Salud de la sala)
    IFNULL(
      ( ( (SELECT COUNT(*) FROM DISPOSITIVOS D WHERE D.codigoSala = S.codigoSala) - 
          (SELECT COUNT(*) FROM ALARMAS A WHERE A.codigoSala = S.codigoSala AND A.estado = 'ACTIVA') 
        ) / (SELECT COUNT(*) FROM DISPOSITIVOS D WHERE D.codigoSala = S.codigoSala) * 100 
      ), 100) AS indice_operatividad,
    -- Datos de Conteo
    (SELECT COUNT(*) FROM DISPOSITIVOS D WHERE D.codigoSala = S.codigoSala) AS total_dispositivos,
    (SELECT COUNT(*) FROM ALARMAS A WHERE A.codigoSala = S.codigoSala AND A.estado = 'ACTIVA') AS alarmas_activas,
    (SELECT COUNT(*) FROM DISPOSITIVOS D WHERE D.codigoSala = S.codigoSala AND D.tipo = 'C') AS cant_computadoras,
    (SELECT COUNT(*) FROM DISPOSITIVOS D WHERE D.codigoSala = S.codigoSala AND D.tipo = 'A') AS cant_aires
FROM SALAS S
JOIN EDIFICIOS E ON S.codigoEdificio = E.codigoEdificio;

DELIMITER //

CREATE TRIGGER trg_lectura_alta_alarma
AFTER INSERT ON LECTURAS
FOR EACH ROW
BEGIN
    -- Declaración de variables para almacenar datos temporales
    DECLARE v_umbralAlto DECIMAL(18,4);
    DECLARE v_codigoSala VARCHAR(10);
    DECLARE v_codigoEdificio VARCHAR(10);
    DECLARE v_codigoAlarma VARCHAR(10);
    
    -- 1. Obtener el umbral alto del sensor que acaba de registrar la lectura
    SELECT umbralAlto INTO v_umbralAlto
    FROM SENSORES
    WHERE codigoSensor = NEW.codigoSensor;
    
    -- 2. Verificar si el umbral existe y si la nueva lectura lo supera
    IF v_umbralAlto IS NOT NULL AND NEW.valor > v_umbralAlto THEN
        
        -- 3. Obtener el código de la sala y del edificio subiendo por la jerarquía
        SELECT d.codigoSala, s.codigoEdificio 
        INTO v_codigoSala, v_codigoEdificio
        FROM SENSORES sen
        INNER JOIN DISPOSITIVOS d ON sen.codigoDispositivo = d.codigoDispositivo
        INNER JOIN SALAS s ON d.codigoSala = s.codigoSala
        WHERE sen.codigoSensor = NEW.codigoSensor;
        
        -- 4. Generar un código único para la alarma de máximo 10 caracteres (Ej: AL-A1B2C3D)
        SET v_codigoAlarma = CONCAT('AL-', UPPER(SUBSTRING(MD5(RAND()), 1, 7)));
        
        -- 5. Insertar la nueva alarma automática
        INSERT INTO ALARMAS (
            codigoAlarma, 
            codigoEdificio, 
            codigoSala, 
            codigoSensor, 
            tipoAlarma, 
            nivel, 
            estado, 
            fechaHora, 
            detalle
        ) VALUES (
            v_codigoAlarma, 
            v_codigoEdificio, 
            v_codigoSala, 
            NEW.codigoSensor,
            'Pico de Consumo',  -- O el nombre que prefieras
            4,                  -- Nivel de gravedad (1 al 5 según tu CHECK)
            'ACTIVA',           -- Estado inicial obligatorio
            NEW.fechaHora, 
            CONCAT('Alerta: La lectura de ', NEW.valor, ' ha excedido el umbral máximo de ', v_umbralAlto)
        );
        
    END IF;
END //

DELIMITER ;