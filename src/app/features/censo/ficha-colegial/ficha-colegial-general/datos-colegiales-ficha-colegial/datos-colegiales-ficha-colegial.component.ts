import { Component, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cardService } from "./../../../../../_services/cardSearch.service";
import { Location } from "@angular/common";
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { AutoComplete, Dialog, Calendar, DataTable } from 'primeng/primeng';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialColegialesObject } from '../../../../../models/FichaColegialColegialesObject';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';

@Component({
  selector: 'app-datos-colegiales-ficha-colegial',
  templateUrl: './datos-colegiales-ficha-colegial.component.html',
  styleUrls: ['./datos-colegiales-ficha-colegial.component.scss']
})
export class DatosColegialesFichaColegialComponent implements OnInit {
  tarjetaColegialesNum: string;
  activateNumColegiado: boolean = false;
  esColegiado:boolean = false;
  tarjetaColegiales;
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  openFicha: boolean = false;
  checkColegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  nuevoEstadoColegial: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  datePipeIncorporacion: boolean = false;
  datePipePresentacion: boolean = false;
  datePipeFechaJura: boolean = false;
  datePipeFechaTitulacion: boolean = false;
  fechaNacCambiada: boolean = false;
  yearRange: string;
  es: any = esCalendar;
  datosColegiales: any[] = [];
  activarGuardarColegiales: boolean = false;
  checkDatosColegiales: any[] = [];
  comboTipoSeguro: any[] = [];
  colegialesObject: FichaColegialColegialesObject = new FichaColegialColegialesObject();
  datosColegialesActual: any[] = [];
  datosColegialesInit: any[] = [];
  residente: String;
  colsColegiales;
  selectedItemColegiales: number = 10;
  filaEditable: boolean = false;
  selectedDatosColegiales;
  showMessageInscripcion;
  fichasPosibles = [
    {
      key: "colegiales",
      activa: false
    },
  ];
  idPersona;
  numSelectedColegiales: number = 0;
  inscritoChange: boolean = false;
  activacionTarjeta: boolean = false;
  desactivarVolver: boolean = true;
  emptyLoadFichaColegial: boolean = false;
  activacionEditar: boolean = true;
  esNewColegiado: boolean = false;
  isCrearColegial: boolean = false;
  inscritoSeleccionado: String = "00";
  inscritoDisabled: boolean = false;
  isRestablecer: boolean = false;
  isEliminarEstadoColegial: boolean = false;
  inscrito: string;
  fechaMinimaEstadoColegial: Date;
  situacionPersona: String;
  fechaMinimaEstadoColegialMod: Date;
  rowsPerPage;
  msgs: Message[];
  disableNumColegiado: boolean = true;

  @Input() generalBody:FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  @ViewChild("tableColegiales")
  tableColegiales: DataTable;
  constructor(private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private cardService: cardService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    // private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe,
    private location: Location,) { }

  ngOnInit() {
    this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";
    if (sessionStorage.getItem("esColegiado")) {
      this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
    } else {
      this.esColegiado = true;
    }
    this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
    this.idPersona = this.generalBody.idPersona;
    this.onInitColegiales();
    this.getYearRange();
    this.getLenguage();
    
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }


    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "286";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaColegialesNum = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        this.asignarPermisosTarjetas();
      }
    );

    let numColeAcceso = new ControlAccesoDto();
    numColeAcceso.idProceso = "12P";

    this.sigaServices.post("acces_control", numColeAcceso).subscribe(
      data => {
        let permiso = JSON.parse(data.body);
        let permisoArray = permiso.permisoItems;
        let numColegiado = permisoArray[0].derechoacceso;
        if (numColegiado == 3) {
          this.activateNumColegiado = true;
        } else {
          this.activateNumColegiado = false;
        }
      },
      err => {
        console.log(err);
      },
      () => {
        // this.checkAccesoOtrasColegiaciones();
      }
    );
    this.colsColegiales = [
      {
        field: "fechaEstado",
        header: "censo.nuevaSolicitud.fechaEstado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "situacionResidente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "observaciones",
        header: "gratuita.mantenimientoLG.literal.observaciones"
      }
    ];
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
  asignarPermisosTarjetas() {
    this.tarjetaColegiales = this.tarjetaColegialesNum;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }
  numMutualistaCheck() {
    if (this.colegialesBody.nMutualista != "") {
      this.activacionGuardarColegiales();
      if (Number(this.colegialesBody.nMutualista)) {
        return true;
      } else {
        this.colegialesBody.nMutualista = "";
        this.checkColegialesBody.nMutualista = "";
        return false;
      }
    } else {
      return true;
    }
  }
  pasarFechas() {

    this.colegialesBody.incorporacionDate = this.arreglarFecha(
      this.colegialesBody.incorporacion
    );
    this.colegialesBody.fechapresentacionDate = this.arreglarFecha(
      this.colegialesBody.fechapresentacion
    );
    this.colegialesBody.fechaTitulacionDate = this.arreglarFecha(
      this.colegialesBody.fechaTitulacion
    );
    this.colegialesBody.fechaJuraDate = this.arreglarFecha(
      this.colegialesBody.fechaJura
    );

    // Tabla de colegiales
    if (this.isCrearColegial == true) {
      this.nuevoEstadoColegial.fechaEstado = this.arreglarFecha(
        this.nuevoEstadoColegial.fechaEstadoStr
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
  getLenguage() {
    this.sigaServices.get("usuario").subscribe(response => {
      let currentLang = response.usuarioItem[0].idLenguaje;

      switch (currentLang) {
        case "1":
          this.es = esCalendar;
          break;
        case "2":
          this.es = catCalendar;
          break;
        case "3":
          this.es = euCalendar;
          break;
        case "4":
          this.es = glCalendar;
          break;
        default:
          this.es = esCalendar;
          break;
      }
    });
  }
  getYearRange() {
    let today = new Date();
    let year = today.getFullYear();
    this.yearRange = (year - 80) + ":" + (year + 20);
  }
  activarPaginacionColegial() {
    if (!this.datosColegiales || this.datosColegiales.length == 0) return false;
    else return true;
  }

  inscritoAItem() {
    if (this.inscritoSeleccionado == "1") {
      this.solicitudEditar.idTipoColegiacion = "20";
      this.colegialesBody.comunitario = "1";
    } else {
      this.solicitudEditar.idTipoColegiacion = "10";
      this.colegialesBody.comunitario = "0";
    }
  }

  itemAInscrito() {
    if (this.colegialesBody.situacionResidente != undefined && this.colegialesBody.comunitario != undefined) {
      this.inscritoSeleccionado = this.colegialesBody.comunitario.toString();
    }

    if (this.colegialesBody.comunitario == "0") {
      this.inscritoDisabled = true;
    } else {
      this.inscritoDisabled = false;
    }
  }

  activarRestablecerColegiales() {
    if (
      JSON.stringify(this.checkColegialesBody) !=
      JSON.stringify(this.colegialesBody) || this.isCrearColegial == true || this.isRestablecer == true
    ) {
      this.isRestablecer = true;
      return true;
    } else {
      this.isRestablecer = false;
      return false;
    }
  }

  mostrarFechas() {
    if (JSON.stringify(this.colegialesBody.incorporacion) != undefined &&
      JSON.stringify(this.colegialesBody.incorporacion) != null && JSON.stringify(this.colegialesBody.incorporacion).length > 13) {
      this.datePipeIncorporacion = true;
    } else {
      this.datePipeIncorporacion = false;
    }
    if (JSON.stringify(this.colegialesBody.fechapresentacion) != undefined &&
      JSON.stringify(this.colegialesBody.fechapresentacion) != null && JSON.stringify(this.colegialesBody.fechapresentacion).length > 13) {
      this.datePipePresentacion = true;
    } else {
      this.datePipePresentacion = false;
    }
    if (JSON.stringify(this.colegialesBody.fechaJura) != undefined &&
      JSON.stringify(this.colegialesBody.fechaJura) != null && JSON.stringify(this.colegialesBody.fechaJura).length > 13) {
      this.datePipeFechaJura = true;
    } else {
      this.datePipeFechaJura = false;
    }
    if (JSON.stringify(this.colegialesBody.fechaTitulacion) != undefined &&
      JSON.stringify(this.colegialesBody.fechaTitulacion) != null && JSON.stringify(this.colegialesBody.fechaTitulacion).length > 13) {
      this.datePipeFechaTitulacion = true;
    } else {
      this.datePipeFechaTitulacion = false;
    }
    //   datePipeIncorporacion: boolean = false;
    // datePipePresentacion: boolean = false;
    // datePipeFechaJura: boolean = false;
    // datePipeFechaTitulacion
  }

  activacionGuardarColegiales() {
    if (this.colegialesBody.situacionResidente == undefined && this.datosColegiales[0].situacionResidente != undefined)
      this.colegialesBody.situacionResidente = this.datosColegiales[0].situacionResidente
    this.inscritoAItem();
    this.mostrarFechas();
    if (
      JSON.stringify(this.checkColegialesBody) !=
      JSON.stringify(this.colegialesBody) &&
      this.colegialesBody.numColegiado != "" &&
      this.colegialesBody.situacionResidente != "" &&
      this.colegialesBody.situacionResidente != undefined &&
      this.colegialesBody.situacionResidente != "0" &&
      this.datosColegiales[0].idEstado != "" &&
      this.datosColegiales[0].idEstado != null &&
      this.colegialesBody.residenteInscrito != "" &&
      this.colegialesBody.incorporacion != null &&
      this.datosColegiales[0].fechaEstadoStr != null &&
      this.colegialesBody.fechapresentacion != null) {

      if (this.isCrearColegial == false) {
        this.activarGuardarColegiales = true;
      } else {
        if (this.nuevoEstadoColegial.situacion != "" && this.nuevoEstadoColegial.situacion != undefined &&
          this.nuevoEstadoColegial.situacionResidente != "" && this.nuevoEstadoColegial.situacionResidente != undefined &&
          this.nuevoEstadoColegial.fechaEstadoStr != "" && this.nuevoEstadoColegial.fechaEstadoStr != undefined) {

          this.activarGuardarColegiales = true;

        } else {
          if (JSON.stringify(this.datosColegiales) != JSON.stringify(this.checkDatosColegiales)) {
            this.activarGuardarColegiales = true;
          } else {
            this.activarGuardarColegiales = false;
          }
        }
      }
    } else {
      if (this.isCrearColegial == false) {
        let colegialesSinEditar = JSON.parse(JSON.stringify(this.datosColegiales));
        colegialesSinEditar.forEach(element => {
          element.habilitarObs = false;
        });
        if (JSON.stringify(colegialesSinEditar) != JSON.stringify(this.checkDatosColegiales) && this.datosColegiales[0].fechaEstadoStr != null && this.datosColegiales[0].idEstado != "" && this.datosColegiales[0].idEstado != null && this.colegialesBody.situacionResidente != "0" &&
          this.colegialesBody.situacionResidente != undefined && this.colegialesBody.situacionResidente != "") {
          this.activarGuardarColegiales = true;
        } else {
          this.activarGuardarColegiales = false;
        }
      } else if (this.colegialesBody.numColegiado != "" &&
        this.colegialesBody.situacionResidente != "" &&
        this.colegialesBody.situacionResidente != undefined &&
        this.colegialesBody.situacionResidente != "0" &&
        this.colegialesBody.residenteInscrito != "" &&
        this.colegialesBody.incorporacion != null &&
        this.colegialesBody.fechapresentacion != null &&
        this.colegialesBody.fechaJura != null &&
        this.nuevoEstadoColegial.situacion != "" && this.nuevoEstadoColegial.situacion != undefined &&
        this.nuevoEstadoColegial.situacionResidente != "" && this.nuevoEstadoColegial.situacionResidente != undefined &&
        this.nuevoEstadoColegial.fechaEstadoStr != "" && this.nuevoEstadoColegial.fechaEstadoStr != undefined) {

        this.activarGuardarColegiales = true;

      } else {
        if (JSON.stringify(this.datosColegiales) != JSON.stringify(this.checkDatosColegiales) &&
          this.nuevoEstadoColegial.situacion != "" && this.nuevoEstadoColegial.situacion != undefined &&
          this.nuevoEstadoColegial.situacionResidente != "" && this.nuevoEstadoColegial.situacionResidente != undefined &&
          this.nuevoEstadoColegial.fechaEstadoStr != "" && this.nuevoEstadoColegial.fechaEstadoStr != undefined) {

          this.activarGuardarColegiales = true;
        } else {
          this.activarGuardarColegiales = false;
        }
      }
    }
  }

  onInitColegiales() {
    this.itemAInscrito();
    this.sigaServices.get("fichaDatosColegiales_tipoSeguro").subscribe(
      n => {
        this.comboTipoSeguro = n.combooItems;
        this.arregloTildesCombo(this.comboTipoSeguro);

      },
      err => {
        console.log(err);
      }
    );
    this.searchColegiales();
    this.getInscritoInit();
    this.getSituacionPersona();
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }
  searchColegiales() {
    this.isEliminarEstadoColegial = false;
    // fichaDatosColegiales_datosColegialesSearch
    this.sigaServices
      .postPaginado(
        "fichaDatosColegiales_datosColegialesSearch",
        "?numPagina=1",
        this.generalBody
      )
      .subscribe(
        data => {
          // this.datosColegiales = JSON.parse(data["body"]);
          // this.datosColegiales = this.datosColegiales.colegiadoItem;

          // this.datosColegiales = JSON.parse(data["body"]);
          this.colegialesObject = JSON.parse(data["body"]);
          this.datosColegiales = this.colegialesObject.colegiadoItem;

          this.datosColegiales.forEach(element => {
            if (element.situacionResidente == "0") {
              element.situacionResidente = "No";
            } else if (element.situacionResidente == "1") {
              element.situacionResidente == "Si";
            }
          });
          this.datosColegialesInit = JSON.parse(JSON.stringify(this.datosColegiales));

          if (this.datosColegiales.length > 0) {
            this.fechaMinimaEstadoColegial = this.sumarDia(JSON.parse(this.datosColegiales[0].fechaEstado));

            // Asignamos al primer registro la bandera de modificacion, ya que podremos modificar el último estado
            // Al traer la lista ordenada por fechaEstado desc, tendremos en la primera posición el último estado añadido
            for (let i in this.datosColegiales) {
              if (i == '0') {
                this.datosColegiales[i].isMod = true;
              } else {
                this.datosColegiales[i].isMod = false;
              }

              if (this.datosColegiales[i].situacionResidente == 'Si') {
                this.datosColegiales[i].idSituacionResidente = 1;
              } else {
                this.datosColegiales[i].idSituacionResidente = 0;
              }
            }

            if (this.datosColegiales.length > 1) {
              // Siempre podremos editar todos los campos del último estado insertado
              // Si tenemos mas de 1 estado en la tabla, la fecha minima a la que podemos modificar la fechaEstado del último estado será la del anterior estado
              this.fechaMinimaEstadoColegialMod = this.sumarDia(JSON.parse(this.datosColegiales[1].fechaEstado));
            }

          }

          this.datosColegiales.forEach(element => {
            element.habilitarObs = false;
          });
          this.checkDatosColegiales = JSON.parse(JSON.stringify(this.datosColegiales));
        },
        err => {
          console.log(err);
        }, () => {
          if (this.generalBody.colegiado) {
            this.sigaServices
              .postPaginado(
                "fichaDatosColegiales_datosColegialesSearchActual",
                "?numPagina=1",
                this.generalBody
              )
              .subscribe(
                data => {
                  // this.datosColegiales = JSON.parse(data["body"]);
                  // this.datosColegiales = this.datosColegiales.colegiadoItem;

                  // this.datosColegiales = JSON.parse(data["body"]);
                  this.colegialesObject = JSON.parse(data["body"]);
                  this.datosColegialesActual = this.colegialesObject.colegiadoItem;
                  //this.estadoColegial = this.datosColegialesActual[0].estadoColegial;

                  if (this.datosColegiales[0].situacionResidente == "1" || this.datosColegiales[0].situacionResidente == "Si") {
                    this.residente = "Si";
                  } else {
                    this.residente = "No";
                  }
                }
              );
          }
        }
      );
  }
  getInscritoInit() {
    if (
      this.inscritoSeleccionado == "1"
    ) {
      this.inscrito = "Si";
      this.solicitudEditar.idTipoColegiacion = "20";
    } else {
      this.inscrito = "No";
      this.solicitudEditar.idTipoColegiacion = "10";

    }
  }
  getSituacionPersona() {
    // •	Situación:
    // o	‘Fallecido’ si está marcado como tal.
    // o	‘No colegiado’ en caso de no estar colegiado en ningún colegio.
    // o	‘Activo’ en caso de estar colegiado en algún colegio con estado ‘Ejerciente’ o ‘No ejerciente’.
    // o	‘De baja’ en cualquier otro caso.

    //     0: {label: "Baja Colegial", value: "30"}
    // 1: {label: "Baja Por Deceso", value: "60"}
    // 2: {label: "Ejerciente", value: "20"}
    // 3: {label: "Inhabilitación", value: "40"}
    // 4: {label: "No Ejerciente", value: "10"}
    // 5: {label: "Suspensión Ejercicio", value: "50"
    if (this.colegialesBody.situacion == "60") {
      this.situacionPersona = "Fallecido";
    } else if (
      this.colegialesBody.situacion == "20" ||
      this.colegialesBody.situacion == "10"
    ) {
      if (this.colegialesBody.comunitario == "1") {
        this.situacionPersona = "Abogado Inscrito";
      } else {
        this.situacionPersona = "Activo";
      }
    } else if (this.colegialesBody.situacion != undefined) {
      this.situacionPersona = "De baja";
    } else {
      this.situacionPersona = "No Colegiado";
    }
  }
  onChangeRowsPerPagesColegiales(event) {
    this.selectedItemColegiales = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableColegiales.reset();
  }
  sumarDia(fechaInput) {
    let fecha = new Date(fechaInput);
    let one_day = 1000 * 60 * 60 * 24;
    let ayer = fecha.getMilliseconds() + one_day;
    fecha.setMilliseconds(ayer);
    return fecha;
  }
  restablecerColegiales() {
    this.selectedDatosColegiales = '';
    this.showMessageInscripcion = false;
    this.colegialesBody = JSON.parse(JSON.stringify(this.checkColegialesBody));
    // this.colegialesBody = this.colegialesBody[0];
    this.itemAInscrito();
    this.checkColegialesBody = new FichaColegialColegialesItem();
    this.nuevoEstadoColegial = new FichaColegialColegialesItem();

    this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
    this.isCrearColegial = false;
    this.filaEditable = false;
    this.isEliminarEstadoColegial = false;
    this.isRestablecer = false;
    this.inscritoChange = false;

    this.activarGuardarColegiales = false;
    this.numSelectedColegiales = 0;
    this.searchColegiales();
  }

  onRowSelectColegiales(selectedDatos) {
    this.numSelectedColegiales = 1;
    this.datosColegiales.forEach(element => {
      element.habilitarObs = false;
    });
    if (!this.isCrearColegial) {
      if (selectedDatos.isMod == true) {
        this.filaEditable = true;
        this.isEliminarEstadoColegial = true;
      } else {
        this.filaEditable = false;
        this.isEliminarEstadoColegial = false;
        selectedDatos.habilitarObs = true;
      }
    }
  }
  disableEnableNumCol() {
    this.disableNumColegiado = !this.disableNumColegiado;
  }
  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  showFailDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }
}
