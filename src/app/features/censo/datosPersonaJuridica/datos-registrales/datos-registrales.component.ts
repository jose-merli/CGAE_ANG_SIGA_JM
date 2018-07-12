import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { NgModule } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { esCalendar } from "../../../../utils/calendar";
import { Message } from "primeng/components/common/api";

import { SigaServices } from "./../../../../_services/siga.service";
import { cardService } from "./../../../../_services/cardSearch.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { HeaderGestionEntidadService } from "./../../../../_services/headerGestionEntidad.service";
import { Subscription } from "rxjs/Subscription";

/*** COMPONENTES ***/
import { DatosRegistralesItem } from "./../../../../../app/models/DatosRegistralesItem";
import { DatosRegistralesObject } from "./../../../../../app/models/DatosRegistralesObject";
import { DatosPersonaJuridicaComponent } from "../../datosPersonaJuridica/datosPersonaJuridica.component";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { ComboItem } from "../../../../models/ComboItem";

@Component({
  selector: "app-datos-registrales",
  templateUrl: "./datos-registrales.component.html",
  styleUrls: ["./datos-registrales.component.scss"]
})
export class DatosRegistralesComponent implements OnInit {
  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];
  bodyInicio: DatosRegistralesItem = new DatosRegistralesItem();
  body: DatosRegistralesItem = new DatosRegistralesItem();
  bodyAnterior: DatosRegistralesItem = new DatosRegistralesItem();
  personaSearch: DatosRegistralesObject = new DatosRegistralesObject();
  prefijoBlock: boolean = false;
  fechaConstitucion: Date;
  fechaFin: Date;
  fechaCancelacion: Date;
  fechaRegistro: Date;
  requiredContador: boolean = false;
  sociedadProfesional: Boolean;
  fichasActivas: Array<any> = [];
  todo: boolean = false;
  textFilter: String = "Elegir";
  selectedDatos: any = [];

  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;

  selectedItem: number = 10;
  selectedDoc: string = "NIF";
  newDireccion: boolean = false;

  editar: boolean = false;
  archivoDisponible: boolean = false;
  file: File = undefined;
  base64String: any;
  source: any;
  imageBase64: any;
  imagenURL: any;
  generos: any[];
  tratamientos: any[];
  actividadesDisponibles: any[];
  fecha;
  fechaCorrecta: boolean;
  fechaBajaCorrecta: boolean;
  fechaConst: Date;
  fechaBaja: Date;
  fechaReg: Date;
  fechaCanc: Date;
  contadorNoCorrecto: boolean;
  selectActividad: any[];
  idiomas: any[] = [
    { label: "", value: "" },
    { label: "Castellano", value: "castellano" },
    { label: "Catalá", value: "catalan" },
    { label: "Euskara", value: "euskera" },
    { label: "Galego", value: "gallego" }
  ];
  textSelected: String = "{0} actividades seleccionadas";
  idPersona: String;
  idPersonaEditar: String;
  datos: any[];
  suscripcionBusquedaNuevo: Subscription;
  activacionEditar: boolean;

  @ViewChild(DatosRegistralesComponent)
  datosRegistralesComponent: DatosRegistralesComponent;

  @ViewChild("table") table;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private cardService: cardService,
    private fichasPosibles: DatosPersonaJuridicaComponent
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
  }

  ngOnInit() {
    this.checkAcceso();
    this.desactivadoGuardar();
    this.onChangeSociedad();
    this.bodyAnterior = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.bodyAnterior[0] != undefined) {
      if (this.bodyAnterior != null) {
        this.body.idPersona = this.bodyAnterior[0].idPersona;
        this.idPersonaEditar = this.bodyAnterior[0].idPersona;
      }
      this.search();
      this.getActividadesPersona();
    }
    console.log(this.body);

    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null) {
          this.idPersonaEditar = id;
          this.search();
        }
      }
    );

    this.sigaServices.get("datosRegistrales_actividadesDisponible").subscribe(
      n => {
        this.actividadesDisponibles = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.select = [
      { label: "", value: null },
      { label: "NIF", value: "nif" },
      { label: "Pasaporte", value: "pasaporte" },
      { label: "NIE", value: "nie" }
    ];

    this.generos = [
      { label: "", value: "" },
      { label: "Mujer", value: "M" },
      { label: "Hombre", value: "H" }
    ];
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "12a";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso == 3) {
          this.activacionEditar = true;
        } else {
          this.activacionEditar = false;
        }
      }
    );
  }

  compruebaFechaConstitucion() {
    if (this.fechaConstitucion > new Date()) {
      this.fechaCorrecta = false;
    } else {
      this.fechaCorrecta = true;
      return true;
    }
  }

  compruebaFechaBaja() {
    let fecha = this.transformaFecha(this.fechaConstitucion);
    if (this.fechaFin != undefined) {
      if (fecha > this.fechaFin) {
        this.fechaBajaCorrecta = false;
      } else {
        this.fechaBajaCorrecta = true;
      }
    }
    if (this.compruebaFechaConstitucion()) {
      return true;
    }
  }

  compruebaRegistro() {
    var a = this.body.contadorNumsspp;
    if (
      Number(this.body.contadorNumsspp) ||
      this.onlySpaces(this.body.contadorNumsspp)
    ) {
      this.contadorNoCorrecto = false;
      return true;
    } else {
      this.contadorNoCorrecto = true;
      return false;
    }
  }

  getActividadesPersona() {
    this.sigaServices
      .post("datosRegistrales_actividadesPersona", this.body)
      .subscribe(
        data => {
          this.selectActividad = JSON.parse(data["body"]).combooItems;
          // seleccionadas.forEach((value: any, index: number) => {
          //   this.selectActividad.push(value.value);
          // });
        },
        err => {
          console.log(err);
        }
      );
  }

  search() {
    this.prefijoBlock = false;
    this.body.idPersona = this.idPersonaEditar;
    this.contadorNoCorrecto = false;
    this.fechaCorrecta = true;
    this.getActividadesPersona();
    this.sigaServices
      .postPaginado("datosRegistrales_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.personaSearch = JSON.parse(data["body"]);
          this.body = this.personaSearch.datosRegistralesItems[0];
          if (this.body == undefined) {
            this.body = new DatosRegistralesItem();
          } else {
            this.body.idPersona = this.idPersonaEditar;
            this.fechaConstitucion = this.body.fechaConstitucion;
            this.fechaFin = this.body.fechaFin;
            this.fechaCancelacion = this.body.fechaCancelacion;
            this.fechaRegistro = this.body.fechaRegistro;
          }
          if (this.body.sociedadProfesional == "1") {
            this.sociedadProfesional = true;
          } else if (this.body.sociedadProfesional == "0") {
            this.sociedadProfesional = false;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showCustomFail(mensaje) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  guardar() {
    this.progressSpinner = true;
    this.arreglarFechas();
    this.body.idPersona = this.idPersonaEditar;
    if (this.selectActividad != undefined) {
      this.body.actividades = [];
      this.selectActividad.forEach((value: ComboItem, key: number) => {
        this.body.actividades.push(value.value);
      });
    } else {
      this.body.actividades = [];
    }
    if (this.body.companiaAseg == undefined) this.body.companiaAseg = "";

    if (this.body.numeroPoliza == undefined) this.body.numeroPoliza = "";

    if (this.sociedadProfesional == true) {
      this.body.sociedadProfesional = "1";
    } else {
      this.body.sociedadProfesional = "0";
    }
    if (
      (this.body.contadorNumsspp != undefined &&
        !this.onlySpaces(this.body.contadorNumsspp)) ||
      !this.requiredContador
    ) {
      console.log(this.body);
      this.sigaServices.post("datosRegistrales_update", this.body).subscribe(
        data => {
          this.showSuccess();
          console.log(data);
          this.progressSpinner = false;
        },
        err => {
          this.showFail();
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.search();
        }
      );
    } else {
      this.showCustomFail(
        "Las sociedades profesionales deben especificar el número de registro"
      );
      this.progressSpinner = false;
    }
  }

  arreglarFechas() {
    if (this.fechaConstitucion != undefined) {
      this.body.fechaConstitucion = this.transformaFecha(
        this.fechaConstitucion
      );
    }
    if (this.fechaFin != undefined) {
      this.body.fechaFin = this.transformaFecha(this.fechaFin);
    }
    if (this.fechaRegistro != undefined) {
      this.body.fechaRegistro = this.transformaFecha(this.fechaRegistro);
    }
    if (this.fechaCancelacion != undefined) {
      this.body.fechaCancelacion = this.transformaFecha(this.fechaCancelacion);
    }
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }

  onChangeSociedad() {
    if (this.sociedadProfesional == true) {
      this.prefijoBlock = true;
      this.body.prefijoNumsspp = "SP/";
      this.requiredContador = true;
    } else {
      this.prefijoBlock = false;
      this.requiredContador = false;
    }
  }

  desactivadoGuardar() {
    if (
      this.body.objetoSocial != undefined &&
      !this.onlySpaces(this.body.objetoSocial) &&
      this.body.resena != undefined &&
      !this.onlySpaces(this.body.resena) &&
      this.fechaConstitucion != undefined &&
      this.compruebaRegistro() &&
      this.compruebaFechaConstitucion() &&
      this.compruebaFechaBaja()
    ) {
      return false;
    } else {
      return true;
    }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }
  onHideDatosFacturacion() {
    this.showDatosFacturacion = !this.showDatosFacturacion;
  }

  onChangeRowsPerPages(event) {
    console.log(event);
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    // si no se esta creando una nueva sociedad
    if (
      this.activacionEditar == true &&
      sessionStorage.getItem("crearnuevo") == null
    ) {
      fichaPosible.activa = !fichaPosible.activa;
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  onAbrirTodoClick() {
    this.showAll = !this.showAll;
    this.fichasPosibles.getFichasPosibles().forEach((ficha: any) => {
      ficha.activa = this.showAll;
    });
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.getFichasPosibles().filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
  clear() {
    this.msgs = [];
  }
}
