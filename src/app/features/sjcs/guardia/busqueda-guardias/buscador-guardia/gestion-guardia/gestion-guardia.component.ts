import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { procesos_guardia } from '../../../../../../permisos/procesos_guarida';
import { procesos_maestros } from '../../../../../../permisos/procesos_maestros';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';


@Component({
  selector: 'app-gestion-guardia',
  templateUrl: './gestion-guardia.component.html',
  styleUrls: ['./gestion-guardia.component.scss']
})
export class GestionGuardiaComponent implements OnInit {



  @Input() datos;
  modoEdicion: boolean;
  permisoEscrituraDatosGenerales: boolean = false;
  permisoEscrituraResumen: boolean = false;
  permisoEscrituraConfCalen: boolean = false;
  permisoEscrituraConfCola: boolean = false;
  permisoEscrituraColaGuardia: boolean = false;
  permisoEscrituraIncomp: boolean = false;
  permisoEscrituraBaremos: boolean = false;
  permisoEscrituraCalen: boolean = false;
  permisoEscrituraInscripciones: boolean = false;
  permisoEscrituraTurno: boolean = false;
  historico: boolean = false;
  progressSpinner: boolean = false;
  datosRedy = new EventEmitter<any>();

  infoResumen = [];
  enlacesTarjetaResumen: any[] = [];
  manuallyOpened: Boolean;
  openGen: Boolean = false;
  openCalendarios: Boolean = false;
  openConfigCola: Boolean = false;
  openCola: Boolean = false;
  openIncompatibilidades: Boolean = false;
  openBaremos: Boolean = false;
  openCalendarioGuardia: Boolean = false;
  openInscripciones: Boolean = false;
  openTurno: Boolean = false;

  tarjetaDatosGenerales: string;
  tarjetaCalendariosGuardias: string;
  tarjetaConfigColatarjetaColaGuardia: string;
  tarjetaColaGuardia: string;
  tarjetaIncompatibilidades: string;
  tarjetaBaremos: string;
  tarjetaCalendarios: string;
  tarjetaInscripcionesGuardias: string;
  tarjetaTurnoGuardias: string;
  persistenciaGuardia: GuardiaItem;
  origenGuarColeg: boolean;
  guardiaCole: any;
  idTurnoFromFichaTurno = null;
  constructor(private persistenceService: PersistenceService,
    private location: Location, private sigaServices: SigaServices,
    private commonService: CommonsService,
    private translateService: TranslateService,
    private router: Router) { }


  ngOnInit() {
    this.infoResumen = [];
    // Comprobar si venimos de Saltos de Compesaciones para informar Datos de Guardias.
    if (sessionStorage.getItem("saltos-compesacionesItem")) {
      this.persistenceService.setDatos(sessionStorage.getItem("saltos-compesacionesItem"));
    }
    if (this.persistenceService.getDatos() != undefined) {
      this.search();
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
      this.openGen = true;
    }
    this.obtenerPermisos();

    if (sessionStorage.getItem("crearGuardiaFromFichaTurno")) {

      this.persistenciaGuardia = new GuardiaItem();
      this.persistenciaGuardia = JSON.parse(
        sessionStorage.getItem("crearGuardiaFromFichaTurno")
      );
      this.datos = JSON.parse(JSON.stringify(this.persistenciaGuardia));
      this.idTurnoFromFichaTurno = this.persistenciaGuardia.idTurno;
    }
    if (sessionStorage.getItem("filtrosBusquedaGuardias")) {

      this.persistenciaGuardia = new GuardiaItem();
      this.persistenciaGuardia = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaGuardias")
      );

      //sessionStorage.removeItem("filtrosBusquedaGuardias");
    }

    //en caso de que la guardia venga desde Guardias de Colegiado.
    if (sessionStorage.getItem("originGuarCole") == "true") {
      if (sessionStorage.getItem("datosGuardiaGuardiaColeg")) {

        this.guardiaCole = JSON.parse(sessionStorage.getItem("datosGuardiaGuardiaColeg"));
        this.guardiaCole = true;
        this.search();
        sessionStorage.removeItem("datosGuardiaGuardiaColeg");
      }
      sessionStorage.removeItem("originGuarCole");
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    this.enviarEnlacesTarjeta();
  }
  search() {
    //this.progressSpinner = true;
    if (this.origenGuarColeg) {
      this.datos = JSON.parse(sessionStorage.getItem("datosGuardiaGuardiaColeg"));
      this.origenGuarColeg = false
    } else {
      this.datos = JSON.parse(JSON.stringify(this.persistenceService.getDatos()));
    }

    this.sigaServices.post("busquedaGuardias_getGuardia", this.datos).subscribe(
      n => {
        this.datos = JSON.parse(n.body);
        this.sigaServices.notifysendDatosRedy(n);
        this.getDatosResumen();

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      })
  }



  backTo() {
    if (sessionStorage.getItem("crearGuardiaFromFichaTurno")) {
      this.router.navigate(["/gestionTurnos"], { queryParams: { idturno: this.idTurnoFromFichaTurno } });
      sessionStorage.removeItem("crearGuardiaFromFichaTurno");
    } else {
      if (this.persistenciaGuardia != undefined) {
        sessionStorage.setItem(
          "filtrosBusquedaGuardiasFichaGuardia",
          JSON.stringify(this.persistenciaGuardia)
        );
      }
      /*let dataToSend = {
        'duplicar': false,
        'tabla': [],
        'turno':row.cells[0].value,
        'nombre': row.cells[1].value,
        'generado': row.cells[8].value,
        'numGuardias': row.cells[9].value,
        'listaGuarias': row.cells[5].value,
        'fechaDesde': row.cells[2].value,
        'fechaHasta': row.cells[3].value,
        'fechaProgramacion': row.cells[4].value.value,
        'estado': row.cells[7].value,
        'observaciones': row.cells[6].value,
        'idCalendarioProgramado': row.cells[10].value,
        'idTurno': row.cells[11].value,
        'idGuardia': row.cells[12].value
      }*/
      let datosFichaProgramacion = this.persistenceService.getDatos();
      this.persistenceService.setDatos(datosFichaProgramacion);
      //this.router.navigate(["/fichaProgramacion"]);
      this.location.back();
    }
  }

  modoEdicionSend(event) {
    if (event) {
      this.search();
      this.modoEdicion = true;
    }else{
      this.getDatosResumen();
    }
  }

  getDatosResumen() {
    this.sigaServices.post("busquedaGuardias_resumenGuardia", this.datos).subscribe(
      r => {
        this.infoResumen = [
          {
            label: "Turno",
            value: JSON.parse(r.body).turno
          },
          {
            label: "Guardia",
            value: JSON.parse(r.body).nombre
          },
          {
            label: "Tipo de guardia",
            value: JSON.parse(r.body).idTipoGuardia
          },
          {
            label: "Número de inscritos",
            value: JSON.parse(r.body).letradosGuardia
          }
        ]
      });

  }

  obtenerPermisos() {
    // Aqui obtenemos todos los permisos de las distintas fichas.
    // Estos permisos nos diran si estaran las fichas desbilitadaso no apareceran.

    //this.progressSpinner = true
    this.commonService.checkAcceso(procesos_guardia.resumen)
      .then(respuesta => {

        this.permisoEscrituraResumen = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraResumen);

        // if (this.permisoEscrituraResumen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.turno)
      .then(respuesta => {

        this.permisoEscrituraTurno = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraTurno);

        // if (this.permisoEscrituraTurno == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.conf_cola)
      .then(respuesta => {

        this.permisoEscrituraConfCola = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraConfCola);

        // if (this.permisoEscrituraConfCola == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.conf_calendario)
      .then(respuesta => {

        this.permisoEscrituraConfCalen = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraConfCalen);

        // if (this.permisoEscrituraConfCalen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.cola_guardia)
      .then(respuesta => {

        this.permisoEscrituraColaGuardia = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraColaGuardia);

        // if (this.permisoEscrituraResumen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.inscripciones)
      .then(respuesta => {

        this.permisoEscrituraInscripciones = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraInscripciones);

        // if (this.permisoEscrituraResumen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.baremos)
      .then(respuesta => {

        this.permisoEscrituraBaremos = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraBaremos);

        // if (this.permisoEscrituraResumen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));


    this.commonService.checkAcceso(procesos_guardia.incompatibilidades)
      .then(respuesta => {

        this.permisoEscrituraIncomp = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraIncomp);

        // if (this.permisoEscrituraResumen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));


    this.commonService.checkAcceso(procesos_guardia.calendario)
      .then(respuesta => {

        this.permisoEscrituraCalen = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraCalen);

        // if (this.permisoEscrituraResumen == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => console.error(error));

    this.commonService.checkAcceso(procesos_guardia.datos_generales)
      .then(respuesta => {

        this.permisoEscrituraDatosGenerales = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraDatosGenerales);
        this.progressSpinner = false;
        // if (this.permisoEscrituraDatosGenerales == undefined) {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem(
        //     "descError",
        //     this.translateService.instant("generico.error.permiso.denegado")
        //   );
        //   this.router.navigate(["/errorAcceso"]);
        // }

      }
      ).catch(error => {
        console.error(error);
        this.progressSpinner = false
      });

    //
    //PROVISIONAL
    //cuando se vaya a seguir con el desarrollo de guardias, hay que cambiar esto y la carga de las tarjetas
    //
    setTimeout(() => {
      this.enviarEnlacesTarjeta();
    }, 2000);
  }

  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = [];

    let pruebaTarjeta = {
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.guardia.gestion.configuracionCalendarios",
      value: document.getElementById("calendarioGuardia"),
      nombre: "calendarioGuardia",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.guardia.gestion.configuracionCola",
      value: document.getElementById("configuracionCola"),
      nombre: "configuracionCola",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.oficio.turnos.coladeguardias",
      value: document.getElementById("colaGuardias"),
      nombre: "colaGuardias",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "dato.jgr.guardia.guardias.incompatibilidades",
      value: document.getElementById("incompatibilidades"),
      nombre: "incompatibilidades",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "dato.jgr.guardia.guardias.baremos",
      value: document.getElementById("baremos"),
      nombre: "baremos",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "agenda.fichaEventos.datosGenerales.calendario",
      value: document.getElementById("calendarios"),
      nombre: "calendarios",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "menu.justiciaGratuita.oficio.inscripciones",
      value: document.getElementById("inscripciones"),
      nombre: "inscripciones",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "dato.jgr.guardia.guardias.turno",
      value: document.getElementById("turnos"),
      nombre: "turnos",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);
  }

  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openGen = this.manuallyOpened;
          break;
        case "calendarioGuardia":
          this.openCalendarioGuardia = this.manuallyOpened;
          break;
        case "configuracionCola":
          this.openConfigCola = this.manuallyOpened;
          break;
        case "colaGuardias":
          this.openCola = this.manuallyOpened;
          break;
        case "incompatibilidades":
          this.openIncompatibilidades = this.manuallyOpened;
          break;
        case "baremos":
          this.openBaremos = this.manuallyOpened;
          break;
        case "calendarios":
          this.openCalendarios = this.manuallyOpened;
          break;
        case "inscripciones":
          this.openInscripciones = this.manuallyOpened;
          break;
        case "turnos":
          this.openTurno = this.manuallyOpened;
          break;
      }
    }
  }

  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openGen = true;
          break;
        case "calendarioGuardia":
          this.openCalendarioGuardia = true;
          break;
        case "configuracionCola":
          this.openConfigCola = true;
          break;
        case "colaGuardias":
          this.openCola = true;
          break;
        case "incompatibilidades":
          this.openIncompatibilidades = true;
          break;
        case "baremos":
          this.openBaremos = true;
          break;
        case "calendarios":
          this.openCalendarios = true;
          break;
        case "inscripciones":
          this.openInscripciones = true;
          break;
        case "turnos":
          this.openTurno = true;
          break;
      }
    }
  }
}