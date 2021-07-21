import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { DatePipe } from '@angular/common';

interface GuardiaI{
  label:string;
  value:string;
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
  objetoValidacion : ResultadoInscripciones;
  infoParaElPadre = {
    'fechasolicitudbajaSeleccionada': '',
    'fechaActual': new Date(),
    'observaciones': '',
    'id_persona': ''
  };
  url;
  datos;
  msgs;
  permisoEscritura
  progressSpinner: boolean = false;
  inscripcionesDatosEntradaItem;
  respuestaInscripciones: ResultadoInscripciones[] = [];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  totalRegistros = 0;
  allSelected = false;
  isDisabled = true;
  seleccionarTodo = false;

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

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe,
    public oldSigaServices: OldSigaServices,
    private trmService: TablaResultadoMixIncompService,
    private authenticationService: AuthenticationService) {
    this.url = oldSigaServices.getOldSigaUrl("guardiasIncompatibilidades");
  }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_guardia.guardias)
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
  getFiltrosValues(event) {
    this.filtrosValues = JSON.parse(JSON.stringify(event));
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

  buscarIns() {

    //let jsonEntrada  = JSON.parse(JSON.stringify(datosEntrada))

    this.inscripcionesDatosEntradaItem = 
      {
        'idTurno': (this.filtrosValues.idturno != null && this.filtrosValues.idturno != undefined) ? this.filtrosValues.idturno.toString() : this.filtrosValues.idturno,
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
                'nombreGuardia': dat.nombreGuardia,
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
          this.jsonToRow();

          this.buscar = true;
          this.progressSpinner = false;
          //this.resetSelect();

          if(this.totalRegistros == 200){
            this.showMessage({ severity: 'info', summary: this.translateService.instant("general.message.informacion"), msg: "La consulta devuelve más de 200 resultados." });
          }

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
          }
          

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
        });
  }

  jsonToRow() {

    let arr = [];
    this.respuestaInscripciones.forEach((res, i) => {
      
      let estadoNombre: String;

      switch(res.estado){
        case "0": estadoNombre = "Pendiente de Alta"; break;
        case "1": estadoNombre = "Alta"; break;
        case "2": estadoNombre = "Pendiente de Baja"; break;
        case "3": estadoNombre = "Baja"; break;
        default: estadoNombre = "Denegada";
      }

      let objCells = [
      { type: 'text', value: res.ncolegiado},
      { type: 'text', value: res.apellidosnombre},
      { type: 'text', value: res.nombre},
      { type: 'text', value: res.nombreGuardia},
      { type: 'invisible', value: res.idpersona},
      { type: 'text', value: res.fechasolicitud },
      { type: 'text', value: res.fechavalidacion},
      { type: 'text', value: res.fechasolicitudbaja },
      { type: 'text', value: res.fechabaja },
      { type: 'text', value: estadoNombre}]
      ;

  
      let obj = {id: i, cells: objCells};
      arr.push(obj);
    }) 
    //BORRAR!!!!******
    /*arr = [
      { id: 1,
        cells: 
        [
          { type: 'text', value: '28/08/2007' },
          { type: 'text', value: 'Designación' },
          { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                        {label: "Fact Ayto. Alicante - As. Joven", value: "2"}] },
          { type: 'input', value: 'documentoX.txt' },
          { type: 'input', value: 'Euskara ResultadoConsulta' }
        ],
      },
      { id: 2,
        cells: 
        [
          { type: 'text', value: '28/08/2007' },
          { type: 'text', value: 'Designación' },
          { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                        {label: "Fact Ayto. Alicante - As. Joven", value: "2"}]},
          { type: 'input', value: 'documentoX.txt' },
          { type: 'input', value: 'Euskara ResultadoConsulta' }
        ],
      },
      { id: 3,
        cells: 
        [
          { type: 'text', value: '28/08/2007' },
          { type: 'text', value: 'Designación' },
          { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                        {label: "Fact Ayto. Alicante - As. Joven", value: "2"}] },
          { type: 'input', value: 'documentoX.txt' },
          { type: 'input', value: 'Euskara ResultadoConsulta' }
        ]
      },
    ];
    //*****BORRAR!!!!*/
    this.rowGroups = [];
    this.rowGroups = this.trmService.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmService.getTableData(arr);
    this.totalRegistros = this.rowGroups.length; 
  }

  BotonesInfo(event){
    this.infoParaElPadre = event;
    console.log(event);

    if(this.infoParaElPadre.fechasolicitudbajaSeleccionada == null){
        this.objetoValidacion.fechavalidacion=this.infoParaElPadre.fechaActual;
    }

   /* this.objetoValidacion = 
      {
        'idturno': (this.infoParaElPadre.idturno != null && this.infoParaElPadre.idturno != undefined) ? this.infoParaElPadre.idturno.toString() : this.infoParaElPadre.idturno,
        // 'idEstado': (this.filtrosValues.estado != null && this.filtrosValues.estado != undefined) ? this.filtrosValues.estado.toString() : this.filtrosValues.estado,
        // 'idGuardia': (this.filtrosValues.idguardia != null && this.filtrosValues.idguardia != undefined) ? this.filtrosValues.idguardia.toString() : this.filtrosValues.idguardia,
        // 'aFechaDe': (this.filtrosValues.afechade != null && this.filtrosValues.afechade != undefined) ? this.formatDate(this.filtrosValues.afechade).toString() : this.formatDate(this.filtrosValues.afechade),
        // 'fechaDesde': (this.filtrosValues.fechadesde != null && this.filtrosValues.fechadesde != undefined) ? this.formatDate(this.filtrosValues.fechadesde).toString() : this.formatDate(this.filtrosValues.fechadesde),
        // 'fechaHasta': (this.filtrosValues.fechahasta != null && this.filtrosValues.fechahasta != undefined) ? this.formatDate(this.filtrosValues.fechahasta).toString() : this.formatDate(this.filtrosValues.fechahasta),
        // 'nColegiado': (this.filtrosValues.ncolegiado != null && this.filtrosValues.ncolegiado != undefined) ? this.filtrosValues.ncolegiado.toString() : this.filtrosValues.ncolegiado,
      };*/
      this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasInscripciones_buscarInscripciones", this.respuestaInscripciones).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.buscar = true;
          this.datos = this.datos.map(it => {
            it.letradosIns = +it.letradosIns;
            return it;
          })
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        },
        () => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        });
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

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
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