import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { DataTable } from "primeng/datatable";
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';

@Component({
  selector: 'app-destinatarios-envio-masivo',
  templateUrl: './destinatarios-envio-masivo.component.html',
  styleUrls: ['./destinatarios-envio-masivo.component.scss']
})
export class DestinatariosEnvioMasivoComponent implements OnInit {

  openFicha: boolean = false;
  openDestinatario: boolean;
  etiquetasSeleccionadas: any[];
  etiquetasNoSeleccionadas: any[];
  body: DestinatariosEnviosMasivosItem = new DestinatariosEnviosMasivosItem();

  @ViewChild('table') table: DataTable;
  selectedDatos

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
    // private router: Router,
    // private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {

    this.getDatos();

    this.etiquetasSeleccionadas = [
      { label: 'Administrador', value: '1' },
      { label: 'Administrador General', value: '2' }
    ]
    this.etiquetasNoSeleccionadas = [
      { label: 'Grupo Deontológico', value: '1' },
      { label: 'Abogado', value: '2' }
    ]


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

  onOpenDestinatario(d) {
    d.open = !d.open;
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
    }
  }

}
