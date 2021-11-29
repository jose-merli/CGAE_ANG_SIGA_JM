import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { PersistenceService } from '../../../../_services/persistence.service';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { Router } from '../../../../../../node_modules/@angular/router';
import { OldSigaServices } from '../../../../_services/oldSiga.service';
import { TablaResultadoMixComponent } from '../../../../commons/tabla-resultado-mix/tabla-resultado-mix.component';
import { GuardiasInscripcionesFiltrosComponent } from './guardias-inscripciones-filtros/guardias-inscripciones-filtros.component';
import { InscripcionesItems } from '../../../../models/guardia/InscripcionesItems';
import { Row, TablaResultadoMixIncompService } from '../../../../commons/tabla-resultado-mix/tabla-resultado-mix-incompatib.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { ResultadoInscripciones } from './ResultadoInscripciones.model';
import { ResultadoInscripcionesBotones } from './ResultadoInscripcionesBotones.model';
import { DatePipe } from '@angular/common';
import { SigaStorageService } from '../../../../siga-storage.service';
import { MatDialog } from '@angular/material';
import { ConfirmationService } from './../../../../../../node_modules/primeng/primeng';
import { Location } from '@angular/common';
interface GuardiaI {
  label: string;
  value: string;
}

@Component({
  selector: 'app-guardias-inscripciones',
  templateUrl: './guardias-inscripciones.component.html',
  styleUrls: ['./guardias-inscripciones.component.scss']
})

export class GuardiasInscripcionesComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;
  filtrosValues = new InscripcionesItems();
  objetoValidacion: ResultadoInscripcionesBotones[] = []; //?????????? PREGUNTAR (FECHA)
  url;
  datos;
  datos2;
  msgs;
  fechaHoy: Date;
  existeSaltosCompensaciones: boolean;
  permisoEscritura: boolean = false;
  isLetrado: boolean = false;
  progressSpinner: boolean = false;
  inscripcionesDatosEntradaItem;
  respuestaInscripciones: ResultadoInscripciones[] = [];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  /*rowGroupsAux2 = {
    

  };*/
  datosColegiado;
  desdeFichaColegial = false;
  totalRegistros = 0;
  allSelected = false;
  isDisabled = true;
  seleccionarTodo = false;

  firstColumn = 0;
  lastColumn = 9;

  infoParaElPadre: {
    fechasolicitudbajaSeleccionada: any;
    fechaActual: any;
    observaciones: any;
    id_persona: any;
    idturno: any,
    idinstitucion: any,
    idguardia: any,
    fechasolicitud: any,
    fechavalidacion: any,
    fechabaja: any,
    observacionessolicitud: any,
    observacionesbaja: any,
    observacionesvalidacion: any,
    observacionesdenegacion: any,
    fechadenegacion: any,
    observacionesvalbaja: any,
    observacionesvalidacionNUEVA: any,
    fechavalidacionNUEVA: any,
    observacionesvalbajaNUEVA: any,
    fechasolicitudbajaNUEVA: any,
    observacionesdenegacionNUEVA: any,
    fechadenegacionNUEVA: any,
    observacionessolicitudNUEVA: any,
    fechasolicitudNUEVA: any,
    validarinscripciones: any,
    estado: any
  }[] = [];


  jsonParaEnviar = {
    'tipoAccion': '',
    'datos': this.infoParaElPadre
  };

  cabeceras = [
    {
      id: "numeroLetrado",
      name: "dato.jgr.guardia.inscripciones.numeroLetrado"
    },
    {
      id: "letrado",
      name: "dato.jgr.guardia.inscripciones.letrado"
    },
    {
      id: "turno",
      name: "dato.jgr.guardia.inscripciones.turno"
    },
    {
      id: "guardia",
      name: "dato.jgr.guardia.inscripciones.guardia"
    },
    {
      id: "fechaSolicitudAlta",
      name: "dato.jgr.guardia.inscripciones.fechaSolAlta"
    },
    {
      id: "fechaEfectiva",
      name: "dato.jgr.guardia.inscripciones.fechaEfectiva"
    },
    {
      id: "fechaSolicitudBaja",
      name: "dato.jgr.guardia.inscripciones.fechaSolicitudBaja"
    },
    {
      id: "fechaBaja",
      name: "dato.jgr.guardia.inscripciones.fechaBaja"
    },
    {
      id: "estado",
      name: "dato.jgr.guardia.inscripciones.estado"
    }
  ];
  @ViewChild(GuardiasInscripcionesFiltrosComponent) filtros;
  @ViewChild(TablaResultadoMixComponent) tabla;
  existeTrabajosSJCS: any;



  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe,
    public oldSigaServices: OldSigaServices,
    private trmService: TablaResultadoMixIncompService,
    private sigaStorageService: SigaStorageService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private location: Location) {
    this.url = oldSigaServices.getOldSigaUrl("guardiasIncompatibilidades");
  }

  ngOnInit() {

    //this.isLetrado = this.sigaStorageService.isLetrado;
    this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;
    
    if (sessionStorage.getItem("datosColegiado") != null || sessionStorage.getItem("datosColegiado") != undefined) {
      this.datosColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
      this.buscarDesdeEnlace();
      this.filtros.usuarioBusquedaExpress.numColegiado = this.datosColegiado.numColegiado;

    }

    this.commonsService.checkAcceso(procesos_guardia.inscripciones_guardias)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));

    if (sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") == null || sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") == undefined) {
      this.datos = {};
      this.buscar = false;
    }

  }

/*  ngOnDestroy(): void {
    this.persistenceService.clearFiltros();
  }*/

  getFiltrosValues(event) {
    this.filtrosValues = JSON.parse(JSON.stringify(event));
    this.persistenceService.setFiltros(this.filtrosValues);
    this.convertArraysToStrings();
    this.buscarIns();

  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.seleccionarTodo || event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);

  }
  formatDateSol(date) {
    const pattern = 'dd/MM/yyyy hh:mm:ss';
    return this.datepipe.transform(date, pattern);

  }



  buscarDesdeEnlace() {

    this.inscripcionesDatosEntradaItem =
    {
      'nColegiado': this.datosColegiado.numColegiado
    };
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_buscarInscripciones", this.inscripcionesDatosEntradaItem).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.buscar = true;
          this.datos = this.datos.map(it => {
            it.letradosIns = +it.letradosIns;
            return it;
          })
          this.respuestaInscripciones = [];
          this.datos.forEach((dat, i) => {
            let responseObject = new ResultadoInscripciones(
              {
                'idturno': dat.idturno,
                'estado': dat.estado,
                'abreviatura': dat.abreviatura,
                'validarinscripciones': dat.validarinscripciones,
                'validarjustificaciones': dat.validarjustificaciones,
                'nombreGuardia': dat.nombreGuardia,
                'descripcionGuardia': dat.descripcionGuardia,
                'idguardia': dat.idguardia,
                'apellidosnombre': dat.apellidosnombre,
                'ncolegiado': dat.ncolegiado,
                'nombre': dat.nombre,
                'apellidos': dat.apellidos,
                'apellidos2': dat.apellidos2,
                'idinstitucion': dat.idinstitucion,
                'idpersona': dat.idpersona,
                'fechasolicitud': this.formatDate(dat.fechasolicitud),
                'observacionessolicitud': dat.observacionessolicitud,
                'fechavalidacion': this.formatDate(dat.fechavalidacion),
                'fechabaja': this.formatDate(dat.fechabaja),
                'observacionesvalidacion': dat.observacionesvalidacion,
                'fechasolicitudbaja': this.formatDate(dat.fechasolicitudbaja),
                'observacionesbaja': dat.observacionesbaja,
                'observacionesvalbaja': dat.observacionesvalbaja,
                'fechadenegacion': dat.fechadenegacion,
                'observacionesdenegacion': dat.observacionesdenegacion,
                'fechavaloralta': dat.fechavaloralta,
                'fechavalorbaja': dat.fechavalorbaja,
                'code': dat.code,
                'message': dat.message,
                'description': dat.description,
                'infoURL': dat.infoURL,
                'errorDetail': dat.errorDetail
              }
            );
            this.respuestaInscripciones.push(responseObject);
          })
          this.jsonToRow(this.respuestaInscripciones);

          this.buscar = true;
          this.progressSpinner = false;
          //this.resetSelect();

          if (this.totalRegistros == 200) {
            this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
          }

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
          }


          if (error != null && error.description != null) {
            this.showMessage('info', this.translateService.instant("general.message.informacion"), this.translateService.instant("error.description"));
          }
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        },
        () => {
          setTimeout(() => { this.commonsService.scrollTablaFoco('tablaFoco'); }, 5);
        });
  }


  buscarIns() {

    //let jsonEntrada  = JSON.parse(JSON.stringify(datosEntrada))

    this.buscar = false;

    this.inscripcionesDatosEntradaItem =
    {
      'idturno': (this.filtrosValues.idturno != null && this.filtrosValues.idturno != undefined) ? this.filtrosValues.idturno.toString() : this.filtrosValues.idturno,
      'idEstado': (this.filtrosValues.estado != null && this.filtrosValues.estado != undefined) ? this.filtrosValues.estado.toString() : this.filtrosValues.estado,
      'idGuardia': (this.filtrosValues.idguardia != null && this.filtrosValues.idguardia != undefined) ? this.filtrosValues.idguardia.toString() : this.filtrosValues.idguardia,
      'aFechaDe': (this.filtrosValues.afechade != null && this.filtrosValues.afechade != undefined) ? this.formatDate(this.filtrosValues.afechade).toString() : this.formatDate(this.filtrosValues.afechade),
      'fechaDesde': (this.filtrosValues.fechadesde != null && this.filtrosValues.fechadesde != undefined) ? this.formatDate(this.filtrosValues.fechadesde).toString() : this.formatDate(this.filtrosValues.fechadesde),
      'fechaHasta': (this.filtrosValues.fechahasta != null && this.filtrosValues.fechahasta != undefined) ? this.formatDate(this.filtrosValues.fechahasta).toString() : this.formatDate(this.filtrosValues.fechahasta),
      'nColegiado': (this.filtrosValues.ncolegiado != null && this.filtrosValues.ncolegiado != undefined) ? this.filtrosValues.ncolegiado.toString() : this.filtrosValues.ncolegiado,
    };
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_buscarInscripciones", this.inscripcionesDatosEntradaItem).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.datos = this.datos.map(it => {
            it.letradosIns = +it.letradosIns;
            return it;
          })
          this.respuestaInscripciones = [];
          this.datos.forEach((dat, i) => {
            let responseObject = new ResultadoInscripciones(
              {
                'idturno': dat.idturno,
                'estado': dat.estado,
                'abreviatura': dat.abreviatura,
                'validarinscripciones': dat.validarinscripciones,
                'validarjustificaciones': dat.validarjustificaciones,
                'nombreGuardia': dat.nombreGuardia,
                'descripcionGuardia': dat.descripcionGuardia,
                'idguardia': dat.idguardia,
                'apellidosnombre': dat.apellidosnombre,
                'ncolegiado': dat.ncolegiado,
                'nombre': dat.nombre,
                'apellidos': dat.apellidos,
                'apellidos2': dat.apellidos2,
                'idinstitucion': dat.idinstitucion,
                'idpersona': dat.idpersona,
                'fechasolicitud': this.formatDateSol(dat.fechasolicitud),
                'observacionessolicitud': dat.observacionessolicitud,
                'fechavalidacion': this.formatDate(dat.fechavalidacion),
                'fechabaja': this.formatDate(dat.fechabaja),
                'observacionesvalidacion': dat.observacionesvalidacion,
                'fechasolicitudbaja': this.formatDate(dat.fechasolicitudbaja),
                'observacionesbaja': dat.observacionesbaja,
                'observacionesvalbaja': dat.observacionesvalbaja,
                'fechadenegacion': dat.fechadenegacion,
                'observacionesdenegacion': dat.observacionesdenegacion,
                'fechavaloralta': dat.fechavaloralta,
                'fechavalorbaja': dat.fechavalorbaja,
                'code': dat.code,
                'message': dat.message,
                'description': dat.description,
                'infoURL': dat.infoURL,
                'errorDetail': dat.errorDetail,
                'descripcion_obligatoriedad': dat.descripcion_obligatoriedad
              }
            );
            this.respuestaInscripciones.push(responseObject);
          })
          this.jsonToRow(this.respuestaInscripciones);

          this.buscar = true;
          this.progressSpinner = false;
          //this.resetSelect();

          if (this.totalRegistros == 200) {
            this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
          }

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
          }


          if (error != null && error.description != null) {
            this.showMessage('info', this.translateService.instant("general.message.informacion"), this.translateService.instant("error.description"));
          }
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        },
        () => {
          setTimeout(() => { this.commonsService.scrollTablaFoco('tablaFoco'); }, 5);
        });
  }

  jsonToRow(respuestaInscripciones) {

    let arr = [];

    respuestaInscripciones.forEach((res, i) => {

      let estadoNombre: String;

      switch (res.estado) {
        case "0": estadoNombre = "Pendiente de Alta"; break;
        case "1": estadoNombre = "Alta"; break;
        case "2": estadoNombre = "Pendiente de Baja"; break;
        case "3": estadoNombre = "Baja"; break;
        default: estadoNombre = "Denegada";
      }

      let objCells = [
        { type: 'link', value: res.ncolegiado },                                                                 //0
        { type: 'link', value: res.apellidosnombre },                                                            //1
        { type: 'textToolTip', value: [res.nombre, res.abreviatura] }, //turno                                    //2
        { type: 'textToolTip', value: [res.descripcionGuardia, res.nombreGuardia] },                             //3
        { type: 'text', value: res.fechasolicitud },                                                             //4
        { type: 'text', value: res.fechavalidacion },                                                            //5
        { type: 'text', value: res.fechasolicitudbaja },                                                         //6
        { type: 'text', value: res.fechabaja },                                                                  //7
        { type: 'text', value: estadoNombre },                                                                   //8
        { type: 'invisible', value: res.idinstitucion },                                                         //9
        { type: 'invisible', value: res.idturno },                                                               //10
        { type: 'invisible', value: res.idguardia },                                                             //11
        { type: 'invisible', value: res.fechabaja },                                                             //12
        { type: 'invisible', value: res.observacionessolicitud },                                                //13
        { type: 'invisible', value: res.observacionesbaja },                                                     //14
        { type: 'invisible', value: res.observacionesvalidacion },                                               //15
        { type: 'invisible', value: res.observacionesdenegacion },                                               //16
        { type: 'invisible', value: res.fechadenegacion },                                                       //17
        { type: 'invisible', value: res.observacionesvalbaja },                                                  //18
        { type: 'invisible', value: res.fechavaloralta },                                                        //19
        { type: 'invisible', value: res.fechavalorbaja },                                                        //20
        { type: 'invisible', value: res.idpersona },                                                             //21
        { type: 'invisible', value: res.validarjustificaciones },                                                //22
        { type: 'invisible', value: res.validarinscripciones },                                                  //23
        { type: 'invisible', value: res.estado },                                                                //24
        { type: 'invisible', value: res.nombre },                                                                //25
        { type: 'invisible', value: res.nombreGuardia },                                                         //26
        { type: 'invisible', value: res.abreviatura },                                                           //27
        { type: 'invisible', value: res.apellidos },                                                             //28
        { type: 'invisible', value: res.apellidos2 },                                                            //29
        { type: 'invisible', value: res.fechavaloralta },                                                        //30
        { type: 'invisible', value: res.fechavalorbaja },                                                        //31
        { type: 'invisible', value: res.descripcion_obligatoriedad }                                              //32
      ]
        ;


      let obj = { id: i, cells: objCells };
      arr.push(obj);
    });

    this.rowGroups = [];
    this.rowGroups = this.trmService.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmService.getTableData(arr);
    this.totalRegistros = this.rowGroups.length;
  }

  rellenarObjetoBack(obj) {
    let objeto =
    {
      'idturno': obj['idturno'],
      'estado': obj['estado'],
      'abreviatura': null,
      'validarinscripciones': null,
      'nombreGuardia': null,
      'idguardia': obj['idguardia'],
      'apellidosnombre': null,
      'ncolegiado': null,
      'nombre': null,
      'apellidos': null,
      'apellidos2': null,
      'idinstitucion': obj['idinstitucion'],
      'idpersona': obj['id_persona'],
      'fechasolicitud': obj['fechasolicitud'], //(obj['fechasolicitud'] != null && obj['fechasolicitud'] != undefined) ? this.formatDate(obj['fechasolicitud']).toString() : this.formatDate(obj['fechasolicitud']),
      'observacionessolicitud': obj['observacionessolicitud'],
      'fechavalidacion': obj['fechavalidacion'], //(obj['fechavalidacion'] != null && obj['fechavalidacion'] != undefined) ? this.formatDate(obj['fechavalidacion']).toString() : this.formatDate(obj['fechavalidacion']),
      'observacionesvalidacion': obj['observacionesvalidacion'],
      'fechasolicitudbaja': obj['fechasolicitudbajaSeleccionada'], //(obj['fechasolicitudbajaSeleccionada'] != null) ? obj['fechasolicitudbajaSeleccionada'] : ""),
      'observacionesbaja': obj['observacionesbaja'],
      'fechabaja': obj['fechabaja'], //(obj['fechabaja'] != null && obj['fechabaja'] != undefined) ? this.formatDate(obj['fechabaja']).toString() : this.formatDate(obj['fechabaja']),
      'observacionesvalbaja': obj['observacionesvalbaja'],
      'fechadenegacion': obj['fechadenegacion'], //(obj['fechadenegacion'] != null && obj['fechadenegacion'] != undefined) ? this.formatDate(obj['fechadenegacion']).toString() : this.formatDate(obj['fechadenegacion']),
      'observacionesdenegacion': obj['observacionesdenegacion'],
      'fechavaloralta': obj['fechavaloralta'], // (obj['fechavaloralta'] != null && obj['fechavaloralta'] != undefined) ? this.formatDate(obj['fechavaloralta']).toString() : this.formatDate(obj['fechavaloralta']),
      'fechavalorbaja': obj['fechavalorbaja'], //(obj['fechavalorbaja'] != null && obj['fechavalorbaja'] != undefined) ? this.formatDate(obj['fechavalorbaja']).toString() : this.formatDate(obj['fechavalorbaja']),
      'code': null,
      'message': null,
      'description': null,
      'infoURL': null,
      'errorDetail': null,
      'observacionesvalidacionNUEVA': (obj['observacionesvalidacionNUEVA'] != null && obj['observacionesvalidacionNUEVA'] != undefined) ? obj['observacionesvalidacionNUEVA'] : obj['observacionesvalidacion'],
      'fechavalidacionNUEVA': (obj['fechavalidacionNUEVA'] != null && obj['fechavalidacionNUEVA'] != undefined) ? obj['fechavalidacionNUEVA'] : obj['fechavalidacion'],
      'observacionesvalbajaNUEVA': (obj['observacionesvalbajaNUEVA'] != null && obj['observacionesvalbajaNUEVA'] != undefined) ? obj['observacionesvalbajaNUEVA'] : obj['observacionesvalbaja'],
      'fechasolicitudbajaNUEVA': (obj['fechasolicitudbajaNUEVA'] != null && obj['fechasolicitudbajaNUEVA'] != undefined) ? obj['fechasolicitudbajaNUEVA'] : obj['fechasolicitudbajaSeleccionada'],
      'observacionesdenegacionNUEVA': (obj['observacionesdenegacionNUEVA'] != null && obj['observacionesdenegacionNUEVA'] != undefined) ? obj['observacionesdenegacionNUEVA'] : obj['observacionesdenegacion'],
      'fechadenegacionNUEVA': (obj['fechadenegacionNUEVA'] != null && obj['fechadenegacionNUEVA'] != undefined) ? obj['fechadenegacionNUEVA'] : obj['fechadenegacion'],
      'observacionessolicitudNUEVA': (obj['observacionessolicitudNUEVA'] != null && obj['observacionessolicitudNUEVA'] != undefined) ? obj['observacionessolicitudNUEVA'] : obj['observacionessolicitud'],
      'fechasolicitudNUEVA': (obj['fechasolicitudNUEVA'] != null && obj['fechasolicitudNUEVA'] != undefined) ? obj['fechasolicitudNUEVA'] : obj['fechasolicitud'],
    };

    return new ResultadoInscripcionesBotones(objeto);
  }


  llamadaBackValidar(objetoValidacion, estado) {

    this.progressSpinner = true;
    if (estado == "0") {//validacion de estado Pendiente de Alta

      this.sigaServices.post(
        "guardiasInscripciones_validarInscripciones", objetoValidacion).subscribe(
          data => {
            this.progressSpinner = false;
           
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          },
          err => {
            this.progressSpinner = false;
            console.log(err);
            
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

          },
          () => {
            this.commonsService.scrollTablaFoco('tablaFoco');
          });

    } else if (estado == "2") {//validacion de estado Pendiente de Baja

      //comprobacion de si la inscripcion tiene trabajos en SJCS
      this.sigaServices.post(
        "guardiasInscripciones_buscarTrabajosSJCS", objetoValidacion).subscribe(
          data => {
            this.progressSpinner = false;
            this.existeTrabajosSJCS = data.body;

            if (this.existeTrabajosSJCS == "true") {

              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("Existen trabajos pendientes en SJCS asociados."));

            } else {

              //comprobacion de si existen saltos y compensaciones para esta inscripcion y eliminar en caso de que asi se requiera

              this.sigaServices.post(
                "guardiasInscripciones_buscarsaltoscompensaciones", objetoValidacion).subscribe(
                  data => {

                    this.existeSaltosCompensaciones = JSON.parse(data.body);

                    if (this.existeSaltosCompensaciones == true) {
                      let mess = this.translateService.instant(
                        "justiciaGratuita.oficio.inscripciones.mensajeSaltos"
                      );
                      let icon = "fa fa-edit";
                      this.confirmationService.confirm({
                        key:'valBaja',
                        message: mess,
                        icon: icon,
                        accept: () => {
                          this.sigaServices.post("guardiasInscripciones_eliminarsaltoscompensaciones", objetoValidacion).subscribe();
                        },
                        reject: () => {
                          this.msgs = [
                            {
                              severity: "info",
                              summary: "Cancel",
                              detail: this.translateService.instant(
                                "general.message.accion.cancelada"
                              )
                            }
                          ];
                        }
                      });

                      this.sigaServices.post(
                        "guardiasInscripciones_validarInscripciones", objetoValidacion).subscribe(
                          data => {
                            this.progressSpinner = false;
                            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

                          },
                          err => {
                            this.progressSpinner = false;
                            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

                          });
                    }else{
                      this.sigaServices.post(
                        "guardiasInscripciones_validarInscripciones", objetoValidacion).subscribe(
                          data => {
                            this.progressSpinner = false;
                            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

                          },
                          err => {
                            this.progressSpinner = false;
                            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

                          });
                    }
                  },
                  err => {
                    this.progressSpinner = false;

                    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

                  });

            }

          },
          err => {
            this.progressSpinner = false;

            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

          });


    }

  }

  llamadaBackDenegar(objetoValidacion) {

    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_denegarInscripciones", objetoValidacion).subscribe(
        data => {
          this.progressSpinner = false;
         
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          objetoValidacion = [];
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
         
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          objetoValidacion = [];
        },
        () => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        });
  }

  llamadaBackSolicitarBaja(objetoValidacion) {

    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_solicitarBajaInscripciones", objetoValidacion).subscribe(
        data => {
          this.progressSpinner = false;
         
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

        },
        () => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        });
  }

  llamadaBackCambiarFecha(objetoValidacion) {

    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_cambiarFechaInscripciones", objetoValidacion).subscribe(
        data => {
          console.log("entra en el data");
          this.progressSpinner = false;
         
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

        },
        () => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        });
  }


  confirmBaja(objetoValidacion) {
    let mess = this.translateService.instant(
      "justiciaGratuita.oficio.inscripciones.mensajeSaltos"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        //permitirá hacer la baja
        this.llamadaBackSolicitarBaja(objetoValidacion);
        


      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

   llamadaBackTrabajosSJCS(objetoValidacion) {
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_buscarTrabajosSJCS", objetoValidacion).subscribe(
        data => {
          this.progressSpinner = false;
          this.existeTrabajosSJCS = data.body;

          if (this.existeTrabajosSJCS == "true") {
            //mensaje de error
            if (this.jsonParaEnviar.tipoAccion == "solicitarBaja") {
              this.confirmBaja(objetoValidacion);
            }
          }else{
            this.llamadaBackSolicitarBaja(objetoValidacion);
          }

          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));


        },
        () => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        });

  } 


  BotonesInfo(event) {
    this.jsonParaEnviar = event;

    if (this.jsonParaEnviar.tipoAccion == "validar") {
      let estado;
      let objVal: ResultadoInscripcionesBotones
      this.jsonParaEnviar.datos.forEach(el => {

        if (el.estado == "0") {//validacion de inscripciones en estado Pendiente de Alta.
          estado = el.estado;
          el.fechavalidacionNUEVA = el.fechaActual;
          el.observacionesvalidacionNUEVA = el.observaciones;
          if (el.fechavalidacion == undefined) {
            el.fechavalidacion = null;
          } else if (el.fechasolicitud == undefined) {
            el.fechasolicitud = null;
          } else if (el.fechadenegacion == undefined) {
            el.fechadenegacion = null;
          }
          if (el.fechabaja == undefined) {
            el.fechabaja = null;
          }
           objVal = this.rellenarObjetoBack(el);
           this.objetoValidacion.push(objVal);
         /*  this.objetoValidacion.push(objVal);
          this.llamadaBackValidar(this.objetoValidacion, el.estado);
          this.objetoValidacion = []; */
        } else if (el.estado == "2") {//validacion de inscripcion en estado Pendiente de Baja.
          estado = el.estado;
          el.fechasolicitudbajaNUEVA = el.fechaActual;
          el.observacionesvalbajaNUEVA = el.observaciones;

           objVal = this.rellenarObjetoBack(el);
           this.objetoValidacion.push(objVal);
/* 
          this.objetoValidacion.push(objVal);
          this.llamadaBackValidar(this.objetoValidacion, el.estado);
          this.objetoValidacion = []; */
        }

      });
      if(estado == "0" || estado == "2"){
        
        this.llamadaBackValidar(this.objetoValidacion,estado);
        this.objetoValidacion = [];
        this.buscarIns()//se vuelve a buscar las inscripciones una vez que se realiza cualquier accion

      }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "La validacion solo se lleva a cabo sobre inscripciones en estado de Pendiente de Alta y Pendiente de Baja.");

      }
      

    } else if (this.jsonParaEnviar.tipoAccion == "denegar") {

      this.jsonParaEnviar.datos.forEach(el => {

        el.fechadenegacionNUEVA = el.fechaActual;
        el.observacionesdenegacionNUEVA = el.observaciones;

        let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBack(el);

        this.objetoValidacion.push(objVal);
        this.objetoValidacion = [];

      });

      this.llamadaBackDenegar(this.objetoValidacion);
      this.buscarIns()//se vuelve a buscar las inscripciones una vez que se realiza cualquier accion

    } else if (this.jsonParaEnviar.tipoAccion == "solicitarBaja") {

      this.fechaHoy = this.transformaFecha(new Date());

      this.jsonParaEnviar.datos.forEach(el => {

        el.fechasolicitudbajaNUEVA = el.fechaActual;
        el.observacionessolicitudNUEVA = el.observaciones;

        if (this.formatDate(el.fechaActual) != this.formatDate(this.fechaHoy)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "La fecha elegida no puede ser distinta a la fecha actual.");
        } else {


          //De misma forma se realizará con las guardias del turno al que esté inscrito el colegiado.

          let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBack(el);

          this.objetoValidacion.push(objVal);

          this.sigaServices.post(
            "guardiasInscripciones_buscarGuardiasAsocTurnos", this.objetoValidacion).subscribe();

          //•	Al realizar la solicitud el sistema iniciara las consultas necesarias para determinar si el letrado tiene trabajos SJCS pendientes asociados a dicho turno. En el caso de que existan, se mostrará un mensaje de confirmación para realizar la baja de que hay trabajos SJCS pendientes y permitirá realizar la baja.
          this.llamadaBackTrabajosSJCS(this.objetoValidacion);
          this.objetoValidacion = [];

          //this.llamadaBackSolicitarBaja();
          this.buscarIns()//se vuelve a buscar las inscripciones una vez que se realiza cualquier accion
        }


      });

    } else if (this.jsonParaEnviar.tipoAccion == "cambiarFecha") {

      this.jsonParaEnviar.datos.forEach(el => {

        el.fechasolicitudNUEVA = el.fechaActual;
        el.observacionessolicitudNUEVA = el.observaciones;

        if (el.estado == "2" || el.estado == "1") {
          //cambiar fecha efectiva de alta
          if (el.fechaActual <= el.fechavalidacion) {
            el.fechavalidacion = el.fechaActual;
          }

        } else if (el.estado == "3") {
          //cambiar fecha efectiva de baja
          if (el.fechaActual >= el.fechabaja) {
            el.fechabaja = el.fechaActual;
          }
        }

        let objVal: ResultadoInscripcionesBotones = this.rellenarObjetoBack(el);

        this.objetoValidacion.push(objVal);

      });

      this.llamadaBackCambiarFecha(this.objetoValidacion);
        this.objetoValidacion = [];
        this.buscarIns()//se vuelve a buscar las inscripciones una vez que se realiza cualquier accion




    }
  

  }
  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }


    return fecha;
  }

  isOpenReceive(event) {

    if (this.persistenceService.getFiltros())
      this.search(event);
  }

  search(event) {

    /*this.filtros.filtroAux = this.persistenceService.getFiltrosAux()

    this.convertArraysToStrings();

    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaGuardias_searchGuardias", this.filtros.filtroAux).subscribe(
      n => {
        let error = JSON.parse(n.body).error;
        this.datos = JSON.parse(n.body).guardiaItems;
        this.buscar = true;
        this.datos = this.datos.map(it => {
          it.letradosIns = +it.letradosIns;
          return it;
        })
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        this.resetSelect();

        if (error != null && error.description != null) {
          this.showMessage({ severity: 'info', summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.commonsService.scrollTablaFoco('tablaFoco');
      });*/
  }
  backTo() {
    this.location.back();
  }
  resetSelect() {
    if (this.tabla) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
      this.tabla.table.sortOrder = 0;
      this.tabla.table.sortField = '';
      this.tabla.table.reset();
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "")
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  convertArraysToStrings() {

    const array = ['idturno', 'fechadesde', 'fechahasta', 'afechade', 'idguardia', 'ncolegiado', 'estado'];
    if (this.filtrosValues != undefined) {
      array.forEach(element => {
        if (this.filtrosValues[element] != undefined && this.filtrosValues[element] != null && this.filtrosValues[element].length > 0) {
          let aux = this.filtrosValues[element].toString();
          this.filtrosValues[element] = aux;
        }

        if (this.filtrosValues[element] != undefined && this.filtrosValues[element] != null && this.filtrosValues[element].length == 0) {
          delete this.filtrosValues[element];
        }

      });

    }
  }

}