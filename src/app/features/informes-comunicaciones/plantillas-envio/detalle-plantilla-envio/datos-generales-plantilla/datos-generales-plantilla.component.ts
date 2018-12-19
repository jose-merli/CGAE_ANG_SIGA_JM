import { Component, OnInit } from '@angular/core';
import { DatosGeneralesPlantillaItem } from '../../../../../models/DatosGeneralesPlantillaItem';
import { SigaServices } from "./../../../../../_services/siga.service";


@Component({
  selector: 'app-datos-generales-plantilla',
  templateUrl: './datos-generales-plantilla.component.html',
  styleUrls: ['./datos-generales-plantilla.component.scss']
})
export class DatosGeneralesPlantillaComponent implements OnInit {


  openFicha: boolean = false;
  activacionEditar: boolean = true;
  body: DatosGeneralesPlantillaItem = new DatosGeneralesPlantillaItem();
  tiposEnvio: any[];



  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "remitente",
      activa: false
    },
  ];


  constructor(
    private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {

    this.getTipoEnvios();
    this.getDatos();


    this.tiposEnvio = [
      {
        label: 'seleccione..', value: null
      },
      {
        label: 'Email', value: '1'
      },
      {
        label: 'SMS', value: '2'
      }
    ]

  }

  abreCierraFicha() {
    if (this.activacionEditar == true) {
      this.openFicha = !this.openFicha;
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }


  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
    }
  }

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      n => {
        this.tiposEnvio = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
      para poder filtrar el dato con o sin estos caracteres*/
        this.tiposEnvio.map(e => {
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
      },
      err => {
        console.log(err);
      }
    );
  }





}
