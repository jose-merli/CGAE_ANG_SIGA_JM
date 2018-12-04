import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ProgEnviosMasivosItem } from '../../../../../models/ProgramacionEnviosMasivosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";

@Component({
  selector: 'app-programacion-envio-masivo',
  templateUrl: './programacion-envio-masivo.component.html',
  styleUrls: ['./programacion-envio-masivo.component.scss']
})
export class ProgramacionEnvioMasivoComponent implements OnInit {


  openFicha: boolean = false;
  body: ProgEnviosMasivosItem = new ProgEnviosMasivosItem();
  es: any = esCalendar;
  fecha: Date;



  fichasPosibles = [
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "programacion",
      activa: false
    },
    {
      key: "destinatarios",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    },

  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {

    this.getDatos();


  }



  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
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


  backTo() {
    this.location.back();
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      // let fechaCreacion = new Date(this.body.fechaCreacion)
    }
  }

}
