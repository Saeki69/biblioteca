$(function () {
    var TallerAvanzada = {};
    var locacion = "http://" + window.location.host + "/biblioteca/";
    (function (app) {
        //var datosClasificaciones;
        app.init = function () {
            if (sessionStorage.value == '2') {
                $("#log").html('<a href="log/logClasificacion.html"> Ver Log de Clasificaciones</a>');
            }
            app.listar();
            app.bindings();
        };

        app.bindings = function () {

            $("#arbol").bind("select_node.jstree", function (e, data) {
                if (data.node.id != '1') {
                    app.limpiarModal();
                    $('#id').val(data.node.id);
                    $("#nombre").val(data.node.text);
                    $("#clasi").val(data.node.parent);
                    $("#tituloModal").html("Editar Clasificacion");
                    $("#modalClasificacion").modal({show: true});
                }

            });

            $("#agregarClasificacion").on('click', function (event) {
                app.limpiarModal();
                $("#id").val(0);
                $("#tituloModal").html("Agregar Nueva Clasificacion");
                $("#modalClasificacion").modal({show: true});
            });

            $("#listarTodo").on('click', function (event) {
                app.listar();
            });

            $("#imprimir").on('click', function (event) {
                app.imprimir();
            });

            $("#guardar").on("click", function (event) {
                //event.preventDefault();
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#btnEliminar").on("click", function (event) {
                app.eliminar($("#id").val());
            });

            /*$("#formClasificacion").bootstrapValidator({
             excluded: [],
             });*/
        };

        app.eliminar = function (id) {    //funcion para eliminar
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.id = id;
            datos.accion = "eliminar";
            datos.formulario = "Clasificacion";
            datos.seccion = "gestor";
            datos.usuario = sessionStorage.usuario;
            $.ajax({
                url: url,
                method: 'POST',
                data: datos,
                success: function (data) {
                    $("#modalClasificacion").modal('hide');
                    //app.listar();
                    window.location = "clasificacion.html"
                },
                error: function (data) {
                    //alert(data.responseText);
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                    window.location = "../error/error.html";
                }
            });
        };

        app.imprimir = function () {    //funcion para imprimir
            var aux = $("#arbol").html();//recupero el html del la tablaClasificacion
            $("#tituloImprimir").val('Clasificaciones');
            $("#htmlImprimir").val(aux);
            $("#formImprimir").attr("action", locacion + "controladores/Imprimir.php");
            $("#formImprimir").submit();//imprimo
        };

        app.guardar = function () {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            //datos.form = $("#formClasificacion").serialize();
            datos.nombre = $("#nombre").val();
            datos.padre = $("#clasi").val();
            datos.accion = "agregar";
            datos.formulario = "Clasificacion";
            datos.seccion = "gestor";
            datos.usuario = sessionStorage.usuario;
            //console.log(datos);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    $("#modalClasificacion").modal('hide');
                    //app.actualizarTabla(data, $("#id").val());
                    //app.listar();
                    window.location = "clasificacion.html"
                },
                error: function (data) {
                    //alert(data.responseText);
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                    window.location = "../error/error.html";
                }
            });
        };

        app.modificar = function () {
            var url = locacion + "controladores/Ruteador.php";
            //var datos = $("#formClasificacion").serialize();
            var datos = {};
            datos.id = $("#id").val();
            datos.nombre = $("#nombre").val();
            datos.padre = $("#clasi").val();
            datos.accion = "modificar";
            datos.formulario = "Clasificacion";
            datos.seccion = "gestor";
            datos.usuario = sessionStorage.usuario;
            $.ajax({
                url: url,
                method: 'POST',
                data: datos,
                success: function (data) {
                    $("#modalClasificacion").modal('hide');
                    //app.listar();
                    window.location = "clasificacion.html"
                },
                error: function (data) {
                    //alert(data.responseText);
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                    window.location = "../error/error.html";
                }
            });
        };

        app.listar = function () {
            //alert("listar");
            //$('#arbol').jstree.destroy ();
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.accion = "listar";
            datos.formulario = "Clasificacion";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    //datosClasificaciones = data;
                    app.cargarCombo(data);
                    app.ArmarArbol(data);
                },
                error: function (data) {
                    //alert(data.responseText);
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                    window.location = "../error/error.html";
                }
            });
        };

        app.cargarCombo = function (data) {
            console.log(data);
            var html = "";
            $.each(data, function (clave, clasi) {
                html += '<option value="' + clasi.id + '">' + clasi.text + '</option>';
            });
            $("#clasi").html(html);
        };

        app.ArmarArbol = function (data) {
            //alert("armarArbol");
            //$('#arbol').redraw();
            //$('#arbol').jstree.destroy ();
            $('#arbol').jstree({'core': {
                    'data': data
                }});
            setTimeout(function () {
                $("#arbol").jstree('open_all');
            }, 150);

            //data = null;
        };

        app.limpiarModal = function () {    //funcion para limpiar los textbox del modal
            $("#id").val(0);
            $("#index").val(-1);
            $("#nombre").val('');
            $("#clasi").val(1);
        };

        app.init();

    })(TallerAvanzada);


});
