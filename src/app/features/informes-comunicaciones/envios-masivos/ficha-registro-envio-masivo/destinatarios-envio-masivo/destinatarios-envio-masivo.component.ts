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
  seleccionadasInicial: any[];
  noSeleccionadasInicial: any[];


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

  getExtistentes() {
    this.sigaServices
      .get("enviosMasivos_etiquetas")
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.etiquetasNoSeleccionadas = n.combooItems;
          this.noSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));

        },
        err => {
          console.log(err);
        }
      );
  }

  getSeleccionadas() {
    this.sigaServices
      .post("enviosMasivos_etiquetasEnvio", this.body.idEnvio)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.etiquetasSeleccionadas = JSON.parse(n["body"]).combooItems;
          this.seleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));

        },
        err => {
          console.log(err);
        }
      );
  }



  guardar() {

    let array: any[] = [];
    let arrayNoSel: any[] = [];
    this.etiquetasSeleccionadas.forEach(element => {
      array.push(element.value)
    });
    this.etiquetasNoSeleccionadas.forEach(element => {
      arrayNoSel.push(element.value)
    });

    let objEtiquetas = {
      etiquetasSeleccionadas: array,
      etiquetasNoSeleccionadas: arrayNoSel,
      idEnvio: this.body.idEnvio
    }

    this.sigaServices
      .post("enviosMasivos_guardarEtiquetas", objEtiquetas)
      .subscribe(
        n => {
          this.showSuccess('Se han guardado las etiquetas correctamente');
          this.seleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));
          this.noSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));
        },
        err => {
          this.showSuccess('Error al guardar las etiquetas');
          console.log(err);

        },
        () => {

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
      this.getSeleccionadas();
      this.getExtistentes();
    }
    this.getSeleccionadas();
  }

  restablecer() {
    this.etiquetasSeleccionadas = JSON.parse(JSON.stringify(this.seleccionadasInicial));
    this.etiquetasNoSeleccionadas = JSON.parse(JSON.stringify(this.noSeleccionadasInicial));
  }


}
