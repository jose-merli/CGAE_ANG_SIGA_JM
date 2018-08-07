import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { esCalendar } from "../../../utils/calendar";
import { Router } from "../../../../../node_modules/@angular/router";

@Component({
  selector: "app-busqueda-no-colegiados",
  templateUrl: "./busqueda-no-colegiados.component.html",
  styleUrls: ["./busqueda-no-colegiados.component.scss"]
})
export class BusquedaNoColegiadosComponent implements OnInit {
  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[];
  select: any[];
  es: any = esCalendar;
  selectedValue: string = "simple";

  // selectedDatos: any = []

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showDatosAvanzadosGenerales: boolean = false;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;

  buscar: boolean = false;
  selectAll: boolean = false;

  selectedItem: number = 10;
  @ViewChild("table") table;
  selectedDatos;

  masFiltros: boolean = false;
  labelFiltros: string;
  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "avanzado",
      activa: false
    },
    {
      key: "direccion",
      activa: false
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formBusqueda = this.formBuilder.group({
      fechaNacimiento: new FormControl(null, Validators.required),
      fechaIncorporacion: new FormControl(null)
    });
  }

  ngOnInit() {}

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
}
