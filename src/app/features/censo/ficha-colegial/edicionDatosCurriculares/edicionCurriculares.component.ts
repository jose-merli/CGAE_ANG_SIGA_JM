import { Component, OnInit, ViewChild } from "@angular/core";
import { esCalendar } from "./../../../../utils/calendar";
import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { Location, DatePipe } from "@angular/common";

import { FichaColegialEdicionCurricularesItem } from "../../../../models/FichaColegialEdicionCurricularesItem";
import { FichaColegialEdicionCurricularesObject } from "../../../../models/FichaColegialEdicionCurricularesObject";
/*** COMPONENTES ***/

@Component({
  selector: "app-edicionCurriculares",
  templateUrl: "./edicionCurriculares.component.html",
  styleUrls: ["./edicionCurriculares.component.scss"]
})
export class EdicionCurricularesComponent implements OnInit {
  cols: any = [];
  datos: any[];
  searchIntegrantes = new FichaColegialEdicionCurricularesObject();
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  es: any = esCalendar;
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  permisosArray: any[];
  usuarioBody: any[];
  cargosArray: any[];
  colegiosArray: any[];
  provinciasArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  update: boolean = true;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  masFiltros: boolean = false;
  openFicha: boolean = true;
  fichasPosibles: any[];
  body: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  datosIntegrantes: FichaColegialEdicionCurricularesObject = new FichaColegialEdicionCurricularesObject();
  fechaCarga: Date;
  fechaBajaCargo: Date;
  columnasTabla: any = [];
  // Obj extras
  body1: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  body2: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();

  @ViewChild("table")
  table;
  selectedDatos;

  constructor(private sigaServices: SigaServices, private router: Router) {}

  ngOnInit() {
    // this.editar = this.body.editar;
    this.editar = true;
    this.fichasPosibles = [
      {
        key: "identificacion",
        activa: this.editar
      },
      {
        key: "colegiacion",
        activa: this.editar
      },
      {
        key: "vinculacion",
        activa: this.editar
      }
    ];
    this.cols = [
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      { field: "apellidos", header: "Apellidos" },
      { field: "fechaInicioCargo", header: "Fecha de alta - fecha de baja" },
      { field: "cargos", header: "Cargos del integrante" },
      { field: "liquidacionComoSociedad", header: "Liquidación como sociedad" },
      { field: "ejerciente", header: "Ejerciente" },
      { field: "participacion", header: "Participación en la sociedad" }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
    this.sigaServices.get("integrantes_tipoColegio").subscribe(
      n => {
        this.colegiosArray = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.provinciasArray = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("integrantes_cargos").subscribe(
      n => {
        this.cargosArray = n.combooItems;
      },
      err => {
        console.log(err);
      }
      //   ,
      //   () => {
      //     this.cargosArray.forEach((value:ComboItem, key:number)){

      //   }
      // }
    );
  }
  abrirFicha() {
    this.openFicha = !this.openFicha;
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
  backTo() {
    this.router.navigate(["fichaColegial"]);
  }
  pInputText;
  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }

  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }
}
