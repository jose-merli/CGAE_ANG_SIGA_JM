import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoDto } from "../../../../../models/ControlAccesoDto";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { DatosGeneralesFicha } from "../../../../../models/DatosGeneralesFichaItem";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { InputMaskModule } from "primeng/inputmask";
import { isNumber } from "util";

@Component({
  selector: "app-datos-generales-ficha",
  templateUrl: "./datos-generales-ficha.component.html",
  styleUrls: ["./datos-generales-ficha.component.scss"]
})
export class DatosGeneralesFichaComponent implements OnInit {
  openFicha: boolean = true;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  clasesComunicaciones: any[];
  colegios: any[];
  bodyInicial: DatosGeneralesFicha = new DatosGeneralesFicha();
  body: DatosGeneralesFicha = new DatosGeneralesFicha();
  msgs: Message[];
  preseleccionar: any = [];
  visible: any = [];
  institucionActual: any = [];
  soloLectura: boolean = false;
  editar: boolean = true;
  plantillas: any = [];
  isEdicion: boolean = false;
  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    }
  ];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) {}

  ngOnInit() {
    this.preseleccionar = [
      { label: "", value: "" },
      { label: "Sí", value: "SI" },
      { label: "No", value: "NO" }
    ];

    this.visible = [
      { label: "", value: "" },
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.getInstitucion();

    this.getClasesComunicaciones();

    this.getPlantillas();
    
    if (
      sessionStorage.getItem("soloLectura") != null &&
      sessionStorage.getItem("soloLectura") != undefined &&
      sessionStorage.getItem("soloLectura") == "true"
    ) {
      this.soloLectura = true;
    }
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

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  getDatos() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.bodyInicial = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.habilitarBotones();
      this.isEdicion = true;
    } else {
      this.body.visible = 1;
    }
  }

  guardar() {
    if (this.bodyInicial.nombre != this.body.nombre) {
      this.sigaServices
        .post("modelos_detalle_datosGeneralesComprobarNom", this.body)
        .subscribe(
          data => {
            let existe = data.body;

            if (existe == "false") {
              this.sigaServices
                .post("modelos_detalle_datosGenerales", this.body)
                .subscribe(
                  data => {
                    this.showSuccess(
                      this.translateService.instant(
                        "informesycomunicaciones.modelosdecomunicacion.ficha.correctGuardado"
                      )
                    );
                    this.body.idModeloComunicacion = JSON.parse(data.body).data;
                    sessionStorage.setItem(
                      "modelosSearch",
                      JSON.stringify(this.body)
                    );
                    sessionStorage.removeItem("crearNuevoModelo");
                    this.sigaServices.notifyRefreshPerfiles();
                  },
                  err => {
                    console.log(err);
                    this.showFail(
                      this.translateService.instant(
                        "informesycomunicaciones.modelosdecomunicacion.ficha.errorGuardado"
                      )
                    );
                  }
                );
            } else {
              this.showFail(
                this.translateService.instant(
                  "informesycomunicaciones.modelosdecomunicacion.fichaModeloComuncaciones.nombreDuplicado"
                )
              );
            }
          },
          err => {
            console.log(err);
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.modelosdecomunicacion.ficha.errorGuardado"
              )
            );
          }
        );
    } else {
      this.sigaServices
        .post("modelos_detalle_datosGenerales", this.body)
        .subscribe(
          data => {
            this.showSuccess(
              this.translateService.instant(
                "informesycomunicaciones.modelosdecomunicacion.ficha.correctGuardado"
              )
            );
            this.body.idModeloComunicacion = JSON.parse(data.body).data;
            sessionStorage.setItem("modelosSearch", JSON.stringify(this.body));
            sessionStorage.removeItem("crearNuevoModelo");
          },
          err => {
            console.log(err);
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.modelosdecomunicacion.ficha.errorGuardado"
              )
            );
          }
        );
    }
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.body.idInstitucion = this.institucionActual;
      this.getComboColegios();
      this.getDatos();
    });
  }

  habilitarBotones() {
    if (this.institucionActual != "2000" && this.body.porDefecto == "SI") {
      this.editar = false;
    } else {
      this.editar = true;
    }

    if (this.editar == false) {
      this.colegios = [];
      this.colegios.unshift({ label: "POR DEFECTO", value: "0" });
      this.sigaServices.notifyRefreshEditar();
    }

    if (this.body.porDefecto == "SI") {
      this.body.idInstitucion = "0";
    }
  }

  getComboColegios() {
    this.sigaServices.get("modelos_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        if (this.institucionActual != "2000") {
          for (let e of this.colegios) {
            if (e.value == "2000") {
              let x = this.colegios.indexOf(e);
              this.colegios.splice(x, 1);
            }
          }
        } else {
          this.colegios.unshift({ label: "POR DEFECTO", value: "0" });
        }
        this.colegios.unshift({ label: "", value: "" });
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
        this.clasesComunicaciones.unshift({ label: "", value: "" });
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

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

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

  editarCompleto(event, dato) {
    let NUMBER_REGEX = /^\d{1,3}$/;
    if (NUMBER_REGEX.test(dato)) {
      if (dato != null && dato != undefined && (dato < 0 || dato > 999)) {
        event.currentTarget.value = "";
      }
    } else {
      event.currentTarget.value = "";
    }
  }

  getPlantillas() {
    this.sigaServices.get("modelos_detalle_plantillasComunicacion").subscribe(
      data => {
        this.plantillas = data.combooItems;
        this.plantillas.unshift({ label: "Seleccionar", value: "" });
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  };

  onChangePlantilla(e) {
    let idPlantillaEnvios = e.value;
    if (idPlantillaEnvios != "") {
      this.getTipoEnvios(idPlantillaEnvios);
    }
  }

  getTipoEnvios(idPlantillaEnvios) {
    this.sigaServices
      .post("modelos_detalle_tipoEnvioPlantilla", idPlantillaEnvios)
      .subscribe(
        data => {
          this.body.tipoEnvio = JSON.parse(data["body"]).tipoEnvio;
          this.body.idTipoEnvio = JSON.parse(data["body"]).idTipoEnvios;
        },
        err => {
          console.log(err);
        }
      );
  }
}
