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
  es: any = esCalendar;
  imagenPersona: any;
  body: BusquedaSancionesItem = new BusquedaSancionesItem();
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
      this.body = this.body[0];
      this.bodyToCheckbox();

      this.getComboColegios();
    }
    //this.deshabilitarFechas();
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;

        if (this.body != undefined) {
          this.colegios.forEach(element => {
            if (element.label == this.body.colegio) {
              this.body.colegio = element.value;
            }
          });
        }
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

  backTo() {
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
    if (this.body.fechaAcuerdo != undefined) {
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
    if (this.body.fechaAcuerdo != undefined) {
      if (this.body.chkFirmeza == true) {
        // Check marcado
        this.disabledPeriodoDesde = false;
        this.disabledFechaFirme = true;
        this.body.fechaFirmeza = undefined;
      } else if (this.body.fechaFirmeza != undefined) {
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
    if (this.body.fechaFirmeza != undefined || this.body.chkFirmeza == true) {
      if (this.body.fechaDesde != undefined) {
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
      this.body.fechaDesde != undefined &&
      this.body.fechaHasta != undefined &&
      this.disabledPeriodoDesde == false &&
      this.disabledPeriodoHasta == false
    ) {
      if (this.body.chkRehabilitado == true) {
        // Check marcado
        this.disabledChkRehabilitado = false;
        this.body.fechaRehabilitado = undefined;
        this.disabledChkArchivada = false;
      } else if (this.body.fechaRehabilitado != undefined) {
        //Check desmarcado y fecha informada
        this.disabledFechaArchivada = false;
      } else {
        //Check desmarcado y fecha no informada
        // Rehabilitado no puede funcionar
        this.disabledRehabilitado = false;
        //this.disabledChkRehabilitado = true;

        this.disabledChkArchivada = false;
        this.disabledFechaArchivada = false;
      }
    } else {
      this.disabledFechaArchivada = true;
    }
  }

  deshabilitarFechaRehabilitado() {
    if (this.body.chkArchivadas == true && this.disabledChkArchivada == false) {
      // Check marcado
      this.disabledChkArchivada = false;
      this.disabledFechaArchivada = true;
      this.body.fechaArchivada = undefined;
    } else {
      this.disabledFechaArchivada = false;
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
    if (this.body.fechaDesde == undefined) {
      this.disabledPeriodoHasta = true;
      this.disabledChkRehabilitado = true;
    } else if (this.body.fechaHasta == undefined) {
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
    } else if (this.body.fechaFirmeza == undefined) {
      this.disabledPeriodoHasta = true;
      this.disabledPeriodoDesde = true;
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
    }
  }

  restore() {
    this.body.tipoSancion = "";
    this.body.estado = "";
    this.body.refColegio = "";
    this.body.fecha = null;
    this.body.fechaDesde = null;
    this.body.fechaHasta = null;
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

  save() {}
}
