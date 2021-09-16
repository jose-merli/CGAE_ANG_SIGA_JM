import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';
import { RemesasResultadoItem } from '../../../models/sjcs/RemesasResultadoItem';
import { SigaServices } from '../../../_services/siga.service';
import { FiltroRemesasResultadosComponent } from './filtro-remesas-resultados/filtro-remesas-resultados.component';


@Component({
  selector: 'app-remesas-resultados',
  templateUrl: './remesas-resultados.component.html',
  styleUrls: ['./remesas-resultados.component.scss']
})
export class RemesasResultadosComponent implements OnInit {

  buscar: boolean = false;
  progressSpinner: boolean = false;
  datos;
  remesasResultadosItem: RemesasResultadoItem = new RemesasResultadoItem();

  filtrosValues: RemesasResultadoItem = new RemesasResultadoItem();
  @ViewChild(FiltroRemesasResultadosComponent) filtros;

  constructor(private sigaServices: SigaServices, private datepipe: DatePipe) { }

  ngOnInit() { }

  getFiltrosValues(event) {
    this.filtrosValues = JSON.parse(JSON.stringify(event));
    this.convertArraysToStrings();
    this.search();
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

  search(){
    this.progressSpinner = true;
    this.sigaServices.post("remesasResultados_buscarRemesasResultados", this.filtrosValues).subscribe(
      n => {
        console.log("Dentro del servicio que llama al buscarRemesasResultado");
        this.datos = JSON.parse(n.body).remesasResultadosItems;

        this.datos.forEach(element => {
          element.fechaResolucionRemesaResultado = this.formatDate(element.fechaResolucionRemesaResultado);
          element.fechaCargaRemesaResultado = this.formatDate(element.fechaCargaRemesaResultado);
          element.numRegistroRemesaCompleto = this.formatNumRegistroRemesaCompleto(element);
          element.numRemesaCompleto = this.formatNumRegistroRemesaCompleto(element);
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

  formatNumRegistroRemesaCompleto(element){
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

  formatNumRemesaCompleto(element){
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

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);    
  }

}