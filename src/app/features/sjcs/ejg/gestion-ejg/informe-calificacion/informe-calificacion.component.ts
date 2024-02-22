import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informe-calificacion',
  templateUrl: './informe-calificacion.component.html',
  styleUrls: ['./informe-calificacion.component.scss']
})
export class InformeCalificacionComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaInformeCalificacion;
  @Output() guardadoSend = new EventEmitter<any>();

  activacionTarjeta: boolean = false;
  progressSpinner: boolean = false;
  openFicha: boolean = false;
  isDisabledFundamentosCalif: boolean = true;

  msgs = [];
  nuevo;
  textFilter: string = "Seleccionar";
  comboFundamentoCalif = [];
  comboDictamen = [];
  datosIniciales: EJGItem;

  dictamenCabecera = "";
  fundamentoCalifCabecera = "";
  selectedDatos = [];
  valueComboEstado = "";
  fechaEstado = new Date();
  fechaDictCabecera: Date = null;
  estados;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  constructor(private sigaServices: SigaServices, private router: Router,
    private commonServices: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
    if (this.datos.fechaDictamen != null) {
      this.datos.fechaDictamen = new Date(this.datos.fechaDictamen);
      this.fechaDictCabecera = this.datos.fechaDictamen;
    }
    this.onChangeDictamen();
    this.getComboTipoDictamen();
    this.datosIniciales = { ...this.datos };
  }

  abreCierraFicha() {
    this.openTarjetaInformeCalificacion = !this.openTarjetaInformeCalificacion;
  }

  getComboFundamentoCalif() {
    this.sigaServices.getParam("filtrosejg_comboFundamentoCalif", "?list_dictamen=" + this.datos.idTipoDictamen).subscribe(
      n => {
        n.combooItems.forEach(element => {
          if (element.fechaBaja == null || element.value == this.datos.fundamentoCalif) {
            this.comboFundamentoCalif.push(element);
          }
        });
        this.commonServices.arregloTildesCombo(this.comboFundamentoCalif);
        this.comboFundamentoCalif.forEach(pres => {
          if (pres.value == this.datos.fundamentoCalif) this.fundamentoCalifCabecera = pres.label;
        });
      }
    );
  }

  getComboTipoDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        n.combooItems.forEach(element => {
          if (element.fechaBaja == null || element.value == this.datos.idTipoDictamen) {
            this.comboDictamen.push(element);
          }
        });
        this.commonServices.arregloTildesCombo(this.comboDictamen);
        this.comboDictamen.forEach(pres => {
          if (pres.value == this.datos.idTipoDictamen) {
            this.datos.dictamenSing = pres.label;
          }
        });
      }
    );
  }

  onChangeDictamen() {
    this.comboFundamentoCalif = [];
    if (this.datos.idTipoDictamen != undefined) {
      this.isDisabledFundamentosCalif = false;
      this.getComboFundamentoCalif();
    } else {
      this.isDisabledFundamentosCalif = true;
      this.datos.fundamentoCalif = null;
    }
  }

  fillFechaDictamen(event) {
    if (event != null && !isNaN(Date.parse(event))) {
      this.datos.fechaDictamen = new Date(event);
    }
  }

  getEstados() {
    this.sigaServices.post("gestionejg_getEstados", this.datos).subscribe(
      n => {
        this.estados = JSON.parse(n.body).estadoEjgItems;
      }
    );
  }

  save() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_actualizarInformeCalificacionEjg", this.datos).subscribe(
      n => {
        if (n.statusText == "OK") {

          //En el caso que se cree un nuevo dictamen, se debe extraer del back
          if (this.datos.iddictamen == null) {
            this.sigaServices.post("gestionejg_datosEJG", this.datos).subscribe(
              n => {
                this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                let ejgObject = JSON.parse(n.body).ejgItems;
                this.datos.iddictamen = ejgObject[0].iddictamen;
                this.datosIniciales = { ...this.datos };
                this.fechaDictCabecera = this.datos.fechaDictamen;
                this.guardadoSend.emit(this.datos);
                this.progressSpinner = false;
              },
              err => {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                this.progressSpinner = false;
              }
            );
          } else {
            //Actualizacion de un dictamen existente
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.datosIniciales = { ...this.datos };
            //Revisamos la cabecera de la tarjeta
            this.comboFundamentoCalif.forEach(pres => {
              if (pres.value == this.datos.fundamentoCalif) this.fundamentoCalifCabecera = pres.label;
            });
            this.comboDictamen.forEach(pres => {
              if (pres.value == this.datos.idTipoDictamen) {
                this.datos.dictamenSing = pres.label;
              }
            });
            this.fechaDictCabecera = this.datos.fechaDictamen;
            this.guardadoSend.emit(this.datos);
            this.progressSpinner = false;
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          this.progressSpinner = false;
        }
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  confirmDelete() {
    this.delete()
  }

  delete() {
    this.progressSpinner = true;

    this.datos.fechaDictamen = null;
    this.datos.idTipoDictamen = null;
    this.datos.fundamentoCalif = null;
    this.datos.dictamen = null;

    this.sigaServices.post("gestionejg_actualizarInformeCalificacionEjg", this.datos).subscribe(
      n => {
        this.progressSpinner = false;
        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.datos.iddictamen = null;
          this.datos.dictamenSing = "";
          this.datosIniciales = { ...this.datos}
          this.fundamentoCalifCabecera = "";
          this.guardadoSend.emit(this.datos);
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  rest() {
    this.datos = { ...this.datosIniciales };
    if (this.datos.fundamentoCalif != null) {
      this.getComboFundamentoCalif();
      this.isDisabledFundamentosCalif = false;
    }
    if (this.datos.fechaDictamen != null) {
      this.datos.fechaDictamen = new Date(this.datos.fechaDictamen);
    } else {
      this.datos.fechaDictamen = null;
    }
  }

  comunicacion() {
    let rutaClaseComunicacion = "/comunicacionEjgca";
    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data["body"]).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
          data => {
            this.keys = JSON.parse(data["body"]).keysItem;
            let keysValues = [];
            this.keys.forEach(key => {
              if (this.datos[key.nombre] != undefined) {
                keysValues.push(this.datos[key.nombre]);
              } else if (key.nombre == "num" && this.datos["numero"] != undefined) {
                keysValues.push(this.datos["numero"]);
              } else if (key.nombre == "anio" && this.datos["annio"] != undefined) {
                keysValues.push(this.datos["annio"]);
              } else if (key.nombre == "idtipoejg" && this.datos["tipoEJG"] != undefined) {
                keysValues.push(this.datos["tipoEJG"]);
              } else if (key.nombre == "identificador") {
                keysValues.push(this.datos["numAnnioProcedimiento"]);
              }
            });
            sessionStorage.setItem("rutaComunicacion", rutaClaseComunicacion);
            sessionStorage.setItem("idModulo", '10');
            sessionStorage.setItem("datosComunicar", JSON.stringify(keysValues));
            this.router.navigate(["/dialogoComunicaciones"]);
          }
        );
      }
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  checkPermisosConfirmDelete() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    }
    else this.checkFechaEstadoComision()
  }

  checkFechaEstadoComision() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEstados", this.datos).subscribe(
      n => {
        let estados = JSON.parse(n.body).estadoEjgItems;
        this.progressSpinner = false;

        let estadoCAJG = estados.find(
          item => item.propietario == "1" && item.fechaInicio > this.datos.fechaDictamen
        );
        //Introducir mensaje en la base de datos
        if (estadoCAJG != undefined) this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.dictamen.disDel"));
        else this.confirmDelete();
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  checkPermisosSave() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.save();
    }
  }

  checkPermisosRest() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  checkPermisosDownload() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.comunicacion();
    }
  }
}