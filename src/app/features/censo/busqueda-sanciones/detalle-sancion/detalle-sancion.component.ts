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
  hideMulta: boolean = false;
  isNew: boolean = true;
  colegios: any;
  es: any = esCalendar;
  imagenPersona: any;
  body: BusquedaSancionesItem = new BusquedaSancionesItem();

  constructor(private location: Location, private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getComboTipoSancion();
    if (
      sessionStorage.getItem("rowData") != null &&
      sessionStorage.getItem("rowData") != undefined
    ) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));
      this.body = this.body[0];
    }
    this.bodyToCheckbox();
  }

  getValueForCombo() {
    let i = 0;
    while (this.tipoSancion.length > i) {
      if (this.tipoSancion[i].label == this.body.tipoSancion) {
        this.body.tipoSancion = this.tipoSancion[i].value;
      }
      i++;
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

  onChangeTipoSancion(event) {
    console.log("event", event);
    if (event.value != 10) {
      this.hideMulta = true;
    } else {
      this.hideMulta = false;
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
}
