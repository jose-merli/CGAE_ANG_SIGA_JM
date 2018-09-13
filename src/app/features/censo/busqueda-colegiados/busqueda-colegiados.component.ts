import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";

import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { Router } from "@angular/router";
import { TranslateService } from "../../../commons/translate/translation.service";
import { ConfirmationService } from "primeng/api";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { DataTable } from "primeng/datatable";
import { esCalendar } from "./../../../utils/calendar";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";

@Component({
  selector: "app-busqueda-colegiados",
  templateUrl: "./busqueda-colegiados.component.html",
  styleUrls: ["./busqueda-colegiados.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaColegiadosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showDatosGeneneralesAvanzado: boolean = false;
  showDatosDireccion: boolean = false;
  progressSpinner: boolean = false;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;

  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: String = "Elegir";
  buscar: boolean = false;

  es: any = esCalendar;

  editar: boolean = true;

  comboEtiquetas: any[];
  comboSituacion: any[];
  comboResidencia: any[] = [];
  comboInscrito: any[] = [];
  comboSexo: any[] = [];
  comboEstadoCivil: any[];
  comboCategoriaCurricular: any[];
  comboSubtipoCV: any[];
  comboProvincias: any[];
  comboPoblacion: any[];
  comboTiposDireccion: any[];

  textSelected: String = "{0} etiquetas seleccionadas";
  body: DatosColegiadosItem = new DatosColegiadosItem();
  colegiadoSearch = new DatosColegiadosObject();

  siNoResidencia: any;
  siNoInscrito: any;
  selectedEstadoCivil: any;
  selectedCategoriaCurricular: any;
  selectedSubtipoCV: any;
  selectedProvincia: any;
  selectedPoblacion: any;
  selectedTipoDireccion: any;
  resultadosPoblaciones: any;
  historico: boolean;

  etiquetasPersonaJuridicaSelecionados: any = [];

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      id: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellido1: new FormControl(null, Validators.minLength(3)),
      apellido2: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.etiquetasPersonaJuridicaSelecionados = "";
    this.getCombos();
    this.getInfo();
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }

  onHideDatosGeneralesAvanzados() {
    this.showDatosGeneneralesAvanzado = !this.showDatosGeneneralesAvanzado;
  }

  onHideDireccion() {
    this.showDatosDireccion = !this.showDatosDireccion;
  }

  irEditarColegiado(id) {}

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

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

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_poblacion",
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
        this.comboPoblacion = [];
        this.isDisabledPoblacion = false;
      }
    }
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

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  search() {
    this.getInfo();
    this.buscar = true;
  }

  getCombos() {
    this.getComboEtiquetas();
    this.getComboSituacion();
    this.getComboResidencia();
    this.getComboInscrito();
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboProvincias();
    this.getComboTiposDireccion();
  }

  getComboEtiquetas() {
    // obtener etiquetas
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSituacion() {
    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboResidencia() {
    this.comboResidencia = [
      { label: "", value: 0 },
      { label: "Sí", value: 1 },
      { label: "No", value: 2 }
    ];
  }

  getComboInscrito() {
    this.comboInscrito = [
      { label: "", value: 0 },
      { label: "Sí", value: 1 },
      { label: "No", value: 2 }
    ];
  }
  getComboSexo() {
    this.comboSexo = [
      { label: "", value: 0 },
      { label: "Hombre", value: 1 },
      { label: "Mujer", value: 2 }
    ];
  }

  getComboEstadoCivil() {
    this.sigaServices.get("busquedaColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaColegiados_provincias").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposDireccion() {
    this.sigaServices.get("busquedaColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTiposDireccion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Busca No colegiados según los filtros
  isBuscar() {
    this.selectAll = false;
    this.historico = false;
    this.buscar = true;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.getColsResults();
    this.progressSpinner = true;
    this.buscar = true;

    this.sigaServices
      .postPaginado(
        "busquedaNoColegiados_searchNoColegiado",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.colegiadoSearch = JSON.parse(data["body"]);
          this.datos = this.colegiadoSearch.colegiadosItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getColsResults() {
    this.cols = [
      {
        field: "identificacion",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
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
        field: "estadoColegial",
        header: "censo.colegiarNoColegiados.literal.estado"
      },
      {
        field: "residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "inscrito",
        header: "censo.fusionDuplicados.colegiaciones.inscrito"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefonoFijo",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "telefonoMovil",
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

  getInfo() {
    // columnas de la tabla de datos tras la busqueda
    this.cols = [
      {
        field: "identificacion",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
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
        field: "estadoColegial",
        header: "censo.colegiarNoColegiados.literal.estado"
      },
      {
        field: "residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "inscrito",
        header: "censo.fusionDuplicados.colegiaciones.inscrito"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefonoFijo",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "telefonoMovil",
        header: "censo.datosDireccion.literal.movil"
      }
    ];

    this.datos = [
      {
        identificacion: "8771",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8772",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8773",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8774",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8775",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8776",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8777",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8778",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "8779",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "87710",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "87711",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "87712",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "87713",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
      },
      {
        identificacion: "87714",
        apellidos: "Abellan sirvent",
        nombre: "Javier",
        numeroColegiado: "1213213",
        residente: "si",
        inscrito: "no",
        estadoColegial: "12/12/1992",
        correoElectronico: "ejerci@ente.es",
        telefonoFijo: "4234234234",
        telefonoMovil: "234234234"
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
