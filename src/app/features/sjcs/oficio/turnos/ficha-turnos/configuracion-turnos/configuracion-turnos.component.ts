import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { MultiSelect, ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';
@Component({
  selector: "app-configuracion-turnos",
  templateUrl: "./configuracion-turnos.component.html",
  styleUrls: ["./configuracion-turnos.component.scss"]
})
export class ConfiguracionTurnosComponent implements OnInit {

  //Resultados de la busqueda
  @Input() turnosItem: TurnosItems;
  @Input() modoEdicion;
  @Input() idTurno;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Input() tarjetaConfiguracionTurnos: string;
  @Input() openConfigTurnos;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  openFicha: boolean = false;
  msgs = [];
  historico: boolean = false;

  provinciaSelecionada: string;
  permisosTarjeta: boolean = true;
  permisoCheck: boolean = false;
  body: TurnosItems;
  bodyInicial: TurnosItems;
  idPrision;
  isDisabledProvincia: boolean = true;

  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;
  codigoPostalValido: boolean = true;
  requisitosGuardiasDescripcion;
  disableAll: boolean = false;
  movilCheck: boolean = false

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;
  avisoMail: boolean = false
  guardias: any[] = [];
  validJustificacion;
  validInscripyBajas;
  visibleMovilTexto;
  emailValido: boolean = false;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;
  requisitoInicial: any;
  isLetrado: boolean = false;

  @ViewChild("mailto") mailto;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
  ];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private router: Router,
    private translateService: TranslateService, private commonsService: CommonsService, private commonsServices: CommonsService, private confirmationService: ConfirmationService) { }

  ngOnChanges(changes: SimpleChanges) {

    if (this.turnosItem != undefined) {
      if (this.idTurno != undefined) {
        this.body = this.turnosItem;
        this.turnosItem.idturno = this.idTurno;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          if (this.persistenceService.getDatos() != undefined) {
            this.turnosItem = this.persistenceService.getDatos();
          }
          if (this.turnosItem.fechabaja != undefined) {
            this.disableAll = true;
          }
          this.modoEdicion = true;
        }
      }
    } else {
      this.turnosItem = new TurnosItems();
    }


    this.sigaServices.get("combossjcs_comboRequisitosGuardias").subscribe(
      n => {
        this.guardias = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.guardias.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
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

      },
      err => {
      }, () => {
        if (this.turnosItem.idguardias != undefined) {
          for (let i = 0; i < this.guardias.length; i++) {
            if (this.guardias[i].value == this.turnosItem.idguardias) {
              this.requisitosGuardiasDescripcion = this.guardias[i].label
            }
          }
        } else {
          this.turnosItem.idguardias = "0";
          this.requisitosGuardiasDescripcion = this.guardias[0].label
        }
        this.rest();
      }
    );
    this.arreglaChecks();
    if (this.openConfigTurnos == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('configTurnos')
      }
    }

    this.requisitoInicial = this.requisitosGuardiasDescripcion;
  }

  ngOnInit() {
    this.sigaServices.get('getLetrado').subscribe(
      (data) => {
        if (data.value == 'S') {
          this.isLetrado = true;
        } else {
          this.isLetrado = false;
        }
      },
      (err) => {
      }
    );
    this.commonsService.checkAcceso(procesos_oficio.configuracionTurnos)
    .then(respuesta => {
      this.permisosTarjeta = respuesta;
      let esColegio = this.commonsService.getLetrado();
      this.persistenceService.setPermisos(this.permisosTarjeta);
      if (this.permisosTarjeta == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem(
          "descError",
          this.translateService.instant("generico.error.permiso.denegado")
        );
        this.router.navigate(["/errorAcceso"]);
      } else if (this.persistenceService.getPermisos() != true) {
        this.disableAll = true;
      }
    }
    ).catch(error => console.error(error));
    
    if (this.modoEdicion) {
      this.body = this.turnosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));

    } else {
      this.body = new TurnosItems();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.edicionEmail = true;
      this.nuevoChecks();
    }

    if (this.turnosItem.validarjustificaciones == 'S') {
      this.validJustificacion = "SI";
    } else {
      this.validJustificacion = "NO";
    }
    if (this.turnosItem.validarinscripciones == 'S') {
      this.validInscripyBajas = "SI";
    } else {
      this.validInscripyBajas = "NO";
    }
    if (this.turnosItem.visiblemovil == '1') {
      this.visibleMovilTexto = "SI";
    } else {
      this.visibleMovilTexto = "NO";
    }
  }


  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechaBaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }
  onChangeRequisitosGuardias() {
    for (let i = 0; i < this.guardias.length; i++) {
      if (this.guardias[i].value == this.turnosItem.idguardias) {
        if (this.requisitosGuardiasDescripcion == "Todas o ninguna" && this.guardias[i].label == "Obligatorias") {
          this.sigaServices.post("turno_changeRequisitoGuardias", this.body).subscribe(
            data => {
              this.progressSpinner = false;
              let error = JSON.parse(data.body).error;
              if (error != null && error.description != null) {
                this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
              }
            },
            error => {
              this.progressSpinner = false;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          );
        }
        if (this.requisitosGuardiasDescripcion == "A elegir" && this.guardias[i].label == "Obligatorias") {
          this.sigaServices.post("turno_changeRequisitoGuardias", this.body).subscribe(
            data => {
              this.progressSpinner = false;
              let error = JSON.parse(data.body).error;
              if (error != null && error.description != null) {
                this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
              }
            },
            error => {
              this.progressSpinner = false;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          );
        }
        this.requisitosGuardiasDescripcion = this.guardias[i].label
      }
    }
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }


  confirmGuardar() {
    let keyConfirmation = "deletePlantillaDoc";

    this.confirmationService.confirm({
      key: keyConfirmation,
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: this.translateService.instant('justiciaGratuita.oficio.turnos.confirmguardarturnos'),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.save()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
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

  getComboProvincias() {
    //this.progressSpinner = true;

    this.sigaServices.get("busquedaPrisiones_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboProvincias);
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      }, () => {
      }
    );
  }
  save() {
    this.progressSpinner = true;
    let url = "";
    this.guardarChecks();
    url = "turnos_updateConfiguracion";
    this.callSaveService(url);
    this.showMessage("info", this.translateService.instant("general.message.correct"), this.translateService.instant("justiciaGratuita.oficio.turnos.messageconfigturnos"));
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.turnosItem).subscribe(
      data => {
        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let turnos = JSON.parse(data.body);
          // this.modulosItem = JSON.parse(data.body);
          this.turnosItem.idturno = turnos.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idturno: this.turnosItem.idturno
          }
          this.modoEdicionSend.emit(send);
        }

        if (this.turnosItem.validarjustificaciones == 'S') {
          this.validJustificacion = "SI";
        } else {
          this.validJustificacion = "NO";
        }
        if (this.turnosItem.validarinscripciones == 'S') {
          this.validInscripyBajas = "SI";
        } else {
          this.validInscripyBajas = "NO";
        }
        if (this.turnosItem.visiblemovil == '1') {
          this.visibleMovilTexto = "SI";
        } else {
          this.visibleMovilTexto = "NO";
        }
        for (let i = 0; i < this.guardias.length; i++) {
          if (this.guardias[i].value == this.turnosItem.idguardias) {
            this.requisitosGuardiasDescripcion = this.guardias[i].label
          }
        }
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        this.persistenceService.setDatos(this.turnosItem);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
      }
    );


  }

  rest() {
    this.turnosItem = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  openOutlook(dato) {
    let correo = dato.email;
    this.commonsServices.openOutlook(correo);
  }
  /* 
    abrirFicha(key) {
      let fichaPosible = this.getFichaPosibleByKey(key);
      fichaPosible.activa = true;
    }
  
    cerrarFicha(key) {
      let fichaPosible = this.getFichaPosibleByKey(key);
      fichaPosible.activa = false;
    } */
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "configTurnos" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  guardarChecks() {
    if (this.turnosItem.visibleMovilCheck == true) {
      this.turnosItem.visiblemovil = '1';
    } else {
      this.turnosItem.visiblemovil = '0';
    }
    if (this.turnosItem.validarinscripcionesCheck == true) {
      this.turnosItem.validarinscripciones = 'S';
    } else {
      this.turnosItem.validarinscripciones = 'N';
    }

    if (this.turnosItem.validarjustificacionesCheck == true) {
      this.turnosItem.validarjustificaciones = 'S';
    } else {
      this.turnosItem.validarjustificaciones = 'N';
    }

    if (this.turnosItem.letradoactuacionesCheck == true) {
      this.turnosItem.letradoactuaciones = 'S';
    } else {
      this.turnosItem.letradoactuaciones = 'N';
    }

    if (this.turnosItem.letradoasistenciasCheck == true) {
      this.turnosItem.letradoasistencias = 'S';
    } else {
      this.turnosItem.letradoasistencias = 'N';
    }

    if (this.turnosItem.activarretriccionacreditCheck == true) {
      this.turnosItem.activarretriccionacredit = 'S';
    } else {
      this.turnosItem.activarretriccionacredit = 'N';
    }

  }

  nuevoChecks() {
    if (!this.modoEdicion) {
      this.turnosItem.visiblemovil = '1';
      this.turnosItem.visibleMovilCheck = true;
      this.visibleMovilTexto = "SI";

      this.turnosItem.validarinscripciones = 'S';
      this.turnosItem.validarinscripcionesCheck = true;
      this.validInscripyBajas = "SI";

      this.turnosItem.validarjustificaciones = 'S';
      this.turnosItem.validarjustificacionesCheck = true;
      this.validJustificacion = "SI";

      this.turnosItem.letradoactuaciones = 'N';
      this.turnosItem.letradoactuacionesCheck = false;

      this.turnosItem.letradoasistencias = 'N';
      this.turnosItem.letradoasistenciasCheck = false;

      this.turnosItem.activarretriccionacredit = 'S';
      this.turnosItem.activarretriccionacreditCheck = true;

      this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
    }

  }

  arreglaChecks() {

    if (this.turnosItem.visiblemovil == '1') {
      this.turnosItem.visibleMovilCheck = true;
      this.visibleMovilTexto = "SI";
    } else {
      this.turnosItem.visibleMovilCheck = false;
      this.visibleMovilTexto = "NO";
    }

    if (this.turnosItem.validarinscripciones == 'S') {
      this.turnosItem.validarinscripcionesCheck = true;
      this.validInscripyBajas = "SI";
    } else {
      this.turnosItem.validarinscripcionesCheck = false;
      this.validInscripyBajas = "NO";
    }

    if (this.turnosItem.validarjustificaciones == 'S') {
      this.turnosItem.validarjustificacionesCheck = true;
      this.validJustificacion = "SI";
    } else {
      this.turnosItem.validarjustificacionesCheck = false;
      this.validJustificacion = "NO";
    }

    if (this.turnosItem.letradoactuaciones == 'S') {
      this.turnosItem.letradoactuacionesCheck = true;
    } else {
      this.turnosItem.letradoactuacionesCheck = false;
    }

    if (this.turnosItem.letradoasistencias == 'S') {
      this.turnosItem.letradoasistenciasCheck = true;
    } else {
      this.turnosItem.letradoasistenciasCheck = false;
    }
    if (this.turnosItem.activarretriccionacredit == 'S') {
      this.turnosItem.activarretriccionacreditCheck = true;
    } else {
      this.turnosItem.activarretriccionacreditCheck = false;
    }

    this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));

  }

  disabledSave() {
    if ((this.turnosItem.idguardias != null && this.turnosItem.idguardias != "") && (JSON.stringify(this.turnosItem) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }
}
