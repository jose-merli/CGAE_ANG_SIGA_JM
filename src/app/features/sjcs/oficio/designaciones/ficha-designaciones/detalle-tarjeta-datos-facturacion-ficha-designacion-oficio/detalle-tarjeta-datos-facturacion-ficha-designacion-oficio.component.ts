import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-facturacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent implements OnInit {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: []
    };
  nuevaDesigna: any;
  msgs: Message[] = [];

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() { 
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
  if(!this.nuevaDesigna){

  }else{
    this.getComboPartidaPresupuestaria();
  }
    
  }

 getComboPartidaPresupuestaria() {

    this.sigaServices.get("designaciones_comboPartidaPresupuestaria").subscribe(
      n => {
        this.selector[0].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selector[0].opciones);
      }
    );
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    if(detail == "Restablecer"){

    }else if(detail == "Guardar"){

    }
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }
}
