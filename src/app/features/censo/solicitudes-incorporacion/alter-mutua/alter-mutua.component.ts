import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";


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
  rowsPerPage: any = [];
  datos: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  colsFisicas: any[];

  comboSexo: any[];
  comboColegios: any[];
  comboEstadoCivil: any[];
  comboModContratacion: any[];
  comboComunicacion: any[];
  comboIdioma: any[];
  comboBeneficiario: any[];

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
  BeneficiarioSelected: any;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();

    this.colsFisicas = [
      {
        field: "fechaInicio",
        header: "administracion.auditoriaUsuarios.fechaDesde"
      },
      {
        field: "fechaFin",
        header: "administracion.auditoriaUsuarios.fechaHasta"
      },
      {
        field: "descripcionRetencion",
        header: "factSJCS.datosPagos.literal.tipoRetencion"
      },
      {
        field: "porcentajeRetencion",
        header: "factSJCS.datosPagos.literal.porcentajeRetencion"
      }
    ];
  }

  cargarCombos() {

    this.comboModContratacion = [
      { label: '', value: null },
      { label: 'Alter profesional joven', value: '1' },
      { label: 'Alter profesional', value: '2' },
      { label: 'Alter profesional plus', value: '3' }
    ];

    this.comboSexo = [
      { label: '', value: null },
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ]

    this.comboEstadoCivil = [
      { label: '', value: null },
      { label: 'Casado', value: '1' },
      { label: 'Soltero', value: '2' },
      { label: 'Separado', value: '3' },
      { label: 'Viudo', value: '4' }
    ];

    this.comboIdioma = [
      { label: '', value: null },
      { label: 'Español', value: '1' },
      { label: 'Catalán', value: '2' }
    ];

    this.comboComunicacion = [
      { label: '', value: null },
      { label: 'Correo Electrónico', value: '1' },
      { label: 'Teléfono', value: '2' },
      { label: 'Carta', value: '3' }
    ];

    this.TipoDireccion = [
      { label: '', value: null },
      { label: 'Residencia', value: '1' },
      { label: 'Despacho', value: '2' }
    ];

    this.comboBeneficiario = [
      { label: '', value: null },
      { label: 'Herederos Legales', value: '1' },
      { label: 'Familiares', value: '2' },
      { label: 'Otros', value: '3' }
    ];

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      result => {
        this.comboColegios = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_pais").subscribe(result => {
      this.paises = result.combooItems;
    }, error => {
      console.log(error);
    });

    this.sigaServices.get("integrantes_provincias").subscribe(result => {
      this.provincias = result.combooItems;
    }, error => {
      console.log(error);
    });

  }

  onChangePais(event) {

  }

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
}
