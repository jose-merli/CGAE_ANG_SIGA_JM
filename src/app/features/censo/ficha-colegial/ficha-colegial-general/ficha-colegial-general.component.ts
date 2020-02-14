import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-colegial-general',
  templateUrl: './ficha-colegial-general.component.html',
  styleUrls: ['./ficha-colegial-general.component.scss']
})
export class FichaColegialGeneralComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (sessionStorage.getItem("fichaColegialByMenu")) {
      this.getColegiadoLogeado();
    } else {
      this.OnInit();
    }
  }

  OnInit() {
    this.initSpinner = true;
    this.getYearRange();
    this.getLenguage();
    this.checkAccesos();
    sessionStorage.removeItem("direcciones");
    sessionStorage.removeItem("situacionColegialesBody");
    sessionStorage.removeItem("fichaColegial");

    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.disabledNif = true;
    } else {
      this.disabledNif = false;
    }

    if (sessionStorage.getItem("disabledAction") == "true") {
      // Es estado baja colegial
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    if (sessionStorage.getItem("solimodifMensaje")) {
      this.solicitudModificacionMens = sessionStorage.getItem("solimodifMensaje");
      sessionStorage.removeItem("solimodifMensaje");
    }

    // Cogemos los datos de la busqueda de Colegiados
    this.getLetrado();
    if (sessionStorage.getItem("filtrosBusquedaColegiados")) {
      sessionStorage.removeItem("filtrosBusquedaColegiadosFichaColegial");
      this.persistenciaColeg = new DatosColegiadosItem();
      this.persistenciaColeg = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaColegiados")
      );
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("filtrosBusquedaNoColegiados")) {
      sessionStorage.removeItem("filtrosBusquedaNoColegiadosFichaColegial");
      this.persistenciaNoCol = new NoColegiadoItem();
      this.persistenciaNoCol = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaNoColegiados")
      );
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.disabledNif = true;
      this.desactivarVolver = false;
    } else if (sessionStorage.getItem("fichaColegialByMenu")) {
      this.desactivarVolver = true;
    } else if (sessionStorage.getItem("destinatarioCom") != null) {
      this.desactivarVolver = false;
    } else {
      //  LLEGA DESDE PUNTO DE MENÚ
      this.emptyLoadFichaColegial = JSON.parse(
        sessionStorage.getItem("emptyLoadFichaColegial")
      );
      // if (this.emptyLoadFichaColegial) {
      // this.showFailDetalle(
      //   "No se han podido cargar los datos porque el usuario desde el que ha inciado sesión no es colegiado"
      // );
      // }
      this.desactivarVolver = true;
    }

    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      sessionStorage.removeItem("esNuevoNoColegiado");
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
      this.idPersona = this.generalBody.idPersona;
      if (sessionStorage.getItem("esColegiado")) {
        this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
      } else {
        this.esColegiado = true;
      }

      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }

      let migaPan = "";

      if (this.esColegiado) {
        migaPan = this.translateService.instant("menu.censo.fichaColegial");
      } else {
        migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
      }

      sessionStorage.setItem("migaPan", migaPan);

      this.generalBody.colegiado = this.esColegiado;
      this.checkGeneralBody.colegiado = this.esColegiado;
      this.tipoCambioAuditoria = null;
      // this.checkAcceso();
      this.onInitGenerales();
      this.onInitCurriculares();
      this.onInitColegiales();
      this.onInitSociedades();
      this.onInitOtrasColegiaciones();
      this.searchSanciones();
      this.searchCertificados();
    } else {
      if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.isLetrado = false;
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      } else if (sessionStorage.getItem("nuevoNoColegiado")) {
        let enviar = JSON.parse(sessionStorage.getItem("nuevoNoColegiado"));
        this.generalBody = new FichaColegialGeneralesItem();
        this.colegialesBody = new FichaColegialColegialesItem();
        this.generalBody = enviar;
        this.generalBody.nif = enviar.numeroIdentificacion;
        this.generalBody.apellidos1 = enviar.apellido1;
        this.generalBody.soloNombre = enviar.nombre;
        this.generalBody.idInstitucion = enviar.idInstitucion;
        this.generalBody.apellidos2 = enviar.apellido2;
        this.situacionPersona = enviar.idEstado;
        if (this.generalBody.fechaNacimiento != null && this.generalBody.fechaNacimiento != undefined) {
          this.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
        }
        this.desactivarVolver = false;
        if (sessionStorage.getItem("nifNuevo") != undefined) {
          this.generalBody.nif = sessionStorage.getItem("nifNuevo");
          let bodyNuevo = JSON.parse(sessionStorage.getItem("bodyNuevo"));
          this.generalBody.soloNombre = bodyNuevo.nombre;
          this.generalBody.apellidos1 = bodyNuevo.primerApellido;
          this.generalBody.apellidos2 = bodyNuevo.segundoApellido;
          sessionStorage.removeItem("nifNuevo");
          sessionStorage.removeItem("bodyNuevo");

        }

        this.colegialesBody = JSON.parse(JSON.stringify(this.generalBody));
        this.compruebaDNI();
      } else {
        this.generalBody = new FichaColegialGeneralesItem();
        this.colegialesBody = new FichaColegialColegialesItem();
      }

      // this.searchDatosBancariosIdPersona.datosBancariosItem[0] = new DatosBancariosItem();
    }

    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      sessionStorage.removeItem("esNuevoNoColegiado");
      this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    if (!this.esNewColegiado && this.generalBody.idPersona != null && this.generalBody.idPersona != undefined) {
      this.onInitCurriculares();
      this.onInitDirecciones();
      this.onInitDatosBancarios();
      this.comprobarREGTEL();

    }

    if (sessionStorage.getItem("busquedaCensoGeneral") == "true") {
      this.generalBody.idTipoIdentificacion = "10";
    }

    // obtener parametro para saber si se oculta la auditoria
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          let parametroOcultarMotivo = JSON.parse(data.body);
          if (parametroOcultarMotivo.parametro == "S" || parametroOcultarMotivo.parametro == "s") {
            this.ocultarMotivo = true;
          } else if (parametroOcultarMotivo.parametro == "N" || parametroOcultarMotivo.parametro == "n") {
            this.ocultarMotivo = false;
          } else {
            this.ocultarMotivo = undefined;
          }
        },
        err => {
          console.log(err);
        }
      );

    // this.onInitSociedades();

    // this.onInitOtrasColegiaciones();

    if (!this.esNewColegiado) {
      this.compruebaDNI();
    }
  }



  getColegiadoLogeado() {
    this.generalBody.searchLoggedUser = true;

    this.sigaServices
      .postPaginado('busquedaColegiados_searchColegiado', '?numPagina=1', this.generalBody)
      .subscribe(
        (data) => {
          let busqueda = JSON.parse(data['body']);
          if (busqueda.colegiadoItem.length > 0) {
            this.OnInit();
            this.displayColegiado = false;

          } else {
            this.displayColegiado = true;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
