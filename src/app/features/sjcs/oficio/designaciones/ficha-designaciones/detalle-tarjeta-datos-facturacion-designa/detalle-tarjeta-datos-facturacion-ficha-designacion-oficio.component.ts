import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-facturacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent implements OnInit {
  datosInicial: any;
  @Input() campos;
  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: []
    };
  nuevaDesigna: any;
  msgs: Message[] = [];

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() { 
    this.datosInicial = this.campos;
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
  if(!this.nuevaDesigna){
      this.getIdPartidaPresupuestaria(this.campos);
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

  getIdPartidaPresupuestaria(designaItem) {
    let facturacionDesigna = new DesignaItem();
    facturacionDesigna.idTurno = designaItem.idTurno;
    let anio = this.campos.ano.split("/");
    facturacionDesigna.ano = Number(anio[0].substring(1,5));
    facturacionDesigna.numero = designaItem.numero;
    this.sigaServices.post("designaciones_getDatosFacturacion", facturacionDesigna).subscribe(
      n => {
        console.log(n.combooItems);
      },
      err => {
        console.log(err);
      }, () => {
        // this.arregloTildesCombo(this.selectores[1].opciones);
      }
    );
  }

  updatePartidaPresupuestaria(designaItem,severity, summary, detail) {
    let facturacionDesigna = new DesignaItem();
    facturacionDesigna.idTurno = designaItem.idTurno;
    let anio = this.campos.ano.split("/");
    facturacionDesigna.ano = Number(anio[0].substring(1,5));
    facturacionDesigna.numero = designaItem.numero;
    // facturacionDesigna.idPartidaPresupuestaria = 
    this.sigaServices.post("designaciones_updateDatosFacturacion", facturacionDesigna).subscribe(
      n => {
        console.log(n.body);
        this.msgs.push({
          severity,
          summary,
          detail
        });
      },
      err => {
        console.log(err);
        severity = "error";
        summary = err;
        this.msgs.push({
          severity,
          summary,
          detail
        });
      }, () => {
        // this.arregloTildesCombo(this.selectores[1].opciones);
      }
    );
  }


  showMsg(severity, summary, detail) {
    this.msgs = [];
    if(detail == "Restablecer"){

    }else if(detail == "Guardar"){
      this.updatePartidaPresupuestaria(this.campos,severity, summary, detail);
      
    }
    
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
