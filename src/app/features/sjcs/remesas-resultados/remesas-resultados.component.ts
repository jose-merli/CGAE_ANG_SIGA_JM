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

  progressSpinner: boolean = false;
  datos: RemesasResultadoItem = new RemesasResultadoItem();
  remesasResultadosItem: RemesasResultadoItem = new RemesasResultadoItem();

  filtrosValues: RemesasResultadoItem = new RemesasResultadoItem();
  @ViewChild(FiltroRemesasResultadosComponent) filtros;

  constructor(private sigaServices: SigaServices) { }

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

        // this.datos.forEach(element => {
        //   element.fechaRecepcion = this.formatDate(element.fechaRecepcion);
        //   element.fechaGeneracion = this.formatDate(element.fechaGeneracion);
        //   element.fechaEnvio = this.formatDate(element.fechaEnvio);
        // });

        console.log("Contenido de la respuesta del back --> ", this.datos);
        // this.buscar = true;
        this.progressSpinner = false;

        // this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        // this.resultadoBusqueda.error = err;
        console.log(err);
      });
    
  }

}