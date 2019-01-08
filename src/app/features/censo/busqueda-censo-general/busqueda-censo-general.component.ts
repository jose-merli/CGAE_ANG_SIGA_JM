import { Component, OnInit, ViewChild } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { Location } from "@angular/common";
import { BusquedaFisicaItem } from "../../../models/BusquedaFisicaItem";
import { BusquedaFisicaObject } from "../../../models/BusquedaFisicaObject";
import { Router } from "../../../../../node_modules/@angular/router";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";

@Component({
  selector: "app-busqueda-censo-general",
  templateUrl: "./busqueda-censo-general.component.html",
  styleUrls: ["./busqueda-censo-general.component.scss"]
})
export class BusquedaCensoGeneralComponent implements OnInit {
  textFilter: String = "Elegir";
  textSelected: String = "{0} opciones seleccionadas";

  cols: any = [];
  rowsPerPage: any = [];
  colegios: any[];
  msgs: any[];
  datos: any[] = [];
  colegios_seleccionados: any[] = [];

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  progressSpinner: boolean = false;

  body: BusquedaFisicaItem = new BusquedaFisicaItem();
  bodySearch = new BusquedaFisicaObject();

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    }
  ];

  selectedItem: number = 10;
  @ViewChild("table")
  table;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.fillDataTable();

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  fillDataTable() {
    this.cols = [
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "numeroColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "situacion",
        header: "censo.fichaCliente.situacion.cabecera"
      },
      {
        field: "residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "correo",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
      }
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
  }

  isLimpiar() {
    this.body = new BusquedaFisicaItem();
    this.colegios_seleccionados = [];
  }

  // Ficha
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  // Métodos
  isBuscar() {
    this.buscar = true;
    this.search();
  }

  search() {
    this.progressSpinner = true;

    if (
      this.colegios_seleccionados != undefined &&
      this.colegios_seleccionados.length > 0
    ) {
      this.body.idInstitucion = [];
      this.body.idInstitucion.push(this.colegios_seleccionados[0].value);
    }

    this.sigaServices
      .postPaginado("busquedaCensoGeneral_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.datos = this.bodySearch.busquedaFisicaItems;
          console.log("ccccc", this.datos);
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  irFichaColegial(selectedDatos) {
    if (
      selectedDatos.numeroInstitucion == 2000 ||
      selectedDatos.numeroInstitucion == 2062 ||
      selectedDatos.numeroInstitucion == 2039 ||
      selectedDatos.numeroInstitucion == 2063 ||
      selectedDatos.numeroInstitucion == 2038 ||
      selectedDatos.numeroInstitucion == 2011
    ) {
      sessionStorage.setItem("personaBody", JSON.stringify(selectedDatos[0]));
      this.router.navigate(["/fichaColegial"]);
    }
  }

  backTo() {
    this.location.back();
  }

  clear() {
    this.msgs = [];
  }
}
