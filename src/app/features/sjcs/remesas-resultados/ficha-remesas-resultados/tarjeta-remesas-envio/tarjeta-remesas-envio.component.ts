import { Component, Input } from '@angular/core'
import { Router } from '@angular/router';
import { RemesasItem } from '../../../../../models/sjcs/RemesasItem';
import { RemesasResultadoItem } from '../../../../../models/sjcs/RemesasResultadoItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
    selector: 'app-tarjeta-remesas-envio',
    templateUrl: './tarjeta-remesas-envio.component.html',
    styleUrls: ['./tarjeta-remesas-envio.component.scss'],
  })
export class TarjetaRemesasEnvioComponent {
    progressSpinner: boolean = false;
    msgs;
    openFicha: boolean = false;
    datos;
    estado;
    incidencias;
    remesasDatosEntradaItem;
    resultado;
    @Input() remesaItem: RemesasResultadoItem ;
    @Input() remesaTabla;
    remesa: { idRemesa: any; descripcion: string; nRegistro: number;};

    constructor(private router: Router,private sigaServices: SigaServices){}
    nuevo: boolean = false;

    ngOnInit(){
      if(this.remesaItem.idRemesa == null){
        this.nuevo = true;
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

    clear() {
        this.msgs = [];
      }

    RemesaEnvio(){
      if(!this.nuevo)
      {
        this.remesa=  {
          'idRemesa': this.remesaItem.idRemesa,
          'descripcion': this.remesaItem.descripcionRemesa,
          'nRegistro': this.remesaItem.numRegistroRemesaCompleto,
        }
        this.router.navigate(["/fichaRemesasEnvio"]);
        localStorage.setItem('remesaItem', JSON.stringify(this.remesa));
        localStorage.setItem('ficha', "registro");
      }      

    }


}