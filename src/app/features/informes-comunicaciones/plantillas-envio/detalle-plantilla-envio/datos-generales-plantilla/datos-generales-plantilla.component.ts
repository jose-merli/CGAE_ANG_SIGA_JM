import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatosGeneralesPlantillaItem } from '../../../../../models/DatosGeneralesPlantillaItem';
import { Location } from "@angular/common";

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
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    // private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {

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

    // this.body.idTipoEnvio = this.tiposEnvio[1].value;
  }

  abreCierraFicha() {
    // let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
      // fichaPosible.activa = !fichaPosible.activa;
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




}
