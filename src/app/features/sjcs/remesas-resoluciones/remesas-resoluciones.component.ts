import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';
import { RemesasResultadoItem } from '../../../models/sjcs/RemesasResultadoItem';
import { CommonsService } from '../../../_services/commons.service';
import { procesos_comision } from '../../../permisos/procesos_comision';
import { SigaServices } from '../../../_services/siga.service';
import { TranslateService } from '../../../commons/translate';
import { Router } from '../../../../../node_modules/@angular/router';
import { PersistenceService } from '../../../_services/persistence.service';
import { RemesasResolucionItem } from '../../../models/sjcs/RemesasResolucionItem';
import { element } from 'protractor';
import { FiltroRemesasResolucionesComponent } from './filtro-remesas-resoluciones/filtro-remesas-resoluciones.component';
import { TablaRemesasResolucionesComponent } from './tabla-remesas-resoluciones/tabla-remesas-resoluciones.component';


@Component({
  selector: 'app-remesas-resoluciones',
  templateUrl: './remesas-resoluciones.component.html',
  styleUrls: ['./remesas-resoluciones.component.scss']
})
export class RemesasResolucionesComponent implements OnInit {

  buscar: boolean = false;
  progressSpinner: boolean = false;
  datos;
  msgs;
  permisoEscritura;
  remesasResultadosItem: RemesasResultadoItem = new RemesasResultadoItem(
    {
      'idRemesaResultado': null,
      'numRemesaPrefijo': '',
      'numRemesaNumero': '',
      'numRemesaSufijo': '',
      'numRegistroPrefijo': '',
      'numRegistroNumero': '',
      'numRegistroSufijo': '',
      'nombreFichero': '',
      'fechaRemesaDesde': '',
      'fechaRemesaHasta': '',
      'fechaCargaDesde': '',
      'fechaCargaHasta': '',
      'observacionesRemesaResultado': '',
      'fechaCargaRemesaResultado': '',
      'fechaResolucionRemesaResultado': '',
      'idRemesa': null,
      'numeroRemesa': '',
      'prefijoRemesa': '',
      'sufijoRemesa': '',
      'descripcionRemesa': '',
      'numRegistroRemesaCompleto': '',
      'numRemesaCompleto': ''
      }
  );
  
  @ViewChild(FiltroRemesasResolucionesComponent) filtrosValues;
  @ViewChild(TablaRemesasResolucionesComponent) tabla;

  constructor(private persistenceService: PersistenceService,private translateService: TranslateService, private router: Router,
           private sigaServices: SigaServices, private datepipe: DatePipe,private commonsService: CommonsService,) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_comision.remesasResoluciones)
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
    this.search(true);
  }

  convertArraysToStrings() {
    const array = ['nombreFichero', 'fechaResolucionDesde', 'fechaResolucioHasta', 'fechaCargaDesde', 'fechaCargaHasta', 'prefijo', 'numero', 'sufijo'];
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


  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);    
  }

  clear() {
    this.msgs = [];
  }

  formatNum(element){
    let numeroFormateado = ''; 
    if(element.numRemesaPrefijo !== null){
      numeroFormateado += element.numRemesaPrefijo
    }
    if(element.numRemesaNumero !== null){
      numeroFormateado += element.numRemesaNumero
    }
    if(element.numRemesaSufijo !== null){
      numeroFormateado += element.numRemesaSufijo
    }
    return numeroFormateado;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  showMessage2(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }
  search(event){
    //console.log("QWEQWE");
    //console.log(this.buscar);
    this.progressSpinner = true;
    this.sigaServices.post("remesasResolucion_buscarRemesasResolucion", this.filtrosValues).subscribe(
      n => {
        let error = JSON.parse(n.body).error;
        //console.log("Dentro del servicio que llama al buscarRemesasResultado");
        this.datos = JSON.parse(n.body).remesasResolucionItem;

        this.datos.forEach(element => {
          element.fechaResolucion = this.formatDate(element.fechaResolucion);
          element.fechaCarga = this.formatDate(element.fechaCarga);
          element.numCompleto = this.formatNum(element);

        });

        //console.log("Contenido de la respuesta del back --> ", this.datos);
        this.buscar = true;
        this.progressSpinner = false;
        if (this.datos.length == 200) {
          //console.log("Dentro del if del mensaje con mas de 200 resultados");
          this.showMessage('info', this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.consulta.resultados"));
        }
        if (error != null && error.description != null) {
          this.showMessage2({ severity: 'info', summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }
        // this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        // this.resultadoBusqueda.error = err;
        console.log(err);
      });
    
  }

}