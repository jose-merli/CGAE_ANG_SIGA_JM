import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { DataTable } from "primeng/datatable";
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";

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
  msgs: Message[];
  etiquetasPersonaJuridica: any[];

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


    // this.etiquetasSeleccionadas = [
    //   { label: 'Administrador', value: '1' },
    //   { label: 'Administrador General', value: '2' }
    // ]
    this.etiquetasNoSeleccionadas = [
      { label: 'Grupo Deontológico', value: '1' },
      { label: 'Abogado', value: '2' }
    ]

  }


  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  getDestinatarios() {
    this.sigaServices
      .post("busquedaPerJuridica_etiquetasPersona", this.body)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.etiquetasSeleccionadas = JSON.parse(n["body"]).combooItems;
          console.log(this.etiquetasSeleccionadas);
        },
        err => {
          console.log(err);
        }
      );
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
      // this.body.idLenguaje = '1';
      // this.body.idPersona = '1';
      this.getDestinatarios();
    }
    this.getDestinatarios();
  }


}
