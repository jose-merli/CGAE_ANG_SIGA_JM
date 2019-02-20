import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { esCalendar } from "../../../utils/calendar";
import { SigaServices } from "../../../_services/siga.service";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ComboItem } from "../../../models/ComboItem";
import { Location } from "@angular/common";
import { BusquedaFisicaItem } from "../../../models/BusquedaFisicaItem";
import { BusquedaJuridicaItem } from "../../../models/BusquedaJuridicaItem";
import { BusquedaJuridicaObject } from "../../../models/BusquedaJuridicaObject";
import { BusquedaFisicaObject } from "../../../models/BusquedaFisicaObject";
import { DatosNotarioItem } from "../../../models/DatosNotarioItem";
import { DatosIntegrantesItem } from "../../../models/DatosIntegrantesItem";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { SolicitudIncorporacionItem } from "../../../models/SolicitudIncorporacionItem";
import { StringObject } from "../../../models/StringObject";
import { NuevaSancionItem } from "../../../models/NuevaSancionItem";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-general",
  templateUrl: "./busqueda-general.component.html",
  styleUrls: ["./busqueda-general.component.scss"]
})
export class BusquedaGeneralComponent {
  formBusqueda: FormGroup;
  comboIdentificacion: any[];
  cols: any = [];
  colsFisicas: any = [];
  colsJuridicas: any = [];
  colegios_rol: any[];
  colegios_seleccionados: any[] = [];
  datos: any[];
  select: any[];
  es: any = esCalendar;
  selectedValue: string = "simple";
  textSelected: String = "{0} opciones seleccionadas";
  persona: String;
  bodyFisica: BusquedaFisicaItem = new BusquedaFisicaItem();
  bodyJuridica: BusquedaJuridicaItem = new BusquedaJuridicaItem();
  searchFisica: BusquedaFisicaObject = new BusquedaFisicaObject();
  searchJuridica: BusquedaJuridicaObject = new BusquedaJuridicaObject();
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  textFilter: String = "Elegir";
  buscar: boolean = false;
  selectAll: boolean = false;
  msgs: any[];
  selectedItem: number = 10;
  institucion: ComboItem = new ComboItem();
  nifCif: StringObject = new StringObject();
  continue: boolean = false;

  resultado: string = "";
  remitente: boolean = false;

  @ViewChild("table") table;
  selectedDatos;
  tipoCIF: string;
  newIntegrante: boolean = false;
  masFiltros: boolean = false;
  labelFiltros: string;
  idPlantillaEnvios: string;
  colegioDisabled: boolean = false;
  bodyRemitente: any = [];
  institucionActual: string;
  labelRemitente: string;

  currentRoute: String;  
  idClaseComunicacion: String;
  keys: any []= [];

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "facturacion",
      activa: false
    }
  ];

  isFormador: boolean = false;

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
  selectedTipo: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private location: Location
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null,
      fechaNacimiento: new FormControl(null, Validators.required),
      fechaIncorporacion: new FormControl(null),
      fechaFacturacion: new FormControl(null)
    });
  }

  ngOnInit() {
    this.getInstitucion();
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios_rol = n.combooItems;
        if (sessionStorage.getItem("abrirRemitente") == "true") {
          this.bodyRemitente = sessionStorage.getItem("plantillasEnvioSearch");
          this.remitente = true;

          for (let colegio of this.colegios_rol) {
            if (colegio.value == this.institucionActual) {
              this.colegios_seleccionados = [
                {
                  label: colegio.label,
                  value: this.institucionActual
                }
              ];
              this.labelRemitente = colegio.label;
            }
          }

          // this.colegios_seleccionados[0].label = this.institucionActual;
          this.colegioDisabled = true;
        } else {
          this.colegioDisabled = false;
        }
      },
      err => {
        console.log(err);
      },
      () => {
        // this.sigaServices.get("institucionActual").subscribe(n => {
        //   this.colegios_seleccionados.push(n);
        // });
      }
    );

    this.persona = "f";

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucion = n;
    });

    if (
      sessionStorage.getItem("newIntegrante") != null ||
      sessionStorage.getItem("newIntegrante") != undefined
    ) {
      this.newIntegrante = JSON.parse(sessionStorage.getItem("newIntegrante"));
    }

    if (
      sessionStorage.getItem("abrirFormador") != null ||
      sessionStorage.getItem("abrirFormador") != undefined
    ) {
      this.isFormador = true;
      sessionStorage.setItem("toBackNewFormador", "true");
    }

    if (
      sessionStorage.getItem("abrirSolicitudIncorporacion") != null ||
      sessionStorage.getItem("abrirSolicitudIncorporacion") != undefined
    ) {
      this.isFormador = true;
      sessionStorage.removeItem("abrirSolicitudIncorporacion");
    }

    this.colsFisicas = [
      { field: "nif", header: "NIF/CIF" },
      { field: "nombre", header: "Nombre" },
      { field: "apellidos", header: "Apellidos" },
      { field: "colegio", header: "Colegio" },
      { field: "numeroColegiado", header: "Numero de Colegiado" },
      { field: "situacion", header: "Estado colegial" },
      { field: "residente", header: "Residencia" }
    ];

    this.colsJuridicas = [
      { field: "tipo", header: "Tipo" },
      { field: "nif", header: "NIF/CIF" },
      { field: "denominacion", header: "Denominacion" },
      { field: "fechaConstitucion", header: "Fecha Constitucion" },
      { field: "abreviatura", header: "Abreviatura" },
      { field: "numeroIntegrantes", header: "Número de integrantes" }
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

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios_rol = n.combooItems;
      },
      err => {
        console.log(err);
      },
      () => {
        // this.sigaServices.get("institucionActual").subscribe(n => {
        //   this.colegios_seleccionados.push(n);
        // });
      }
    );

    this.checkStatusInit();

    // Combo de identificación
    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.comboIdentificacion = n.combooItems;
      },
      error => {}
    );
  }

  ngOnDestroy() {
    sessionStorage.removeItem("nuevaSancion");
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
  }

  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
        this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }

  checkTypeCIF(value: String): boolean {
    if (this.isValidDNI(value)) {
      this.tipoCIF = "10";
      return true;
    } else if (this.isValidCIF(value)) {
      this.tipoCIF = "20";
      return true;
    } else if (this.isValidNIE(value)) {
      this.tipoCIF = "40";
      return true;
    } else if (this.isValidPassport(value)) {
      this.tipoCIF = "30";
      return true;
    } else {
      this.tipoCIF = "50";
      return false;
    }
  }

  isValidPassport(dni: String): boolean {
    return (
      dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni)
    );
  }

  isValidNIE(nie: String): boolean {
    return (
      nie &&
      typeof nie === "string" &&
      /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie)
    );
  }

  isValidCIF(cif: String): boolean {
    return (
      cif &&
      typeof cif === "string" &&
      /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif)
    );
  }

  changeColsAndData() {
    if (this.persona == "f") {
      this.cols = this.colsFisicas;
      this.colegios_seleccionados = [];
      this.datos = [];

      this.bodyFisica.nif = "";
      this.bodyFisica.nombre = "";
      this.bodyFisica.primerApellido = "";
      this.bodyFisica.segundoApellido = "";
      this.bodyFisica.numeroColegiado = "";
    } else {
      this.cols = this.colsJuridicas;
      this.colegios_seleccionados = [];
      this.datos = [];

      this.selectedTipo = "";
      //this.bodyJuridica.tipo = this.selectedTipo;
      this.bodyJuridica.nif = "";
      this.bodyJuridica.denominacion = "";
      this.bodyJuridica.abreviatura = "";
    }
  }

  checkFilterFisic() {
    if (
      (this.bodyFisica.nombre == null ||
        this.bodyFisica.nombre == null ||
        this.bodyFisica.nombre.trim().length < 3) &&
      (this.bodyFisica.primerApellido == null ||
        this.bodyFisica.primerApellido == null ||
        this.bodyFisica.primerApellido.trim().length < 3) &&
      (this.bodyFisica.segundoApellido == null ||
        this.bodyFisica.segundoApellido == null ||
        this.bodyFisica.segundoApellido.trim().length < 3) &&
      (this.bodyFisica.numeroColegiado == null ||
        this.bodyFisica.numeroColegiado == null ||
        this.bodyFisica.numeroColegiado.trim().length < 3) &&
      (this.bodyFisica.nif == null ||
        this.bodyFisica.nif == null ||
        this.bodyFisica.nif.trim().length < 3) &&
      (this.colegios_seleccionados == undefined ||
        this.colegios_seleccionados == null ||
        this.colegios_seleccionados.length < 1)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.bodyFisica.nombre != undefined) {
        this.bodyFisica.nombre = this.bodyFisica.nombre.trim();
      }
      if (this.bodyFisica.primerApellido != undefined) {
        this.bodyFisica.primerApellido = this.bodyFisica.primerApellido.trim();
      }
      if (this.bodyFisica.segundoApellido != undefined) {
        this.bodyFisica.segundoApellido = this.bodyFisica.segundoApellido.trim();
      }
      if (this.bodyFisica.numeroColegiado != undefined) {
        this.bodyFisica.numeroColegiado = this.bodyFisica.numeroColegiado.trim();
      }
      if (this.bodyFisica.nif != undefined) {
        this.bodyFisica.nif = this.bodyFisica.nif.trim();
      }

      return true;
    }
  }

  checkFilterJuridic() {
    if (
      (this.selectedTipo == undefined ||
        this.selectedTipo == null ||
        this.selectedTipo.value == "" ||
        this.selectedTipo.length < 1) &&
      (this.bodyJuridica.abreviatura == null ||
        this.bodyJuridica.abreviatura == null ||
        this.bodyJuridica.abreviatura.trim().length < 3) &&
      (this.bodyJuridica.denominacion == null ||
        this.bodyJuridica.denominacion == null ||
        this.bodyJuridica.denominacion.trim().length < 3) &&
      (this.bodyJuridica.nif == null ||
        this.bodyJuridica.nif == null ||
        this.bodyJuridica.nif.trim().length < 3) &&
      (this.colegios_seleccionados == undefined ||
        this.colegios_seleccionados == null ||
        this.colegios_seleccionados.length < 1)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      // if (this.bodyJuridica.tipo != undefined) {
      //   this.bodyJuridica.tipo = this.bodyJuridica.tipo.trim();
      // }
      if (this.bodyJuridica.abreviatura != undefined) {
        this.bodyJuridica.abreviatura = this.bodyJuridica.abreviatura.trim();
      }
      if (this.bodyJuridica.denominacion != undefined) {
        this.bodyJuridica.denominacion = this.bodyJuridica.denominacion.trim();
      }
      if (this.bodyJuridica.nif != undefined) {
        this.bodyJuridica.nif = this.bodyJuridica.nif.trim();
      }
      return true;
    }
  }
  checkStatusInit() {
    if (this.persona == "f") {
      this.cols = this.colsFisicas;
    } else {
      this.cols = this.colsJuridicas;
    }
  }

  search() {
    this.progressSpinner = true;
    this.buscar = true;

    if (this.persona == "f") {
      if (this.checkFilterFisic()) {
        if (this.bodyFisica.nif == undefined) {
          this.bodyFisica.nif = "";
        }
        if (this.colegios_seleccionados != undefined) {
          this.bodyFisica.idInstitucion = [];
          this.colegios_seleccionados.forEach(
            (value: ComboItem, key: number) => {
              this.bodyFisica.idInstitucion.push(value.value);
            }
          );
        } else {
          this.bodyFisica.idInstitucion = [];
        }
        if (this.bodyFisica.nombre == undefined) {
          this.bodyFisica.nombre = "";
        }
        if (this.bodyFisica.primerApellido == undefined) {
          this.bodyFisica.primerApellido = "";
        }
        if (this.bodyFisica.segundoApellido == undefined) {
          this.bodyFisica.segundoApellido = "";
        }
        if (this.bodyFisica.numeroColegiado == undefined) {
          this.bodyFisica.numeroColegiado = "";
        }
        this.checkTypeCIF(this.bodyFisica.nif);
        this.sigaServices
          .postPaginado(
            "busquedaPer_searchFisica",
            "?numPagina=1",
            this.bodyFisica
          )
          .subscribe(
            data => {
              this.progressSpinner = false;
              this.searchFisica = JSON.parse(data["body"]);
              this.datos = [];
              this.datos = this.searchFisica.busquedaFisicaItems;
            },
            err => {
              console.log(err);
              this.progressSpinner = false;
            },
            () => {
              if (
                this.datos.length == 0 ||
                this.datos == null ||
                this.datos == undefined
              ) {
                if (
                  this.bodyFisica.nif != "" &&
                  this.bodyFisica.nif != undefined
                ) {
                  if (this.tipoIdentificacionPermitido(this.bodyFisica.nif)) {
                    this.noDataFoundWithDNI();
                  }
                }
              } else {
                // encuentra datos, muestra mensaje informativo si tiene nif + {nombre || primer apellido || segundo apellido informado}
                if (
                  this.bodyFisica.nif != undefined &&
                  this.bodyFisica.nif.trim() != "" &&
                  ((this.bodyFisica.nombre != undefined &&
                    this.bodyFisica.nombre.trim() != "") ||
                    (this.bodyFisica.primerApellido != undefined &&
                      this.bodyFisica.primerApellido.trim() != "") ||
                    (this.bodyFisica.segundoApellido != undefined &&
                      this.bodyFisica.segundoApellido.trim() != ""))
                ) {
                  this.showWarning(
                    "se ha encontrado una persona con el Núm. de identificación indicado. Revise el resto de los datos, porque al seleccionar este registro se usarán los datos existentes anteriormente y no podrá modificar sus datos generales"
                  );
                }
              }
            }
          );
      }
    } else {
      if (this.checkFilterJuridic()) {
        if (this.selectedTipo != undefined && this.selectedTipo.value == "") {
          this.bodyJuridica.tipo = "";
        }
        if (this.bodyJuridica.nif == undefined) {
          this.bodyJuridica.nif = "";
        }
        if (this.bodyJuridica.denominacion == undefined) {
          this.bodyJuridica.denominacion = "";
        }
        if (this.bodyJuridica.numColegiado == undefined) {
          this.bodyJuridica.numColegiado = "";
        }
        if (this.bodyJuridica.abreviatura == undefined) {
          this.bodyJuridica.abreviatura = "";
        }

        this.bodyJuridica.idInstitucion = [];
        this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
          this.bodyJuridica.idInstitucion.push(value.value);
        });
        this.checkTypeCIF(this.bodyJuridica.nif);
        this.sigaServices
          .postPaginado(
            "busquedaPer_searchJuridica",
            "?numPagina=1",
            this.bodyJuridica
          )
          .subscribe(
            data => {
              this.progressSpinner = false;
              this.searchJuridica = JSON.parse(data["body"]);
              this.datos = [];
              this.datos = this.searchJuridica.busquedaPerJuridicaItems;

              // this.table.paginator = true;
            },
            err => {
              console.log(err);
              this.progressSpinner = false;
            },
            () => {
              if (
                this.datos.length == 0 ||
                this.datos == null ||
                this.datos == undefined
              ) {
                if (this.tipoIdentificacionPermitido(this.bodyJuridica.nif)) {
                  this.noDataFoundWithDNI();
                }
              }
            }
          );
      }
    }
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
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isBuscar() {
    this.buscar = true;
    this.search();
  }

  irFichaColegial(id) {
    // ir a ficha de notario
    if (
      sessionStorage.getItem("abrirNotario") == "true" &&
      sessionStorage.getItem("abrirRemitente") != "true"
    ) {
      if (!this.selectMultiple && !this.selectAll) {
        if (
          sessionStorage.getItem("notario") != null ||
          sessionStorage.getItem("notario") != undefined
        ) {
          sessionStorage.removeItem("notario");
          sessionStorage.removeItem("abrirRemitente");
        }
        this.checkTypeCIF(id[0].nif);
        id[0].tipoIdentificacion = this.tipoCIF;

        sessionStorage.setItem("notario", JSON.stringify(id));
        //this.location.back();
        this.router.navigate(["fichaPersonaJuridica"]);
      }
    } else if (
      (sessionStorage.getItem("newIntegrante") != null ||
        sessionStorage.getItem("newIntegrante") != undefined) &&
      sessionStorage.getItem("abrirRemitente") != "true"
    ) {
      // ir a ficha de integrante
      sessionStorage.removeItem("notario");
      sessionStorage.removeItem("abrirRemitente");
      this.checkTypeCIF(id[0].nif);
      id[0].tipoIdentificacion = this.tipoCIF;
      id[0].colegio = this.colegios_seleccionados[0];
      id[0].completo = true;
      sessionStorage.removeItem("nIntegrante");
      sessionStorage.setItem("nIntegrante", JSON.stringify(id));
      this.router.navigate(["detalleIntegrante"]);
    } else if (sessionStorage.getItem("abrirRemitente") == "true") {
      sessionStorage.setItem("remitente", JSON.stringify(id[0]));
      sessionStorage.removeItem("abrirRemitente");
      sessionStorage.removeItem("notario");
      sessionStorage.removeItem("integrante");
      this.location.back();
      // ir a ficha de solicitud de Incorporación
    } else if (
      sessionStorage.getItem("solicitudIncorporacion") == "true" &&
      sessionStorage.getItem("abrirRemitente") != "true"
    ) {
      let enviar = new SolicitudIncorporacionItem();

      this.nifCif.valor = id[0].nif;
      this.sigaServices
        .post("solicitudModificacion_verifyPerson", this.nifCif)
        .subscribe(
          data => {
            this.resultado = JSON.parse(data["body"]).valor;

            if (this.resultado == "existe") {
              this.continue = false;
            } else {
              this.continue = true;
            }

            this.progressSpinner = false;
          },
          err => {
            console.log(err);
          },
          () => {
            if (this.continue == true) {
              enviar.numeroIdentificacion = id[0].nif;
              enviar.apellido1 = id[0].primerApellido;
              enviar.nombre = id[0].nombre;
              enviar.numColegiado = id[0].numeroColegiado;
              enviar.idInstitucion = id[0].numeroInstitucion;
              enviar.apellido2 = id[0].segundoApellido;

              sessionStorage.setItem(
                "nuevaIncorporacion",
                JSON.stringify(enviar)
              );
              this.router.navigate(["/nuevaIncorporacion"]);
            } else {
              this.showFail(
                "No se puede crear una solicitud de modificación a partir de una persona de la misma institución"
              );
            }
          }
        );
    } else if (this.isFormador) {
      // ir a ficha de formador
      this.checkTypeCIF(id[0].nif);
      id[0].tipoIdentificacion = this.tipoCIF;
      id[0].completo = true;
      sessionStorage.removeItem("abrirFormador");
      sessionStorage.removeItem("abrirSolicitudIncorporacion");

      sessionStorage.setItem("formador", JSON.stringify(id[0]));
      if (
        sessionStorage.getItem("backInscripcion") != null ||
        sessionStorage.getItem("backInscripcion") != undefined
      ) {
        this.router.navigate(["/buscarInscripciones"]);
        sessionStorage.removeItem("backInscripcion");
      } else if (
        sessionStorage.getItem("backFichaInscripcion") != null ||
        sessionStorage.getItem("backFichaInscripcion") != undefined
      ) {
        sessionStorage.removeItem("backFichaInscripcion");
        if (sessionStorage.getItem("modoEdicionInscripcion") != null) {
          sessionStorage.removeItem("modoEdicionInscripcion");
        }

        sessionStorage.setItem("modoEdicionInscripcion", "false");
        this.router.navigate(["/fichaInscripcion"]);
      } else {
        this.router.navigate(["/fichaCurso"]);
      }
    } else if (
      sessionStorage.getItem("nuevaSancion") != null &&
      sessionStorage.getItem("nuevaSancion") != undefined
    ) {
      sessionStorage.setItem("nSancion", JSON.stringify(id));
      this.router.navigate(["detalleSancion"]);
    }
  }

  tipoIdentificacionPermitido(value: String): boolean {
    // busqueda fisica => todos menos cif
    if (this.persona == "f") {
      if (this.isValidCIF(value)) {
        return false;
      } else {
        return true;
      }
    } else {
      // busqueda juridica => cif
      if (this.isValidCIF(value)) {
        return true;
      } else {
        return false;
      }
    }
  }

  noDataFoundWithDNI() {
    let mess = "";
    if (this.persona == "f") {
      mess =
        "No existe ningun elemento con el NIF seleccionado, ¿Desea crear un elemento?";
    } else {
      mess =
        "No existe ningun elemento con el CIF seleccionado, ¿Desea crear un elemento?";
    }

    let icon = "fa fa-edit";

    if (sessionStorage.getItem("nuevaSancion") == undefined) {
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          if (sessionStorage.getItem("abrirNotario") == "true") {
            let notarioNIF = new DatosNotarioItem();
            if (
              this.bodyFisica.nif != null ||
              this.bodyFisica.nif != undefined
            ) {
              notarioNIF.nif = this.bodyFisica.nif;
            } else {
              notarioNIF.nif = this.bodyJuridica.nif;
            }

            notarioNIF.tipoIdentificacion = this.tipoCIF;

            notarioNIF.nombre = "";
            let notariosNEW = [];
            notariosNEW.push(notarioNIF);

            sessionStorage.removeItem("notario");

            sessionStorage.setItem("notario", JSON.stringify(notariosNEW));
            this.location.back();
          } else if (
            sessionStorage.getItem("solicitudIncorporacion") == "true"
          ) {
            let enviar = new SolicitudIncorporacionItem();
            if (this.bodyFisica.nif != undefined || this.bodyFisica.nif != "") {
              enviar.numeroIdentificacion = this.bodyFisica.nif;
              enviar.nombre = this.bodyFisica.nombre;
              enviar.apellido1 = this.bodyFisica.primerApellido;
              enviar.apellido2 = this.bodyFisica.segundoApellido;
              enviar.numColegiado = this.bodyFisica.numeroColegiado;
              sessionStorage.setItem(
                "nuevaIncorporacion",
                JSON.stringify(enviar)
              );
              this.router.navigate(["/nuevaIncorporacion"]);
            } else {
              this.showFail(
                "No se puede crear una solicitud de modificación a partir de una persona jurídica"
              );
            }
          } else if (
            sessionStorage.getItem("newIntegrante") != null ||
            sessionStorage.getItem("newIntegrante") != undefined
          ) {
            let integranteNew = new DatosIntegrantesItem();
            if (
              this.bodyFisica.nif != null ||
              this.bodyFisica.nif != undefined
            ) {
              integranteNew.nifCif = this.bodyFisica.nif;
            } else {
              integranteNew.nifCif = this.bodyJuridica.nif;
            }

            // sirve tanto para ambas busquedas (fisica, juridica)
            integranteNew.tipoIdentificacion = this.tipoCIF;

            // datos de persona fisica para pasar a pantalla integrante
            if (this.persona == "f") {
              integranteNew.nombre = this.bodyFisica.nombre;
              integranteNew.apellidos1 = this.bodyFisica.primerApellido;
              integranteNew.apellidos2 = this.bodyFisica.segundoApellido;
              integranteNew.ejerciente = "NO COLEGIADO";
            } else {
              // datos de persona fisica para pasar a pantalla integrante
              integranteNew.nombre = this.bodyJuridica.denominacion;
              integranteNew.apellidos1 = this.bodyJuridica.abreviatura;
              integranteNew.ejerciente = "SOCIEDAD";
              integranteNew.colegio = this.colegios_seleccionados[0];
            }

            integranteNew.completo = false;
            let integrantesNEW = [];
            integrantesNEW.push(integranteNew);

            sessionStorage.removeItem("nIntegrante");
            sessionStorage.setItem(
              "nIntegrante",
              JSON.stringify(integrantesNEW)
            );
            this.router.navigate(["detalleIntegrante"]);
          } else if (
            sessionStorage.getItem("abrirFormador") != null ||
            sessionStorage.getItem("abrirFormador") != undefined
          ) {
            let formador = new FormadorCursoItem();
            formador.tipoIdentificacion = this.tipoCIF;
            // formador.nif = this.bodyFisica.nif;
            sessionStorage.removeItem("abrirFormador");
            sessionStorage.setItem("formador", JSON.stringify(formador));
            if (
              sessionStorage.getItem("backFichaInscripcion") != null &&
              sessionStorage.getItem("backFichaInscripcion")
            )
              this.router.navigate(["/fichaInscripcion"]);
            else this.router.navigate(["/fichaCurso"]);
          }
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  showWarning(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "warn",
      summary: "Atención",
      detail: mensaje
    });
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
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

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  backTo() {
    this.location.back();
  }

  clear() {
    this.msgs = [];
  }

  getTipo(event) {
    this.selectedTipo = event;
    this.bodyJuridica.tipo = this.selectedTipo.value;
  }

  navigateComunicar(dato){
    sessionStorage.setItem("rutaComunicacion",this.currentRoute.toString());
    this.getDatosComunicar();    
  }
  
  getDatosComunicar(){
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
          data => {
            this.keys = JSON.parse(data['body']).keysItem;
            this.selectedDatos.forEach(element => {
              let keysValues = [];
              this.keys.forEach(key =>{
                if(element[key.nombre] != undefined){
                  keysValues.push(element[key.nombre]);
                }            
              })
              datosSeleccionados.push(keysValues);
            });
    
            sessionStorage.setItem("datosComunicar", JSON.stringify(datosSeleccionados));
            this.router.navigate(["/dialogoComunicaciones"]);
          },
          err => {
            console.log(err);
          }
        );   
      },
      err => {
        console.log(err);
      }
    );    
  
  }
}
