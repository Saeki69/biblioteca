<?php

require_once 'ControladorGeneral.php';

class ControladorUsuario extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            session_start();
            $parametros = array("nombre" => $datos["nombre"], "clave" => "25d55ad283aa400af464c76d713c07ad");
            if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
                $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::AGREGAR_USUARIO, $parametros);
            }
            $id_usuario = $this->ultimoID();
            return $id_usuario;
        } catch (Exception $e) {
            throw new Exception("Usuario-agregar: " . $e->getMessage());
        }
    }

    public function listar() {
        try {
            session_start();
            $resultado = null;
            if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
                $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_USUARIOS);
            }
            $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $listado;
        } catch (Exception $e) {
            throw new Exception("Usuario-listar: " . $e->getMessage());
        }
    }

    public function listarTodo() {
        try {
            session_start();
            $resultado = null;
            if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
                $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_TODO_USUARIOS);
            }
            $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $listado;
        } catch (Exception $e) {
            throw new Exception("Usuario-listarTodo: " . $e->getMessage());
        }
    }

    public function modificar($datos) {
        try {
            session_start();
            $parametros = array("nombre" => $datos["nombre"], "id" => $datos["id"]);
            if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
                $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::MODIFICAR_USUARIO, $parametros);
            }
        } catch (Exception $e) {
            throw new Exception("Usuario-modificar: " . $e->getMessage());
        }
    }

    public function eliminar($datos) {
        try {
            session_start();
            $tipo = $this->traerTipo($datos["id"]);
            if ($tipo != Constantes::USER_SUPER_ADMINISTRADOR) {
                $parametros = array("user" => Constantes::USER_SUPER_ADMINISTRADOR, "id" => $datos["id"]);
                if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
                    $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_USUARIO, $parametros);
                }
            } else {
                throw new Exception("Usuario-eliminar: 959595 No se puede eliminar un Super-Administrador");
            }
        } catch (Exception $e) {
            throw new Exception("Usuario-eliminar: " . $e->getMessage());
        }
    }

    private function ultimoID() {
        if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ULTIMO_ID_USUARIO);
        }
        $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $listado[0]["MAX(id_usuario)"];
    }

    private function traerTipo($id) {
        $parametros = array("id" => $id);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::TRAER_TIPO_USUARIO, $parametros);
        $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $listado[0]["tipo"];
    }

    public function cambiarPass($datos) {
        try {
            session_start();
            $passwordActualIngresada = $datos["claveActual"];

            $parametros = array("idUsuario" => $_SESSION["user"]);
            $retorno = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::OBTENER_PASSWORD, $parametros);
            $retorno = $retorno->fetchAll(PDO::FETCH_ASSOC);

            $passwordActualObtenida = $retorno[0]["clave_usuario"];

            if ($passwordActualIngresada == $passwordActualObtenida) {
                unset($parametros);
                $parametros = array("nuevaPass" => $datos["claveNueva"], "idUsuario" => $_SESSION["user"]);
                $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::CAMBIAR_PASSWORD, $parametros);
                return array("retorno" => "Se ha actualizado la contrasena", "bandera" => true);
            } else {
                return array("retorno" => "Has introducido una contrasena incorrecta", "bandera" => false);
            }
        } catch (Exception $e) {
            throw new Exception("cambiarPass-usuario: " . $e->getMessage());
        }
    }

    public function reiniciarPass($datos) {
        try {
            session_start();
            $parametros = array("id" => $datos["id"]);
            if ($_SESSION["tipo"] == Constantes::USER_SUPER_ADMINISTRADOR) {
                $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::REINICIAR_PASSWORD, $parametros);
                return 1;
            }
        } catch (Exception $e) {
            throw new Exception("Usuario-reiniciarPass: " . $e->getMessage());
        }
    }

}
