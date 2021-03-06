$(function () {
    var TallerAvanzada = {};
    var locacion = "http://" + window.location.host + "/biblioteca/";
    (function (app) {
        var clasificaciones;
        var caracteristicas;
        var clasif = [];
        var caract = [];
        var fotos = [];
        var libro;
        var librosApi;
        app.init = function () {
            var datosCombo = {};

            app.bindings();
            console.log(sessionStorage.aux != null);
            if (sessionStorage.aux != null) {
                $('#tituloModal').html("Editar Libro");
                libro = JSON.parse(sessionStorage.aux);
                console.log(libro);
                sessionStorage.removeItem("aux");
                $("#id").val(libro.id);
                $("#resumen").val(libro.resumen);
                $("#titulo").val(libro.titulo);
                $("#isbn").val(libro.isbn);
                $("#pag").val(libro.paginas);

                datosCombo.idioma = libro.idioma;
                datosCombo.autor = libro.hidAutor;
                datosCombo.editorial = libro.hidEditorial;
                datosCombo.publicacion = libro.publicacion;

                if (libro.destacado == "No") {
                    $("#destacado").prop('checked', false);
                } else {
                    $("#destacado").prop('checked', true);
                }
                if (libro.disponible == "No") {
                    $("#disponible").prop('checked', false);
                } else {
                    $("#disponible").prop('checked', true);
                }
                app.recuperarCaracteristicas(libro.id);
                app.recuperarClasificaciones(libro.id);
                app.recuperarFoto(libro.id);
                //console.log(libro);
            }
            app.cargarFormulario(datosCombo);
        };

        app.recuperarCaracteristicas = function (id) {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.id = id;
            datos.accion = "buscar";
            datos.formulario = "Caracteristica";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    $.each(data, function (clave, valor) {
                        caract.push(valor.id);
                        $("#caract").append("<label>" + valor.text + "</label><br>");
                    });
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                }
            });
        };

        app.recuperarFoto = function (id) {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.id = id;
            datos.accion = "buscar";
            datos.formulario = "Foto";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    var div = $("#canvasFoto")[0];
                    //$(div).html("");
                    var canvas = document.createElement('canvas');
                    canvas.width = 199;
                    canvas.height = 299;
                    var contexto = canvas.getContext('2d');
                    var img = new Image();
                    img.onload = function () {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        contexto.drawImage(img, 0, 0, img.width, img.height);
                    };
                    img.src = locacion + data[0].ruta;
                    div.appendChild(canvas);
                    console.log(data);
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                }
            });
        };

        app.recuperarClasificaciones = function (id) {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.id = id;
            datos.accion = "buscar";
            datos.formulario = "Clasificacion";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    $.each(data, function (clave, valor) {
                        clasif.push(valor.id);
                        $("#clasif").append("<label>" + valor.text + "</label><br>");
                    });
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                }
            });
        };

        app.verificarAutor = function (nameAutor) {
            var combo = $("#autor")[0];
            var index = -1;
            for (var i = 0; i < combo.length; i++) {
                if (combo[i].label == nameAutor) {
                    index = combo[i].value;
                }
            }
            if (index == -1) {

                if (confirm("El Autor " + nameAutor + " no existe, Desea agregarlo?")) {
                    var url = locacion + "controladores/Ruteador.php";
                    var datos = {};
                    datos.nombre = nameAutor;
                    datos.accion = "agregar";
                    datos.formulario = "Autor";
                    datos.seccion = "gestor";
                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: datos,
                        success: function (data) {
                            $("#autor").append('<option selected value="' + data + '">' + nameAutor + '</option>');
                        },
                        error: function (data) {
                            //swal("Error!", data.responseText, "error");
                            sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                        }
                    });
                    //alert("Autor agregado");
                    swal("Felicidades!", "Autor agregado!!", "success");
                }

            } else {
                $("#autor").val(index);
            }
        };

        app.verificarEditorial = function (nameEditorial) {
            var combo = $("#editorial")[0];
            var index = -1;
            for (var i = 0; i < combo.length; i++) {
                if (combo[i].label == nameEditorial) {
                    index = combo[i].value;
                }
            }
            if (index == -1) {

                if (confirm("La Editorial " + nameEditorial + " no existe, Desea agregarla?")) {
                    var url = locacion + "controladores/Ruteador.php";
                    var datos = {};
                    datos.nombre = nameEditorial;
                    datos.accion = "agregar";
                    datos.formulario = "Editorial";
                    datos.seccion = "gestor";
                    $.ajax({
                        url: url,
                        method: 'POST',
                        dataType: 'json',
                        data: datos,
                        success: function (data) {
                            $("#editorial").append('<option selected value="' + data + '">' + nameEditorial + '</option>');
                        },
                        error: function (data) {
                            //swal("Error!", data.responseText, "error");
                            sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                        }
                    });
                    //alert("Editorial agregada!!");
                    swal("Felicidades!", "Editorial agregada!!", "success");
                }

            } else {
                $("#editorial").val(index);
            }
        };

        app.bindings = function () {

            $("#btnWebService").on('click', function (event) {
                $("#aca").html("");
                var tabla = new Tabla({
                    contenedor: "aca",
                    cabecera: ["Isbn", "Titulo", "Autor", "Editorial"],
                    controlador: "ApiExterna",
                    verEditar: false,
                    verEliminar: false,
                    verSeleccionar: true,
                    fnListar: function () {
                        var url = locacion + "controladores/Ruteador.php";
                        var datos = {};
                        datos.titulo = $("#titulo").val();
                        datos.accion = "buscar";
                        datos.formulario = "ApiExterna";
                        datos.seccion = "gestor";
                        $.ajax({
                            url: url,
                            method: 'POST',
                            dataType: 'json',
                            data: datos,
                            success: function (data) {
                                console.log(data);
                                tabla.pagActual = 1;
                                tabla.datos = data;
                                tabla.listado = data;
                                tabla.rellenarTbody();
                                $("#modalLibrosApi").modal({show: true});
                            },
                            error: function (data) {
                                //swal("Error!", data.responseText, "error");
                                sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                            }
                        });
                    },
                    fnSeleccionar: function () {
                        var fila = this.parentNode.parentNode;
                        $("#isbn").val(fila.cells[0].innerHTML);
                        $("#titulo").val(fila.cells[1].innerHTML);
                        app.verificarAutor(fila.cells[2].innerHTML);
                        app.verificarEditorial(fila.cells[3].innerHTML);
                        $("#modalLibrosApi").modal('hide');
                    }
                });
                tabla.crearTabla();
                //app.consumirAPI();
            });

            $("input:file").change(function () {
                app.limpiarFotos();
                var arch = $(this)[0].files[0];
                var div = $("#canvasFoto")[0];
                //$(div).html("");
                var canvas = document.createElement('canvas');
                canvas.width = 199;
                canvas.height = 299;
                var contexto = canvas.getContext('2d');
                var url = URL.createObjectURL(arch);
                var img = new Image();
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    contexto.drawImage(img, 0, 0, img.width, img.height);
                };
                img.src = url;
                div.appendChild(canvas);
            });

            $("#refLog").on('click', function (event) {
                $("#contenido").load('../libro/log/logLibro.html #contenido');
                $.getScript("../libro/log/logLibro.js");
            });

            $('#listCaract').on('click', 'li', function () {
                var id = this.children[0].getAttribute("data-id");
                if (caract.indexOf(id) == -1) {
                    caract.push(id);
                    $("#caract").append("<label>" + this.children[0].innerHTML + "</label><br>");
                    console.log(caract);
                }
            });

            $("#guardar").on("click", function (event) {
                //event.preventDefault();
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });
            
            $("#cancelar").on("click", function (event) {
                window.location = locacion + "gestorContenido/libro/libro.html";
            });

            $("#arbol").bind("select_node.jstree", function (e, data) {
                if (data.node.id != '1') {
                    app.agregarClasificacion(data);
                }
            });

            $("#btnLimpiarClasif").on("click", function (event) {
                clasif = [];
                $("#clasif").html("");
            });

            $("#btnLimpiarCaract").on("click", function (event) {
                caract = [];
                $("#caract").html("");
            });

            $("#btnEliminar").on("click", function (event) {
                app.eliminar($("#id").val());
            });

        };

        app.agregarClasificacion = function (data) {
            app.agregarClasificacionPadre(data.node.parent);
            if (clasif.indexOf(data.node.id) == -1) {
                clasif.push(data.node.id);
                $("#clasif").append("<label>" + data.node.text + "</label><br>");
                console.log(clasif);
            }
        };

        app.agregarClasificacionPadre = function (idPadre) {
            if (idPadre != "#" && idPadre != "1") {
                for (var i = 0; i < clasificaciones.length; i++) {
                    if (idPadre == clasificaciones[i].id && clasif.indexOf(idPadre) == -1) {
                        app.agregarClasificacionPadre(clasificaciones[i].parent);
                        clasif.push(clasificaciones[i].id);
                        $("#clasif").append("<label>" + clasificaciones[i].text + "</label><br>");
                    }
                }
            }
        };

        app.limpiarFotos = function () {
            var div = $("#canvasFoto")[0];
            $(div).html("");
        };

        app.cargarFormulario = function (datoSelected) {

            app.comboPublicacion(datoSelected.publicacion);
            app.comboAutor(datoSelected.autor);
            app.comboEditorial(datoSelected.editorial);
            app.comboIdioma(datoSelected.idioma);
            app.listarClasificaciones();
            app.listarCaracteristicas();
        };

        app.comboPublicacion = function (publicacionSelected) {
            var inicio = 2015;
            var fin = 1800;
            var html = "";

            for (; inicio > fin; inicio--) {
                if (publicacionSelected == inicio)
                    html += '<option selected value="' + inicio + '">' + inicio + '</option>';
                else
                    html += '<option value="' + inicio + '">' + inicio + '</option>';
            }
            $("#publi").html(html);
        };

        app.comboIdioma = function (idiomaSelected) {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.accion = "listar";
            datos.formulario = "Idioma";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    var inicio = 0;
                    var fin = data.length;
                    var html = "";
                    for (; inicio < fin; inicio++) {
                        if (idiomaSelected == data[inicio].id_idioma)
                            html += '<option selected value="' + data[inicio].id_idioma + '">' + data[inicio].nombre + '</option>';
                        else
                            html += '<option value="' + data[inicio].id_idioma + '">' + data[inicio].nombre + '</option>';

                    }
                    $("#idioma").html(html);
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                }
            });
        };

        app.listarCaracteristicas = function () {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.accion = "listar";
            datos.formulario = "Caracteristica";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    var html = "";
                    $.each(data, function (clave, valor) {
                        html += '<li><a data-id="' + valor.id + '">' + valor.denominacion + '</a></li>';
                    });
                    $("#listCaract").html(html);
                    console.log(data);
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                       window.location = "../error/error.html";
                }
            });

        };

        app.listarClasificaciones = function () {
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
                    clasificaciones = data;
                    app.ArmarArbol(data);
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                }
            });
        };

        app.ArmarArbol = function (data) {
            $('#arbol').jstree({'core': {
                    'data': data
                }});
            $("#arbol").jstree('open_all');
        };

        app.comboAutor = function (autorSelected) {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.accion = "listar";
            datos.formulario = "Autor";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    var inicio = 0;
                    var fin = data.length;
                    var html = "";
                    for (; inicio < fin; inicio++) {
                        if (autorSelected == data[inicio].id)
                            html += '<option selected value="' + data[inicio].id + '">' + data[inicio].nombre + '</option>';
                        else
                            html += '<option value="' + data[inicio].id + '">' + data[inicio].nombre + '</option>';

                    }
                    $("#autor").html(html);
                }
            });
        };

        app.comboEditorial = function (editorialSelected) {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.accion = "listar";
            datos.formulario = "Editorial";
            datos.seccion = "gestor";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datos,
                success: function (data) {
                    var inicio = 0;
                    var fin = data.length;
                    var html = "";
                    for (; inicio < fin; inicio++) {
                        if (editorialSelected == data[inicio].id)
                            html += '<option selected value="' + data[inicio].id + '">' + data[inicio].nombre + '</option>';
                        else
                            html += '<option value="' + data[inicio].id + '">' + data[inicio].nombre + '</option>';

                    }
                    $("#editorial").html(html);
                }
            });
        };

        app.eliminar = function (id) {    //funcion para eliminar
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            datos.id = $("#id").val();
            datos.accion = "eliminar";
            datos.formulario = "Libro";
            datos.seccion = "gestor";
            datos.usuario = sessionStorage.usuario;
            $.ajax({
                url: url,
                method: 'POST',
                data: datos,
                success: function (data) {
                    $("#contenido").load('../libro/libro.html #contenido');
                    $.getScript("../libro/libro.js");
                },
                error: function (data) {
                    //swal("Error!", data.responseText, "error");
                    sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                }
            });
        };

        app.validarDatos = function (datos) {
            var retorno = {};
            retorno.valido = true;
            retorno.msj = "";
            //"/^[a-zA-Z]+$/"
            var soloTexto = new RegExp("/^[a-zA-Z]*$/");

            var titulo = datos.titulo.trim();
            if (titulo == "") {
                retorno.msj += "titulo\n";
                retorno.valido = false;
            }

            var isbn = datos.isbn.trim();
            if (isbn == "" || isNaN(isbn) || isbn < 0 || isbn.length != 13) {
                retorno.msj += "isbn\n";
                retorno.valido = false;
            }

            var paginas = datos.paginas.trim();
            if (paginas == "" || isNaN(paginas) || paginas < 0) {
                retorno.msj += "paginas\n";
                retorno.valido = false;
            }

            var publicacion = datos.publicacion.trim();
            if (publicacion == "" || isNaN(publicacion) || publicacion < 0) {
                retorno.msj += "publicacion\n";
                retorno.valido = false;
            }
            
            var resumen = datos.resumen.trim();
            if (resumen == ""){
                retorno.msj += "resumen\n";
                retorno.valido = false;
            }

            var clasificaciones = datos.clasificaciones;
            if (clasificaciones.length == 0) {
                retorno.msj += "clasificaciones\n";
                retorno.valido = false;
            }

            var caracteristicas = datos.caracteristicas;
            if (caracteristicas.length == 0) {
                retorno.msj += "caracteristicas\n";
                retorno.valido = false;
            }

            var fotos = $("canvas");
            if (fotos.length == 0) {
                retorno.msj += "fotos\n";
                retorno.valido = false;
            }

            return retorno;
        };


        app.guardar = function () {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            //datos.form = $("#formLibro").serialize();
            datos.titulo = $("#titulo").val();
            datos.isbn = $("#isbn").val();
            datos.paginas = $("#pag").val();
            datos.publicacion = $("#publi").val();
            datos.autor = $("#autor").val();
            datos.editorial = $("#editorial").val();
            datos.idioma = $("#idioma").val();
            datos.disponible = $("#disponible").prop('checked');
            datos.destacado = $("#destacado").prop('checked');
            datos.resumen = $("#resumen").val();

            datos.clasificaciones = clasif;
            datos.caracteristicas = caract;
            datos.accion = "agregar";
            datos.formulario = "Libro";
            datos.seccion = "gestor";
            datos.usuario = sessionStorage.usuario;
            //console.log(datos);
            var valido = app.validarDatos(datos);
            if (valido.valido) {
                fotos.push($("canvas")[0].toDataURL().split('base64,')[1]);
                datos.fotos = fotos;
                $.ajax({
                    url: url,
                    method: 'POST',
                    dataType: 'json',
                    data: datos,
                    success: function (data) {
                        console.log(data);
                        //$("#contenido").load('../libro/libro.html #contenido');
                        //$.getScript("../libro/libro.js");
                        //app.actualizarTabla(data, $("#id").val());
                        window.location = "libro.html";
                    },
                    error: function (data) {
                        //swal("Error!", data.responseText, "error");
                        sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                    }
                });
            } else {
                //alert("Revise los siguiente campos:\n" + valido.msj);
                swal("Oops!", "Revise los siguiente campos:\n" + valido.msj, "warning");
            }
        };

        app.modificar = function () {
            var url = locacion + "controladores/Ruteador.php";
            var datos = {};
            //datos.form = $("#formLibro").serialize();
            datos.id = $("#id").val();
            datos.titulo = $("#titulo").val();
            datos.isbn = $("#isbn").val();
            datos.paginas = $("#pag").val();
            datos.publicacion = $("#publi").val();
            datos.autor = $("#autor").val();
            datos.editorial = $("#editorial").val();
            datos.idioma = $("#idioma").val();
            datos.disponible = $("#disponible").prop('checked');
            datos.destacado = $("#destacado").prop('checked');
            datos.resumen = $("#resumen").val();

            datos.clasificaciones = clasif;
            datos.caracteristicas = caract;

            datos.accion = "modificar";
            datos.formulario = "Libro";
            datos.seccion = "gestor";
            datos.usuario = sessionStorage.usuario;
            var valido = app.validarDatos(datos);
            if (valido.valido) {
                fotos.push($("canvas")[0].toDataURL().split('base64,')[1]);
                datos.fotos = fotos;
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: datos,
                    success: function (data) {
                        window.location = "libro.html"
                        //$("#contenido").load('../libro/libro.html #contenido');
                        //$.getScript("../libro/libro.js");
                    },
                    error: function (data) {
                        //swal("Error!", data.responseText, "error");
                        sessionStorage.aux = JSON.stringify(data.responseText);
                        window.location = "../error/error.html";
                    }
                });
            } else {
                //alert("Revise los siguiente campos:\n" + valido.msj);
                swal("Oops!", "Revise los siguiente campos:\n" + valido.msj, "warning");
            }
        };

        app.limpiarModal = function () {    //funcion para limpiar los textbox del modal
            $("#id").val(0);
            $("#index").val(-1);
            $("#nombre").val('');
        };

        app.init();

    })(TallerAvanzada);


});
