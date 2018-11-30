import { Location } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SelectItem } from "primeng/components/common/api";
import { BusquedaSancionesItem } from "../../../../models/BusquedaSancionesItem";
import { esCalendar } from "../../../../utils/calendar";
import { FichaColegialGeneralesItem } from "../../../../models/FichaColegialGeneralesItem";

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

  constructor(private location: Location) {}

  ngOnInit() {
    if (
      sessionStorage.getItem("rowData") != null &&
      sessionStorage.getItem("rowData") != undefined
    ) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));
    }
  }

  onHideDatosSancion() {
    this.showDatosSancion = !this.showDatosSancion;
  }

  backTo() {
    this.location.back();
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
