import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";

import { DatosIntegrantesItem } from "./../../../../app/models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "./../../../../app/models/DatosIntegrantesObject";

@Component({
  selector: "app-datos-integrantes",
  templateUrl: "./datos-integrantes.component.html",
  styleUrls: ["./datos-integrantes.component.scss"]
})
export class DatosIntegrantesComponent implements OnInit {
  openFicha: boolean = false;

  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();

  columnasTabla: any = [];

  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();

  @ViewChild("table") table;
  selectedDatos;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.columnasTabla = [
      { field: "nif", header: "NIF" },
      { field: "nombre", header: "Nombre" },
      { field: "apellidos", header: "Apellidos" },
      { field: "fechaInicioCargo", header: "Fecha de alta - fecha de baja" },
      { field: "cargo", header: "Cargos del integrante" },
      { field: "fechaFinCargo", header: "Liquidación como sociedad" },
      { field: "cargo", header: "Ejerciente" },
      { field: "cargo", header: "Participación en la sociedad" }
    ];

    // Descomentar si se quiere probar
    this.unInteg();
    this.masDe1Integ();
  }

  // funciones de relleno de datos fantasmas
  masDe1Integ() {
    this.body1.nombre = "JACINTO";
    this.datosIntegrantes.datosIntegrantesItems.push(this.body1);
    this.body2.nombre = "ALBERTO";
    this.datosIntegrantes.datosIntegrantesItems.push(this.body2);
  }

  unInteg() {
    this.body.nif = "String";
    this.body.nombre = "PEPE";
    this.body.apellido1 = "String";
    this.body.apellido2 = "String";
    this.body.cargo = "String";
    this.body.descripcionCargo = "String";
    this.body.fechaInicioCargo = new Date();
    this.body.fechaFinCargo = new Date();
    this.body.participacionSociedad = "String";
    this.body.numColegiado = "String";
    this.body.colegioProfesional = "String";
    this.body.provincia = "String";
    this.body.tipoColegio = "String";

    this.datosIntegrantes.datosIntegrantesItems.push(this.body);
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }
}
