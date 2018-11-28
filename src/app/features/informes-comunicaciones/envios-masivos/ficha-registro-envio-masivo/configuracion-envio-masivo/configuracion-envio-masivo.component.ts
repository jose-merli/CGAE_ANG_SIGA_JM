import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfigEnviosMasivosItem } from '../../../../../models/ConfiguracionEnviosMasivosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";

@Component({
  selector: 'app-configuracion-envio-masivo',
  templateUrl: './configuracion-envio-masivo.component.html',
  styleUrls: ['./configuracion-envio-masivo.component.scss']
})
export class ConfiguracionEnvioMasivoComponent implements OnInit {


  openFicha: boolean = false;
  activacionEditar: boolean = true;
  body: ConfigEnviosMasivosItem = new ConfigEnviosMasivosItem();
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];

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

    this.objetivos = [
      {
        label: 'seleccione..', value: null
      },
      {
        label: 'Destinatarios', value: '1'
      },
      {
        label: 'Condicional', value: '2'
      }
    ]

    // this.body.idConsulta = this.consultas[1].value;
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

  backTo() {
    this.location.back();
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
    }
  }

  onGuardar() {
    sessionStorage.removeItem("crearNuevoEnvio");
  }

}
