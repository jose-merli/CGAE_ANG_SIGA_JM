import { Component, OnInit } from '@angular/core';
import { ConfigComunicacionItem } from '../../../../../models/ConfiguracionComunicacionItem';
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  openFicha: boolean = false;
  activacionEditar: boolean = true;
  datos: any[];
  cols: any[];
  first: number = 0;
  body: ConfigComunicacionItem = new ConfigComunicacionItem();
  clasesComunicaciones: any[];
  modelos: any[];
  plantillas: any[];
  tipoEnvios: any[];
  progressSpinner: boolean;
  msgs: Message[];
  eliminarArray: any[];
  editar: boolean = false;
  tipoEnvio: string;
  plantilla: string;
  modelosComunicacion: any = [];
  arrayClases: any = [];


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
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {


    this.getDatos();
    this.getClasesComunicaciones();
    this.getModelosComunicacion();
    this.getTipoEnvios()

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
      }
    );
  }


  onChangeTipoEnvio() {
    this.getPlantillas();
  }

  onChangeClase() {
    this.getModelosComunicacion();
  }

  getPlantillas() {

    this.sigaServices.post("enviosMasivos_plantillas", this.body.idTipoEnvios).subscribe(
      data => {
        let comboPlantillas = JSON.parse(data["body"]);
        this.plantillas = comboPlantillas.combooItems;
        this.plantillas.map(e => {
          if (this.body.idPlantillaEnvios == e.value) {
            this.plantilla = e.label;
          }
        })

        if (this.editar) {
          this.body.idPlantillaEnvios = this.body.idPlantillaEnvios.toString();
        }

      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
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
    if (sessionStorage.getItem("comunicacionesSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("comunicacionesSearch"));
      this.editar = true;
      this.getPlantillas();
    } else {
      this.editar = false;
    }

  }


  getModelosComunicacion() {
    this.arrayClases = [];

    this.arrayClases.push(this.body.idClaseComunicacion);

    this.sigaServices.post("comunicaciones_modelosComunicacion", this.arrayClases).subscribe(
      data => {
        let result = JSON.parse(data['body']);
        this.modelosComunicacion = result.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getClasesComunicaciones() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      data => {
        this.clasesComunicaciones = data.combooItems;
        this.clasesComunicaciones.unshift({ label: 'Seleccionar', value: '' });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.clasesComunicaciones.map(e => {
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


  duplicar() {
    this.sigaServices.post("enviosMasivos_duplicar", this.body).subscribe(
      data => {
        //this.showSuccess('Se ha duplicado el envío correctamente');
        sessionStorage.setItem("ComunicacionDuplicada", "true");
        this.router.navigate(["enviosMasivos"]);
      },
      err => {
        this.showFail('Error al duplicar el envío');
        console.log(err);
      }
    );
  }


}
