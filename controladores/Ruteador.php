<?php
//print_r($_POST);
//print_r($_FILES);
//var_dump($_FILES);
//print_r($_POST);
if ($_POST['seccion'] == "gestor") {
    require_once './gestorContenido/persistencia/ControladorPersistencia.php';
} else {
    require_once './portalWeb/persistencia/ControladorPersistencia.php';
}
$refPersistencia = ControladorPersistencia::obtenerCP();
try {
    $refPersistencia->iniciarTransaccion();

    $formulario = $_POST['formulario'];
    $accion = $_POST['accion'];
    $controlador = 'Controlador' . $formulario;
    if ($_POST['seccion'] == "gestor") {
        require_once './gestorContenido/controladoresEspecificos/' . $controlador . '.php';
    } else {
        require_once './portalWeb/controladoresEspecificos/' . $controlador . '.php';
    }

    $datosFormulario = $_POST;
    $refControlador = new $controlador($datosFormulario);
    $resultado = $refControlador->$accion($datosFormulario);
    
    echo json_encode($resultado);
    $refPersistencia->confirmarTransaccion();
} catch (Exception $ex) {
    $refPersistencia->rollBackTransaccion();
    //$parametros = array('E',$ex->getMessage());
    echo $ex->getMessage();
    //echo join("%S%", $parametros);
} finally {
    $refPersistencia->cerrarConexion();
}
