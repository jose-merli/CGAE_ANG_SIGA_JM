import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { SelectItem } from "primeng/components/common/api";
import { BusquedaSancionesItem } from "../../../../models/BusquedaSancionesItem";
import { esCalendar } from "../../../../utils/calendar";
import { FichaColegialGeneralesItem } from "../../../../models/FichaColegialGeneralesItem";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { BusquedaSancionesObject } from "../../../../models/BusquedaSancionesObject";
import { ComboItem } from "../../../../../app/models/ComboItem";

@Component({
  selector: "app-detalle-sancion",
  templateUrl: "./detalle-sancion.component.html",
  styleUrls: ["./detalle-sancion.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DetalleSancionComponent implements OnInit {
  showDatosSancion: boolean = true;
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  tipoSancion: SelectItem[];
  estado: SelectItem[];
  existeImagen: boolean = false;
  colegios: any;
  msgs: any;
  es: any = esCalendar;
  imagenPersona: any;
  body: BusquedaSancionesItem = new BusquedaSancionesItem();
  restoreBody: BusquedaSancionesItem = new BusquedaSancionesItem();
  progressSpinner: boolean = false;
  disabledFechaAcuerdo: boolean = false;
  disabledFechaFirme: boolean = true;
  disabledPeriodoDesde: boolean = true;
  disabledPeriodoHasta: boolean = true;
  disabledRehabilitado: boolean = true;
  disabledFechaArchivada: boolean = true;
  disabledChkFirmeza: boolean = true;
  disabledChkRehabilitado: boolean = true;
  disabledChkArchivada: boolean = true;

  constructor(private location: Location, private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getComboColegios();
    this.getComboTipoSancion();

    if (
      sessionStorage.getItem("rowData") != null &&
      sessionStorage.getItem("rowData") != undefined
    ) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));
      //this.body = this.body[0];
      this.restoreBody = JSON.parse(sessionStorage.getItem("rowData"));
      this.transformDates(this.body);

      this.bodyToCheckbox();

      this.deshabilitarFechas();
    }
    //this.deshabilitarFechas();
  }

  transformDates(body) {
    body.fechaAcuerdoDate = new Date(body.fechaAcuerdoDate);
    body.fechaDesdeDate = new Date(body.fechaDesdeDate);
    body.fechaHastaDate = new Date(body.fechaHastaDate);
    body.fechaFirmezaDate = new Date(body.fechaFirmezaDate);
    body.fechaRehabilitadoDate = new Date(body.fechaRehabilitadoDate);
    body.fechaArchivadaDate = new Date(body.fechaArchivadaDate);
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;

        // if (this.body != undefined) {
        //   this.colegios.forEach(element => {
        //     if (element.label == this.body.colegio) {
        //       this.body.colegio = element.value;
        //     }
        //   });
        // }
      },
      err => {
        console.log(err);
      }
    );
  }

  getValueForCombo() {
    let i = 0;
    while (this.tipoSancion.length > i) {
      if (this.tipoSancion[i].label == this.body.tipoSancion) {
        this.body.tipoSancion = this.tipoSancion[i].value;
      }
      i++;
    }
    // let j = 0;
    // while (this.colegios.length > j) {
    //   if (this.colegios[j].label == this.body.colegio) {
    //     this.body.colegio = this.colegios[j].value;
    //   }
    //   j++;
    // }
  }

  onHideDatosSancion() {
    this.showDatosSancion = !this.showDatosSancion;
  }

  return() {
    sessionStorage.removeItem("rowData");
    this.location.back();
  }

  bodyToCheckbox() {
    if (this.body.rehabilitado == "No") {
      this.body.chkRehabilitado = false;
    } else {
      this.body.chkRehabilitado = true;
    }
    if (this.body.firmeza == "No") {
      this.body.chkFirmeza = false;
    } else {
      this.body.chkFirmeza = true;
    }
  }

  getComboTipoSancion() {
    this.sigaServices.get("busquedaSanciones_comboTipoSancion").subscribe(
      n => {
        this.tipoSancion = n.combooItems;
        this.getValueForCombo();
      },
      err => {
        console.log(err);
      }
    );
  }

  deshabilitarAcuerdo() {
    if (this.body.fechaAcuerdoDate != undefined) {
      //Check desmarcado y fecha informada
      this.disabledFechaFirme = false;
      this.disabledFechaAcuerdo = false;
      this.disabledChkFirmeza = false;
    } else {
      //check desmarcado y fecha no informada
      this.disabledFechaFirme = true;
      this.disabledChkFirmeza = true;
      this.disabledFechaAcuerdo = false;
    }
  }

  deshabilitarFirmeza() {
    if (this.body.fechaAcuerdoDate != undefined) {
      if (this.body.chkFirmeza == true) {
        // Check marcado
        this.disabledPeriodoDesde = false;
        this.disabledFechaFirme = true;
        this.body.fechaFirmezaDate = undefined;
      } else if (this.body.fechaFirmezaDate != undefined) {
        //Check desmarcado y fecha informada
        this.disabledPeriodoDesde = false;
      } else {
        //Check desmarcado y fecha no informada
        this.disabledPeriodoDesde = true;
        this.disabledPeriodoHasta = true;

        // LO NUEVO
        this.disabledRehabilitado = true;
        this.disabledChkRehabilitado = true;
        this.disabledChkArchivada = true;
        this.disabledFechaArchivada = true;

        this.disabledFechaFirme = false;
      }
    }
  }

  deshabilitarFechaDesde() {
    if (
      this.body.fechaFirmezaDate != undefined ||
      this.body.chkFirmeza == true
    ) {
      if (this.body.fechaDesdeDate != undefined) {
        // Fecha informada
        this.disabledPeriodoHasta = false;
        this.disabledPeriodoDesde = false;
      } else {
        // Fecha no informada
        this.disabledPeriodoHasta = true;
        this.disabledFechaArchivada = true;
      }
    }
  }

  deshabilitarFechaFin() {
    if (
      this.body.fechaDesdeDate != undefined &&
      this.body.fechaHastaDate != undefined &&
      this.disabledPeriodoDesde == false &&
      this.disabledPeriodoHasta == false
    ) {
      if (this.body.chkRehabilitado == true) {
        // Check marcado
        this.disabledChkRehabilitado = false;
        this.disabledRehabilitado = true;
        this.body.fechaRehabilitadoDate = undefined;
        this.disabledChkArchivada = false;
      } //else if (this.body.fechaRehabilitado != undefined) {
      //Check desmarcado y fecha informada
      // this.disabledRehabilitado = false;
      // this.disabledChkArchivada = false;
      // this.disabledFechaArchivada = false;
      //}
      // } else {
      //   //Check desmarcado y fecha no informada
      //   // Rehabilitado no puede funcionar
      //   this.disabledRehabilitado = false;
      //   //this.disabledChkRehabilitado = true;

      //   // this.disabledChkArchivada = false;
      //   // this.disabledFechaArchivada = false;
      // }
    }
  }

  deshabilitarFechaRehabilitado() {
    if (this.disabledChkRehabilitado == false) {
      if (this.body.chkRehabilitado == true) {
        if (
          this.body.chkArchivadas == true &&
          this.disabledChkArchivada == false
        ) {
          this.disabledFechaArchivada = true;
          this.body.fechaArchivadaDate = undefined;
        } else {
          this.disabledFechaArchivada = false;
        }
      } else {
        if (this.body.fechaRehabilitadoDate != undefined) {
          if (
            this.body.chkArchivadas == true &&
            this.disabledChkArchivada == false
          ) {
            this.disabledChkArchivada = false;
            this.disabledFechaArchivada = true;
            this.body.fechaArchivadaDate = undefined;
          } else {
            this.disabledChkArchivada = false;
            this.disabledFechaArchivada = false;
          }
        } else {
          this.disabledRehabilitado = false;
          this.disabledChkArchivada = true;
          this.disabledFechaArchivada = true;
        }
      }
    }
  }

  deshabilitarFechas() {
    this.deshabilitarAcuerdo();
    this.deshabilitarFirmeza();
    this.deshabilitarFechaDesde();
    this.deshabilitarFechaFin();
    this.deshabilitarFechaRehabilitado();
  }

  detectDateInput() {
    if (this.body.fechaDesdeDate == undefined) {
      this.disabledPeriodoHasta = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
    } else if (this.body.fechaHastaDate == undefined) {
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
    } else if (this.body.fechaFirmezaDate == undefined) {
      this.disabledPeriodoHasta = true;
      this.disabledPeriodoDesde = true;
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
    } else if (this.body.fechaRehabilitadoDate == undefined) {
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
    }
  }

  // Control de fechas

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }

  restore() {
    // this.body.idColegio = "";
    // this.body.tipoSancion = "";
    // this.body.refColegio = "";
    // this.body.fechaAcuerdoDate = undefined;
    // this.body.fechaFirmezaDate = undefined;
    // this.body.fechaDesdeDate = undefined;
    // this.body.fechaHastaDate = undefined;
    // this.body.fechaRehabilitadoDate = undefined;
    // this.body.fechaArchivadaDate = undefined;
    // this.body.chkFirmeza = false;
    // this.body.chkRehabilitado = false;
    // this.body.chkArchivadas = false;
    // this.body.texto = "";
    // this.body.observaciones = "";

    this.body = this.restoreBody;
    this.getComboTipoSancion();
    this.transformDates(this.body);
    this.bodyToCheckbox();
  }

  disableFields() {
    if (
      this.body.colegio != null &&
      this.body.colegio != undefined &&
      this.body.colegio != "" &&
      this.body.tipoSancion != null &&
      this.body.tipoSancion != undefined &&
      this.body.tipoSancion != ""
    ) {
      this.disabledFechaAcuerdo = false;
      return false;
    } else {
      this.disabledFechaAcuerdo = true;
      return true;
    }
  }

  // Método para actualizar el registro
  save() {
    this.sigaServices
      .post("busquedaSanciones_updateSanction", this.body)
      .subscribe(
        data => {
          this.showSuccess("Correcto");
        },
        error => {
          this.showFail("Error");
          console.log(error);
        },
        () => {
          sessionStorage.setItem("back", "true");
          this.return();
        }
      );
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  clear() {
    this.msgs = [];
  }
}
