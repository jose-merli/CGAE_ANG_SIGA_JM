import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { esCalendar } from "../../../utils/calendar";
import { Router } from "../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../_services/siga.service";
import { TranslateService } from "../../../commons/translate";
import { DatosNoColegiadosItem } from "../../../models/DatosNoColegiadosItem";
import { DataTable } from "../../../../../node_modules/primeng/primeng";

@Component({
  selector: "app-busqueda-no-colegiados",
  templateUrl: "./busqueda-no-colegiados.component.html",
  styleUrls: ["./busqueda-no-colegiados.component.scss"]
})
export class BusquedaNoColegiadosComponent implements OnInit {
  formBusqueda: FormGroup;
  comboEtiquetas: any;
  textSelected: String = "{0} etiquetas seleccionadas";
  comboEstadoCivil: any;
  comboProvincias: any;
  comboPoblacion: any;
  comboTipoDireccion: any;
  comboCategoriaCurricular: any;
  comboSexo: any;
  progressSpinner: boolean = false;
  resultadosPoblaciones: any;

  editar: boolean = true;
  textFilter: String = "Selección Múltiple";
  body: DatosNoColegiadosItem = new DatosNoColegiadosItem();
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  isEditable: boolean = false;
  buscar: boolean = false;
  es: any;

  cols: any;
  datos: any;
  rowsPerPage: any;
  selectMultiple: boolean = false;
  isMultiple: string = "single";
  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected: number = 0;

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

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
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices
  ) {
    this.formBusqueda = this.formBuilder.group({
      fechaNacimiento: new FormControl(null, Validators.required),
      id: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3))
    });
  }

  ngOnInit() {
    // Obtener Combos
    this.getCombos();
    this.es = this.translateService.getCalendarLocale();
  }

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

  getCombos() {
    this.getComboProvincias();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboSexo();
    this.getComboTipoDireccion();
    this.getComboEtiquetas();
  }

  getComboSexo() {
    this.comboSexo = [
      { label: "", value: null },
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" }
    ];
  }

  getComboEstadoCivil() {
    this.sigaServices.get("busquedaNoColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEtiquetas() {
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTipoDireccion() {
    this.sigaServices.get("busquedaNoColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTipoDireccion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaNoColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaNoColegiados_provincias").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaNoColegiados_poblacion",
        "?idProvincia=" + this.body.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
        },
        error => {},
        () => {}
      );
  }

  onChangeCodigoPostal(event) {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      let value = this.body.codigoPostal.substring(0, 2);
      if (
        value != this.body.idProvincia ||
        this.body.idProvincia == undefined
      ) {
        this.body.idProvincia = value;
        this.isDisabledPoblacion = false;
        this.comboPoblacion = [];
      }
    }
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = "No hay resultados";
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = "No hay resultados";
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (this.selectMultiple) {
      this.selectedDatos = [];
      this.isMultiple = "multiple";
    } else {
      this.selectAll = false;
      this.numSelected = 0;
      this.isMultiple = "single";
    }
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelect(event) {
    if (this.selectMultiple == false) {
      this.selectedDatos = this.selectedItem;
    } else {
      this.isSelectMultiple();
    }
  }

  isBuscar() {
    this.getInfo();
    this.buscar = true;
  }

  isLimpiar() {
    this.body = new DatosNoColegiadosItem();
  }

  isCrear() {
    let noColegiado = {
      id: "",
      apellidos: "",
      nombre: "",
      fechaNacimiento: "",
      mail: "",
      telefono: ""
    };

    this.isEditable = true;
    this.datos = [noColegiado, ...this.datos];
    this.table.reset();
  }

  deleteSeleccion() {
    this.selectedDatos = [];
  }

  isCancelar() {
    this.isEditable = false;
  }

  getInfo() {
    this.cols = [
      { field: "id", header: "Nº Identificación" },
      { field: "apellidos", header: "Apellidos" },
      { field: "nombre", header: "Nombre" },
      { field: "fechaNacimiento", header: "Fecha de nacimiento" },
      { field: "mail", header: "Correo Electrónico" },
      { field: "telefono", header: "Teléfono" }
    ];

    this.datos = [
      {
        id: "8771",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8772",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8773",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8774",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8775",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8776",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8777",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8778",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "8779",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "87710",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "87711",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "87712",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "87713",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "87714",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
      },
      {
        id: "87715",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        fechaNacimiento: "22/02/2000",
        mail: "ejerci@ente.es",
        telefono: "99999999"
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
        label: "Todo",
        value: this.datos.length
      }
    ];
  }
}
