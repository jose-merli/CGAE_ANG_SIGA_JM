import { Component, OnInit} from '@angular/core';
import { RemesasResultadoItem } from '../../../models/sjcs/RemesasResultadoItem';
import { SigaServices } from '../../../_services/siga.service';


@Component({
  selector: 'app-remesas-resultados',
  templateUrl: './remesas-resultados.component.html',
  styleUrls: ['./remesas-resultados.component.scss']
})
export class RemesasResultadosComponent implements OnInit {

  progressSpinner: boolean = false;
  datos: RemesasResultadoItem = new RemesasResultadoItem();
  remesasResultadosItem: RemesasResultadoItem = new RemesasResultadoItem();

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() { }

  search(){
    this.progressSpinner = true;
    this.remesasResultadosItem.descripcionRemesa = 'hola';
    this.sigaServices.post("remesasResultados_buscarRemesasResultados", this.remesasResultadosItem).subscribe(
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