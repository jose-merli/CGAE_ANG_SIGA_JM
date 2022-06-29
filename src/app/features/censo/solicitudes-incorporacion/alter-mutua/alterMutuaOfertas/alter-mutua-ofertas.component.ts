import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  SecurityContext
} from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { DatosFamiliaresItem } from "../../../../../models/DatosFamiliaresItem";
import { DatePipe, Location } from "@angular/common";
import { AlterMutuaItem } from "../../../../../models/AlterMutuaItem";
import { FamiliarItem } from "../../../../../models/FamiliarItem";
import { SolicitudIncorporacionItem } from "../../../../../models/SolicitudIncorporacionItem";
import { AseguradoItem } from "../../../../../models/AseguradoItem";
import { Message } from "primeng/components/common/api";
import { DomSanitizer } from "../../../../../../../node_modules/@angular/platform-browser";
import { DropdownModule, Dropdown } from "primeng/dropdown";
import { ConfirmationService } from "primeng/api";
import { CommonsService } from "../../../../../_services/commons.service";

@Component({
  selector: "app-alter-mutua-ofertas",
  templateUrl: "./alter-mutua-ofertas.component.html",
  styleUrls: ["./alter-mutua-ofertas.component.scss"]
})
export class AlterMutuaOfertasComponent implements OnInit {
  es: any;
  existeImagen: any;
  fichaColegiacion: any;
  Identificador: any;
  beneficiarioSelected: any;
  datosPropuesta: boolean = false;
  datosPersonales: boolean = false;
  datosContacto: boolean = false;
  datosCuentaBancaria: boolean = false;
  datosFamiliares: boolean = false;
  datosBeneficiarios: boolean = false;
  datosEstadoSolicitud: boolean = false;
  observaciones: boolean = false;
  mostrarInfo: boolean = false;
  tienePropuesta: boolean = true;
  tieneSolicitud: boolean = false;
  showSolicitarSeguro: boolean = false;
  deshabilitarDireccion: boolean = false;
  poblaciones: any[];
  propuestas: any;
  estadoSolicitudResponse: any;
  codigoPostalValido: boolean;
  selectedDatos1: any;
  poblacionYaObtenida: boolean = false;
  existeSolicitud: boolean = false;

  @ViewChild("table")
  table;
  @ViewChild("tableB")
  tableB;
  selectedDatos;
  selectedDatosB;
  cols: any = [];
  progressSpinner: boolean = false;
  colsFisicas: any = [];
  datosAlter: AlterMutuaItem = new AlterMutuaItem();
  familiares: Array<FamiliarItem> = new Array<FamiliarItem>();
  herederosList: Array<FamiliarItem> = new Array<FamiliarItem>();
  asegurado: AseguradoItem = new AseguradoItem();
  herederos: boolean = false;
  tipoPropuesta: number;
  msgs: Message[] = [];

  rowsPerPage: any = [];
  datos: any;
  datosB: any;
  numSelected: number = 0;
  selectedItem2: number = 10;
  selectedItem1: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  sortO: number = 1;
  sortF: string = "";
  idFamiliar: String;
  datosFamiliar: DatosFamiliaresItem = new DatosFamiliaresItem();
  datosHeredero: DatosFamiliaresItem = new DatosFamiliaresItem();
  nuevaFecha = Date;
  isVolver: boolean = false;
  isCrearA: boolean = false;
  isCrearB: boolean = false;
  isEliminar: boolean = false;
  tarifa: any;
  infoPropuesta: any;
  resultadosPoblaciones: any;
  comboSexo: any[];
  comboColegios: any[];
  comboEstadoCivil: any[];
  comboModContratacion: any[] = [];
  comboComunicacion: any[];
  comboIdioma: any[];
  comboBeneficiario: any[];
  comboParentesco: any[];
  comboTipoIdentificacion: any[];
  comboTiposSolicitud: any[];

  paises: any[];
  provincias: any[];
  TipoDireccion: any[];

  sexoSelected: any;
  sexoSelectedTabla: any;
  estadoCivilSelected: any;
  ColegioSelected: any;
  idiomaSelected: any;
  comunicacionSelected: any;
  paisSelected: any;
  modContratacionSelected: any;
  provinciaSelected: any;
  tipoDirSelected: any;
  parentescoSelected: any;
  tipoIdentificacionSelected: any;
  tipoSolicitudSelected: any;
  tipoEjercicioSelected: any;
  parentescoSend: any;
  datosSolicitud: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  ibanValido: boolean;
  provinciaDesc: any;
  poblacionDesc: any;

  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public datepipe: DatePipe,
    private location: Location,
    private domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
  ) { }
  @ViewChild("poblacion") dropdown: Dropdown;

  ngOnInit() {
    this.progressSpinner = true;
    this.es = this.translateService.getCalendarLocale();

    if (sessionStorage.getItem("datosSolicitud") != null) {
      this.datosSolicitud = JSON.parse(
        sessionStorage.getItem("datosSolicitud")
      );
      this.datosSolicitud.nombre = this.datosSolicitud.soloNombre;
      this.datosSolicitud.apellidos = this.datosSolicitud.apellido1 + " " + this.datosSolicitud.apellido2;
      //Reta es tipo 1
      this.tipoPropuesta = 1;
      //ofertas es tipo 3

      /*if (this.datosSolicitud.tipoIdentificacion.lastIndexOf("NIF") == 0)
        tipoIdenficador = 0
      else
        tipoIdenficador = 1*/

      let estadoSolicitud = {
        identificador: this.datosSolicitud.numeroIdentificacion,
        idSolicitud: this.datosSolicitud.idSolicitud,
        duplicado: false
      };
      // estadoSolicitud.identificador = "40919463W";

      this.sigaServices
        .post("alterMutua_estadoSolicitud", estadoSolicitud)
        .subscribe(
          result => {
            this.estadoSolicitudResponse = JSON.parse(result.body);
            this.progressSpinner = false;
          },
          error => {
            console.log(error);
          },
          () => {
            if (this.estadoSolicitudResponse.error == false) {
              this.tieneSolicitud = true;
              this.existeSolicitud = true;
              this.buscarPropuestas();
            } else {
              this.showSolicitarSeguro = true;
            }
          }
        );
        
        if (this.datosSolicitud.tipoDireccion == "Residencia") {
          this.tipoDirSelected = { value: 1 };
        } else if (this.datosSolicitud.tipoDireccion == "Despacho") {
          this.tipoDirSelected = { value: 2 };
        }

        this.comunicacionSelected = { value: 1 };

        switch(this.datosSolicitud.idiomaPref) {
          case "1":
            this.idiomaSelected = { value: 1 };
            break;
          case "2":
            this.idiomaSelected = { value: 2 };
            break;
          default:
            this.idiomaSelected = { value: 1 };
        }

        this.autogenerarDatosInit();
    }

    this.colsFisicas = [
      {
        field: "idParentesco",
        header: "informes.solicitudAsistencia.parentesco"
      },
      {
        field: "idSexo",
        header: "censo.busquedaClientesAvanzada.literal.sexo"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
      },
      {
        field: "idTipoIdentificacion",
        header: "censo.SolicitudIncorporacion.literal.tipoIdentificacion"
      },
      {
        field: "nIdentificacion",
        header: "censo.solicitudincorporacion.nIdentificacion"
      },
      {
        field: "fechaNacimiento",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
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
    if (this.propuestas.propuestas != null) {
      for (let i = 0; i < this.propuestas.propuestas.length; i++) {
        if (i == 0) {
          let item = { label: "", value: "" };
          this.comboModContratacion.push(item);
        }
        let item = {
          label: this.propuestas.propuestas[i].nombre,
          value: this.propuestas.propuestas[i].idPaquete
        };
        this.comboModContratacion.push(item);
      }
      this.comboModContratacion = [...this.comboModContratacion];
    }
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
      { label: "Español", value: 1 },
      { label: "Catalán", value: 2 }
    ];

    this.comboComunicacion = [
      { label: "", value: null },
      { label: "Correo Electrónico", value: 1 },
      { label: "Teléfono", value: 2 },
      { label: "Carta", value: 3 }
    ];

    this.TipoDireccion = [
      { label: "", value: null },
      { label: "Residencia", value: 1 },
      { label: "Despacho", value: 2 }
    ];

    this.comboBeneficiario = [
      { label: "", value: null },
      { label: "Herederos Legales", value: "1" },
      { label: "Familiares", value: "2" },
      { label: "Otros", value: "3" }
    ];

    this.comboParentesco = [
      { label: "", value: null },
      { label: "Hij@", value: 1 },
      { label: "Suegr@", value: 14 },
      { label: "Otra Relacion", value: 16 },
      { label: "Pareja", value: 17 },
      { label: "No Familiar", value: 18 },
      { label: "Conyuje", value: 3 },
      { label: "Padre", value: 4 }
    ];

    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          this.comboTipoIdentificacion = result.combooItems;
        },
        error => {
          console.log(error);
        }
      );

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      result => {
        this.comboColegios = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudIncorporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.provincias = n.combooItems;
      },
      error => {
        console.log(error);
      },
      () => {
        this.mostrarDatosContacto();
      }
    );

    this.sigaServices.get("solicitudIncorporacion_tipoSolicitud").subscribe(
      result => {
        this.comboTiposSolicitud = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  buscarPropuestas() {
    this.progressSpinner = true;
    //this.tieneSolicitud = false;

    let datosPropuesta = {
      tipoIdentificador: this.datosSolicitud.tipoIdentificacion,
      identificador: this.datosSolicitud.numeroIdentificacion,
      fechaNacimiento: this.datosSolicitud.fechaNacimiento,
      sexo: this.datosSolicitud.sexo,
      tipoPropuesta: this.tipoPropuesta
    };
    this.sigaServices.post("alterMutua_propuestas", datosPropuesta).subscribe(
      result => {
        this.propuestas = JSON.parse(result.body);
        this.propuestas.mensaje = this.domSanitizer.bypassSecurityTrustHtml(
          this.propuestas.mensaje
        );
      },
      error => {
        console.log(error);
        this.showFail("No es posible solicitar el seguro ");
      },
      () => {
        if (this.propuestas.error == true) {
          this.tienePropuesta = false;
        } else {
          this.tienePropuesta = true;
          this.showSolicitarSeguro = false;
        }
        this.cargarCombos();
        this.tratarDatos();
        this.modalidadInit();
        this.progressSpinner = false;
      }
    );
    this.buscarPoblacionInit(this.datosSolicitud.nombrePoblacion);
    this.mostarDatosPropuesta();
    this.mostrarDatosBancarios();
  }

  tratarDatos() {
    this.asegurado.apellidos = this.datosSolicitud.apellidos;
    this.asegurado.cp = this.datosSolicitud.codigoPostal;
    this.asegurado.domicilio = this.datosSolicitud.domicilio;
    this.asegurado.estadoCivil = this.datosSolicitud.estadoCivil;
    this.asegurado.fax = this.datosSolicitud.fax1;
    this.asegurado.fechaNacimiento = new Date(
      this.datosSolicitud.fechaNacimiento
    );
    this.asegurado.iban = this.datosSolicitud.iban;
    this.asegurado.identificador = this.datosSolicitud.numeroIdentificacion;
    this.asegurado.mail = this.datosSolicitud.correoElectronico;
    this.asegurado.movil = this.datosSolicitud.movil;
    this.asegurado.nombre = this.datosSolicitud.nombre;
    this.asegurado.pais = this.datosSolicitud.idPais;
    this.asegurado.poblacion = this.datosSolicitud.nombrePoblacion;
    this.asegurado.provincia = this.datosSolicitud.idProvincia;
    this.asegurado.sexo = this.datosSolicitud.sexo;
    this.asegurado.telefono = this.datosSolicitud.telefono1;
    this.datosAlter.observaciones = this.datosSolicitud.observaciones;
    this.provinciaSelected = { value: this.datosSolicitud.idProvincia };
    this.paisSelected = { value: this.datosSolicitud.idPais };
    this.paisSelected.value == "191"
      ? (this.deshabilitarDireccion = false)
      : (this.deshabilitarDireccion = true);
    this.sexoSelected = { value: this.datosSolicitud.sexo };
    this.estadoCivilSelected = { value: this.datosSolicitud.idEstadoCivil };
    this.provinciaSelected = { value: this.datosSolicitud.idProvincia };
    this.ColegioSelected = { value: this.datosSolicitud.idInstitucion };
    this.tipoEjercicioSelected = { value: this.datosSolicitud.idTipo };
  }
  onChangePais(event) {
    this.paisSelected = { value: event.value.value };
    if (event.value.value != "191") {
      this.provinciaSelected = null;
      this.asegurado.poblacion = null;
      this.asegurado.cp = null;
      this.deshabilitarDireccion = true;
    } else {
      this.deshabilitarDireccion = false;
    }
  }

  isValidIBAN(): boolean {
    if (this.asegurado.iban != null || this.asegurado.iban != undefined) {
      this.asegurado.iban = this.asegurado.iban.replace(/\s/g, "");
      return (
        this.asegurado.iban &&
        typeof this.asegurado.iban === "string" &&
        /^ES\d{22}$/.test(this.asegurado.iban)
      );
    }
  }

  irDatosFamiliar(id) {
    this.datos.forEach((value: any, key: number) => {
      if (key == id) {
        this.datos[key].idParentesco = this.parentescoSelected;
        this.datos[key].idSexo = this.sexoSelectedTabla;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
      }
    });
  }

  isInvalidFamiliar(): boolean {
    if (
      this.datosFamiliar.idSexo != "" &&
      this.datosFamiliar.nombre != "" &&
      this.datosFamiliar.apellidos != "" &&
      this.datosFamiliar.idParentesco != "" &&
      this.datosFamiliar.idTipoIdentificacion != "" && this.datosFamiliar.idTipoIdentificacion != undefined &&
      this.datosFamiliar.nIdentificacion != "" &&
      this.datosFamiliar.fechaNacimiento != undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  // isGuardar(){
  //   if(this)
  // }

  isInvalidHeredero(): boolean {
    if (
      this.datosHeredero.idSexo != "" &&
      this.datosHeredero.nombre != "" &&
      this.datosHeredero.apellidos != "" &&
      this.datosHeredero.idParentesco != "" &&
      this.datosHeredero.idTipoIdentificacion != "" &&
      this.datosHeredero.nIdentificacion != "" &&
      this.datosHeredero.fechaNacimiento != undefined
    ) {
      return false;
    } else {
      return true;
    }
  }
  irDatosHeredero(id) {
    this.datosB.forEach((value: any, key: number) => {
      if (key == id) {
        this.datosB[key].idParentesco = this.parentescoSelected;
        this.datosB[key].idSexo = this.sexoSelectedTabla;
        this.datosB[key].nombre = this.datosFamiliar.nombre;
        this.datosB[key].apellidos = this.datosFamiliar.apellidos;
        this.datosB[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datosB[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datosB[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
      }
    });
  }

  onchangeParentesco(event) {
    if (event) {
      this.parentescoSelected = event.value.label;
    }
  }

  onchangeSexo(event) {
    if (event) {
      this.sexoSelectedTabla = event.value.label;
    }
  }

  onchangeIdentificacion(event) {
    if (event) {
      this.tipoIdentificacionSelected = event.value.label;
    }
  }

  crear() {
    this.isCrearA = true;
    this.datosFamiliar = new DatosFamiliaresItem();
    if (
      this.datos == null ||
      this.datos == undefined ||
      this.datos.length == 0
    ) {
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

  crearB() {
    this.isCrearB = true;
    this.datosHeredero = new DatosFamiliaresItem();
    if (
      this.datosB == null ||
      this.datosB == undefined ||
      this.datosB.length == 0
    ) {
      this.datosB = [];
    } else {
      let value = this.table.first;
    }

    let dummy = {
      idFamiliar: this.tableB.first,
      idParentesco: "",
      idSexo: "",
      nombre: "",
      apellidos: "",
      idTipoIdentificacion: "",
      nIdentificacion: "",
      fechaNacimiento: undefined
    };
    this.datosB = [dummy, ...this.datosB];

    // this.table.reset();
    let event = { field: "nombre", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  confirmEdit() {
    this.datos.forEach((value: any, key: number) => {
      if (key == value.idFamiliar) {
        this.datos[key].idFamiliar = value.idFamiliar;
        this.datos[key].idParentesco = this.parentescoSelected;
        this.datos[key].idSexo = this.sexoSelectedTabla;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
      }
    });
    this.isCrearA = false;

    this.selectedDatos = [];
    this.selectAll = false;
  }

  confirmEditB() {
    this.datosB.forEach((value: any, key: number) => {
      if (key == value.idFamiliar) {
        this.datosB[key].idFamiliar = value.idFamiliar;
        this.datosB[key].idParentesco = this.parentescoSelected;
        this.datosB[key].idSexo = this.sexoSelectedTabla;
        this.datosB[key].nombre = this.datosHeredero.nombre;
        this.datosB[key].apellidos = this.datosHeredero.apellidos;
        this.datosB[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datosB[key].nIdentificacion = this.datosHeredero.nIdentificacion;
        this.datosB[key].fechaNacimiento = this.datosHeredero.fechaNacimiento;
      }
    });
    this.isCrearB = false;
    this.selectedDatosB = [];
    this.selectAll = false;
  }

  enviarDatosAlter() {
    this.progressSpinner = true;
    this.datosAlter.idPaquete = this.modContratacionSelected.value;
    this.asegurado.modContratacion = this.modContratacionSelected.value;
    this.asegurado.sexo = this.sexoSelected.value;
    this.asegurado.estadoCivil = this.estadoCivilSelected.value;
    this.asegurado.colegio = this.ColegioSelected.value;
    this.asegurado.medioComunicacion = this.comunicacionSelected.value;
    this.asegurado.idioma = this.idiomaSelected.value;
    this.asegurado.pais = this.paisSelected.value;
    this.asegurado.provincia = this.provinciaSelected;
    this.asegurado.idPais = this.paisSelected.value;
    this.asegurado.idProvincia = this.provinciaSelected;
    this.asegurado.idPoblacion = this.poblacionDesc.value;
    this.asegurado.tipoDireccion = this.tipoDirSelected.value;
    this.asegurado.poblacion = this.poblacionDesc.label;
    this.asegurado.provincia = this.provinciaDesc.label;
    this.asegurado.tipoEjercicio = this.tipoEjercicioSelected.value;
    if (this.datosSolicitud.tipoIdentificacion.lastIndexOf("NIF") == 0)
      this.asegurado.tipoIdentificador = 0;
    else this.asegurado.tipoIdentificador = 1;
    this.asegurado.identificador = "40919463W";

    this.datosAlter.asegurado = this.asegurado;

    if (this.herederos == true) {
      if (this.datosB != null) {
        this.datosB.forEach(element => {
          let heredero: FamiliarItem = new FamiliarItem();
          heredero.nombre = element.nombre;
          heredero.apellido = element.apellidos;
          heredero.parentesco = element.idParentesco;
          if (element.idSexo == "Hombre") {
            heredero.sexo = 1;
          } else {
            heredero.sexo = 2;
          }
          heredero.tipoIdentificacion = element.idTipoIdentificacion;
          heredero.identificacion = element.nIdentificacion;
          heredero.fechaNacimiento = element.fechaNacimiento;
          this.herederosList.push(heredero);
        });
        this.datosAlter.herederos = this.herederosList;
      }
    }
    if (this.datos != null) {
      this.datos.forEach(element => {
        let familiar: FamiliarItem = new FamiliarItem();
        familiar.nombre = element.nombre;
        familiar.apellido = element.apellidos;
        familiar.parentesco = element.idParentesco;
        if (element.idSexo == "Hombre") {
          familiar.sexo = 1;
        } else {
          familiar.sexo = 2;
        }
        familiar.tipoIdentificacion = element.idTipoIdentificacion;
        familiar.identificacion = element.nIdentificacion;
        familiar.fechaNacimiento = element.fechaNacimiento;
        this.familiares.push(familiar);
      });
      this.datosAlter.familiares = this.familiares;
    }


    this.sigaServices
      .post("alterMutua_solicitudAlter", this.datosAlter)
      .subscribe(
        result => {
          this.propuestas = JSON.parse(result.body);
        },
        error => {
          console.log(error);
        },
        () => {
          if (this.propuestas.error == true) {
            this.tienePropuesta = false;
          } else {
            this.tienePropuesta = true;
          }
          if (this.propuestas.error == false) {
            if (this.propuestas.mensaje != null) {
              this.propuestas.mensaje = this.domSanitizer.bypassSecurityTrustHtml(
                this.propuestas.mensaje
              );
            } else {
              this.showSuccess(
                "La solicitud se ha enviado correctamente a Alter Mútua"
              );
            }
          } else {
            if (this.propuestas.mensaje != null) {
              this.propuestas.mensaje = this.domSanitizer.bypassSecurityTrustHtml(
                this.propuestas.mensaje
              );
            } else {
              this.showFail(
                "La solicitud no se ha enviado correctamente a Alter Mútua"
              );
            }
          }
          this.progressSpinner = false;
        }
      );
  }

  changeSort(event) {
    this.sortF = "nombre";
    this.sortO = 1;
    this.table.sortMultiple();
  }
  checkStatusInit() {
    this.cols = this.colsFisicas;
  }

  isEnviar(): boolean {
    if (
      this.modContratacionSelected != null &&
      this.modContratacionSelected != "" &&
      this.ColegioSelected != null &&
      this.ColegioSelected != "" &&
      this.comunicacionSelected != null &&
      this.comunicacionSelected != "" &&
      this.idiomaSelected != null &&
      this.idiomaSelected != "" &&
      this.asegurado.telefono != null &&
      this.asegurado.domicilio &&
      this.paisSelected != null &&
      this.paisSelected != "" &&
      this.asegurado.movil &&
      this.tipoDirSelected != null &&
      this.tipoDirSelected != "" &&
      this.asegurado.mail != null &&
      this.asegurado.iban != "" &&
      this.asegurado.iban != undefined &&
      this.tipoEjercicioSelected != null &&
      this.tipoEjercicioSelected != "" &&
      this.existeSolicitud != true
    ) {
      return true;
    } else {
      return false;
    }
  }

  obtenerProvinciaDesc(e) {
    this.provinciaDesc = this.provincias.find(item => item.value === e.value);
  }

  obtenerPoblacionDesc(e) {
    this.poblacionDesc = this.poblaciones.find(item => item.value === e.value);
    if (this.provinciaSelected != undefined) this.provinciaDesc = this.provincias.find(item => item.value === this.provinciaSelected);
  }

  obtenerPoblacionDescInit(poblacion) {
    this.poblacionDesc = this.poblaciones.find(item => item.value === poblacion);
    this.asegurado.poblacion = this.poblacionDesc.label;
    if (this.provinciaSelected != undefined) this.provinciaDesc = this.provincias.find(item => item.value === this.provinciaSelected);
  }

  onchangeModalidad(event) {
    if (event) {
      this.modContratacionSelected = event.value;
      for (let i = 0; i < this.propuestas.propuestas.length; i++) {
        if (event.value.value == this.propuestas.propuestas[i].idPaquete) {
          this.tarifa = this.propuestas.propuestas[i].tarifa;
          this.infoPropuesta = {
            tarifa: this.propuestas.propuestas[i].tarifa,
            breve: this.propuestas.propuestas[i].breve,
            descripcion: this.domSanitizer.bypassSecurityTrustHtml(
              this.propuestas.propuestas[i].descripcion
            )
          };
        }
      }
      if (event.value.value == "") {
        this.tarifa = null;
      }
    }
  }

  modalidadInit() {
    if (this.propuestas.propuestas.length > 0) {
      let modalidad = this.propuestas.propuestas[0];

      this.modContratacionSelected = { value: modalidad.idPaquete };

      this.tarifa = modalidad.tarifa;
      this.infoPropuesta = {
        tarifa: modalidad.tarifa,
        breve: modalidad.breve,
        descripcion: this.domSanitizer.bypassSecurityTrustHtml(
          modalidad.descripcion
        )
      };
    }
  }

  getComboPoblacion(filtro: string) {
    this.progressSpinner = true;
    let poblacionBuscada = filtro;
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + this.asegurado.provincia + "&filtro=" + filtro
      )
      .subscribe(
        n => {
          this.poblaciones = n.combooItems;
          this.getLabelbyFilter(this.poblaciones);
          this.dropdown.filterViewChild.nativeElement.value = poblacionBuscada;
        },
        error => { },
        () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;
        }
      );
  }

  getComboPoblacionInit(filtro: string) {
    this.progressSpinner = true;
    let poblacionBuscada = filtro;
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + this.datosSolicitud.idProvincia + "&filtro=" + filtro
      )
      .subscribe(
        n => {
          this.poblaciones = n.combooItems;
          this.getLabelbyFilter(this.poblaciones);
          this.dropdown.filterViewChild.nativeElement.value = poblacionBuscada;
        },
        error => { },
        () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;
        }
      );
  }

  isValidCodigoPostal(): boolean {
    return (
      this.asegurado.cp &&
      typeof this.asegurado.cp === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.asegurado.cp)
    );
  }

  onChangeCodigoPostal() {
    if (this.asegurado.pais == "191") {
      if (this.isValidCodigoPostal() && this.asegurado.cp.length == 5) {
        let value = this.asegurado.cp.substring(0, 2);
        this.provinciaSelected = value;
        let isDisabledPoblacion = false;
        if (value != this.asegurado.provincia) {
          this.asegurado.provincia = this.provinciaSelected;
          this.asegurado.poblacion = "";
          this.poblaciones = [];
        }
        this.codigoPostalValido = true;
      } else {
        this.codigoPostalValido = false;
      }
    }
  }

  getLabelbyFilter(array) {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
  para poder filtrar el dato con o sin estos caracteres*/
    array.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null) {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.poblaciones = [];
        this.resultadosPoblaciones = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.almenosTres");
      }
    } else {
      this.poblaciones = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  buscarPoblacionInit(poblacion) {
    if (poblacion !== null) {
      if (poblacion.length >= 3) {
        this.getComboPoblacionInit(poblacion);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.poblaciones = [];
        this.resultadosPoblaciones = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.almenosTres");
      }
    } else {
      this.poblaciones = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }
  // obtenerProvinciaDesc(e) {
  //   this.provinciaDesc = e.label;
  // }
  // obtenerPoblacionDesc(e) {
  //   this.poblacionDesc = this.poblaciones.find(item => item.value === e.value);
  // }

  deshabilitaDireccion(): boolean {
    if (this.provinciaSelected == "") {
      return true;
    } else {
      return false;
    }
  }
  onChangeProvincia(event) {
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + event.value.value
      )
      .subscribe(
        result => {
          this.poblaciones = result.combooItems;
          this.progressSpinner = false;
        },
        error => {
          console.log(error);
        }
      );
  }


  autogenerarDatos() {
    if (this.asegurado.iban != null && this.asegurado.iban != "") {
      var ccountry = this.asegurado.iban.substring(0, 2);
      if (ccountry == "ES") {
        if (this.isValidIBAN()) {
          this.recuperarBicBanco();

          this.ibanValido = true;
        } else {
          this.asegurado.bic = "";

          this.ibanValido = false;
        }
      }
    } else {
      this.asegurado.bic = "";

      this.ibanValido = false;
    }
  }

  autogenerarDatosInit() {
    this.asegurado.iban = this.datosSolicitud.iban;
    if (this.asegurado.iban != null && this.asegurado.iban != "") {
      var ccountry = this.asegurado.iban.substring(0, 2);
      if (ccountry == "ES") {
        if (this.isValidIBAN()) {
          this.recuperarBicBanco();

          this.ibanValido = true;
        } else {
          this.asegurado.bic = "";

          this.ibanValido = false;
        }
      }
    } else {
      this.asegurado.bic = "";

      this.ibanValido = false;
    }
  }


  validarBIC(): boolean {
    var ccountry = this.asegurado.iban.substring(0, 2);
    if (
      this.asegurado.bic != null &&
      this.asegurado.bic != undefined &&
      this.asegurado.bic != "" &&
      this.asegurado.bic.length == 11 &&
      this.asegurado.bic.charAt(4) == ccountry.charAt(0) &&
      this.asegurado.bic.charAt(5) == ccountry.charAt(1)
    ) {
      return true;
    } else {
      return false;
    }
  }

  recuperarBicBanco() {
    this.sigaServices
      .post("datosCuentaBancaria_BIC_BANCO", this.asegurado)
      .subscribe(
        data => {
          let bodyBancoBicSearch = JSON.parse(data["body"]);
          let bodyBancoBic = bodyBancoBicSearch.bancoBicItem[0];

          this.asegurado.banco = bodyBancoBic.banco;
          this.asegurado.bic = bodyBancoBic.bic;
          this.asegurado.iban = this.asegurado.iban.replace(/\s/g, "");
          this.asegurado.dc = this.asegurado.iban.substring(12, 14);
          this.asegurado.sucursal = this.asegurado.iban.substring(8, 12);
          // this.editar = false;
        },
        error => {
          let bodyBancoBicSearch = JSON.parse(error["error"]);
          this.showFailMensaje(bodyBancoBicSearch.error.message.toString());
        }
      );
  }

  showFailMensaje(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: mensaje
    });
  }

  mostarDatosPropuesta() {
    this.datosPropuesta = !this.datosPropuesta;
  }
  mostarDatosPersonales() {
    this.datosPersonales = !this.datosPersonales;
  }
  mostrarDatosContacto() {
    this.datosContacto = !this.datosContacto;
    this.onChangeCodigoPostal();
    if (this.poblacionYaObtenida != true) {
      this.obtenerPoblacionDescInit(this.datosSolicitud.idPoblacion);
      this.poblacionYaObtenida = true;
    }
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

  mostrarDatosEstado() {
    this.datosEstadoSolicitud = !this.datosEstadoSolicitud;
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

  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }

  showSuccess(message) {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Solicitud enviada",
      detail: message
    });
  }

  backTo() {
    this.location.back();
  }

  onChangeTipoBenef(event) {
    if (event.value.value == "3") {
      this.herederos = true;
    } else {
      this.herederos = false;
      this.datosB = [];
    }
  }

  fillFechaNacimientoAsegurado(event) {
    this.asegurado.fechaNacimiento = event;
  }

  fillFechaNacimientoFamiliar(event) {
    this.datosFamiliar.fechaNacimiento = event;
  }

  fillFechaNacimientoHeredero(event) {
    this.datosHeredero.fechaNacimiento = event;
  }

  changeEmail() {
    this.emailValido = this.commonsService.validateEmail(this.asegurado.mail);
  }

  changeTelefono1() {
    this.tlf1Valido = this.commonsService.validateTelefono(this.asegurado.telefono);
  }

  changeTelefono2() {
    this.tlf2Valido = this.commonsService.validateTelefono(this.asegurado.telefono2);
  }

  changeMovil() {
    this.mvlValido = this.commonsService.validateMovil(this.asegurado.movil);
  }

  changeFax() {
    this.faxValido = this.commonsService.validateFax(this.asegurado.fax);
  }
}

