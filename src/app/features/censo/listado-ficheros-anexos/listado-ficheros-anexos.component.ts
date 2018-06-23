import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-listado-ficheros-anexos",
  templateUrl: "./listado-ficheros-anexos.component.html",
  styleUrls: ["./listado-ficheros-anexos.component.scss"]
})
export class ListadoFicherosAnexosComponent implements OnInit {
  cols: any = [];

  progressSpinner: boolean = false;

  constructor() {}

  ngOnInit() {
    this.cols = [
      {
        field: "descripcion",
        header: "Descripcion"
      },
      {
        field: "tipo",
        header: "tipo"
      },
      {
        field: "fechaUso",
        header: "Fecha Uso"
      },
      {
        field: "fechaFirma",
        header: "Fecha de Firma"
      },
      {
        field: "lugarFirma",
        header: "Lugar de la firma"
      },
      {
        field: "publicable",
        header: "Publicable"
      }
    ];
  }

  descargarXml(cargas) {}
}
