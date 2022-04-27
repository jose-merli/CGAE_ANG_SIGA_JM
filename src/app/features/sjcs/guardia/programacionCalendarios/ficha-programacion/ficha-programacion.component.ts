import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '@angular/router';
import { Row } from '../../../../../commons/tabla-resultado-mix/tabla-resultado-mix-incompatib.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { GlobalGuardiasService } from '../../guardiasGlobal.service';
import { saveAs } from "file-saver/FileSaver";
import { CalendarioProgramadoItem } from '../../../../../models/guardia/CalendarioProgramadoItem';
import * as moment from 'moment';
import { CalendariosDatosEntradaItem } from '../CalendariosDatosEntradaItem.model';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-ficha-programacion',
  templateUrl: './ficha-programacion.component.html',
  styleUrls: ['./ficha-programacion.component.scss']
})
export class FichaProgramacionComponent implements OnInit {



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
  tarjetaCalendariosGuardias: string;
  tarjetaConfigColatarjetaColaGuardia: string;
  tarjetaColaGuardia: string;
  tarjetaIncompatibilidades: string;
  tarjetaBaremos: string;
  tarjetaCalendarios: string;
  tarjetaInscripcionesGuardias: string;
  tarjetaTurnoGuardias: string;
  persistenciaGuardia: GuardiaItem;
  datosTarjetaGuardiasCalendario = [];
  datosTarjetaGuardiasCalendarioIni = [];
  filtros = new CalendarioProgramadoItem();
  datosGenerales = {
    'duplicar': '',
    'tabla': [],
    'turno': '',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': { label: '', value: undefined },
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'guardias': [],
  };

  datosGeneralesIniciales = {
    'duplicar': '',
    'tabla': [],
    'turno': '',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'guardias': []
  };
  rowGroupsSaved: Row[];
  dataToReceive = {
    'duplicar': false,
    'tabla': [],
    'turno': '',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': '',
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': '',
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'filtrosBusqueda': new CalendarioProgramadoItem()
  }
  estado: string = "";
  dataReady = false;
  duplicar;
  fInicioElegida = "";
  fFinElegida = "";
  msgs;
  disableGenerar = true;
  idConjuntoGuardiaElegido;
  suscription: Subscription;
  wrongList = [];
  fromCombo = false;

  comboEstados = [
    { label: "Pendiente", value: "4" },
    { label: "Programada", value: "0" },
    { label: "En proceso", value: "1" },
    { label: "Procesada con Errores", value: "2" },
    { label: "Generada", value: "3" },
    { label: "Reprogramada", value: "5" }
  ];

  constructor(private persistenceService: PersistenceService,
    private location: Location, private sigaServices: SigaServices,
    private commonService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe,
    private globalGuardiasService: GlobalGuardiasService) { }


  ngOnInit() {
    this.suscription = this.globalGuardiasService.getConf().subscribe((confValue) => {
      this.dataReady = false;
      this.idConjuntoGuardiaElegido = confValue.idConjuntoGuardia;
      this.fromCombo = confValue.fromCombo;

      if (this.modoEdicion) {
        this.dataReady = true;
      }
    });

    //console.log('this.persistenceService.getDatos(): ', this.persistenceService.getDatos())
    this.infoResumen = [];
    if (this.persistenceService.getDatos() != undefined) {
      this.dataToReceive = this.persistenceService.getDatos();

      if (this.dataToReceive.idCalendarioProgramado != null) {
        this.disableGenerar = false;
        this.getGuardiasFromCal(this.dataToReceive.idCalendarioProgramado, this.dataToReceive.fechaDesde, this.dataToReceive.fechaHasta);
      } else {
        this.disableGenerar = true;
        this.dataReady = true;
      }
      this.rowGroupsSaved = this.persistenceService.getDatos().tabla;
      //console.log('rowGroupsSaved: ', this.rowGroupsSaved)
      this.datosGenerales = this.persistenceService.getDatos();
      this.datosGeneralesIniciales = deepCopy(this.datosGenerales);
      this.duplicar = this.dataToReceive.duplicar;
      //this.search();
      this.modoEdicion = true;
    } else if (sessionStorage.getItem('guardiaColegiadoData')) { //si el origen es guardias de colegiado
      this.dataToReceive = JSON.parse(sessionStorage.getItem('guardiaColegiadoData'));


      if (this.dataToReceive.idCalendarioProgramado != null) {
        this.disableGenerar = false;
        this.getGuardiasFromCal(this.dataToReceive.idCalendarioProgramado, this.dataToReceive.fechaDesde, this.dataToReceive.fechaHasta);
      } else {
        this.disableGenerar = true;
        this.dataReady = true;
      }

      this.rowGroupsSaved = this.dataToReceive.tabla;
      //console.log('rowGroupsSaved: ', this.rowGroupsSaved)
      this.datosGenerales = JSON.parse(sessionStorage.getItem('guardiaColegiadoData'));
      this.datosGeneralesIniciales = deepCopy(this.datosGenerales);
      this.duplicar = this.dataToReceive.duplicar;
      //this.search();

      this.modoEdicion = true;
      sessionStorage.removeItem('guardiaColegiadoData');
    } else {
      this.dataReady = false;
      this.modoEdicion = false;
    }

    this.obtenerPermisos();

    if (sessionStorage.getItem("filtrosBusquedaGuardias")) {
      sessionStorage.removeItem("filtrosBusquedaGuardiasFichaGuardia");
      this.persistenciaGuardia = new GuardiaItem();
      this.persistenciaGuardia = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaGuardias")
      );
    }

    this.estado = this.datosGeneralesIniciales.estado;

    // Mensaje mostrado tras acualizar o guardar correctamente
    if (sessionStorage.getItem("mensaje")) {
      let message: Message = JSON.parse(sessionStorage.getItem("mensaje"));
      if (message)
        this.showMessage(message.severity, message.summary, message.detail);
      sessionStorage.removeItem("mensaje");
    }

  }

  ngOnDestroy() {
    this.suscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.enviarEnlacesTarjeta();
    }, 2000);
    this.comprobarEstado();
  }
  search() {
    this.progressSpinner = true;
    this.datos = JSON.parse(JSON.stringify(this.persistenceService.getDatos()));
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


    if (this.persistenciaGuardia != undefined) {
      this.persistenciaGuardia.volver = true;
      //console.log('this.persistenciaGuardia: ', this.persistenciaGuardia)
      if (this.dataToReceive.filtrosBusqueda != null && this.dataToReceive.filtrosBusqueda != undefined) {
        this.filtros = this.dataToReceive.filtrosBusqueda;
        if (this.filtros.fechaCalendarioDesde == undefined || this.filtros.fechaCalendarioDesde == null || this.filtros.fechaCalendarioDesde == '') {
          let AnioAnterior = new Date().getFullYear() - 1;
          this.filtros.fechaCalendarioDesde = new Date(AnioAnterior, new Date().getMonth(), new Date().getDate());
        }
        sessionStorage.setItem(
          "filtrosBusquedaGuardiasFichaGuardia",
          JSON.stringify(this.filtros)
        );
      }
    }
    this.location.back();
  }

  modoEdicionSend(event) {
    if (event) {
      this.search();
      this.modoEdicion = true;
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

    this.progressSpinner = true
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
      }
    }
  }

  getdataToDuplicate(event) {
    //console.log('DATA TO DUPLICATE: ', event)
    //console.log('this.rowGroupsSaved: ', this.rowGroupsSaved)
    event.tabla = this.rowGroupsSaved; // lo cogemos en el oninit si duplicar = true!!!!!!
    //console.log('DATA TO DUPLICATE *: ', event)
    //TO DO: pasar los datos event al servicio global para obtenerlos desde tabla-mix
    this.persistenceService.setDatos(event);
    let estadoNumerico = "4";
    switch (event.estado) {
      case "Pendiente":
        estadoNumerico = "4";
        break;
      case "Programada":
        estadoNumerico = "0";
        break;
      case "En proceso":
        estadoNumerico = "1";
        break;
      case "Procesada con Errores":
        estadoNumerico = "2";
        break;
      case "Generada":
        estadoNumerico = "3";
        break;
      case "Reprogramada":
        estadoNumerico = "5";
        break;
      default:
        estadoNumerico = "4";
        break;
    }
    let idCalG;
    if (this.idConjuntoGuardiaElegido == 0) {
      idCalG = null;
    } else {
      idCalG = this.idConjuntoGuardiaElegido;
    }
    if (idCalG == null) {
      idCalG = event.listaGuarias.value;
    }
    let dataToDuplicate = {
      'turno': event.turno,
      'guardia': event.nombre,
      'idGuardia': event.idGuardia,
      'idTurno': event.idTurno,
      'observaciones': event.observaciones,
      'fechaDesde': event.fechaDesde,
      'fechaHasta': event.fechaHasta,
      'fechaProgramacion': this.formatDate3(event.fechaProgramacion),
      'estado': estadoNumerico,
      'generado': event.generado,
      'numGuardias': event.numGuardias,
      'idCalG': idCalG,
      'listaGuardias': event.listaGuarias.label,
      'idCalendarioProgramado': event.idCalendarioProgramado,
      //'idCalendarioGuardias' : this.datosGenerales.idCalendarioGuardias

    };
    this.newCalendarProg(dataToDuplicate);
  }

  searchGuardiasFromCal(event): Promise<any> {
    this.datosTarjetaGuardiasCalendario = [];
    if (event.idCal != "")
      return this.getGuardiasFromCal(event.idCal, event.fechaDesde, event.fechaHasta);
  }

  getGuardiasFromCal(idCalendarioProgramado, fechaDesde, fechaHasta): Promise<any> {
    if (!this.fromCombo) {
      this.datosTarjetaGuardiasCalendarioIni = [];
    }
    this.dataReady = false;
    this.progressSpinner = true;
    return this.sigaServices.getParam(
      "guardiaCalendario_getGuardiasFromCalendar", `?idCalendar=${idCalendarioProgramado}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`).toPromise().then(
        data => {

          let datosTarjetaGuardiasCalendario2 = data;

          let numGuardias = datosTarjetaGuardiasCalendario2.length;
          datosTarjetaGuardiasCalendario2.forEach((dat, i) => {
            //console.log('dat: ', dat)
            let responseObject = (
              {
                'orden': dat.orden,
                'turno': dat.turno,
                'guardia': dat.guardia,
                'generado': dat.generado,
                'numGuardias': numGuardias,
                'idGuardia': dat.idGuardia,
                'idTurno': dat.idTurno,
                'idCalendarioGuardia': dat.idCalendarioGuardia
              }

            );
            this.datosTarjetaGuardiasCalendario.push(responseObject);
            this.datosTarjetaGuardiasCalendarioIni.push(responseObject);
          });
          this.dataReady = true;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        });


  }

  async guardarDatosCalendario(datGen) {
    this.wrongList = [];
    if (datGen != undefined) {
      //Boton guardar tarjeta Datos generales
      let datosGeneralesToSave = {
        'duplicar': '',
        'tabla': [],
        'turno': '',
        'nombre': '',
        'generado': '',
        'numGuardias': '',
        'listaGuarias': { label: '', value: '' },
        'fechaDesde': '',
        'fechaHasta': '',
        'fechaProgramacion': null,
        'estado': '',
        'observaciones': '',
        'idCalendarioProgramado': '',
        'idTurno': '',
        'idGuardia': '',
        'guardias': [],
      };

      datosGeneralesToSave = datGen;

      let estadoNumerico = "4";
      switch (datosGeneralesToSave.estado) {
        case "Pendiente":
          estadoNumerico = "4";
          break;
        case "Programada":
          estadoNumerico = "0";
          break;
        case "En proceso":
          estadoNumerico = "1";
          break;
        case "Procesada con Errores":
          estadoNumerico = "2";
          break;
        case "Generada":
          estadoNumerico = "3";
          break;
        case "Reprogramada":
          estadoNumerico = "5";
          break;
        default:
          estadoNumerico = "4";
          break;
      }
      this.estado = datosGeneralesToSave.estado;
      this.dataReady = false;
      this.datosTarjetaGuardiasCalendario = []; //reload tarjeta guardias cal
      this.dataReady = true;
      let dat = {
        'idCal': datosGeneralesToSave.idCalendarioProgramado,
        'fechaDesde': datosGeneralesToSave.fechaDesde,
        'fechaHasta': datosGeneralesToSave.fechaHasta
      }

      await this.searchGuardiasFromCal(dat);
      let idCalG;
      if (this.idConjuntoGuardiaElegido == 0) {
        idCalG = null;
      } else {
        idCalG = this.idConjuntoGuardiaElegido;
      }
      let dataToSave = {
        'turno': datosGeneralesToSave.turno,
        'guardia': datosGeneralesToSave.nombre,
        'idGuardia': datosGeneralesToSave.idGuardia,
        'idTurno': datosGeneralesToSave.idTurno,
        'observaciones': datosGeneralesToSave.observaciones,
        'fechaDesde': datosGeneralesToSave.fechaDesde,
        'fechaHasta': datosGeneralesToSave.fechaHasta,
        'fechaProgramacion': this.formatDate3(datosGeneralesToSave.fechaProgramacion),
        'estado': estadoNumerico,
        'generado': datosGeneralesToSave.generado,
        'numGuardias': datosGeneralesToSave.numGuardias,
        'idCalG': datosGeneralesToSave.listaGuarias.value,
        'listaGuardias': datosGeneralesToSave.listaGuarias.label,
        'idCalendarioProgramado': datosGeneralesToSave.idCalendarioProgramado,
        'guardias': datosGeneralesToSave.guardias
        //'idCalendarioGuardias' : this.datosGenerales.idCalendarioGuardias

      };
      this.fInicioElegida = datosGeneralesToSave.fechaDesde;
      this.fFinElegida = datosGeneralesToSave.fechaHasta;

      this.datosTarjetaGuardiasCalendario.forEach(async datTarjetaGuardias => {
        await this.getFechasProgramacion(datTarjetaGuardias.idGuardia, dataToSave);

      })
      if (this.wrongList.length == 0) {
        //console.log('datosGeneralesToSave.idCalendarioProgramado: ', datosGeneralesToSave.idCalendarioProgramado)
        if (datosGeneralesToSave.idCalendarioProgramado != null && datosGeneralesToSave.idCalendarioProgramado != '0' && datosGeneralesToSave.idCalendarioProgramado.length != 0) {
          //actualizar existente
          //console.log('****UPDATE')
          this.updateCalendarData(dataToSave);
        } else {
          //muevo
          //console.log('****NEW')
          this.newCalendarProg(dataToSave);
        }

      }

    }
  }


  getFechasProgramacion(idGuardia, dataToSave): Promise<any> {
    this.disableGenerar = true;
    let go;
    this.progressSpinner = true;
    let fechasArr = [{ fechaDesde: '', fechaHasta: '' }];
    return this.sigaServices.getParam(
      "guardiaCalendario_getFechasProgFromGuardia", "?idGuardia=" + idGuardia).toPromise().then(
        data => {
          fechasArr = data;
          //console.log('fechasArr: ', fechasArr)
          fechasArr.forEach(f => {
            let fIniProg = this.formatDate2(f.fechaDesde);
            let fFinProg = this.formatDate2(f.fechaHasta);
            //console.log('inicio elegida: ', new Date(this.fInicioElegida).getTime())
            //console.log('<= fFinProg: ', new Date(fFinProg).getTime())

            //console.log('fin elegida: ', new Date(this.fFinElegida).getTime())
            //console.log('>= fIniProg: ', new Date(fIniProg).getTime())
            if (new Date(this.fInicioElegida).getTime() <= new Date(fFinProg).getTime() && new Date(this.fFinElegida).getTime() >= new Date(fIniProg).getTime()) {
              //console.log('FALSEEE')
              //LAS FECHAS COINCIDEN CON LA PROGRAMACIÓN DE ESTA GUARDIA
              this.progressSpinner = false;
              this.showMessage('error', 'Error. Las fechas seleccionadas coinciden con alguna programación de la guardia ' + idGuardia + ', cuyo rango de fechas es: ' + fIniProg + ' - ' + fFinProg, '')
              go = false;
              this.wrongList.push(go);
            } else {
              //se hace el guardado correcto
              //console.log('TRUEEEEE')
              this.showMessage('success', 'Guardado correctamente', '')
              //habilitar botón GENERAR
              this.disableGenerar = false;
              this.progressSpinner = false;
              go = true;

            }
          })
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
          go = false;
          this.wrongList.push(go);
        }
      )
  }

  formatDate2(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  formatDate3(date) {
    const pattern = 'dd/MM/yyyy HH:mm:ss';
    return this.datepipe.transform(date, pattern);
  }

  formatDate4(date: string) {
    return moment(date, "DD/MM/YYYY hh:mm:ss").format();
  }

  fillDatosTarjetaGuardiasCalendario(event) {
    this.datosTarjetaGuardiasCalendario = event;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  generate() {
    //Generar sólo se permitirá desde los estados vacío (creación), Pendiente, Programada y Procesada con errores
    if (this.datosGenerales.estado == "" || this.datosGenerales.estado == "Pendiente" || this.datosGenerales.estado == "Programada" || this.datosGenerales.estado == "Procesada con errores") {
      //Al generar, pasará al estado Programada (rellenando previamente la Fecha de programación si estaba vacía)
      if (this.datosGenerales.fechaProgramacion == undefined || this.datosGenerales.fechaProgramacion == null) {
        this.datosGenerales.fechaProgramacion = new Date();
        //console.log('this.datosGenerales.fechaProgramacion: ', this.datosGenerales.fechaProgramacion)
      }

      let estadoNumerico = "0";
      switch (this.datosGenerales.estado) {
        case "Pendiente":
          estadoNumerico = "4";
          break;
        case "Programada":
          estadoNumerico = "0";
          break;
        default:
          estadoNumerico = "1";
          break;
      }
      this.datosGenerales.estado = estadoNumerico;
      //Al generar, pasará al estado Programada
      if (this.datosGenerales.estado == "Pendiente") {
        estadoNumerico = "0";
      }

      let dataToGenerate = {
        'turno': this.datosGenerales.turno,
        'guardia': this.datosGenerales.nombre,
        'idGuardia': this.datosGenerales.idGuardia,
        'idTurno': this.datosGenerales.idTurno,
        'observaciones': this.datosGenerales.observaciones,
        'fechaDesde': this.datosGenerales.fechaDesde,
        'fechaHasta': this.datosGenerales.fechaHasta,
        'fechaProgramacion': this.formatDate2(this.datosGenerales.fechaProgramacion),
        'estado': estadoNumerico,
        'generado': this.datosGenerales.generado,
        'numGuardias': this.datosGenerales.numGuardias,
        'idCalG': this.datosGenerales.listaGuarias.value,
        'listaGuardias': this.datosGenerales.listaGuarias.label,
        'idCalendarioProgramado': this.datosGenerales.idCalendarioProgramado,
        //'idCalendarioGuardias' : this.datosGenerales.idCalendarioGuardias

      };
      this.generarCalendario(dataToGenerate);
    } else {
      this.showMessage('error', 'Error. Debido al estado de la programación, no es posible generar', '')
    }


    this.datosGenerales.estado = "Programada";
  }

  updateCalendarData(datos) {
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiaCalendario_updateCalendarioProgramado", datos).subscribe(
        data => {
          this.showMessage('info', "Se ha actualizado correctamente", "Se ha actualizado correctamente");
          sessionStorage.setItem("mensaje", JSON.stringify({
            severity: "info", summary: "Se ha actualizado correctamente", detail: "Se ha actualizado correctamente"
          }));
          this.progressSpinner = false;

          this.findFichaProgramacion(datos);
        }, err => {
          let error = JSON.parse(err.error);
          if (err.status = "409" && error.error && error.error.message) {
            this.showMessage('error', this.translateService.instant("general.message.incorrect"), error.error.message);
          } else {
            this.showMessage('error', "No se ha actualizado correctamente", "No se ha actualizado correctamente");
          }
          this.progressSpinner = false;
          //console.log(err);
        });

  }


  newCalendarProg(datos) {
    console.log('datos ana: ', datos)
    this.dataReady = false;
    this.progressSpinner = true;

    this.sigaServices.post(
      "guardiaCalendario_newCalendarioProgramado", datos).subscribe(
        data => {

          //console.log('this.persistenciaGuardia: ', this.persistenciaGuardia)

          if (this.persistenciaGuardia != undefined) {
            sessionStorage.setItem(
              "filtrosBusquedaGuardiasFichaGuardia",
              JSON.stringify(this.persistenciaGuardia)
            );
          }

          let body = JSON.parse(data.body);

          // Se tiene en cuenta la creación de un calendario sin lista de guardias
          if (datos.idCalG == null && (!datos.guardias || datos.guardias.length == 0)) {
            this.showMessage('info', "Debe asociar alguna guardia", "Debe asociar alguna guardia");
          } else if (body && body.id) {
            sessionStorage.setItem("mensaje", JSON.stringify({
              severity: "info", summary: "Se ha creado correctamente", detail: "Se ha creado correctamente"
            }));
            this.findFichaProgramacion({ idCalendarioProgramado: body.id });
          }

          this.dataReady = true;
          this.progressSpinner = false;

        }, err => {
          this.progressSpinner = false;
          //this.showMessage('error', JSON.stringify(data.body.error.message), JSON.stringify(data.body.error.message));
          let error = JSON.parse(err.error);
          if (error.error.message == "messages.factSJCS.error.solapamientoRango") {
            this.showMessage('error', this.translateService.instant("general.message.incorrect"),
              this.translateService.instant(error.error.message));
          } else if (err.status = "409" && error.error && error.error.message) {
            this.showMessage('error', this.translateService.instant("general.message.incorrect"), error.error.message);
          } else {
            this.showMessage('error', "No se ha generado correctamente", "No se ha generado correctamente");
          }

          this.dataReady = true;
          //console.log(err);
        });

  }

  descargarLog(event) {
    let datosCalendariosSeleccionado = {
      'idCalendarioGuardias': event.idCalendarioGuardias,
      'idTurno': event.idTurno,
      'idGuardia': event.idGuardia
    };
    let estadoNumerico = "0";
    switch (this.datosGenerales.estado) {
      case "Pendiente":
        estadoNumerico = "5";
        break;
      case "Programada":
        estadoNumerico = "1";
        break;
      case "Generada":
        estadoNumerico = "4";
        break;
      default:
        estadoNumerico = "0";
        break;
    }
    this.datosGenerales.estado = estadoNumerico;

    let dataToDownload = {
      'turno': this.datosGenerales.turno,
      'guardia': this.datosGenerales.nombre,
      'idGuardia': datosCalendariosSeleccionado.idGuardia,
      'idTurno': datosCalendariosSeleccionado.idTurno,
      'observaciones': this.datosGenerales.observaciones,
      'fechaDesde': this.datosGenerales.fechaDesde,
      'fechaHasta': this.datosGenerales.fechaHasta,
      'fechaProgramacion': this.datosGenerales.fechaProgramacion,
      'estado': estadoNumerico,
      'generado': this.datosGenerales.generado,
      'numGuardias': this.datosGenerales.numGuardias,
      'idCalG': this.datosGenerales.listaGuarias.value, //conjunto
      'listaGuardias': this.datosGenerales.listaGuarias.label,
      'idCalendarioProgramado': this.datosGenerales.idCalendarioProgramado,
      'idCalendarioGuardias': datosCalendariosSeleccionado.idCalendarioGuardias
    };

    if (event) {
      let resHead = {
        'response': null,
        'header': null
      };
      this.progressSpinner = true;
      let descarga = this.sigaServices.getDownloadFiles(
        "guardiaCalendario_descargarExcelLog", dataToDownload);
      descarga.subscribe(resp => {
        this.progressSpinner = false;
        resHead.response = resp.body;
        resHead.header = resp.headers;
        let contentDispositionHeader = resHead.header.get('Content-Disposition');
        let fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        //console.log('fileName: ', fileName)
        let blob = new Blob([resHead.response], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
        this.showMessage('success', 'LOG descargado correctamente', 'LOG descargado correctamente');
        switch (estadoNumerico) {
          case "5":
            this.datosGenerales.estado = "Pendiente";
            break;
          case "1":
            this.datosGenerales.estado = "Programada";
            break;
          case "4":
            this.datosGenerales.estado = "Generada";
            break;
          default:
            this.datosGenerales.estado = "-";
            break;
        }
      },
        err => {
          this.progressSpinner = false;
          this.showMessage('error', 'El LOG no pudo descargarse', 'El LOG no pudo descargarse');
          //console.log(err);


          switch (estadoNumerico) {
            case "5":
              this.datosGenerales.estado = "Pendiente";
              break;
            case "1":
              this.datosGenerales.estado = "Programada";
              break;
            case "4":
              this.datosGenerales.estado = "Generada";
              break;
            default:
              this.datosGenerales.estado = "-";
              break;
          }

        });
    }
  }

  generarCalendario(datos) {
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiaCalendario_generar", datos).subscribe(
        data => {
          this.progressSpinner = false;
          this.showMessage('success', 'Calendario generado correctamente', '')
          setTimeout(() => {
            let dataToSend = {
              'duplicar': false,
              'tabla': [],
              'turno': this.datosGenerales.turno,
              'nombre': this.datosGenerales.nombre,
              'generado': 'Si',
              'numGuardias': this.datosGenerales.numGuardias,
              'listaGuarias': this.datosGenerales.listaGuarias,
              'fechaDesde': this.datosGenerales.fechaDesde,
              'fechaHasta': this.datosGenerales.fechaHasta,
              'fechaProgramacion': this.datosGenerales.fechaProgramacion,
              'estado': "Generada",
              'observaciones': this.datosGenerales.observaciones,
              'idCalendarioProgramado': this.datosGenerales.idCalendarioProgramado,
              'idTurno': this.datosGenerales.idTurno,
              'idGuardia': this.datosGenerales.idGuardia,
              'filtrosBusqueda': this.dataToReceive.filtrosBusqueda
            }
            this.persistenceService.setDatos(dataToSend);
            this.router.navigate(["/fichaProgramacion"]);

          }, 3000);


        }, err => {
          this.progressSpinner = false;
          let errorDTO = { 'code': 0, 'message': '', 'description': '', 'infoURL': null, 'details': [] };
          let responseDTO = { 'status': '', 'id': '', 'error': errorDTO };

          responseDTO = err.error;
          responseDTO = JSON.parse(err.error);
          let mensajeError = responseDTO.error.message;
          this.showMessage('error', 'Error. No puede generarse el calendario. ' + mensajeError, '')

          //console.log(err);
        });
  }

  comprobarEstado() {
    let deshabilitar = true;
    if ((this.estado != undefined) || (this.estado != null) || (this.estado.length < 1) || (this.estado != "Generada")) {
      deshabilitar = false;
    }
    return deshabilitar;
  }

  reloadDatos(newData) {
    this.datosGenerales = newData;
  }

  disGen($event) {
    this.disableGenerar = $event;
    //console.log('DISABLE GENERAR', $event)
  }

  clear() {
    this.msgs = [];
  }

  linkGuardiaColegiado2(event) {

    let calendario = {
      'orden': event.orden,
      'turno': event.turno,
      'guardia': event.guardia,
      'generado': event.generado,
      'idGuardia': event.idGuardia,
      'idTurno': event.idTurno
    }
    let anadirLetrado = {
      'duplicar': '',
      'tabla': [],
      'turno': calendario.turno,
      'nombre': calendario.guardia,
      'generado': this.datosGenerales.generado,
      'numGuardias': '',
      'listaGuarias': { label: '', value: '' },
      'fechaDesde': this.datosGenerales.fechaDesde,
      'fechaHasta': this.datosGenerales.fechaHasta,
      'fechaProgramacion': this.datosGenerales.fechaProgramacion,
      'estado': this.datosGenerales.estado,
      'observaciones': '',
      'idCalendarioProgramado': this.datosGenerales.idCalendarioProgramado,
      'idTurno': calendario.idTurno,
      'idGuardia': calendario.idGuardia,
      'orden': calendario.orden,
      'idConjunto': this.datosGenerales.listaGuarias.value
    };

    sessionStorage.setItem("calendariosProgramados", "true");
    sessionStorage.setItem("calendarioSeleccinoado", JSON.stringify(anadirLetrado));
    this.router.navigate(["/buscadorColegiados"]);

  }

  // Busca la programación por idCalendarioProgramado, para actualizar los datos de la ficha
  findFichaProgramacion(datos) {
    this.progressSpinner = true;
    //let jsonEntrada  = JSON.parse(JSON.stringify(datosEntrada))
    let datosEntrada =
    {
      'idCalendarioProgramado': datos.idCalendarioProgramado,
    };

    this.sigaServices.post("guardiaCalendario_buscar", datosEntrada).subscribe(
      data => {
        let error = JSON.parse(data.body).error;
        let datos = JSON.parse(data.body);

        console.log("Datos antes: ", datos)
        // this.comboGuardiasIncompatibles = [];
        if (datos.length > 0) {

          let dataToSend = {
            'duplicar': false,
            'tabla': [],
            'turno': datos[0].turno,
            'nombre': datos[0].nombre,
            'generado': datos[0].generado,
            'numGuardias': datos[0].numGuardias,
            'listaGuarias': { label: datos[0].listaGuardias, value: datos[0].idCalG },
            'fechaDesde': this.changeDateFormat(datos[0].fechaDesde),
            'fechaHasta': this.changeDateFormat(datos[0].fechaHasta),
            'fechaProgramacion': this.formatDate4(datos[0].fechaProgramacion),
            'estado': this.getStatusValue(datos[0].estado),
            'observaciones': datos[0].observaciones,
            'idCalendarioProgramado': datos[0].idCalendarioProgramado,
            'idTurno': datos[0].idTurno,
            'idGuardia': datos[0].idGuardia
          }

          this.progressSpinner = false
          this.persistenceService.setDatos(dataToSend);
          this.router.navigate(["/fichaProgramacion"]);
        } else {
          sessionStorage.removeItem("mensaje");
          this.progressSpinner = false;
        }
      },
      err => {
        this.progressSpinner = false;
        sessionStorage.removeItem("mensaje");
        //console.log(err);
      });
  }

  getStatusValue(id) {
    let status;
    this.comboEstados.forEach(estado => {
      if (estado.value != null && id != null) {
        if (estado.value.toString() == id.toString()) {
          status = estado.label;
        }
      }
    })
    return status;
  }

  changeDateFormat(date1) {
    let year = date1.substring(0, 4)
    let month = date1.substring(5, 7)
    let day = date1.substring(8, 10)
    let date2 = day + '/' + month + '/' + year;
    return date2;
  }
}

function deepCopy(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}