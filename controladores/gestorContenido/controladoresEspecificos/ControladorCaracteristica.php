<?php
require_once 'ControladorGeneral.php';
require_once 'Controlador_LogCaracteristicas.php';
class ControladorCaracteristica extends ControladorGeneral{
    private $refLog;
    function __construct() {
        parent::__construct();
    }
    
    public function listar() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_CARACTERISTICAS);
            $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $listado;
        } catch (Exception $e) {
            throw new Exception("Caracteristica-listar: " . $e->getMessage());
        }
    }
    
    public function listarTodo() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_TODO_CARACTERISTICAS);
            $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $listado;
        } catch (Exception $e) {
            throw new Exception("Caracteristica-listar: " . $e->getMessage());
        }
    }
    
    public function agregar($datos) {
        try{
            session_start();
            $parametros = array("nombreCaracteristica" => $datos["nombre"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::AGREGAR_CARACTERISTICA, $parametros);
            unset($parametros);
            //Rescato la caracteristica insertada
            $idUltimaCaracteristica = $this->ultimoID();
            
            $parametros = array("id_Caracteristica" => $idUltimaCaracteristica, "nuevo_nombre_Caracteristica" => $datos["nombre"], "id_Usuario" => $_SESSION["usuario"]);
            //print_r($_SESSION);
            $this->refLog = new Controlador_LogCaracteristicas($parametros);
            $this->refLog->agregar();
            
            return $idUltimaCaracteristica;
        }  catch (Exception $e){
            throw new Exception("Caracteristica-agregar: " . $e->getMessage());
        }
    }

    public function modificar($datos) {
        try{
            session_start();
            //Primero rescato el nombre de la caracteristica que voy a modificar
            $nombreCaracteristicaAnterior = $this->traerNombreCaracteristica($datos["id"]);
            //Cargo los parametros y aplico la modificacion
            $parametros = array("nombreCaracteristica" => $datos["nombre"], "id" => $datos["id"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::MODIFICAR_CARACTERISTICA, $parametros);
            
            unset($parametros);
            $parametros = array("id_Caracteristica" => $datos["id"],
                                "id_Usuario" => $_SESSION["usuario"],
                                "nuevo_nombre_Caracteristica" => $datos["nombre"],
                                "anterior_nombre_Caracteristica" => $nombreCaracteristicaAnterior
                                );
            
            $this->refLog = new Controlador_LogCaracteristicas($parametros);
            $this->refLog->modificar();
            
        }  catch (Exception $e){
            throw new Exception("Caracteristica-modificar: " . $e->getMessage());
        }    
    }

    public function eliminar($datos) {
        try {
            session_start();
            //Primero rescato el nombre de la caracteristica que voy a eliminar
            $nombreCaracteristicaAnterior = $this->traerNombreCaracteristica($datos["id"]);
            $parametros = array("id" => $datos["id"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_CARACTERISTICA, $parametros);
            
            unset($parametros);
            $parametros = array("id_Caracteristica" => $datos["id"],
                                "id_Usuario" => $_SESSION["usuario"],
                                "anterior_nombre_Caracteristica" => $nombreCaracteristicaAnterior
                                );
            
            $this->refLog = new Controlador_LogCaracteristicas($parametros);
            $this->refLog->eliminar();
        } catch (Exception $e) {
            throw new Exception("Editorlal-eliminar: " . $e->getMessage());
        }
    }
    
    private function ultimoID() {
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ULTIMA_CARACTERISTICA);
        $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $listado[0]["id"];
    }
    
    private function traerNombreCaracteristica($id){
        $parametros = array("id" => $id);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::NOMBRE_CARACTERISTICA, $parametros);
        $listado = $resultado->fetchAll(PDO::FETCH_ASSOC);
        return $listado[0]["nombre"];
    }


}
