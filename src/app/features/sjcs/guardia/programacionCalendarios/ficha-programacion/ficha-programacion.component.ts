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
  datosGenerales = {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {label: '', value: ''},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
  };
  
  datosGeneralesIniciales = {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
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
    'idGuardia': ''
  }
  dataReady = false;
  duplicar;
  fInicioElegida = "";
  fFinElegida = "";
  msgs;
  disableGenerar = true;
  idConjuntoGuardiaElegido;
  suscription: Subscription;
  wrongList = [];
  constructor(private persistenceService: PersistenceService,
    private location: Location, private sigaServices: SigaServices,
    private commonService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe,
    private globalGuardiasService: GlobalGuardiasService) { }


  ngOnInit() {
    this.suscription = this.globalGuardiasService.getConf().subscribe((confValue)=>{
         this.dataReady = false;
      this.idConjuntoGuardiaElegido = confValue.idConjuntoGuardia;
      this.dataReady = true;});
    this.disableGenerar = true;
    console.log('this.persistenceService.getDatos(): ', this.persistenceService.getDatos())
    this.infoResumen = [];
    if (this.persistenceService.getDatos() != undefined) {
      this.dataToReceive = this.persistenceService.getDatos();
      if (this.dataToReceive.idCalendarioProgramado != null){
        this.getGuardiasFromCal(this.dataToReceive.idCalendarioProgramado);
      }else{
        this.dataReady = true;
      }
      this.rowGroupsSaved = this.persistenceService.getDatos().tabla;
      console.log('rowGroupsSaved: ', this.rowGroupsSaved)
      this.datosGenerales = this.persistenceService.getDatos();
      this.datosGeneralesIniciales = this.persistenceService.getDatos();
      this.duplicar = this.dataToReceive.duplicar;
      //this.search();
      this.modoEdicion = true;
    } else {
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

  }
  ngOnDestroy(){
    this.suscription.unsubscribe();
   }
  ngOnChanges(changes: SimpleChanges) {
    this.enviarEnlacesTarjeta();
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
        console.log(err);
      })
  }



  backTo() {

    console.log('this.persistenciaGuardia: ', this.persistenciaGuardia)
    if (this.persistenciaGuardia != undefined) {
      sessionStorage.setItem(
        "filtrosBusquedaGuardiasFichaGuardia",
        JSON.stringify(this.persistenciaGuardia)
      );
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

  getdataToDuplicate(event){
    console.log('DATA TO DUPLICATE: ', event)
    console.log('this.rowGroupsSaved: ', this.rowGroupsSaved)
    event.tabla = this.rowGroupsSaved; // lo cogemos en el oninit si duplicar = true!!!!!!
    console.log('DATA TO DUPLICATE *: ', event)
//TO DO: pasar los datos event al servicio global para obtenerlos desde tabla-mix
  this.persistenceService.setDatos(event);
  let estadoNumerico = "0";
  switch (event.estado) {
    case "Pendiente":
      estadoNumerico = "0";
      break;
    case "Programada":
      estadoNumerico = "1";
      break;
    case "En proceso":
      estadoNumerico = "2";
      break;
    case "Procesada con Errores":
      estadoNumerico = "3";
      break;
    case "Generada":
      estadoNumerico = "4";
      break;
    default:
      estadoNumerico = "0";
      break;
  }
  let idCalG;
  if (this.idConjuntoGuardiaElegido == 0){
    idCalG = null;
  }else{
    idCalG = this.idConjuntoGuardiaElegido ;
  }
  let dataToDuplicate = {
    'turno': event.turno,
    'guardia': event.nombre,
    'idGuardia': event.idGuardia,
    'idTurno': event.idTurno,
    'observaciones': event.observaciones,
    'fechaDesde': event.fechaDesde,
    'fechaHasta': event.fechaHasta,
    'fechaProgramacion': this.formatDate2(event.fechaProgramacion),
    'estado': estadoNumerico,
    'generado': event.generado,
    'numGuardias': event.numGuardias,
    'idCalG': idCalG,
    'listaGuardias': event.listaGuarias.label,
    'idCalendarioProgramado': event.idCalendarioProgramado,

  };
  this.newCalendarProg(dataToDuplicate);
  }

    searchGuardiasFromCal(event){
      this.datosTarjetaGuardiasCalendario = [];
      this.getGuardiasFromCal(event);
    }
   getGuardiasFromCal(idCalendarioProgramado){
    this.dataReady = false;
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiaCalendario_getGuardiasFromCalendar", idCalendarioProgramado).subscribe(
        data => {
          console.log('data Ana: ', data.body)
          let error = JSON.parse(data.body).error;
          let datosTarjetaGuardiasCalendario2 = JSON.parse(data.body);
          let numGuardias = datosTarjetaGuardiasCalendario2.length;
          datosTarjetaGuardiasCalendario2.forEach((dat, i) => {
            console.log('dat: ', dat)
            let responseObject = (
              {
                'orden': dat.orden,
                'turno': dat.turno,
                'guardia': dat.guardia,
                'generado': dat.generado,
                'numGuardias': numGuardias,
                'idGuardia': dat.idGuardia,
                'idTurno': dat.idTurno
              }
             
            );
            this.datosTarjetaGuardiasCalendario.push(responseObject);
          });
          this.dataReady = true;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        });
  }


  guardarDatosCalendario(datGen){
    this.wrongList = [];
      if (datGen != undefined){
        //Boton guardar tarjeta Datos generales
        let   datosGeneralesToSave = {
          'duplicar' : '',
          'tabla': [],
          'turno':'',
          'nombre': '',
          'generado': '',
          'numGuardias': '',
          'listaGuarias': {label: '', value: ''},
          'fechaDesde': '',
          'fechaHasta': '',
          'fechaProgramacion': null,
          'estado': '',
          'observaciones': '',
          'idCalendarioProgramado': '',
          'idTurno': '',
          'idGuardia': '',
        };

      datosGeneralesToSave = datGen;
      let estadoNumerico = "0";
      switch (datosGeneralesToSave.estado) {
				case "Pendiente":
					estadoNumerico = "0";
					break;
				case "Programada":
					estadoNumerico = "1";
					break;
				case "En proceso":
					estadoNumerico = "2";
					break;
				case "Procesada con Errores":
					estadoNumerico = "3";
          break;
        case "Generada":
					estadoNumerico = "4";
					break;
				default:
					estadoNumerico = "0";
					break;
      }
      let idCalG;
      if (this.idConjuntoGuardiaElegido == 0){
        idCalG = null;
      }else{
        idCalG = this.idConjuntoGuardiaElegido ;
      }
      let dataToSave = {
        'turno': datosGeneralesToSave.turno,
        'guardia': datosGeneralesToSave.nombre,
        'idGuardia': datosGeneralesToSave.idGuardia,
        'idTurno': datosGeneralesToSave.idTurno,
        'observaciones': datosGeneralesToSave.observaciones,
        'fechaDesde': datosGeneralesToSave.fechaDesde,
        'fechaHasta': datosGeneralesToSave.fechaHasta,
        'fechaProgramacion': this.formatDate2(datosGeneralesToSave.fechaProgramacion),
        'estado': estadoNumerico,
        'generado': datosGeneralesToSave.generado,
        'numGuardias': datosGeneralesToSave.numGuardias,
        'idCalG': datosGeneralesToSave.listaGuarias.value,
        'listaGuardias': datosGeneralesToSave.listaGuarias.label,
        'idCalendarioProgramado': datosGeneralesToSave.idCalendarioProgramado,

      };
      this.fInicioElegida = datosGeneralesToSave.fechaDesde;
      this.fFinElegida = datosGeneralesToSave.fechaHasta;
      
      this.datosTarjetaGuardiasCalendario.forEach(datTarjetaGuardias => {
      this.getFechasProgramacion(datTarjetaGuardias.idGuardia, dataToSave);
       
    })
    if (this.wrongList.length == 0){
      console.log('datosGeneralesToSave.idCalendarioProgramado: ', datosGeneralesToSave.idCalendarioProgramado)
      if (datosGeneralesToSave.idCalendarioProgramado != null && datosGeneralesToSave.idCalendarioProgramado != '0'){
        //actualizar existente
        console.log('****UPDATE')
        this.updateCalendarData(dataToSave);
      }else{
        //muevo
        console.log('****NEW')
        this.newCalendarProg(dataToSave);
      }
      
    }
      
    }
  }


  getFechasProgramacion(idGuardia, dataToSave){
    this.disableGenerar = true;
    let go;
    this.progressSpinner = true;
    let fechasArr = [{fechaDesde : '', fechaHasta: ''}];
    this.sigaServices.getParam(
      "guardiaCalendario_getFechasProgFromGuardia", "?idGuardia=" + idGuardia).subscribe(
        data => {
          fechasArr = data;
          console.log('fechasArr: ', fechasArr)
          fechasArr.forEach( f => {
            let fIniProg = this.formatDate2(f.fechaDesde);
            let fFinProg = this.formatDate2(f.fechaHasta);
            console.log('inicio elegida: ', new Date(this.fInicioElegida).getTime())
            console.log('<= fFinProg: ', new Date(fFinProg).getTime())

            console.log('fin elegida: ', new Date(this.fFinElegida).getTime())
            console.log('>= fIniProg: ', new Date(fIniProg).getTime())
            if (new Date(this.fInicioElegida).getTime() <= new Date(fFinProg).getTime() && new Date(this.fFinElegida).getTime() >= new Date(fIniProg).getTime()){
              console.log('FALSEEE')
              //LAS FECHAS COINCIDEN CON LA PROGRAMACIÓN DE ESTA GUARDIA
              this.progressSpinner = false;
              this.showMessage('error', 'Error. Las fechas seleccionadas coinciden con alguna programación de la guardia ' + idGuardia + ', cuyo rango de fechas es: ' + fIniProg + ' - ' + fFinProg, '')
              go = false;
              this.wrongList.push(go);
            }else{
             //se hace el guardado correcto
             console.log('TRUEEEEE')
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
          console.log(err);
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
  fillDatosTarjetaGuardiasCalendario(event){
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
  generate(){
    //Generar sólo se permitirá desde los estados vacío (creación), Pendiente, Programada y Procesada con errores
    if (this.datosGenerales.estado == "" || this.datosGenerales.estado == "Pendiente" || this.datosGenerales.estado == "Programada" || this.datosGenerales.estado == "Procesada con errores"){
      //Al generar, pasará al estado Programada (rellenando previamente la Fecha de programación si estaba vacía)
      if(this.datosGenerales.fechaProgramacion == undefined || this.datosGenerales.fechaProgramacion == null){
        this.datosGenerales.fechaProgramacion = new Date();
        console.log('this.datosGenerales.fechaProgramacion: ', this.datosGenerales.fechaProgramacion)
      }

    let estadoNumerico = "0";
      switch (this.datosGenerales.estado) {
				case "Pendiente":
					estadoNumerico = "0";
					break;
				case "Programada":
					estadoNumerico = "1";
					break;
				default:
					estadoNumerico = "0";
					break;
      }
      this.datosGenerales.estado = estadoNumerico;

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
    
      };
      this.generarCalendario(dataToGenerate);
    }else{
      this.showMessage('error', 'Error. Debido al estado de la programación, no es posible generar', '')
    }


    this.datosGenerales.estado = "Programada";
  }

  updateCalendarData(datos){
       this.sigaServices.post(
      "guardiaCalendario_updateCalendarioProgramado",  datos).subscribe(
        data => {
        }, err => {
          console.log(err);
        });
  }


  newCalendarProg(datos){
    this.sigaServices.post(
   "guardiaCalendario_newCalendarioProgramado",  datos).subscribe(
     data => {
      console.log('this.persistenciaGuardia: ', this.persistenciaGuardia)
      if (this.persistenciaGuardia != undefined) {
        sessionStorage.setItem(
          "filtrosBusquedaGuardiasFichaGuardia",
          JSON.stringify(this.persistenciaGuardia)
        );
      }
        this.router.navigate(["/programacionCalendarios"]);
     }, err => {
       console.log(err);
     });
}


  generarCalendario(datos){
    this.sigaServices.post(
      "guardiaCalendario_generar",  datos).subscribe(
        data => {

        }, err => {
          console.log(err);
        });
  }
}