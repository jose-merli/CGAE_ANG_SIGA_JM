import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { CommonsService } from "../../../../../../_services/commons.service";
import { NotificationService } from "../../../../../../_services/notification.service";
import { PersistenceService } from "../../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../../_services/siga.service";
import { TranslateService } from "../../../../../../commons/translate";
import { ModulosItem } from "../../../../../../models/sjcs/ModulosItem";

@Component({
  selector: "app-edicion-modulos",
  templateUrl: "./edicion-modulos.component.html",
  styleUrls: ["./edicion-modulos.component.scss"],
})
export class EdicionModulosComponent implements OnInit {
  body: ModulosItem = new ModulosItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  jurisdicciones;
  procedimientos;
  textFilter;
  showTarjeta: boolean = true;
  esComa: boolean = false;
  textSelected: String = "{label}";

  @Output() modoEdicionSend = new EventEmitter<any>();

  @ViewChild("importe") importe;
  //Resultados de la busqueda
  @Input() modulosItem: ModulosItem;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private persistenceService: PersistenceService, private commonsService: CommonsService, private notificationService: NotificationService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.textFilter = this.translateService.instant("general.boton.seleccionar");
    if (this.modulosItem != undefined) {
      this.modulosItem.importe = this.modulosItem.importe.replace(".", ",");
      if (this.modulosItem.fechadesdevigor != undefined) {
        this.modulosItem.fechadesdevigor = this.transformaFecha(this.modulosItem.fechadesdevigor);
      } else {
        this.modulosItem.fechadesdevigor = undefined;
      }
      if (this.modulosItem.fechahastavigor != undefined) {
        this.modulosItem.fechahastavigor = this.transformaFecha(this.modulosItem.fechahastavigor);
      } else {
        this.modulosItem.fechahastavigor = undefined;
      }
      if (this.modulosItem.idjurisdiccion != undefined) {
        this.sigaServices.getParam("modulosybasesdecompensacion_procedimientos", "?idProcedimiento=" + this.modulosItem.idProcedimiento).subscribe(
          (n) => {
            this.procedimientos = n.combooItems;
            /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
        para poder filtrar el dato con o sin estos caracteres*/
            this.procedimientos.map((e) => {
              let accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
              let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
              let i;
              let x;
              for (i = 0; i < e.label.length; i++) {
                if ((x = accents.indexOf(e.label[i])) != -1) {
                  e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
                  return e.labelSinTilde;
                }
              }
            });
            this.sortOptions();
          },
          (err) => {
            //console.log(err);
          },
          () => {
            if (this.modulosItem.procedimientos != null && this.modulosItem.procedimientos != "") {
              this.modulosItem.procedimientosReal = this.modulosItem.procedimientos.split(",");
              this.sortOptions();
            } else {
              this.modulosItem.procedimientosReal = [];
            }
            this.body = this.modulosItem;
            this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
            if (this.body.idProcedimiento == undefined) {
              this.modoEdicion = false;
            } else {
              this.modoEdicion = true;
            }
          },
        );
      } else {
        this.body = this.modulosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
        if (this.body.idProcedimiento == undefined) {
          this.modoEdicion = false;
        } else {
          this.modoEdicion = true;
        }
      }
    } else {
      this.modulosItem = new ModulosItem();
      this.modulosItem.fechadesdevigor = undefined;
      this.modulosItem.fechahastavigor = undefined;
    }

    this.arreglaChecks();
  }
  ngOnInit() {
    this.textFilter = this.translateService.instant("general.boton.seleccionar");
    if (this.modulosItem != undefined) {
      this.body = this.modulosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
    } else {
      this.modulosItem = new ModulosItem();
    }
    if (this.body.idProcedimiento == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.getCombos();
  }

  getCombos() {
    this.sigaServices.get("fichaAreas_getJurisdicciones").subscribe((n) => {
      this.jurisdicciones = n.combooItems;

      /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
      this.jurisdicciones.map((e) => {
        let accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
    });
  }

  onChangeJurisdiccion(evento) {
    this.modulosItem.procedimientosReal = [];
    this.modulosItem.procedimientos = "";
    this.getProcedimientos(evento.value);
  }

  onChangeProcedimientos(evento) {
    this.modulosItem.procedimientosReal = [];
    this.modulosItem.procedimientos = "";
    this.getProcedimientos(evento.value);
  }

  getProcedimientos(id) {
    this.sigaServices.getParam("modulosybasesdecompensacion_procedimientos", "?idProcedimiento=" + this.modulosItem.idProcedimiento).subscribe(
        n => {
            this.procedimientos = n.combooItems;
            this.procedimientos.map(e => {
                let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
                let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
                for (let i = 0; i < e.label.length; i++) {
                    let x = accents.indexOf(e.label[i]);
                    if (x != -1) {
                        e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
                        return e.labelSinTilde;
                    }
                }
            });
            this.sortOptions();
        },
        err => {
            // handle error
        },
        () => {
            if (this.modulosItem.procedimientos != null && this.modulosItem.procedimientos != "") {
                this.modulosItem.procedimientosReal = this.modulosItem.procedimientos.split(",");
                this.sortOptions();
            } else {
                this.modulosItem.procedimientosReal = [];
            }
        }
    );
}

  disableJurisdiccion() {
    if (this.modulosItem.procedimientosReal != undefined && this.modulosItem.procedimientosReal.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  arreglaChecks() {
    // idjurisdiccion complemento permitiraniadirletrado
    if (this.modulosItem.complemento == "1") {
      this.modulosItem.complementoCheck = true;
    } else {
      this.modulosItem.complementoCheck = false;
    }
    if (this.modulosItem.permitiraniadirletrado == "1") {
      this.modulosItem.permitiraniadirletradoCheck = true;
    } else {
      this.modulosItem.permitiraniadirletradoCheck = false;
    }
    this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
  }

  guardarChecks() {
    if (this.modulosItem.complementoCheck == true) {
      this.modulosItem.complemento = "1";
    } else {
      this.modulosItem.complemento = "0";
    }
    if (this.modulosItem.permitiraniadirletradoCheck == true) {
      this.modulosItem.permitiraniadirletrado = "1";
    } else {
      this.modulosItem.permitiraniadirletrado = "0";
    }
  }

  checkPermisosRest() {
    if (this.commonsService.checkPermisosService(!this.modulosItem.historico, this.modulosItem.historico)) {
      this.rest();
    }
  }

  rest() {
    if (this.modoEdicion) {
      if (this.modulosItem.idjurisdiccion != undefined) {
        this.getProcedimientos(this.modulosItem.idjurisdiccion);
      }
      if (this.bodyInicial != undefined) this.modulosItem = JSON.parse(JSON.stringify(this.bodyInicial));
      this.modulosItem.importe = this.modulosItem.importe.replace(".", ",");
      this.modulosItem.fechadesdevigor = this.transformaFecha(this.modulosItem.fechadesdevigor);
      this.modulosItem.fechahastavigor = this.transformaFecha(this.modulosItem.fechahastavigor);
      this.arreglaChecks();
    } else {
      this.modulosItem = new ModulosItem();
    }
  }

  checkPermisosSave() {
    if (this.commonsService.checkPermisosService(!this.modulosItem.historico, this.modulosItem.historico)) {
      if (this.disabledSave()) {
        this.commonsService.checkPermisoAccionService();
      } else {
        this.save();
      }
    }
  }

  onFocusOutEvent(event: any) {
    if (this.modulosItem.observaciones == null || this.modulosItem.observaciones == "") {
      this.modulosItem.observaciones = this.modulosItem.nombre;
    }
  }

  save() {
    if (this.modulosItem.procedimientosReal != undefined) {
      this.modulosItem.procedimientos = "";
      for (let i in this.modulosItem.procedimientosReal) {
        this.modulosItem.procedimientos += "," + this.modulosItem.procedimientosReal[i];
      }
      this.modulosItem.procedimientos = this.modulosItem.procedimientos.substring(1, this.modulosItem.procedimientos.length);
    }

    this.guardarChecks();
    this.progressSpinner = true;
    let url = "";
    if (!this.modoEdicion) {
      url = "modulosybasesdecompensacion_createmoduloybasedecompensacion";
    } else {
      url = "modulosybasesdecompensacion_updatemoduloybasedecompensacion";
    }
    this.callSaveService(url);
  }

  changeImporte() {
    this.esComa = this.modulosItem.importe.includes(",");
    if (this.esComa) {
      let partes = this.modulosItem.importe.split(",");
      if (partes[1].length > 2) {
        let segundaParte = partes[1].substring(0, 2);
        this.modulosItem.importe = partes[0] + "," + segundaParte;
        this.importe.nativeElement.value = this.modulosItem.importe;
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode == 44) {
      return true;
    } else {
      return false;
    }
  }

  callSaveService(url) {
    if (this.modulosItem.nombre != undefined) this.modulosItem.nombre = this.modulosItem.nombre.trim();
    if (this.modulosItem.importe != undefined) this.modulosItem.importe = this.modulosItem.importe.trim();
    if (this.modulosItem.codigo != undefined) this.modulosItem.codigo = this.modulosItem.codigo.trim();
    if (this.modulosItem.codigoext != undefined) this.modulosItem.codigoext = this.modulosItem.codigoext.trim();
    if (this.modulosItem.observaciones != undefined) this.modulosItem.observaciones = this.modulosItem.observaciones.trim();

    this.modulosItem.importe = this.modulosItem.importe.replace(",", ".");

    this.sigaServices.post(url, this.modulosItem).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.esComa = false;
        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let modulos = JSON.parse(data.body);
          this.modulosItem.idProcedimiento = modulos.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idProcedimiento: this.modulosItem.idProcedimiento,
          };
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
        this.persistenceService.setDatos(this.modulosItem);
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      (err) => {
        this.progressSpinner = false;
        if (err.error != null && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        this.progressSpinner = false;
        this.modulosItem.importe = this.modulosItem.importe.replace(".", ",");
        this.body = this.modulosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
      },
    );

    if (this.modulosItem.fechadesdevigor != undefined) {
      this.modulosItem.fechadesdevigor = new Date(this.modulosItem.fechadesdevigor);
    }

    if (this.modulosItem.fechahastavigor != undefined) {
      this.modulosItem.fechahastavigor = new Date(this.modulosItem.fechahastavigor);
    }
  }

  fillFechaDesdeCalendar(event) {
    this.modulosItem.fechadesdevigor = event;

    if (this.modulosItem.fechadesdevigor > this.modulosItem.fechahastavigor) {
      this.modulosItem.fechahastavigor = undefined;
    }
  }

  fillFechaHastaCalendar(event) {
    this.modulosItem.fechahastavigor = event;
  }

  formatDate(date) {
    var parts = date.split("/");
    var formattedDate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
    return formattedDate;
  }

  disabledSave() {
    if ((this.modulosItem.nombre != undefined && this.modulosItem.importe != undefined &&
        this.modulosItem.importe != "" && this.modulosItem.fechadesdevigor != undefined && this.modulosItem.idjurisdiccion != "" &&
        this.modulosItem.idjurisdiccion != undefined) && 
        (JSON.stringify(this.modulosItem) != JSON.stringify(this.bodyInicial))) {
        if (this.modulosItem.nombre.trim() != "") {
            return false;
        } else { return true; }
    } else {
        return true;
    }
}

  sortOptions() {
    if (this.procedimientos && this.modulosItem.procedimientosReal) {
      this.procedimientos.sort((a, b) => {
        //const includeA = this.etiquetasPersonaJuridicaSelecionados.includes(a);
        //const includeB = this.etiquetasPersonaJuridicaSelecionados.includes(b);
        const includeA = this.modulosItem.procedimientosReal.find((item) => item == a.value);
        const includeB = this.modulosItem.procedimientosReal.find((item) => item == b.value);
        if (includeA && !includeB) {
          //const includeA = this.etiquetasPersonaJuridicaSelecionados.indexOf(a);
          //const includeB = this.etiquetasPersonaJuridicaSelecionados.indexOf(b);
          //if ((includeA != -1) && (includeB == -1)) {
          return -1;
        } else if (!includeA && includeB) {
          //else if ((includeA == -1) && (includeB != -1)) {
          return 1;
        }
        return a.label.localeCompare(b.label);
      });
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
}
