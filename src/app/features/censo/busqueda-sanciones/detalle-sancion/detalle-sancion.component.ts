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
  disabledFechaAcuerdo: boolean = false;
  disabledFechaFirme: boolean = true;
  disabledPeriodoDesde: boolean = true;
  disabledPeriodoHasta: boolean = true;
  disabledRehabilitado: boolean = true;
  disabledFechaArchivada: boolean = true;

  constructor(private location: Location, private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getComboTipoSancion();
    this.getComboColegios();
    if (
      sessionStorage.getItem("rowData") != null &&
      sessionStorage.getItem("rowData") != undefined
    ) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));
      this.body = this.body[0];
      this.bodyToCheckbox();
    }
    this.deshabilitarFechas();
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
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
    let j = 0;
    while (this.colegios.length > j) {
      if (this.colegios[j].label == this.body.colegio) {
        this.body.colegio = this.colegios[j].value;
      }
      j++;
    }
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
    if (this.body.chkAcuerdo == true) {
      //Check marcado
      this.disabledFechaFirme = false;
      this.disabledFechaAcuerdo = true;
      this.body.fechaAcuerdo = undefined;
    } else if (this.body.fechaAcuerdo != undefined) {
      //Check desmarcado y fecha informada
      this.disabledFechaFirme = false;
      this.disabledFechaAcuerdo = false;
    } else {
      //check desmarcado y fecha no informada
      this.disabledFechaFirme = true;
      this.disabledFechaAcuerdo = false;
    }
    return this.disabledFechaAcuerdo;
  }

  deshabilitarFirmeza() {
    if (this.body.chkFirmeza == true) {
      //Check marcado
      this.disabledPeriodoDesde = false;
      this.disabledFechaFirme = true;
      this.body.fechaFirmeza = undefined;
    } else if (this.body.fechaAcuerdo != undefined) {
      //Check desmarcado y fecha informada
      this.disabledPeriodoDesde = false;
      this.disabledFechaFirme = false;
    } else {
      //check desmarcado y fecha no informada

      this.disabledPeriodoDesde = true;
      //   this.disabledFechaFirme = false;
      // } else {
      //   this.disabledFechaFirme = true;
    }
  }

  deshabilitarFechas() {
    this.deshabilitarAcuerdo();
    this.deshabilitarFirmeza();
  }

  restore() {
    this.body.tipoSancion = "";
    this.body.estado = "";
    this.body.refColegio = "";
    this.body.fecha = null;
    this.body.fechaDesde = null;
    this.body.fechaHasta = null;
  }
}
