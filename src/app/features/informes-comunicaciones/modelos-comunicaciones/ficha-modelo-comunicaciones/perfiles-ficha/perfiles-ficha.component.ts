import { Component, OnInit, ViewChild } from '@angular/core';
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";

@Component({
  selector: 'app-perfiles-ficha',
  templateUrl: './perfiles-ficha.component.html',
  styleUrls: ['./perfiles-ficha.component.scss']
})
export class PerfilesFichaComponent implements OnInit {

  openFicha: boolean = false;
  openDestinatario: boolean;
  etiquetasSeleccionadas: any[];
  etiquetasNoSeleccionadas: any[];
  body: DestinatariosEnviosMasivosItem = new DestinatariosEnviosMasivosItem();
  msgs: Message[];
  etiquetasPersonaJuridica: any[];
  seleccionadasInicial: any[];
  noSeleccionadasInicial: any[];
  progressSpinner: boolean = false;


  @ViewChild('table') table: DataTable;
  selectedDatos

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "perfiles",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
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
    this.progressSpinner = true;
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
        },
        () => {
          this.progressSpinner = false;
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
        },

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
          this.progressSpinner = false;
        }
      );

  }




  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoModelo") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
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




}
