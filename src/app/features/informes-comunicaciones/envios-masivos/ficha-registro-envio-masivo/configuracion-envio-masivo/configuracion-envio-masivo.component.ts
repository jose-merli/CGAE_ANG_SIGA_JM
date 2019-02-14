import { Component, OnInit } from '@angular/core';
import { ConfigEnviosMasivosItem } from '../../../../../models/ConfiguracionEnviosMasivosItem';
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";

@Component({
  selector: 'app-configuracion-envio-masivo',
  templateUrl: './configuracion-envio-masivo.component.html',
  styleUrls: ['./configuracion-envio-masivo.component.scss']
})
export class ConfiguracionEnvioMasivoComponent implements OnInit {


  openFicha: boolean = false;
  body: ConfigEnviosMasivosItem = new ConfigEnviosMasivosItem();
  bodyInicial: ConfigEnviosMasivosItem = new ConfigEnviosMasivosItem();
  editar: boolean = false;
  plantillas: any[];
  tipoEnvios: any[];
  progressSpinner: boolean;
  msgs: Message[];
  eliminarArray: any[];
  tipoEnvio: string;


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
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {



  }

  ngOnInit() {

    this.editar = false;
    this.getDatos();
    this.getTipoEnvios();

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


  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      data => {
        this.tipoEnvios = data.combooItems;
        this.tipoEnvios.unshift({ label: 'Seleccionar', value: '' });
        this.tipoEnvios.map(e => {
          if (this.body.idTipoEnvios == e.value) {
            this.tipoEnvio = e.label;
          }
        })
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.tipoEnvios.map(e => {
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
      },
      () => {
      }
    );
  }

  onChangeTipoEnvio() {
    this.getPlantillas();
  }


  enviar() {
    let envios = [];
    let objEnvio = {
      idEnvio: this.body.idEnvio
    };
    envios.push(objEnvio);

    this.sigaServices.post("enviosMasivos_enviar", envios).subscribe(
      data => {
        this.showSuccess('Se ha lanzado el envio correctamente');
      },
      err => {
        this.showFail('Error al procesar el envio');
        console.log(err);
      },
      () => {
      }
    );
  }

  getPlantillas() {
    this.sigaServices.post("enviosMasivos_plantillas", this.body.idTipoEnvios).subscribe(
      data => {
        let comboPlantillas = JSON.parse(data["body"]);
        this.plantillas = comboPlantillas.combooItems;

        if (this.editar) {
          this.body.idPlantillaEnvios = this.body.idPlantillaEnvios.toString();
        }

        console.log(this.plantillas)
      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }



  abreCierraFicha() {
    this.openFicha = !this.openFicha;

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
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      this.editar = true;
      this.getPlantillas();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    } else {
      this.editar = false;
    }

  }


  cancelar() {

    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: '¿Está seguro de cancelar el envío?',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarCancelar();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }


  confirmarCancelar() {
    this.eliminarArray = [];
    let objCancelar = {
      idEstado: this.body.idEstado,
      idEnvio: this.body.idEnvio,
      fechaProgramacion: new Date(this.body.fechaProgramada)
    };
    this.eliminarArray.push(objCancelar);
    this.sigaServices.post("enviosMasivos_cancelar", this.eliminarArray).subscribe(
      data => {
        this.showSuccess('Se ha cancelado el envío correctamente');
      },
      err => {
        this.showFail('Error al cancelar el envío');
        console.log(err);
      },
      () => {

      }
    );
  }

  guardar() {

    this.sigaServices.post("enviosMasivos_guardarConf", this.body).subscribe(
      data => {
        this.body.idEstado = '4';
        let result = JSON.parse(data["body"]);
        this.body.idEnvio = result.description;

        if (sessionStorage.getItem("crearNuevoEnvio") != null) {
          this.body.fechaCreacion = new Date();
        }
        console.log(this.body.fechaCreacion);
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        sessionStorage.removeItem("crearNuevoEnvio");
        sessionStorage.setItem("enviosMasivosSearch", JSON.stringify(this.body));
        this.showSuccess('Se ha guardado el envío correctamente');
      },
      err => {
        this.showFail('Error al guardar el envío');
        console.log(err);
      },
      () => {

      }
    );


  }


  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  duplicar() {
    this.sigaServices.post("enviosMasivos_duplicar", this.body).subscribe(
      data => {
        this.showSuccess('Se ha duplicado el envío correctamente');
      },
      err => {
        this.showFail('Error al duplicar el envío');
        console.log(err);
      }
    );
  }


  isGuardarDisabled() {
    if (this.body.idTipoEnvios != '' && this.body.idTipoEnvios != null && this.body.idPlantillaEnvios != ''
      && this.body.idPlantillaEnvios != null && this.body.descripcion != '' && this.body.descripcion != null) {
      return false;
    }
    return true;
  }







}
