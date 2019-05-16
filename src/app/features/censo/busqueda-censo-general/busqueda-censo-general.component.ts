import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { Location } from "@angular/common";
import { BusquedaFisicaItem } from "../../../models/BusquedaFisicaItem";
import { BusquedaFisicaObject } from "../../../models/BusquedaFisicaObject";
import { Router } from "../../../../../node_modules/@angular/router";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";
import { AuthenticationService } from "../../../_services/authentication.service";
import { DatosNoColegiadosObject } from "../../../models/DatosNoColegiadosObject";
import { NoColegiadoItem } from "../../../models/NoColegiadoItem";
import { TranslateService } from "../../../commons/translate";
import { ConfirmationService } from "../../../../../node_modules/primeng/primeng";
import { FichaColegialGeneralesItem } from "../../../models/FichaColegialGeneralesItem";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-censo-general",
  templateUrl: "./busqueda-censo-general.component.html",
  styleUrls: ["./busqueda-censo-general.component.scss"]
})
export class BusquedaCensoGeneralComponent implements OnInit {
  textFilter: String = "Elegir";
  textSelected: String = "{0} opciones seleccionadas";

  cols: any = [];
  rowsPerPage: any = [];
  colegios: any[];
  msgs: any[];
  datos: any[] = [];
  datosColegiados: any[] = [];
  datosNoColegiados: any[] = [];
  colegios_seleccionados: any[] = [];

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  progressSpinner: boolean = false;

  body: BusquedaFisicaItem = new BusquedaFisicaItem();
  bodySearch = new BusquedaFisicaObject();

  bodyNoColegiado: NoColegiadoItem = new NoColegiadoItem();
  noColegiadoSearch = new DatosNoColegiadosObject();

  personaBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();

  bodyColegiado: DatosColegiadosItem = new DatosColegiadosItem();
  colegiadoSearch = new DatosColegiadosObject();

  selectedItem: number = 10;
  @ViewChild("table")
  table;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    sessionStorage.removeItem("esNuevoNoColegiado");

    if (sessionStorage.getItem("filtrosBusqueda") != null) {
      this.body = JSON.parse(sessionStorage.getItem("filtrosBusqueda"));

      if (sessionStorage.getItem("busquedaCensoGeneral") != null) {
        this.body = JSON.parse(sessionStorage.getItem("filtrosBusqueda"));
        this.isBuscar();
        sessionStorage.removeItem("busquedaCensoGeneral");
      }

      sessionStorage.removeItem("filtrosBusqueda");
    }

    this.fillDataTable();

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  fillDataTable() {
    this.cols = [
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
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
        field: "numeroColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "colegio",
        header: "censo.busquedaClientesAvanzada.literal.colegio"
      },
      {
        field: "situacion",
        header: "censo.fichaCliente.situacion.cabecera"
      },
      {
        field: "fechaEstado",
        header: "censo.nuevaSolicitud.fechaEstado"
      },
      {
        field: "residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "domicilio",
        header: "solicitudModificacion.especifica.domicilio.literal"
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

  isLimpiar() {
    this.body = new BusquedaFisicaItem();
    this.colegios_seleccionados = [];
  }

  // Ficha
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  // Métodos
  isBuscar() {

    if (this.checkFilters()) {
      if (
        this.body.numeroColegiado != undefined &&
        this.body.numeroColegiado != ""
      ) {
        if (
          this.colegios_seleccionados != undefined &&
          this.colegios_seleccionados.length > 0
        ) {
          this.search();
        } else {
          this.showFail("Debe introducir un colegio para buscar.");
        }
      } else if (
        this.colegios_seleccionados != undefined &&
        this.colegios_seleccionados.length > 0
      ) {
        if (
          this.body.numeroColegiado != undefined &&
          this.body.numeroColegiado != ""
        ) {
          this.search();
        } else {
          this.showFail("Debe introducir un número de colegiado para buscar.");
        }
      } else {
        this.search();
      }
    }


  }

  search() {
    this.progressSpinner = true;
    this.buscar = true;

    if (
      this.colegios_seleccionados != undefined &&
      this.colegios_seleccionados.length > 0
    ) {
      this.body.idInstitucion = [];
      this.body.idInstitucion.push(this.colegios_seleccionados[0].value);
    }

    this.sigaServices
      .postPaginado("busquedaCensoGeneral_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.datos = this.bodySearch.busquedaFisicaItems;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  irFichaColegial(selectedDatos) {
    this.progressSpinner = true;
    sessionStorage.setItem("busquedaCensoGeneral", "true");

    sessionStorage.setItem("filtrosBusqueda", JSON.stringify(this.body));

    // if (this.authenticationService.getInstitucionSession() == 2000) {
    //   this.getNoColegiado(selectedDatos);
    // } else {
    // if (
    //   this.selectedDatos.numeroInstitucion ==
    //   this.authenticationService.getInstitucionSession()
    // ) {
    // Colegiado
    this.getColegiado(selectedDatos);
    // } else if (
    //   this.selectedDatos.numeroInstitucion !=
    //   this.authenticationService.getInstitucionSession()
    // ) {
    //   this.getNoColegiado(selectedDatos);
    // }
    // }
  }

  getColegiado(selectedDatos) {
    this.bodyColegiado.nif = selectedDatos.nif;
    // this.bodyColegiado.numColegiado = selectedDatos.numeroColegiado;

    this.sigaServices
      .postPaginado(
        "busquedaCensoGeneral_searchColegiado",
        "?numPagina=1",
        this.bodyColegiado
      )
      .subscribe(data => {
        this.colegiadoSearch = JSON.parse(data["body"]);
        this.datosColegiados = this.colegiadoSearch.colegiadoItem;

        if (this.datosColegiados == null || this.datosColegiados == undefined ||
          this.datosColegiados.length == 0) {
          this.getNoColegiado(selectedDatos);
        } else {
          sessionStorage.setItem(
            "personaBody",
            JSON.stringify(this.datosColegiados[0])
          );
          this.router.navigate(["/fichaColegial"]);
        }
      },
        err => {
          this.progressSpinner = false;

        });
  }

  getNoColegiado(selectedDatos) {
    this.bodyNoColegiado.nif = selectedDatos.nif;
    this.bodyNoColegiado.idInstitucion = this.authenticationService.getInstitucionSession();

    this.sigaServices
      .postPaginado(
        "busquedaNoColegiados_searchNoColegiado",
        "?numPagina=1",
        this.bodyNoColegiado
      )
      .subscribe(data => {
        this.progressSpinner = false;
        this.noColegiadoSearch = JSON.parse(data["body"]);
        this.datosNoColegiados = this.noColegiadoSearch.noColegiadoItem;

        if (this.datosNoColegiados.length > 0) {
          if (this.datosNoColegiados[0].fechaNacimiento != null) {
            this.datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
              this.datosNoColegiados[0].fechaNacimiento
            );
          }

          sessionStorage.setItem(
            "personaBody",
            JSON.stringify(this.datosNoColegiados[0])
          );

          this.router.navigate(["/fichaColegial"]);
        } else {
          this.getCliente(selectedDatos);
        }
      },
        err => {
          this.progressSpinner = false;

        });
  }

  getCliente(selectedDatos) {
    this.bodyNoColegiado.nif = selectedDatos.nif;

    this.sigaServices
      .postPaginado(
        "busquedaCensoGeneral_searchCliente",
        "?numPagina=1",
        this.bodyNoColegiado
      )
      .subscribe(data => {
        this.progressSpinner = false;
        this.noColegiadoSearch = JSON.parse(data["body"]);
        this.datosNoColegiados = this.noColegiadoSearch.noColegiadoItem;
        sessionStorage.setItem("esColegiado", "false");

        if (this.datosNoColegiados.length > 0) {
          if (this.datosNoColegiados[0].fechaNacimiento != null) {
            this.datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
              this.datosNoColegiados[0].fechaNacimiento
            );
          }

          sessionStorage.setItem(
            "personaBody",
            JSON.stringify(this.datosNoColegiados[0])
          );

          this.router.navigate(["/fichaColegial"]);
        } else {
          this.confirmationService.confirm({
            message: "¿Desea crear un no colegiado?",
            icon: "fa fa-info",
            accept: () => {
              sessionStorage.setItem("esNuevoNoColegiado", "true");
              sessionStorage.setItem("busquedaCensoGeneral", "true");
              let noColegiado = new NoColegiadoItem();
              noColegiado.nif = selectedDatos.nif;
              noColegiado.idPersona = selectedDatos.idPersona;
              noColegiado.soloNombre = selectedDatos.nombre;
              noColegiado.apellidos1 = selectedDatos.primerApellido;
              noColegiado.apellidos2 = selectedDatos.segundoApellido;
              sessionStorage.removeItem("disabledAction");
              this.datosNoColegiados.push(noColegiado);
              sessionStorage.setItem(
                "personaBody",
                JSON.stringify(this.datosNoColegiados[0])
              );

              this.router.navigate(["/fichaColegial"]);
            },
            reject: () => {
              sessionStorage.setItem("busquedaCensoGeneral", "false");

              this.msgs = [
                {
                  severity: "info",
                  summary: "Info",
                  detail: this.translateService.instant(
                    "general.message.accion.cancelada"
                  )
                }
              ];
              this.progressSpinner = false;
              this.selectedDatos = [];
            }
          });
          this.progressSpinner = false;
          sessionStorage.removeItem("esNuevoNoColegiado");
        }
      },
        err => {
          this.progressSpinner = false;

        });
  }

  personaBodyFecha(fecha) {
    let f = fecha.substring(0, 10);
    let year = f.substring(0, 4);
    let month = f.substring(5, 7);
    let day = f.substring(8, 10);

    return day + "/" + month + "/" + year;
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

  disableBuscar(): boolean {
    if (
      (this.body.nif != undefined && this.body.nif != "") ||
      (this.body.nombre != undefined && this.body.nombre != "") ||
      (this.body.primerApellido != undefined &&
        this.body.primerApellido != "") ||
      (this.body.segundoApellido != undefined &&
        this.body.segundoApellido != "") ||
      (this.body.numeroColegiado != undefined &&
        this.body.numeroColegiado != "") ||
      (this.colegios_seleccionados != undefined &&
        this.colegios_seleccionados.length > 0)
    ) {
      return false;
    } else {
      return true;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  checkFilters() {
    if (
      (this.body.nif == null ||
        this.body.nif == undefined ||
        this.body.nif.trim().length < 3) &&
      (this.body.nombre == null ||
        this.body.nombre == undefined ||
        this.body.nombre.trim().length < 3) &&
      (this.body.primerApellido == null ||
        this.body.primerApellido == undefined ||
        this.body.primerApellido.trim().length < 3) &&
      (this.body.segundoApellido == null ||
        this.body.segundoApellido == undefined ||
        this.body.segundoApellido.trim().length < 3) &&
      (this.body.numeroColegiado == null ||
        this.body.numeroColegiado == undefined ||
        this.body.numeroColegiado.trim().length < 3) &&
      (this.colegios_seleccionados == undefined ||
        this.colegios_seleccionados.length == 0)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.primerApellido != undefined) {
        this.body.primerApellido = this.body.primerApellido.trim();
      }
      if (this.body.segundoApellido != undefined) {
        this.body.segundoApellido = this.body.segundoApellido.trim();
      }
      if (this.body.numeroColegiado != undefined) {
        this.body.numeroColegiado = this.body.numeroColegiado.trim();
      }

      return true;
    }
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

}
