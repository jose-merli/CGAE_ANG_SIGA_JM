jQuery.noConflict();

// (function () {
//     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();

var user, psswd, profile, loc, bloqueado = false;
user = '';
psswd = 'clavecita';
loc = '';


function inicio() {
    MM_preloadImages('http://localhost/SIGA/html/imagenes/botonSession_ilum.gif',
        'http://localhost/SIGA/html/imagenes/botonSession_activo.gif',
        'http://localhost/SIGA/html/imagenes/botonSession.gif',
        'http://localhost/SIGA/html/imagenes/botonAyuda.gif',
        'http://localhost/SIGA/html/imagenes/botonAyuda_ilum.gif',
        'http://localhost/SIGA/html/imagenes/botonAyuda_activo.gif');
}

function cerrarSession() {
    MM_swapImage('closeSession', '', 'http://localhost/SIGA/html/imagenes/botonSession_activo.gif', 1);

    document.formularioOcultoCerrarSesion.submit();

    return false;
}

function usuario() {

    jQuery.ajax({ //Comunicación jQuery hacia JSP  
        type: "POST",
        url: "/SIGA/GEN_InformacionUsuario.do?modo=getAjaxObtenerInfoUsuario",
        data: "idCombo=",
        dataType: "json",
        success: function (json) {
            if (json.Encontrado == "SI") {
                $("#dialogoInsercion").html("");
                $("#dialogoInsercion").append("<b>Nombre: </b>");
                $("#dialogoInsercion").append(json.Nombre + "</br>");
                $("#dialogoInsercion").append("<b>DNI: </b>");
                $("#dialogoInsercion").append(json.DNI + "</br>");
                $("#dialogoInsercion").append("<b>Grupo: </b>");
                $("#dialogoInsercion").append(json.Grupo + "</br>");
                $("#dialogoInsercion").append("<b>Institución: </b>");
                $("#dialogoInsercion").append(json.Institucion + "</br>");
                $("#dialogoInsercion").append("<b>Fecha último acceso: </b>");
                $("#dialogoInsercion").append(json.FechaAcceso);
                $("#dialogoInsercion").dialog(
                    {
                        height: 270,
                        width: 525,
                        modal: true,
                        resizable: false,
                        buttons: {
                            "Cerrar": function () {
                                $(this).dialog("close");
                            }
                        }
                    }
                );
            } else {
                alert('No existe Usuario de acceso en el sistema ');
            }
        },
        error: function (e) {
            alert('Error de comunicación: ' + e);
            fin();
        }
    });
    $(".ui-widget-overlay").css("opacity", "0");
    window.top.focus();
    return false;
}


function ayuda() {
    MM_swapImage('AbrirAyuda', '', 'http://localhost/SIGA/html/imagenes/botonAyuda_activo.gif', 1);
    window.open('<%=pathAyuda%>', 'Ayuda', 'width=800px,height=600px,scrollbars=1;resizable:no;top=100px;left=100px;Directories=no;Location=no;Menubar=no;Status=yes;Toolbar=no;');
    window.top.focus();
    return false;
}

function version() {
    MM_swapImage('AbrirAyuda', '', 'http://localhost/SIGA/html/imagenes/botonAyuda_activo.gif', 1);
    window.open('<%=pathVersiones%>', 'Versiones');
    window.top.focus();
    return false;
}

function cerrarAplicacion() {
    MM_swapImage('closeApp', '', 'http://localhost/SIGA/html/imagenes/botonCerrar_activo.gif', 1);

    if (confirm('<siga:Idioma key="general.cerrarAplicacion"/>')) {
        window.top.close();
    }

    return false;
}
function interfaz() {
    mainWorkArea.location = 'http://localhost/SIGA/Dispatcher.do?proceso=80';
    return false;
}
function establecerIP(dirIP) {
    document.formularioOcultoParaIP.IPCLIENTE.value = dirIP;
    document.formularioOcultoParaIP.submit();
}

function mainSub(msg) {
    if (!bloqueado) {
        if (typeof msg == "undefined")
            msg = "";
        if (jQueryTop("#mainWorkArea").length > 0 &&
            typeof jQueryTop("#mainWorkArea")[0].contentWindow != "undefined" &&
            typeof jQueryTop("#mainWorkArea")[0].contentWindow.jQuery != "undefined") {
            var mainWorkAreaJquery = jQueryTop("#mainWorkArea")[0].contentWindow.jQuery;
            try {
                mainWorkAreaJquery.blockUI({
                    message: '<div id="barraBloqueante"><span class="labelText">' + msg + '</span><br><img src="http://localhost/SIGA/html/imagenes/loadingBar.gif"/></div>',
                    css: { border: 0, background: 'transparent' },
                    overlayCSS: { backgroundColor: '#FFF', opacity: .0 }
                });
            } catch (e) {
                console.debug("[mainSub] blockUI");
                jQuery("#divEspera").show();
            }

        } else {
            jQuery("#divEspera").show();
        }
        bloqueado = true;
    }
}

function mainFin() {
    if (bloqueado) {
        if (jQueryTop("#mainWorkArea").length > 0 &&
            typeof jQueryTop("#mainWorkArea")[0].contentWindow != "undefined" &&
            typeof jQueryTop("#mainWorkArea")[0].contentWindow.jQuery != "undefined") {
            var mainWorkAreaJquery = jQueryTop("#mainWorkArea")[0].contentWindow.jQuery;
            try {
                mainWorkAreaJquery.unblockUI();
            } catch (e) {
                console.debug("[mainFin] unblockUI");
            }
        }
        jQuery("#divEspera").hide();
        bloqueado = false;
    }
}

function growl(msg, type) {
    jQuery('.notice-item-wrapper').remove();
    jQuery.noticeAdd({
        text: msg,
        type: type
    });
}

function jAlert(texto, ancho, alto){
    jQuery.noConflict();
    $("#dialog-message").html(texto);
    $("#dialog-message").height(alto);
    $("#dialog-message").dialog({
        modal: true,
        resizable: false,
        width: ancho,
        height: alto,
        buttons: { "Ok": function() { $(this).dialog("close"); $(this).dialog("destroy"); } }
    });
    $("#dialog-message").scrollTop(0);
}