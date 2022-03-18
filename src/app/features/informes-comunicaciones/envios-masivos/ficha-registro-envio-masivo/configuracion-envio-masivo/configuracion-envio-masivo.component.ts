import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfigEnviosMasivosItem } from "../../../../../models/ConfiguracionEnviosMasivosItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { truncate } from 'fs';
import { CommonsService } from '../../../../../_services/commons.service';
import { EnviosMasivosObject } from '../../../../../models/EnviosMasivosObject';
import { EnviosMasivosItem } from '../../../../../models/EnviosMasivosItem';


@Component({
  selector: "app-configuracion-envio-masivo",
  templateUrl: "./configuracion-envio-masivo.component.html",
  styleUrls: ["./configuracion-envio-masivo.component.scss"]
})
export class ConfiguracionEnvioMasivoComponent implements OnInit {
  searchEnviosMasivos: EnviosMasivosObject = new EnviosMasivosObject();
  searchEnvios: EnviosMasivosItem = new EnviosMasivosItem();
  openFicha: boolean = true;
  body: ConfigEnviosMasivosItem = new ConfigEnviosMasivosItem();
  bodyInicial: ConfigEnviosMasivosItem = new ConfigEnviosMasivosItem();
  editar: boolean = false;
  plantillas: any[];
  tipoEnvios: any[];
  progressSpinner: boolean;
  msgs: Message[];
  eliminarArray: any[];
  tipoEnvio: string;
  editarPlantilla: boolean = false;
  apiKey: string = "";

  resaltadoDatos: boolean = false;

  editorConfig: any = {
    selector: "textarea",
    plugins:
      "autoresize pagebreak table save charmap media contextmenu paste directionality noneditable visualchars nonbreaking spellchecker template searchreplace lists link image insertdatetime textcolor code hr",
    toolbar:
      "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect | cut copy paste pastetext | searchreplace | bullist numlist | indent blockquote | undo redo | link unlink image code | insertdatetime preview | forecolor backcolor",
    menubar: false,
    autoresize_on_init: true,
    statusbar: false,
    paste_data_images: true,
    images_upload_handler: function (blobInfo, success, failure) {
      // no upload, just return the blobInfo.blob() as base64 data
      success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
    }
  };

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
      key: "documentos",
      activa: false
    }
  ];
  // @Output() emitOpenDescripcion = new EventEmitter<any>();
  // @Output() cuerpoPlantilla = new EventEmitter<any>();
  // @Output() guardarDatos = new EventEmitter<any>();

  // @Input() nuevoCuerpoPlantilla;

  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.resaltadoDatos = true;

    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }

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

  detallePlantilla(event) {
    this.onlyCheckDatos();
    if (event.value != undefined) {
      this.body.cuerpo = "";
      if (
        this.body.idTipoEnvios == "1" ||
        this.body.idTipoEnvios == "4" ||
        this.body.idTipoEnvios == "5" ||
        this.body.idTipoEnvios == "7"
      ) {

        let datosPlantilla = {
          idPlantillaEnvios: event.value,
          idTipoEnvios: this.body.idTipoEnvios
        };
        this.sigaServices
          .post("enviosMasivos_detallePlantilla", datosPlantilla)
          .subscribe(data => {
            let datos = JSON.parse(data["body"]);
            this.body.asunto = datos.asunto;
            this.body.cuerpo = datos.cuerpo;
            if (datos.idPersona == null){
              this.showFail(this.translateService.instant(
                "general.message.datos.generales.remitente"));
                this.body.idPlantillaEnvios = null;
            }
          },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            }, () => {
              if (this.body.cuerpo != undefined) {
                let cuerpoPlantilla = {
                  cuerpo: this.body.cuerpo,
                  asunto: this.body.asunto,
                }
                // this.cuerpoPlantilla.emit(cuerpoPlantilla);
              }
            });
      }
    } else {
      this.body.cuerpo = "";
      this.body.asunto = "";
    }
  }

  detallePlantillaInicial() {
      this.body.cuerpo = "";
      if (
        this.body.idTipoEnvios == "1" ||
        this.body.idTipoEnvios == "4" ||
        this.body.idTipoEnvios == "5" ||
        this.body.idTipoEnvios == "7"
      ) {

        let datosPlantilla = {
          idPlantillaEnvios: this.body.idPlantillaEnvios,
          idTipoEnvios: this.body.idTipoEnvios
        };
        this.sigaServices
          .post("enviosMasivos_detallePlantilla", datosPlantilla)
          .subscribe(data => {
            let datos = JSON.parse(data["body"]);
            this.body.asunto = datos.asunto;
            this.body.cuerpo = datos.cuerpo;
          },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            }, () => {
              
            });
      }
    
  }

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      data => {
        this.tipoEnvios = data.combooItems;
        // this.tipoEnvios.unshift({ label: this.translateService.instant("tablas.literal.seleccionarTodo"), value: '' });
        this.tipoEnvios.map(e => {
          if (this.body.idTipoEnvios == e.value) {
            this.tipoEnvio = e.label;
          }
        });
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
        //console.log(err);
      },
      () => {
        let datosGuardar = {
          idEnvio: this.body.idEnvio,
          idEstado: this.body.idEstado,
          idTipoEnvio: this.body.idTipoEnvios,
          descripcion: this.body.descripcion,
          asunto: this.body.asunto,
        }
        // this.guardarDatos.emit(datosGuardar);
      }
    );
  }

  onChangeTipoEnvio(e) {
    this.onlyCheckDatos();
    if (e != null) {
      this.body.tipoEnvio = e.originalEvent.currentTarget.innerText;
    }
    if (this.body.idTipoEnvios != null && this.body.idTipoEnvios != "") {
      this.getPlantillas();
    }

    if (this.body.idTipoEnvios == "1" || this.body.idTipoEnvios == "2") {
      this.sigaServices.notifyHabilitarDocumentos();
    } else {
      this.sigaServices.notifyDesHabilitarDocumentos();
    }
    if (!this.body.idTipoEnvios) {
      this.body.idPlantillaEnvios = null;
      this.plantillas = [];
    }

  }

  getPlantillas() {

    if (this.body.idTipoEnvios == undefined || this.body.idTipoEnvios == "") {
      this.body.idPlantillaEnvios = "";
    } else {
      this.sigaServices
        .post("enviosMasivos_plantillas", this.body.idTipoEnvios)
        .subscribe(
          data => {
            let comboPlantillas = JSON.parse(data["body"]);
            this.plantillas = comboPlantillas.combooItems;
            this.progressSpinner = false;
            if(sessionStorage.getItem(
              "enviosMasivosSearch") == null){
                this.detallePlantillaInicial();
            }else{
              let datos =
                JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
                this.body.idTipoEnvios = datos.idTipoEnvios;
                this.body.idPlantillaEnvios = datos.idPlantillaEnvios;
            }
            
            // if (this.editar) {
            //   this.body.idPlantillaEnvios = this.body.idPlantillaEnvios.toString();
            // }
            this.plantillas.map(e => {
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
            //console.log(err);
            this.progressSpinner = false;
          },
          () => { }
        );
    }
  }

  abreCierraFicha() {
    if(!this.openFicha){
      this.onlyCheckDatos();
    }
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
      this.getPlantillas();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.editarPlantilla = true;
      if (
        this.bodyInicial.idEstado != "1" &&
        this.bodyInicial.idEstado != "4"
      ) {
        this.editar = true;
      }

    } else {
      this.body.idTipoEnvios = "1";
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.getPlantillas();
      this.editar = false;
    }
  }

  cancelar() {
    this.onlyCheckDatos();
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: this.translateService.instant(
        "informesycomunicaciones.comunicaciones.mensaje.seguroCancelarEnvio"
      ),
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
    this.onlyCheckDatos();
    this.eliminarArray = [];
    let objCancelar = {
      idEstado: this.body.idEstado,
      idEnvio: this.body.idEnvio,
      fechaProgramacion: new Date(this.body.fechaProgramada)
    };
    this.eliminarArray.push(objCancelar);
    this.sigaServices
      .post("enviosMasivos_cancelar", this.eliminarArray)
      .subscribe(
        data => {
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.enviosMasivos.cancelCorrect"
            )
          );
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.comunicaciones.mensaje.errorCancelarEnvio"
            )
          );
          //console.log(err);
        },
        () => { }
      );
  }

  guardar() {
    this.onlyCheckDatos();
    // if(this.nuevoCuerpoPlantilla !=undefined){
    //   this.body.cuerpo = this.nuevoCuerpoPlantilla
    // }
    this.sigaServices.post("enviosMasivos_guardarConf", this.body).subscribe(
      data => {
        this.body.idEstado = "4";
        let result = JSON.parse(data["body"]);
        this.body.idEnvio = result.description;

        if (sessionStorage.getItem("crearNuevoEnvio") != null) {
          this.body.fechaCreacion = new Date();
        }
        //console.log(this.body.fechaCreacion);
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        sessionStorage.removeItem("crearNuevoEnvio");
        sessionStorage.setItem(
          "enviosMasivosSearch",
          JSON.stringify(this.body)
        );
        this.showSuccess(
          this.translateService.instant(
            "informesycomunicaciones.enviosMasivos.ficha.envioCorrect"
          )
        );
        this.editarPlantilla = true;
      },
      err => {
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.enviosMasivos.ficha.envioError"
          )
        );
        //console.log(err);
      },
      () => {
        let datosGuardar = {
          idEnvio: this.body.idEnvio,
        }
        // this.guardarDatos.emit(datosGuardar);
      }
    );
  }

  restablecer() {
    this.resaltadoDatos = true;
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.getPlantillas();
    this.resaltadoDatos = false;
  }

  isGuardarDisabled() {
    if (
      this.body.idTipoEnvios != "" &&
      this.body.idTipoEnvios != null &&
      this.body.idPlantillaEnvios != "" &&
      this.body.idPlantillaEnvios != null &&
      this.body.descripcion != "" &&
      this.body.descripcion != null
    ) {
      return false;
    }
    return true;
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  checkDatos() {
    if (!this.isGuardarDisabled()) {
      this.guardar();
    } else {
      if ((this.body.idTipoEnvios == null || this.body.idTipoEnvios == undefined || this.body.idTipoEnvios === "") || (this.body.idPlantillaEnvios == null || this.body.idPlantillaEnvios == undefined || this.body.idPlantillaEnvios === "") || (this.body.descripcion == null || this.body.descripcion == undefined || this.body.descripcion === "")) {
        this.muestraCamposObligatorios();
      } else {
        this.guardar();
      }
    }
  }

  onlyCheckDatos() {
    if (this.isGuardarDisabled() && (this.body.idTipoEnvios == null || this.body.idTipoEnvios == undefined || this.body.idTipoEnvios === "") || (this.body.idPlantillaEnvios == null || this.body.idPlantillaEnvios == undefined || this.body.idPlantillaEnvios === "") || (this.body.descripcion == null || this.body.descripcion == undefined || this.body.descripcion === "")) {
       this.resaltadoDatos=true;
      } 
    }
  
}
