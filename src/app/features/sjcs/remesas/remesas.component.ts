import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistenceService } from '../../../_services/persistence.service';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { FiltroRemesasComponent } from './filtro-remesas/filtro-remesas.component';
import { TablaRemesasComponent } from './tabla-remesas/tabla-remesas.component';
import { procesos_comision } from '../../../permisos/procesos_comision';
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
  remesaInformacionEconomica: boolean;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private datepipe: DatePipe,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit() {

    if(this.activatedRoute.snapshot.paramMap.get('tipoRemesa') == '0'){
      this.remesaInformacionEconomica = false;
    }
    
    if(this.activatedRoute.snapshot.paramMap.get('tipoRemesa') == '1'){
      this.remesaInformacionEconomica = true;
    }

    this.commonsService.checkAcceso(procesos_comision.remesasEnvio)
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

      this.commonsService.checkAcceso(procesos_comision.remesasInformacionEconomica)
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

      if(localStorage.getItem('remesaBorrada') == "true"){
        this.showMessage("success", this.translateService.instant("general.message.correct"), "La remesa se ha borrado correctmente");
        localStorage.removeItem('remesaBorrada');
      }
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
      'sufijo': (this.filtrosValues.sufijo != null && this.filtrosValues.sufijo != undefined) ? this.filtrosValues.sufijo.toString() : this.filtrosValues.sufijo,
      'informacionEconomica': (this.remesaInformacionEconomica) ? this.remesaInformacionEconomica : this.remesaInformacionEconomica
    };
    this.progressSpinner = true;
    this.sigaServices.post("filtrosremesas_buscarRemesa", this.remesasDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al buscarRemesas");
        this.datos = JSON.parse(n.body).remesasItems;
        
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
      },
      () =>{
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaRemesa');
          this.commonsService.scrollTop();
        }, 5);
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