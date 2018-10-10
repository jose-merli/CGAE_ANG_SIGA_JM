import { OldSigaServices } from "../../../_services/oldSiga.service";
import { SelectItem } from "../../../../../node_modules/primeng/primeng";
import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { Router } from "../../../../../node_modules/@angular/router";

@Component({
  selector: "app-gestion-subtiposCV",
  templateUrl: "./gestion-subtiposCV.component.html",
  styleUrls: ["./gestion-subtiposCV.component.scss"]
})
export class GestionSubtiposCVComponent {
  tipo: SelectItem[];
  selectedTipo: any;

  @ViewChild("table")
  table;
  selectedDatos = [];
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  selectedItem: number = 10;
  numSelected: number = 0;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  showSubtipoCV: boolean = false;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  pressNew: boolean = false;
  enableCargo: boolean;
  enableColegiado: boolean;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.showSubtipoCV = true;

    this.getInfo();
  }

  getInfo() {
    this.cols = [
      { field: "cdgoext", header: "Cdgo ext" },
      {
        field: "tipoCV",
        header: "Tipo CV"
      },
      {
        field: "cdgoExt",
        header: "CdgoExt"
      },
      {
        field: "subtipo1",
        header: "Tipos curriculares"
      },
      {
        field: "subtipo2",
        header: "Número de Registros Subtipo Curriculares"
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

  ngAfterContentInit() {
    this.tipo = [
      {
        label: "Cargos",
        value: "Cargos"
      },
      {
        label: "Colegiados de honor",
        value: "Colegiados de honor"
      }
    ];
  }

  onHideSubtipoCV() {
    this.showSubtipoCV = !this.showSubtipoCV;
  }

  onChange(event) {
    if (event == "Cargos") {
      this.enableCargo = true;
    } else {
      this.enableCargo = false;
    }

    if (event == "Colegiados de honor") {
      this.enableColegiado = true;
    } else {
      this.enableColegiado = false;
    }
  }

  search() {
    this.buscar = true;
    //this.getInfo();

    if (this.enableCargo == true) {
      this.datos = [
        {
          id: "0",
          cdgoext: "4",
          tipoCV: "Cargos",
          cdgoExt: "CM1",
          subtipo1: "Comisión 1",
          subtipo2: "11"
        },
        {
          id: "1",
          cdgoext: "6",
          tipoCV: "Cargos",
          cdgoExt: "CM2",
          subtipo1: "Comisión 2",
          subtipo2: "1"
        }
      ];
    }

    if (this.enableColegiado == true) {
      this.datos = [
        {
          id: "0",
          cdgoext: "9",
          tipoCV: "Colegiados de honor",
          cdgoExt: "CM1",
          subtipo1: "Comisión 1",
          subtipo2: "11"
        },
        {
          id: "1",
          cdgoext: "4",
          tipoCV: "Colegiados de honor",
          cdgoExt: "CM2",
          subtipo1: "Comisión 2",
          subtipo2: "1"
        }
      ];
    }
    //this.progressSpinner = true;

    //this.progressSpinner = false;
  }

  restore() {
    this.selectedTipo = [];
  }

  newElement() {
    this.pressNew = true;

    let dummy = {
      id: "",
      cdgoext: "",
      tipoCV: "",
      cdgoExt: "",
      subtipo1: "",
      subtipo2: undefined
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

  redirect(selectedDatos) {
    if (!this.selectMultiple) {
      sessionStorage.setItem("datos", JSON.stringify(selectedDatos));
      this.router.navigate(["/informacionGestionSubtipoCV"]);
    }

    this.numSelected = this.selectedDatos.length;
  }
}
