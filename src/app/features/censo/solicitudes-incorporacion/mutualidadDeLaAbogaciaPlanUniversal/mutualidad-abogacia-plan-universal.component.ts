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
} from "../../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { Location } from "@angular/common";
import { DatosPlanUniversalItem } from "../../../../models/DatosPlanUniversalItem";
import { SolicitudIncorporacionItem } from "../../../../models/SolicitudIncorporacionItem";
import { DropdownModule, Dropdown } from "primeng/dropdown";

@Component({
  selector: "app-mutualidad-abogacia-plan-universal",
  templateUrl: "./mutualidad-abogacia-plan-universal.component.html",
  styleUrls: ["./mutualidad-abogacia-plan-universal.component.scss"]
})
export class MutualidadAbogaciaPlanUniversal implements OnInit {
  mostrarEstadoSolicitud: boolean = false;
  progressSpinner: boolean = false;
  datosDireccion: boolean = false;
  datosBancarios: boolean = false;
  datosPoliza: boolean = false;
  paisSelected: any;
  body: DatosPlanUniversalItem = new DatosPlanUniversalItem();
  provinciaSelected: any;
  poblacionSelected: any;
  pagoSelected: any;
  provincias: any[];
  poblaciones: any[];
  paises: any[];
  comboPago: any[];
  datosUdFamiliar: boolean = false;
  msgs: any;
  existeImagen: any;
  s: any;
  sl: any;
  clear: any;
  guardar: any;
  valorCheckUsuarioAutomatico: any;
  asistenciaSanitaria: any[];
  designacionBeneficiarios: any[];
  opcionesCoberturas: any[];
  ejerciente: any[];
  estadosCiviles: any[];
  formasPago: any[];
  sexos: any[];
  tiposDireccion: any[];
  tiposDomicilio: any[];
  tiposIdentificador: any[];
  fichaPersonal: boolean = false;
  fechaNacimiento: string;
  resultadosPoblaciones: string;
  codigoPostalValido: boolean;
  solicitud: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location
  ) {}

  @ViewChild("poblacion")
  dropdown: Dropdown;

  onChangePais(event) {
    this.body.idPais = event.value;
    if (event.value.value != "191") {
      this.isValidCodigoPostal();
      this.provinciaSelected = null;
      this.poblacionSelected = null;
      this.body.codigoPostal = null;
    }
  }

  ngOnInit() {
    this.solicitud = JSON.parse(sessionStorage.getItem("solicitudEnviada"));
    this.body = JSON.parse(sessionStorage.getItem("solicitudEnviada"));
    this.fechaNacimiento = this.transformaFecha(this.solicitud.fechaNacimiento);
    this.sigaServices.post("mutualidad_getEnums", "").subscribe(
      result => {
        let prueba = JSON.parse(result.body);
        if (prueba.asistenciaSanitaria != null) {
          this.asistenciaSanitaria = prueba.asistenciaSanitaria.combooItems;
          this.designacionBeneficiarios =
            prueba.designacionBeneficiarios.combooItems;
          this.opcionesCoberturas = prueba.opcionesCoberturas.combooItems;
          this.ejerciente = prueba.ejerciente.combooItems;
          this.estadosCiviles = prueba.estadosCiviles.combooItems;
          this.formasPago = prueba.formasPago.combooItems;
          this.sexos = prueba.sexos.combooItems;
          this.tiposDireccion = prueba.tiposDireccion.combooItems;
          this.tiposDomicilio = prueba.tiposDomicilio.combooItems;
          this.tiposIdentificador = prueba.tiposIdentificador.combooItems;
        }
      },
      error => {
        debugger;
        console.log(error);
      }
    );

    this.solicitud.identificador = this.solicitud.numeroIdentificacion;

    this.sigaServices
      .post("mutualidad_estadoMutualista", this.solicitud)
      .subscribe(
        result => {
          let prueba = JSON.parse(result.body);
        },
        error => {
          debugger;
          console.log(error);
        }
      );

    // Necesita boolean duplicado;
    this.solicitud.duplicado = true;

    this.sigaServices
      .post("mutualidad_estadoSolicitud", this.solicitud)
      .subscribe(
        result => {
          let prueba = JSON.parse(result.body);
        },
        error => {
          debugger;
          console.log(error);
        }
      );

    this.obtenerCuotaYCapObj();
    this.cargarCombos();
  }

  obtenerCuotaYCapObj() {
    // necesita int sexo;
    //  int cobertura;
    //  Date fechaNacimiento;
    // this.solicitud.sexo = this.body.sexo;
    if (this.solicitud.sexo == "H") {
      this.solicitud.sexo = "0";
    } else {
      this.solicitud.sexo = "1";
    }
    this.solicitud.cobertura = "1";
    this.sigaServices
      .post("mutualidad_obtenerCuotaYCapObjetivo", this.solicitud)
      .subscribe(
        result => {
          let prueba = JSON.parse(result.body);
          this.body.cuotaMensual = prueba.cuota;
          this.body.capitalObjetivo = prueba.capitalObjetivo;
        },
        error => {
          console.log(error);
        }
      );
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("-");
      let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
      return arrayDate;
    } else {
      rawDate = rawDate.slice(0, 10);
      let splitDate = rawDate.split("-");
      let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
      return arrayDate;
    }
  }

  abreCierraFichaPersonal() {
    this.fichaPersonal = !this.fichaPersonal;
  }

  cargarCombos() {
    this.sigaServices.get("solicitudIncorporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  getComboPoblacion(filtro: string) {
    this.progressSpinner = true;
    let poblacionBuscada = filtro;
    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" + this.body.idProvincia + "&filtro=" + filtro
      )
      .subscribe(
        n => {
          this.poblaciones = n.combooItems;
          this.getLabelbyFilter(this.poblaciones);
          this.dropdown.filterViewChild.nativeElement.value = poblacionBuscada;
        },
        error => {},
        () => {
          // this.isDisabledPoblacion = false;
          this.progressSpinner = false;
        }
      );
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  onChangeCodigoPostal() {
    if (this.body.idPais == "191") {
      if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
        let value = this.body.codigoPostal.substring(0, 2);
        this.provinciaSelected = value;
        let isDisabledPoblacion = false;
        if (value != this.body.idProvincia) {
          this.body.idProvincia = this.provinciaSelected;
          this.body.idPoblacion = "";
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
        this.resultadosPoblaciones = "No hay resultados";
      } else {
        this.poblaciones = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
      }
    } else {
      this.poblaciones = [];
      this.resultadosPoblaciones = "No hay resultados";
    }
  }

  deshabilitarDireccion(): boolean {
    if (this.paisSelected != "191") {
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
          console.log(this.poblaciones);
        },
        error => {
          console.log(error);
        }
      );
  }

  abreCierraEstadoSolicitud() {
    this.mostrarEstadoSolicitud = !this.mostrarEstadoSolicitud;
  }
  abreCierraDatosDireccion() {
    this.datosDireccion = !this.datosDireccion;
  }

  abreCierraDatosBancarios() {
    this.datosBancarios = !this.datosBancarios;
  }

  abreCierraDatosPoliza() {
    this.datosPoliza = !this.datosPoliza;
  }

  abreCierraDatosUdFamiliar() {
    this.datosUdFamiliar = !this.datosUdFamiliar;
  }

  backTo() {
    this.location.back();
  }
}
