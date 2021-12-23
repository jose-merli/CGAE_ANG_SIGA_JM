import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { DatosSolicitudMutualidadItem } from '../../../../../models/DatosSolicitudMutualidadItem';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { DatosBancariosItem } from '../../../../../models/DatosBancariosItem';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';

@Component({
  selector: 'app-mutualidad-abogacia-ficha-colegial',
  templateUrl: './mutualidad-abogacia-ficha-colegial.component.html',
  styleUrls: ['./mutualidad-abogacia-ficha-colegial.component.scss']
})
export class MutualidadAbogaciaFichaColegialComponent implements OnInit, OnChanges {
  @Input() tarjetaMutualidad;
  msgs = [];
  progressSpinner: boolean = false;
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  tratamientoDesc: String;
  generalTratamiento: any[] = [];
  fechaNacimiento: Date;
  fechaAlta: Date;
  @Input() datosBancarios: DatosBancariosItem[] = [];
  @Input() datosDirecciones: DatosDireccionesItem[] = [];
  jueves = false;


  constructor(private sigaServices: SigaServices,
    private router: Router,
    private translateService: TranslateService) { }

  ngOnInit() {

    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
    }


  }

  ngOnChanges() {

    if ((this.tarjetaMutualidad == "2" || this.tarjetaMutualidad == "3") && !this.jueves) {
      this.sigaServices.get("fichaColegialGenerales_tratamiento").subscribe(
        n => {
          this.jueves = true;
          this.generalTratamiento = n.combooItems;
          let tratamiento = this.generalTratamiento.find(
            item => item.value === this.generalBody.idTratamiento
          );
          if (tratamiento != undefined && tratamiento.label != undefined) {
            this.tratamientoDesc = tratamiento.label;
          }
        },
        err => {
          //console.log(err);
          this.jueves = true;

        }
      );
    }
  }

  arreglarFecha(fecha) {

    if (fecha != undefined && fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(rawDate);
      }
    }
    return fecha;
  }
  irPlanUniversal() {
    this.prepararDatosMutualidad();
    this.arreglarFechas();
    if (this.generalBody.nif == undefined || this.generalBody.nif == "" || this.generalBody.fechaNacimientoDate == undefined || this.generalBody.fechaNacimientoDate == null) {
      this.showFailDetalle("Asegurese de que el NIF y la fecha de nacimiento son correctos");
    } else {
      this.progressSpinner = true;
      let mutualidadRequest = new DatosSolicitudMutualidadItem();
      mutualidadRequest.numeroidentificador = this.generalBody.nif;
      this.sigaServices
        .post("mutualidad_searchSolicitud", mutualidadRequest)
        .subscribe(
          result => {
            let resultParsed = JSON.parse(result.body);
            if (
              resultParsed.idsolicitud != null &&
              resultParsed.idsolicitud != undefined
            ) {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1") || (prueba.idSolicitud != "0")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");
                        this.progressSpinner = false;

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                        this.progressSpinner = false;

                      }
                    }
                  },
                  error => {
                    //console.log(error);
                    this.progressSpinner = false;

                  }
                );
            } else {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/MutualidadAbogaciaPlanUniversal"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");
                        this.progressSpinner = false;

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                        this.progressSpinner = false;

                      }
                    }
                  },
                  error => {
                    //console.log(error);
                    this.progressSpinner = false;

                  }
                );
            }
          }, error => {
            //console.log(error);
            this.progressSpinner = false;

          }
        );
    }
  }

  clear() {
    this.msgs = [];
  }
  showFailDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }
  irSegAccidentes() {
    this.prepararDatosMutualidad();
    this.arreglarFechas();
    if (this.generalBody.nif == undefined || this.generalBody.nif == "" || this.generalBody.fechaNacimientoDate == undefined || this.generalBody.fechaNacimientoDate == null) {
      this.showFailDetalle("Asegurese de que el NIF y la fecha de nacimiento son correctos");
    } else {
      this.progressSpinner = true;
      let mutualidadRequest = new DatosSolicitudMutualidadItem();
      mutualidadRequest.numeroidentificador = this.generalBody.nif;
      this.sigaServices
        .post("mutualidad_searchSolicitud", mutualidadRequest)
        .subscribe(
          result => {
            let resultParsed = JSON.parse(result.body);
            if (
              resultParsed.idsolicitud != null &&
              resultParsed.idsolicitud != undefined
            ) {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1") || (prueba.idSolicitud != "0")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/mutualidadSeguroAccidentes"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");
                        this.progressSpinner = false;

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                        this.progressSpinner = false;

                      }
                    }
                  },
                  error => {
                    //console.log(error);
                    this.progressSpinner = false;

                  }
                );
            } else {
              this.arreglarFechas();
              this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
              this.solicitudEditar.idPais = "191";
              this.solicitudEditar.identificador = this.generalBody.nif;
              this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
              this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
              this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
              this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
              this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
              this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
              this.solicitudEditar.tratamiento = this.tratamientoDesc;
              this.sigaServices
                .post("mutualidad_estadoMutualista", this.solicitudEditar)
                .subscribe(
                  result => {
                    let prueba = JSON.parse(result.body);
                    if ((prueba.valorRespuesta == "1")) {
                      this.solicitudEditar.idSolicitudMutualidad = prueba.idSolicitud;
                      this.solicitudEditar.estadoMutualidad = prueba.valorRespuesta;
                      this.solicitudEditar.tipoIdentificacion = this.generalBody.idTipoIdentificacion;
                      this.solicitudEditar.nombre = this.solicitudEditar.soloNombre;
                      sessionStorage.setItem(
                        "solicitudEnviada",
                        JSON.stringify(this.solicitudEditar)
                      );
                      this.router.navigate(["/mutualidadSeguroAccidentes"]);
                    } else {
                      //  this.modoLectura = true;
                      if (prueba.valorRespuesta == undefined || prueba.valorRespuesta == null || prueba.valorRespuesta == "") {
                        this.showInfo("No se ha podido comprobar si tiene ya un Plan Universal");
                        this.progressSpinner = false;

                      } else {
                        this.showInfo(prueba.valorRespuesta);
                        this.progressSpinner = false;

                      }
                    }
                  },
                  error => {
                    //console.log(error);
                    this.progressSpinner = false;

                  }
                );
            }
          }, error => {
            //console.log(error);
            this.progressSpinner = false;

          }
        );
    }
  }

  prepararDatosMutualidad() {
    if (this.datosDirecciones.length > 0) {
      for (let i in this.datosDirecciones) {
        if ((this.datosDirecciones[i].idTipoDireccion.find(x => x == "3")) != "-1") {
          let direccion = this.datosDirecciones[i];
          sessionStorage.setItem(
            "direcciones",
            JSON.stringify(direccion)
          );
        }
      }

    }
    if (this.datosBancarios.length > 0) {
      let masActual;
      let tieneCargo;
      for (let i in this.datosBancarios) {
        if (masActual == undefined || this.datosBancarios[i].fechaModificacion > masActual.fechaModificacion) {
          masActual = this.datosBancarios[i];
        }
        if (this.datosBancarios[i].uso == "ABONO/CARGO" || this.datosBancarios[i].uso == "CARGO" || this.datosBancarios[i].uso == "PARA TODO") {
          tieneCargo = this.datosBancarios[i];
        }
      }
      let cuenta = masActual;

      if (tieneCargo != undefined) {
        cuenta = tieneCargo;
      } else {
        cuenta = masActual;
      }
      sessionStorage.setItem(
        "cuentas",
        JSON.stringify(cuenta)
      );
    }
  }


  arreglarFechas() {
    if (this.fechaNacimiento != undefined) {
      this.generalBody.fechaNacimientoDate = this.transformaFecha(
        this.fechaNacimiento
      );
    }
    if (this.fechaAlta != undefined) {
      this.generalBody.incorporacionDate = this.transformaFecha(this.fechaAlta);
    }
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }
}
