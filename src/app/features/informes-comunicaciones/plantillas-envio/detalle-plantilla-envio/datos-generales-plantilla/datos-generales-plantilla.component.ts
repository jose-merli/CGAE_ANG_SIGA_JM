import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DatosGeneralesPlantillaItem } from "../../../../../models/DatosGeneralesPlantillaItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { PlantillaEnvioItem } from "../../../../../models/PlantillaEnvioItem";
import { CommonsService } from "../../../../../_services/commons.service";


@Component({
  selector: "app-datos-generales-plantilla",
  templateUrl: "./datos-generales-plantilla.component.html",
  styleUrls: ["./datos-generales-plantilla.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesPlantillaComponent implements OnInit {
  openFicha: boolean = true;
  openDesc: boolean = true;
  activacionEditar: boolean = true;
  body: DatosGeneralesPlantillaItem = new DatosGeneralesPlantillaItem();
  bodyInicial: DatosGeneralesPlantillaItem = new DatosGeneralesPlantillaItem();
  bodyPlantilla: PlantillaEnvioItem = new PlantillaEnvioItem();
  tiposEnvio: any[];
  msgs: Message[];
  editar: boolean = false;
  nuevo: boolean = false;
  soloLectura: boolean = false;
  apiKey: string = "";
  disabledPlantilla: boolean = false;

  resaltadoDatos: boolean = false;

  @Input() claseComunicacion;

  institucionActual: any;
  editorConfig: any = {
    selector: 'textarea',
    plugins: "autoresize pagebreak table save charmap media contextmenu paste directionality noneditable visualchars nonbreaking spellchecker template searchreplace lists link image insertdatetime textcolor code hr",
    toolbar: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify formatselect fontselect fontsizeselect | cut copy paste pastetext | searchreplace | bullist numlist | indent blockquote | undo redo | link unlink image code | insertdatetime preview | forecolor backcolor",
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
      key: "generales",
      activa: true
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "remitente",
      activa: false
    }
  ];

  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("tinyApiKey") != null) {
      this.apiKey = sessionStorage.getItem("tinyApiKey")
    }
    this.getTipoEnvios();
    this.getDatos();

    this.getInstitucion();

    if (sessionStorage.getItem("crearNuevaPlantilla") != undefined) {
      this.nuevo = JSON.parse(sessionStorage.getItem("crearNuevaPlantilla"));
    }

    this.tiposEnvio = [
      {
        label: "Email",
        value: "1"
      },
      {
        label: "SMS",
        value: "2"
      }
    ];
    this.openDesc = false;

    if(sessionStorage.getItem("disabledPlantillaEnvio") == "true"){
      this.disabledPlantilla  = true;
    }else{
      this.disabledPlantilla = false;
    }

      this.resaltadoDatos = true;
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      this.bodyPlantilla = JSON.parse(sessionStorage.getItem('plantillasEnvioSearch'));
      if (this.bodyPlantilla != undefined && this.bodyPlantilla != null && this.bodyPlantilla.idInstitucion == '2000' && this.institucionActual != '2000') {
        if (
          sessionStorage.getItem("soloLectura") != null &&
          sessionStorage.getItem("soloLectura") != undefined &&
          sessionStorage.getItem("soloLectura") == "true"
        ) {
          this.soloLectura = true;
        }
      }

    });
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

  abreCierraFicha() {
    if(!this.openFicha){
      this.onlyCheckDatos();
    }
    if (this.activacionEditar == true) {
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
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      if (this.body.claseComunicacion != undefined) {
        this.claseComunicacion = this.body.claseComunicacion;
      } else {
        this.claseComunicacion = "";
      }

      this.editar = true;
    } else {
      this.editar = false;
    }
  }

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      n => {
        this.tiposEnvio = n.combooItems;
        // this.tiposEnvio.unshift({ label: "Seleccionar", value: "" });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.tiposEnvio.map(e => {
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
    this.resaltadoDatos = false;

    this.sigaServices
      .postPaginado(
        "plantillasEnvio_guardarDatosGenerales",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          this.body.idPlantillaEnvios = result.message;
          sessionStorage.setItem(
            "plantillasEnvioSearch",
            JSON.stringify(this.body)
          );
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          sessionStorage.removeItem("crearNuevaPlantilla");
          this.nuevo = false;
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaGuardada"
            )
          );
          if (result.description == null){
            this.showFail(this.translateService.instant(
              "general.message.datos.generales.remitente"));
          }
        },
        err => {
          //console.log(err);
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaGuardada"
            )
          );
        },
        () => { }
      );
  }


  guardarDesc() {
    let description = new DatosGeneralesPlantillaItem();
    description = JSON.parse(JSON.stringify(this.bodyInicial));
    description.cuerpo = this.body.cuerpo;
    description.asunto = this.body.asunto;
    this.sigaServices
      .postPaginado(
        "plantillasEnvio_guardarDatosGenerales",
        "?numPagina=1",
        description
      )
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          this.body.idPlantillaEnvios = result.message;
          this.bodyInicial.cuerpo = JSON.parse(JSON.stringify(this.body.cuerpo));
          this.bodyInicial.asunto = JSON.parse(JSON.stringify(this.body.asunto));
          this.bodyInicial.idPlantillaEnvios = JSON.parse(JSON.stringify(this.body.idPlantillaEnvios));

          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaGuardada"
            )
          );
          if (result.description == null){
            this.showFail(this.translateService.instant(
              "general.message.datos.generales.remitente"));
          }
        },
        err => {
          //console.log(err);
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaGuardada"
            )
          );
        },
        () => { }
      );
  }

  abreCierraDesc() {
    if (this.activacionEditar == true && (this.body.idTipoEnvios == '4' || this.body.idTipoEnvios == '5' || this.body.idTipoEnvios == '1' || this.body.idTipoEnvios == '7')) {
      this.openDesc = !this.openDesc;
    } else {
      this.openDesc = false;
    }
  }

  cambiaDesc() {
    this.onlyCheckDatos();
    this.body.cuerpo = "";
    this.body.asunto = "";
    if (this.activacionEditar == true && (this.body.idTipoEnvios == '4' || this.body.idTipoEnvios == '5' || this.body.idTipoEnvios == '1' || this.body.idTipoEnvios == '7')) {
      this.openDesc = true;
    } else {
      this.openDesc = false;
    }
  }
  isGuardarDisabled() {
    if (
      this.body.idTipoEnvios != "" &&
      this.body.idTipoEnvios != null &&
      this.body.descripcion != "" &&
      this.body.descripcion != null &&
      this.body.nombre != "" &&
      this.body.nombre != null && !this.soloLectura
    ) {
      return false;
    }
    return true;
  }

  restablecer() {
    if (this.body.idTipoEnvios == '4' || this.body.idTipoEnvios == '5') {
      this.openDesc = false;
    }
    let asunto = this.body.asunto;
    let cuerpo = this.body.cuerpo;
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.body.asunto = asunto;
    this.body.cuerpo = cuerpo;
  }

  restablecerDesc() {
    if (this.nuevo) {
      this.body.cuerpo = "";
      this.body.asunto = "";
    } else {
      this.body.cuerpo = JSON.parse(JSON.stringify(this.bodyInicial.cuerpo));
      this.body.asunto = JSON.parse(JSON.stringify(this.bodyInicial.asunto));
    }
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
    if (this.isGuardarDisabled()) {
      if ((this.body.nombre == null || this.body.nombre == undefined || this.body.nombre === "") || (this.body.idTipoEnvios == null || this.body.idTipoEnvios == undefined || this.body.idTipoEnvios === "") || (this.body.descripcion == null || this.body.descripcion == undefined || this.body.descripcion === "")) {
        this.muestraCamposObligatorios();
      } else {
        this.guardar();
      }
    } else {
      if ((this.body.nombre == null || this.body.nombre == undefined || this.body.nombre === "") || (this.body.idTipoEnvios == null || this.body.idTipoEnvios == undefined || this.body.idTipoEnvios === "") || (this.body.descripcion == null || this.body.descripcion == undefined || this.body.descripcion === "")) {
        this.muestraCamposObligatorios();
      } else {
        this.guardar();
      }
    }
  }

  onlyCheckDatos() {
    if (this.isGuardarDisabled()) {
      if ((this.body.nombre == null || this.body.nombre == undefined || this.body.nombre === "") || (this.body.idTipoEnvios == null || this.body.idTipoEnvios == undefined || this.body.idTipoEnvios === "") || (this.body.descripcion == null || this.body.descripcion == undefined || this.body.descripcion === "")) {
        this.resaltadoDatos = true;
      } 
    } else {
      if ((this.body.nombre == null || this.body.nombre == undefined || this.body.nombre === "") || (this.body.idTipoEnvios == null || this.body.idTipoEnvios == undefined || this.body.idTipoEnvios === "") || (this.body.descripcion == null || this.body.descripcion == undefined || this.body.descripcion === "")) {
        this.resaltadoDatos = true;
      } 
    }
  }
}
