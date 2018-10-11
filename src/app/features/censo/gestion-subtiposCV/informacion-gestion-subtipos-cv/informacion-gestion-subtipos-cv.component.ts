import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "../../../../_services/siga.service";
import { GestionSubtipoCVItem } from "../../../../models/GestionSubtipoCVItem";
import { Location } from "@angular/common";

@Component({
  selector: "app-informacion-gestion-subtipos-cv",
  templateUrl: "./informacion-gestion-subtipos-cv.component.html",
  styleUrls: ["./informacion-gestion-subtipos-cv.component.scss"]
})
export class InformacionGestionSubtiposCvComponent implements OnInit {
  selectedTipo: any;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  showInfoSubtipoCV: boolean = false;
  progressSpinner: boolean = false;
  buscar: boolean = false;

  body: GestionSubtipoCVItem = new GestionSubtipoCVItem();

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit() {
    this.showInfoSubtipoCV = true;

    if (sessionStorage.getItem("datos") != null) {
      this.body = JSON.parse(sessionStorage.getItem("datos"));
      this.body.subtipo2 = "";
    }

    this.getInfo();
  }

  getInfo() {
    this.cols = [
      {
        field: "cdgoExt",
        header: "Códgo Externo"
      },
      {
        field: "subtipo2",
        header: "Nombre Subtipo Curriculares"
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

  onHideInformacionSubtipoCV() {
    this.showInfoSubtipoCV = !this.showInfoSubtipoCV;
  }

  onChange(event) {
    return event;
  }

  search() {
    this.buscar = true;
    this.selectedDatos = [];
    //this.progressSpinner = true;
    this.getInfo();

    if (this.body != null && this.body != undefined) {
      if (
        this.body.tipoCV == "" &&
        this.body.subtipo1 == "" &&
        this.body.subtipo2 == ""
      ) {
        this.datos = [];
      } else {
        this.datos = [
          {
            id: "0",
            cdgoExt: "12",
            subtipo2: "Bibliotecario"
          },
          {
            id: "1",
            cdgoExt: "34",
            subtipo2: "Gerente"
          }
        ];
      }
    }
    //this.progressSpinner = false;
  }

  restore() {
    this.body.tipoCV = "";
    this.body.subtipo1 = "";
    this.body.subtipo2 = "";
  }

  redirect(selectedDatos) {
    if (this.selectMultiple) {
      this.numSelected = this.selectedDatos.length;
    }
  }

  newElement() {
    this.getInfo();

    let dummy = {
      id: "",
      cdgoExt: "",
      subtipo2: ""
    };
    this.datos = [dummy, ...this.datos];

    this.selectAll = false;
    this.selectMultiple = false;
    this.numSelected = 0;
  }

  removeElement(selectedDatos) {
    this.getInfo();

    let data = [];
    this.datos.forEach(element => {
      if (element.id != selectedDatos[0].id) {
        data.push(element);
      }
    });
    this.datos = [...data];

    this.selectAll = false;
    this.selectMultiple = false;
    this.numSelected = 0;
  }

  volver() {
    this.location.back();
  }

  // PARA LA TABLA
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }
}
