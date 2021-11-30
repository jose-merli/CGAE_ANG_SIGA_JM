import { Component, OnInit, ViewChild } from '@angular/core';
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate';

@Component({
  selector: 'app-destinatarios-etiquetas-envio-masivo',
  templateUrl: './destinatarios-etiquetas-envio-masivo.component.html',
  styleUrls: ['./destinatarios-etiquetas-envio-masivo.component.scss']
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
  progressSpinner: boolean = false;
  noEditar: boolean = false;


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
      key: "destinatariosIndv",
      activa: false
    },
    {
      key: "destinatariosList",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    }
  ];

  constructor(
    // private router: Router,
    // private translateService: TranslateService,
    private sigaServices: SigaServices,
    private translateService: TranslateService
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
          this.etiquetasNoSeleccionadas = [];
          let array = n.comboItems;

          array.forEach(element => {
            let e = { label: element.label, value: { label: element.label, value: element.value, idInstitucion: element.idInstitucion } };
            this.etiquetasNoSeleccionadas.push(e);
          });

          this.noSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));
        },
        err => {
          //console.log(err);
        },
        () => {
          let i = 0;
          let etiquetas = [];
          if (this.etiquetasSeleccionadas != undefined) {
            this.etiquetasNoSeleccionadas.forEach(element => {
              let find = this.etiquetasSeleccionadas.findIndex(x => x.value === element.value.value && x.idInstitucion === element.value.idInstitucion);
              if (find == -1) {
                etiquetas.push(this.etiquetasNoSeleccionadas[i]);
              }
              i++;
            });

            this.etiquetasNoSeleccionadas = [];
            this.etiquetasNoSeleccionadas = etiquetas;
          }
          this.progressSpinner = false;
        }
      );
  }

  getSeleccionadas() {
    this.progressSpinner = true;

    if(this.body.idEnvio != undefined){
      this.sigaServices
        .post("enviosMasivos_etiquetasEnvio", this.body.idEnvio)
        .subscribe(
          n => {
            // coger etiquetas de una persona juridica
            this.etiquetasSeleccionadas = [];
            this.etiquetasSeleccionadas = JSON.parse(n["body"]).comboItems;
            this.seleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));
            this.progressSpinner = false;

          },
          err => {
            //console.log(err);
            this.progressSpinner = false;

          },
          () => {
            this.progressSpinner = false;
          }


        );
    }else{
      this.progressSpinner = false;
    }
  }



  guardar() {
    this.progressSpinner = true;
    let array: any[] = [];
    let arrayNoSel: any[] = [];
    this.etiquetasSeleccionadas.forEach(element => {

      if (element.idInstitucion != undefined) {
        array.push(element);
      } else {
        let e = element.value;
        array.push(element.value);
        element = e;
      }

    });
    this.etiquetasNoSeleccionadas.forEach(element => {

      if (element.idInstitucion != undefined) {
        arrayNoSel.push(element);
      } else {
        let e = element.value;
        arrayNoSel.push(element.value);
        element = e;
      }

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
          this.showSuccess(this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.guardar.etiquetas.ok"));
          this.seleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));
          this.noSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));
          this.progressSpinner = false;

        },
        err => {
          this.showSuccess(this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.error.guardar.etiquetas"));
          //console.log(err);
          this.progressSpinner = false;

        },
        () => {
          this.progressSpinner = false;
        }
      );

  }




  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
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
      if (this.body.idEstado != '1' && this.body.idEstado != '4') {
        this.noEditar = true;
      }
    } else {
      this.getSeleccionadas();
    }
  }

  restablecer() {
    this.progressSpinner = true;
    this.getDatos();
  }
}
