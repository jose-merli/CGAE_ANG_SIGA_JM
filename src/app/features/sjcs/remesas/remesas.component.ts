import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistenceService } from '../../../_services/persistence.service';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { FiltroRemesasComponent } from './filtro-remesas/filtro-remesas.component';
import { TablaRemesasComponent } from './tabla-remesas/tabla-remesas.component';
import { procesos_maestros } from '../../../permisos/procesos_maestros';
import { RemesasBusquedaObject } from '../../../models/sjcs/RemesasBusquedaObject';
import { RemesasBusquedaItem } from '../../../models/sjcs/RemesasBusquedaItem';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.component.html',
  styleUrls: ['./remesas.component.scss']
})
export class RemesasComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  resultadoBusqueda: RemesasBusquedaObject = new RemesasBusquedaObject();
  filtrosValues: RemesasBusquedaItem = new RemesasBusquedaItem();

  progressSpinner: boolean = false;

  @ViewChild(FiltroRemesasComponent) filtros;
  @ViewChild(TablaRemesasComponent) tabla;

  remesasDatosEntradaItem;
  datos;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private datepipe: DatePipe) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.procedimientos)
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
  }

  getFiltrosValues(event) {
    this.filtrosValues = JSON.parse(JSON.stringify(event));
    this.convertArraysToStrings();
    this.search();
  }

  convertArraysToStrings() {
    const array = ['annioEJG', 'descripcion', 'estado', 'fechaEnvioDesde', 'fechaEnvioHasta', 'fechaGeneracionDesde', 'fechaGeneracionHasta', 'fechaRecepcionDesde', 'fechaRecepcionHasta', 'numero', 'numeroEJG', 'prefijo', 'sufijo'];
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

  jsonToRow() {
    let arr = [];
    this.resultadoBusqueda.resultadoBusqueda.forEach((res, i) => {
      let estadoNombre: String;
      switch (res.estado) {
        case "0": estadoNombre = "Iniciada"; break;
        case "1": estadoNombre = "Generada"; break;
        case "2": estadoNombre = "Enviada"; break;
        case "3": estadoNombre = "Recibida"; break;
        case "4": estadoNombre = "Validando"; break;
        case "5": estadoNombre = "Validada"; break;
        case "6": estadoNombre = "Procesando remesa"; break;
        default: estadoNombre = "Error envío";
      }
      let objCells = [
        { type: 'text', value: res.descripcion },
        { type: 'text', value: res.estado },
        { type: 'text', value: res.fechaEnvio },
        { type: 'text', value: res.fechaGeneracion },
        { type: 'text', value: res.fechaRecepcion },
        { type: 'text', value: res.numero },
        { type: 'text', value: res.prefijo },
        { type: 'text', value: res.sufijo },
        { type: 'text', value: estadoNombre },
        /* { type: 'invisible', value: res.idinstitucion },
        { type: 'invisible', value: res.idturno },
        { type: 'invisible', value: res.idguardia },
        { type: 'invisible', value: res.fechabaja },
        { type: 'invisible', value: res.observacionessolicitud },
        { type: 'invisible', value: res.observacionesbaja },
        { type: 'invisible', value: res.observacionesvalidacion },
        { type: 'invisible', value: res.observacionesdenegacion },
        { type: 'invisible', value: res.fechadenegacion },
        { type: 'invisible', value: res.observacionesvalbaja },
        { type: 'invisible', value: res.fechavaloralta },
        { type: 'invisible', value: res.fechavalorbaja },
        { type: 'invisible', value: res.idpersona } */
      ]
        ;
      let obj = { id: i, cells: objCells };
      arr.push(obj);
    });

    /* this.rowGroups = [];
    this.rowGroups = this.trmService.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmService.getTableData(arr);
    this.totalRegistros = this.rowGroups.length; */
  }

  search() {
    console.log("Dentro del search del padre");
    this.remesasDatosEntradaItem =
    {
      'annioEJG': (this.filtrosValues.annioEJG != null && this.filtrosValues.annioEJG != undefined) ? this.filtrosValues.annioEJG.toString() : this.filtrosValues.annioEJG,
      'estado': (this.filtrosValues.estado != null && this.filtrosValues.estado != undefined) ? this.filtrosValues.estado.toString() : this.filtrosValues.estado,
      'descripcion': (this.filtrosValues.descripcion != null && this.filtrosValues.descripcion != undefined) ? this.filtrosValues.descripcion.toString() : this.filtrosValues.descripcion,
      'fechaEnvioDesde': (this.filtrosValues.fechaEnvioDesde != null && this.filtrosValues.fechaEnvioDesde != undefined) ? this.filtrosValues.fechaEnvioDesde : this.filtrosValues.fechaEnvioDesde,
      'fechaEnvioHasta': (this.filtrosValues.fechaEnvioHasta != null && this.filtrosValues.fechaEnvioHasta != undefined) ? this.filtrosValues.fechaEnvioHasta : this.filtrosValues.fechaEnvioHasta,
      'fechaGeneracionDesde': (this.filtrosValues.fechaGeneracionDesde != null && this.filtrosValues.fechaGeneracionDesde != undefined) ? this.filtrosValues.fechaGeneracionDesde : this.filtrosValues.fechaGeneracionDesde,
      'fechaGeneracionHasta': (this.filtrosValues.fechaGeneracionHasta != null && this.filtrosValues.fechaGeneracionHasta != undefined) ? this.filtrosValues.fechaGeneracionHasta : this.filtrosValues.fechaGeneracionHasta,
      'fechaRecepcionDesde': (this.filtrosValues.fechaRecepcionDesde != null && this.filtrosValues.fechaRecepcionDesde != undefined) ? this.filtrosValues.fechaRecepcionDesde : this.filtrosValues.fechaRecepcionDesde,
      'fechaRecepcionHasta': (this.filtrosValues.fechaRecepcionHasta != null && this.filtrosValues.fechaRecepcionHasta != undefined) ? this.filtrosValues.fechaRecepcionHasta : this.filtrosValues.fechaRecepcionHasta,
      'numero': (this.filtrosValues.numero != null && this.filtrosValues.numero != undefined) ? this.filtrosValues.numero.toString() : this.filtrosValues.numero,
      'numeroEJG': (this.filtrosValues.numeroEJG != null && this.filtrosValues.numeroEJG != undefined) ? this.filtrosValues.numeroEJG.toString() : this.filtrosValues.numeroEJG,
      'prefijo': (this.filtrosValues.prefijo != null && this.filtrosValues.prefijo != undefined) ? this.filtrosValues.prefijo.toString() : this.filtrosValues.prefijo,
      'sufijo': (this.filtrosValues.sufijo != null && this.filtrosValues.sufijo != undefined) ? this.filtrosValues.sufijo.toString() : this.filtrosValues.sufijo
    };
    this.progressSpinner = true;
    this.sigaServices.post("filtrosremesas_buscarRemesa", this.remesasDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al buscarRemesas");
        this.datos = JSON.parse(n.body).remesasItems;

        this.datos.forEach(element => {
          element.fechaRecepcion = this.formatDate(element.fechaRecepcion);
          element.fechaGeneracion = this.formatDate(element.fechaGeneracion);
          element.fechaEnvio = this.formatDate(element.fechaEnvio);
        });

        console.log("Contenido de la respuesta del back --> ", this.datos);
        this.buscar = true;
        this.progressSpinner = false;

        this.resetSelect();

        console.log("Registros de this.datos --> ", this.datos.length);

        if (this.datos.length == 200) {
          console.log("Dentro del if del mensaje con mas de 200 resultados");
          this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
        }
      },
      err => {
        this.progressSpinner = false;
        this.resultadoBusqueda.error = err;
        console.log(err);
      });
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
      this.tabla.tabla.sortOrder = 0;
      this.tabla.tabla.sortField = '';
      this.tabla.tabla.reset();
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
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

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);    
  }

  clear() {
    this.msgs = [];
  }

}