import { Component, OnInit } from '@angular/core';
import { RemesasResolucionItem } from '../../../../models/sjcs/RemesasResolucionItem';
import { procesos_intercambios } from '../../../../permisos/procesos_intercambios';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Router, ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-carga-designa-procurador',
  templateUrl: './carga-designa-procurador.component.html',
  styleUrls: ['./carga-designa-procurador.component.scss']
})
export class CargaDesignaProcuradorComponent implements OnInit {

  buscar: boolean = false;
  progressSpinner: boolean = false;
  datos;
  msgs;
  permisoEscritura;
  filtrosValues: RemesasResolucionItem = new RemesasResolucionItem();
  
  constructor(private persistenceService: PersistenceService,private translateService: TranslateService, private router: Router,
    private sigaServices: SigaServices, private datepipe: DatePipe,private commonsService: CommonsService,) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_intercambios.cargaDesignasProcurador)
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

  search(){
    console.log("QWEQWE");
    console.log(this.buscar);
    this.progressSpinner = true;
    this.sigaServices.post("intercambios_buscarCargaDesignaProcuradores", this.filtrosValues).subscribe(
      n => {
        console.log("Dentro del servicio que llama al buscarRemesasResultado");
        this.datos = JSON.parse(n.body).remesasResolucionItem;

        this.datos.forEach(element => {
          element.fechaResolucion = this.formatDate(element.fechaResolucion);
          element.fechaCarga = this.formatDate(element.fechaCarga);
          element.numCompleto = this.formatNum(element);

        });

        console.log("Contenido de la respuesta del back --> ", this.datos);
        this.buscar = true;
        this.progressSpinner = false;

        // this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        // this.resultadoBusqueda.error = err;
        console.log(err);
      });
    
  }
  //intercambios_buscarCargaDesignaProcuradores

}
