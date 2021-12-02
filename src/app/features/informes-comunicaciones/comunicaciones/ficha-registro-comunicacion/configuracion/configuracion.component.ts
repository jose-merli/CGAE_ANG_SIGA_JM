import { Component, OnInit } from "@angular/core";
import { ConfigComunicacionItem } from "../../../../../models/ConfiguracionComunicacionItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { saveAs } from "file-saver/FileSaver";
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: "app-configuracion",
  templateUrl: "./configuracion.component.html",
  styleUrls: ["./configuracion.component.scss"]
})
export class ConfiguracionComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = false;
  datos: any[];
  cols: any[];
  first: number = 0;
  body: ConfigComunicacionItem = new ConfigComunicacionItem();
  bodyInicial: ConfigComunicacionItem = new ConfigComunicacionItem();
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
  reenviar: boolean = false;
  cancelar: boolean = false;
  apiKey: string = "";

  resaltadoDatos: boolean = false;

  editorConfig: any = {
    selector: 'textarea',
    plugins: "autoresize pagebreak table save charmap media contextmenu paste directionality noneditable visualchars nonbreaking spellchecker template searchreplace lists link image insertdatetime textcolor code hr",
    toolbar: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect | cut copy paste pastetext | searchreplace | bullist numlist | indent blockquote | undo redo | link unlink image code | insertdatetime preview | forecolor backcolor",
    menubar: false,
    autoresize_on_init: true,
    statusbar: false
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
      key: "documentos",
      activa: false
    }
  ];

  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.resaltadoDatos=true;
    
    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey")
    }

    this.getDatos();
    this.getClasesComunicaciones();
    this.getModelosComunicacion();
    this.getTipoEnvios();

    if(this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion===""){
      this.abreCierraFicha();
    }
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
        // this.tipoEnvios.unshift({ label: "Seleccionar", value: "" });
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
    this.sigaServices
      .post("enviosMasivos_plantillas", this.body.idTipoEnvios)
      .subscribe(
        data => {
          let comboPlantillas = JSON.parse(data["body"]);
          this.plantillas = comboPlantillas.combooItems;
          this.plantillas.map(e => {
            if (this.body.idPlantillaEnvios == e.value) {
              this.plantilla = e.label;
            }
          });

          if (this.editar) {
            this.body.idPlantillaEnvios = this.body.idPlantillaEnvios.toString();
          }
        },
        err => {
          //console.log(err);
        },
        () => { }
      );
  }

  abreCierraFicha() {
    if(!this.openFicha){
      this.onlyCheckDatos();
    }
    // let fichaPosible = this.getFichaPosibleByKey(key);
    // if (this.activacionEditar == true) {
    // fichaPosible.activa = !fichaPosible.activa;
    this.openFicha = !this.openFicha;
    // }
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
      this.bodyInicial = JSON.parse(sessionStorage.getItem("comunicacionesSearch"));
      if (this.body.idEstado != '4' && this.body.idEstado != '1') {
        this.editar = true;
      } else {
        this.activacionEditar = true;
      }
      if (this.body.idEstado == '3' || this.body.idEstado == '6') {
        this.reenviar = true;
      }
      this.getPlantillas();
    } else {
      this.editar = false;
    }
  }


  isGuardarDisabled() {
    if (JSON.stringify(this.bodyInicial) != JSON.stringify(this.body)) {
      if (this.body.idTipoEnvios != '' && this.body.idTipoEnvios != null && this.body.idPlantillaEnvios != ''
        && this.body.idPlantillaEnvios != null && this.body.descripcion != '' && this.body.descripcion != null) {
        return false;
      }
      return true;
    } else {
      return true;
    }

  }

  getModelosComunicacion() {
    this.arrayClases = [];

    this.arrayClases.push(this.body.idClaseComunicacion);

    this.sigaServices
      .post("comunicaciones_modelosComunicacion", this.arrayClases)
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          this.modelosComunicacion = result.combooItems;
        },
        err => {
          //console.log(err);
        }
      );
  }

  getClasesComunicaciones() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      data => {
        this.clasesComunicaciones = data.combooItems;
        this.clasesComunicaciones.unshift({ label: "Seleccionar", value: "" });
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
        //console.log(err);
      }
    );
  }

  guardar() {
    this.onlyCheckDatos();
    this.resaltadoDatos=false;
    this.sigaServices.post("enviosMasivos_guardarConf", this.body).subscribe(
      data => {
        this.body.idEstado = '4';
        let result = JSON.parse(data["body"]);
        this.body.idEnvio = result.description;

        // if (sessionStorage.getItem("crearNuevoEnvio") != null) {
        //   this.body.fechaCreacion = new Date();
        // }
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        // sessionStorage.removeItem("crearNuevoEnvio");
        // sessionStorage.setItem("enviosMasivosSearch", JSON.stringify(this.body));
        this.showSuccess(this.translateService.instant("informesycomunicaciones.enviosMasivos.ficha.envioCorrect"));
        // this.editarPlantilla = true;
      },
      err => {
        this.showFail(this.translateService.instant("informesycomunicaciones.enviosMasivos.ficha.envioError"));
        //console.log(err);
      },
      () => {

      }
    );


  }


  onCancelar() {
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
            summary: this.translateService.instant(
              "general.message.informacion"
            ),
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
              "informesycomunicaciones.comunicaciones.mensaje.envioCanceladoCorrectamente"
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

  descargarJustificante() {
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("comunicaciones_descargarCertificado", this.body.csv)
      .subscribe(data => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        if (blob.size == 0) {
          this.showFail(
            this.translateService.instant(
              "messages.general.error.ficheroNoExiste"
            )
          );
        } else {
          saveAs(data, "Justificante_BUROSMS.pdf");
        }
      },
        err => {
          //console.log(err);
          this.showFail(this.translateService.instant("messages.general.error.ficheroNoExiste")
          );
        }, () => {
          this.progressSpinner = false
        });
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  checkDatos(){
    if(this.isGuardarDisabled()){
      if(this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion===""){
        this.muestraCamposObligatorios();
      }else{
        this.guardar();
      }
    }else{
      if(this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion===""){
        this.muestraCamposObligatorios();
      }else{
        this.guardar();
      }
    }
  }

  onlyCheckDatos(){
    if(this.isGuardarDisabled()){
      if(this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion===""){
        this.resaltadoDatos=true;
      }
    }else{
      if(this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion===""){
        this.resaltadoDatos=true;
      }
    }
  }
}
