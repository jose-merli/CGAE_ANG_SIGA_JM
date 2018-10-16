import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { DatosFamiliaresItem } from "../../../../models/DatosFamiliaresItem";
import { DatePipe, Location } from "@angular/common";

@Component({
  selector: "app-alter-mutua",
  templateUrl: "./alter-mutua.component.html",
  styleUrls: ["./alter-mutua.component.scss"]
})
export class AlterMutuaComponent implements OnInit {
  es: any;
  datosPropuesta: boolean = false;
  datosPersonales: boolean = false;
  datosContacto: boolean = false;
  datosCuentaBancaria: boolean = false;
  datosFamiliares: boolean = false;
  datosBeneficiarios: boolean = false;
  observaciones: boolean = false;
  mostrarInfo: boolean = false;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  msgs: any = [];
  s: any;
  residente: any;
  progressSpinner: boolean = false;
  censo: any;
  irFichaColegial: any;
  colsFisicas: any = [];

  rowsPerPage: any = [];
  datos: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  sortO: number = 1;
  sortF: string = "";
  idFamiliar: String;
  datosFamiliar: DatosFamiliaresItem = new DatosFamiliaresItem();
  nuevaFecha = Date;
  isVolver: boolean = false;
  isCrear: boolean = false;
  isEliminar: boolean = false;

  comboSexo: any[];
  comboColegios: any[];
  comboEstadoCivil: any[];
  comboModContratacion: any[];
  comboComunicacion: any[];
  comboIdioma: any[];
  comboBeneficiario: any[];
  comboParentesco: any[];
  comboTipoIdentificacion: any[];

  paises: any[];
  provincias: any[];
  TipoDireccion: any[];

  sexoSelected: any;
  estadoCivilSelected: any;
  ColegioSelected: any;
  idiomaSelected: any;
  comunicacionSelected: any;
  paisSelected: any;
  modContratacionSelected: any;
  provinciaSelected: any;
  tipoDirSelected: any;
  beneficiarioSelected: any;
  parentescoSelected: any;
  tipoIdentificacionSelected: any;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public datepipe: DatePipe,
    private location: Location
  ) {

  }

  ngOnInit() {
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();



    this.colsFisicas = [
      {
        field: "idParentesco",
        header: "Parentesco"
      },
      {
        field: "idSexo",
        header: "Sexo"
      },
      {
        field: "nombre",
        header: "Nombre"
      },
      {
        field: "apellidos",
        header: "Apellidos"
      },
      {
        field: "idTipoIdentificacion",
        header: "Tipo identificación"
      },
      {
        field: "nIdentificacion",
        header: "Número identificación"
      },
      {
        field: "fechaNacimiento",
        header: "Fecha Nacimiento"
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

    this.checkStatusInit();
  }

  cargarCombos() {
    this.comboModContratacion = [
      { label: "", value: null },
      { label: "Alter profesional joven", value: "1" },
      { label: "Alter profesional", value: "2" },
      { label: "Alter profesional plus", value: "3" }
    ];

    this.comboSexo = [
      { label: "", value: null },
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ];

    this.comboEstadoCivil = [
      { label: "", value: null },
      { label: "Casado", value: "1" },
      { label: "Soltero", value: "2" },
      { label: "Separado", value: "3" },
      { label: "Viudo", value: "4" }
    ];

    this.comboIdioma = [
      { label: "", value: null },
      { label: "Español", value: "1" },
      { label: "Catalán", value: "2" }
    ];

    this.comboComunicacion = [
      { label: "", value: null },
      { label: "Correo Electrónico", value: "1" },
      { label: "Teléfono", value: "2" },
      { label: "Carta", value: "3" }
    ];

    this.TipoDireccion = [
      { label: "", value: null },
      { label: "Residencia", value: "1" },
      { label: "Despacho", value: "2" }
    ];

    this.comboBeneficiario = [
      { label: "", value: null },
      { label: "Herederos Legales", value: "1" },
      { label: "Familiares", value: "2" },
      { label: "Otros", value: "3" }
    ];

    this.comboParentesco = [
      { label: '', value: null },
      { label: 'Hij@', value: '1' },
      { label: 'Suegr@', value: '2' },
      { label: 'Otra Relacion', value: '3' },
      { label: 'Pareja', value: '4' },
      { label: 'No Familiar', value: '5' },
      { label: 'Conyuje', value: '6' },
      { label: 'Padre', value: '7' },
    ];

    this.sigaServices.get("solicitudInciporporacion_tipoIdentificacion").subscribe(result => {
      this.comboTipoIdentificacion = result.combooItems;
    }, error => {
      console.log(error);
    });

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      result => {
        this.comboColegios = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );
  }

  onChangePais(event) { }

  /*isValidIBAN(): boolean {
    if (
        (this.solicitudEditar.iban != null || this.solicitudEditar.iban != undefined)) {
        this.solicitudEditar.iban = this.solicitudEditar.iban.replace(/\s/g, "");
        return (
            this.solicitudEditar.iban &&
            typeof this.solicitudEditar.iban === "string" &&
            // /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(
            ///[A-Z]{2}\d{22}?[\d]{0,2}/.test(this.body.iban)
            /^ES\d{22}$/.test(this.solicitudEditar.iban)
        );
    }
  }*/

  irDatosFamiliar(id) {
    //console.log(id[0].fechaInicio);
    this.datosFamiliar = new DatosFamiliaresItem();
    if (id[0].idFamiliar == null && id[0].idFamiliar != "") {
      this.datosFamiliar.idFamiliar = id[0].idFamiliar;
      //this.nuevafecha = id[0].fechaInicio;
      //id[0].fechaInicio = "";
      //this.newRetencion.descripcionRetencion = id[0].idRetencion;
      // this.onChangeDrop(this.newRetencion.descripcionRetencion);
      //id[0].descripcionRetencion = "";
    }
  }

  crear() {
    this.isVolver = false;
    this.isCrear = true;
    this.isEliminar = true;
    this.datosFamiliar = new DatosFamiliaresItem();
    if (this.datos == null || this.datos == undefined || this.datos.length == 0) {
      this.datos = [];
    } else {
      let value = this.table.first;
    }

    let dummy = {
      idFamiliar: this.table.first,
      idParentesco: "",
      idSexo: "",
      nombre: "",
      apellidos: "",
      idTipoIdentificacion: "",
      nIdentificacion: "",
      fechaNacimiento: undefined
    };
    this.datos = [dummy, ...this.datos];

    // this.table.reset();
    let event = { field: "nombre", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  confirmEdit() {
    this.datosFamiliar.idFamiliar = this.idFamiliar;
    this.datosFamiliar.idParentesco = this.parentescoSelected;
    this.datosFamiliar.idSexo = this.sexoSelected;
    this.datosFamiliar.idTipoIdentificacion = this.tipoIdentificacionSelected;

    this.datos.forEach((value: any, key: number) => {
      if (key == value.idFamiliar) {
        this.datos[key].idParentesco = this.parentescoSelected;
        this.datos[key].idSexo = this.parentescoSelected;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
        this.datos[key].fechaNacimiento = this.datepipe.transform(
          new Date(this.datos[key].fechaNacimiento),
          "dd/MM/yyyy"
        );
      }
    });
    this.isCrear = false;
  }

  changeSort(event) {
    this.sortF = "nombre";
    this.sortO = 1;
    this.table.sortMultiple();
  }
  checkStatusInit() {
    this.cols = this.colsFisicas;
  }

  mostarDatosPropuesta() {
    this.datosPropuesta = !this.datosPropuesta;
  }
  mostarDatosPersonales() {
    this.datosPersonales = !this.datosPersonales;
  }
  mostrarDatosContacto() {
    this.datosContacto = !this.datosContacto;
  }
  mostrarDatosBancarios() {
    this.datosCuentaBancaria = !this.datosCuentaBancaria;
  }
  mostrarFamiliares() {
    this.datosFamiliares = !this.datosFamiliares;
  }
  mostrarDatosBeneficiarios() {
    this.datosBeneficiarios = !this.datosBeneficiarios;
  }

  mostrarObservaciones() {
    this.observaciones = !this.observaciones;
  }

  mostarPopUp() {
    this.mostrarInfo = true;
  }

  clear() {
    this.msgs = [];
  }
  backTo() {
    this.location.back();
  }

  onChangeTipoBenef(event) {
    console.log(this.beneficiarioSelected);
  }

}
