import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { DatePipe } from '@angular/common';
import { CargaMasivaObject } from '../../../../models/CargaMasivaObject';
import { CargaMasivaItem } from '../../../../models/CargaMasivaItem';
import { TarjetaDatosCurricularesComponent } from './tarjta-datos-curriculares/tarjeta-datos-curriculares.component';
import { TarjetaListadoComponent } from './tarjeta-listado/tarjeta-listado.component';

@Component({
  selector: 'app-carga-masiva-procuradores',
  templateUrl: './carga-masiva-procuradores.component.html',
  styleUrls: ['./carga-masiva-procuradores.component.scss']
})
export class CargaMasivaProcuradoresComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  resultadoBusqueda: CargaMasivaObject = new CargaMasivaObject();
  filtrosValues: CargaMasivaItem = new CargaMasivaItem();

  progressSpinner: boolean = false;

  @ViewChild(TarjetaDatosCurricularesComponent) filtros;
  @ViewChild(TarjetaListadoComponent) tabla;

  cargaMasivaDatosEntradaItem;
  datos;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private datepipe: DatePipe) { }

  ngOnInit() {
  }

	getFiltrosValues(event) {
    this.filtrosValues = JSON.parse(JSON.stringify(event));
    this.convertArraysToStrings();
    this.search();
  }

  convertArraysToStrings() {
    const array = ['fechaCarga'];
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
    this.cargaMasivaDatosEntradaItem =
    {
      'fechaCarga': (this.filtrosValues.fechaCarga != null && this.filtrosValues.fechaCarga != undefined) ? this.filtrosValues.fechaCarga : this.filtrosValues.fechaCarga,
    };
    this.progressSpinner = true;
    this.sigaServices.post("intercambios_buscarCargaMasivaProcuradores", this.cargaMasivaDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al busqueda de Carga Masiva Procuradores");
        this.datos = JSON.parse(n.body).cargaMasivaProcuradorItem;
 
        console.log("Contenido de la respuesta del back de Carga Masiva Procuradores--> ", this.datos);
        this.buscar = true;
        this.progressSpinner = false;

        this.resetSelect();

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
