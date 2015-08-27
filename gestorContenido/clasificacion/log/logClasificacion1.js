$(function () {
    var TallerAvanzada = {};
    var locacion = "http://" + window.location.host + "/biblioteca/";
    (function (app) {
        var datosLogClasificaciones;
        app.init = function () {
            app.listar();
            app.bindings();
        };

        app.bindings = function () {
            $("#imprimir").on('click', function (event) {
                app.imprimir();
            });
        };

        app.imprimir = function () {    //funcion para imprimir
            var aux = $("#tablaLogClasificacion").html();//recupero el html del la tablaClasificacion
            aux = aux.replace("<thead>", "");//reemplazo el <thead> por cadena vacia
            aux = aux.replace("</thead>", "");//reemplazo el </thead> por cadena vacia
            $("#html").val('<table border="1">'+aux+'</table>');
            $("#formImprimir").attr("action", locacion + "controladores/Imprimir.php");
            $("#formImprimir").submit();//imprimo
        };

        app.listar = function () {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.accion = "listarLogs";
            datos.formulario = "Clasificacion";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    datosLogClasificaciones = data;
                    app.rellenarTabla(data);
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        };

        app.rellenarTabla = function (data) {
            $('#tablaLogClasificacion').dataTable().fnDestroy();
            datosLogClasificaciones = $('#tablaLogClasificacion').dataTable({
                data: data,
                "columns": [
                    {"data": "fecha"},
                    {"data": "hora"},
                    {"data": "clasificacion"},
                    {"data": "usuario"},
                    {"data": "accion"}
                ]
            }).api();
        };

        app.init();

    })(TallerAvanzada);


});
