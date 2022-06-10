import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';
import { RemesasResultadoItem } from '../../../models/sjcs/RemesasResultadoItem';
import { CommonsService } from '../../../_services/commons.service';
import { procesos_comision } from '../../../permisos/procesos_comision';
import { SigaServices } from '../../../_services/siga.service';
import { TranslateService } from '../../../commons/translate';
import { Router } from '../../../../../node_modules/@angular/router';
import { FiltroRemesasResultadosComponent } from './filtro-remesas-resultados/filtro-remesas-resultados.component';
import { PersistenceService } from '../../../_services/persistence.service';
import { TablaRemesasResultadosComponent } from './tabla-remesas-resultados/tabla-remesas-resultados.component';


@Component({
  selector: 'app-remesas-resultados',
  templateUrl: './remesas-resultados.component.html',
  styleUrls: ['./remesas-resultados.component.scss']
})
export class RemesasResultadosComponent implements OnInit {

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


  @ViewChild(FiltroRemesasResultadosComponent) filtrosValues;
  @ViewChild(TablaRemesasResultadosComponent) tabla;

  constructor(private persistenceService: PersistenceService,private translateService: TranslateService, private router: Router,
           private sigaServices: SigaServices, private datepipe: DatePipe,private commonsService: CommonsService,) { }

          
  ngOnInit() {
    this.commonsService.checkAcceso(procesos_comision.remesasResultado)
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
    const array = ['numRemesaPrefijo', 'numRemesaNumero', 'numRegistroPrefijo', 'numRegistroNumero', 'numRegistroSufijo', 'nombreFichero', 'fechaRemesaDesde', 'fechaRemesaHasta', 'fechaCargaDesde', 'fechaCargaHasta'];
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

  search(event){
    this.progressSpinner = true;
    this.sigaServices.post("remesasResultados_buscarRemesasResultados", this.filtrosValues).subscribe(
      n => {
        //console.log("Dentro del servicio que llama al buscarRemesasResultado");
        this.datos = JSON.parse(n.body).remesasResultadosItems;

        this.datos.forEach(element => {
          element.fechaResolucionRemesaResultado = this.formatDate(element.fechaResolucionRemesaResultado);
          element.fechaCargaRemesaResultado = this.formatDate(element.fechaCargaRemesaResultado);
          element.numRegistroRemesaCompleto = this.formatNumRegistroRemesaCompleto(element);
          element.numRemesaCompleto = this.formatNumRemesaCompleto(element);
        });

        //console.log("Contenido de la respuesta del back --> ", this.datos);
        this.buscar = true;
        this.progressSpinner = false;
        this.progressSpinner = false;
        if (this.datos.length == 200) {
          //console.log("Dentro del if del mensaje con mas de 200 resultados");
          this.showMessage('info', this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.consulta.resultados"));
        }
        // this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        // this.resultadoBusqueda.error = err;
        //console.log(err);
      });
    
  }

  formatNumRegistroRemesaCompleto(element){
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
  formatNumRemesaCompleto(element){
    // {{dato["prefijoRemesa"]}}{{dato["numeroRemesa"]}}{{dato["sufijoRemesa"]}}
    let numeroFormateado = ''; 
    if(element.prefijoRemesa !== null){
      numeroFormateado += element.prefijoRemesa
    }
    if(element.numeroRemesa !== null){
      numeroFormateado += element.numeroRemesa
    }
    if(element.sufijoRemesa !== null){
      numeroFormateado += element.sufijoRemesa
    }
    return numeroFormateado;
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);    
  }

}