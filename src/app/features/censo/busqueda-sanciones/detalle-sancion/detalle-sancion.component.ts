import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { BusquedaSancionesItem } from "../../../../models/BusquedaSancionesItem";
import { SelectItem } from "primeng/components/common/api";
import { esCalendar } from "../../../../utils/calendar";

@Component({
  selector: "app-detalle-sancion",
  templateUrl: "./detalle-sancion.component.html",
  styleUrls: ["./detalle-sancion.component.scss"]
})
export class DetalleSancionComponent implements OnInit {
  showDatosSancion: boolean = true;

  tipoSancion: SelectItem[];
  estado: SelectItem[];

  colegios: any;
  es: any = esCalendar;

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
    this.body.letrado = "";
    this.body.tipoSancion = "";
    this.body.estado = "";
    this.body.colegioSancionador = "";
    this.body.refColegio = "";
    this.body.fechaAcuerdo = null;
    this.body.chkFirmeza = false;
    this.body.chkRehabilitado = false;
    this.body.fecha = null;
    this.body.fechaDesde = null;
    this.body.fechaHasta = null;
    this.body.fechaArchivada = null;
    this.body.multa = "";
    this.body.texto = "";
    this.body.observaciones = "";
  }
}
