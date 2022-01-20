import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ConfigEnviosMasivosItem } from "../../../../../models/ConfiguracionEnviosMasivosItem";
import { SigaServices } from "../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { truncate } from "fs";

@Component({
  selector: "app-descripcion-envio-masivo",
  templateUrl: "./descripcion-envio-masivo.component.html",
  styleUrls: ["./descripcion-envio-masivo.component.scss"]
})
export class DescripcionEnvioMasivoComponent implements OnInit {
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
  editarPlantilla: boolean = false;
  apiKey: string = "";
  habilitarGuardar:boolean = false;
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
  @Input() idPlantillaEnvio;
  @Input() cuerpoPlantillas;
  @Input() idEnvio;
  @Output() emitCuerpo = new EventEmitter<any>();
  @Output() emitGuardar = new EventEmitter<any>();

  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey");
    }

    this.editar = false;
    this.getDatos();
    // this.getTipoEnvios();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.body.idTipoEnvios = undefined;
    if (this.idPlantillaEnvio != undefined) {
      this.body.idTipoEnvios = this.idPlantillaEnvio.value;
      if(this.body.idTipoEnvios != "2"){
        this.openFicha = true;
      }else{
        this.openFicha = false;
      }
     
    }
    if (this.cuerpoPlantillas != undefined) {
      if(this.cuerpoPlantillas.cuerpo != undefined){
        if(this.body.cuerpo == undefined){
          this.body.cuerpo = this.cuerpoPlantillas.cuerpo;
        }
      }
      else{
        this.body.cuerpo = undefined;
      }
    }
    if(this.idEnvio != undefined){
      this.habilitarGuardar = true;
    }else{
      this.habilitarGuardar = false;
    }
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));

    // this.getTipoEnvios();
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
    if (event != undefined) {
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
          });
      }
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
      () => { }
    );
  }

  onChangeTipoEnvio(e) {
    if (e != null) {
      this.body.tipoEnvio = e.originalEvent.currentTarget.innerText;
    }
    if (this.body.idTipoEnvios != null && this.body.idTipoEnvios != "")
      this.getPlantillas();

    if (this.body.idTipoEnvios == "1" || this.body.idTipoEnvios == "2") {
      this.sigaServices.notifyHabilitarDocumentos();
    } else {
      this.sigaServices.notifyDesHabilitarDocumentos();
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

            // if (this.editar) {
            //   this.body.idPlantillaEnvios = this.body.idPlantillaEnvios.toString();
            // }
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
    if (this.body.idTipoEnvios != undefined && this.body.idTipoEnvios != "2") {
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
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      // this.getPlantillas();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.editarPlantilla = true;
      if (
        this.bodyInicial.idEstado != "1" &&
        this.bodyInicial.idEstado != "4"
      ) {
        this.editar = true;
      }
    } else {
      this.editar = false;
    }
  }

  cancelar() {
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
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    this.emitGuardar.emit(true);
  }

  restablecer() {
    this.body.cuerpo = JSON.parse(JSON.stringify(this.bodyInicial.cuerpo));
  }

  isGuardarDisabled() {
    if(this.body.cuerpo != undefined){
      if (this.body.cuerpo != this.bodyInicial.cuerpo) {
        return false;
      }
    }
    return true;
  }

  onChangeEditor(){
    this.emitCuerpo.emit(this.body.cuerpo);
  }
}
