import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { SelectItem } from "primeng/components/common/api";
import { BusquedaSancionesItem } from "../../../../models/BusquedaSancionesItem";
import { esCalendar } from "../../../../utils/calendar";
import { FichaColegialGeneralesItem } from "../../../../models/FichaColegialGeneralesItem";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { BusquedaSancionesObject } from "../../../../models/BusquedaSancionesObject";
import { ComboItem } from "../../../../../app/models/ComboItem";
import { BusquedaFisicaItem } from "../../../../models/BusquedaFisicaItem";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { NuevaSancionItem } from "../../../../models/NuevaSancionItem";

@Component({
  selector: "app-detalle-sancion",
  templateUrl: "./detalle-sancion.component.html",
  styleUrls: ["./detalle-sancion.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DetalleSancionComponent implements OnInit {
  showDatosSancion: boolean = true;
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  tipoSancion: SelectItem[];
  estado: SelectItem[];
  existeImagen: boolean = false;
  colegios: any;
  msgs: any;
  es: any = esCalendar;
  imagenPersona: any;
  body: BusquedaSancionesItem = new BusquedaSancionesItem();
  restoreBody: BusquedaSancionesItem = new BusquedaSancionesItem();
  newBody: NuevaSancionItem = new NuevaSancionItem();

  progressSpinner: boolean = false;
  disabledFechaAcuerdo: boolean = false;
  disabledFechaFirme: boolean = true;
  disabledPeriodoDesde: boolean = true;
  disabledPeriodoHasta: boolean = true;
  disabledRehabilitado: boolean = true;
  disabledFechaArchivada: boolean = true;
  disabledChkFirmeza: boolean = true;
  disabledChkRehabilitado: boolean = true;
  disabledChkArchivada: boolean = true;
  disabledField: boolean = false;
  isPersona: boolean = true;
  disabledGuardar: boolean = false;

  fechaMinimaFirmeza: Date;
  fechaMaxAcuerdo: Date;

  permisoTarjeta: string;

  constructor(
    private location: Location,
    private authenticationService: AuthenticationService,
    private sigaServices: SigaServices,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    sessionStorage.removeItem("nuevaSancion");
    this.controlFechas();
    this.getComboColegios();
    this.getComboTipoSancion();

    if (
      sessionStorage.getItem("rowData") != null &&
      sessionStorage.getItem("rowData") != undefined
    ) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));
      //this.body = this.body[0];

      this.transformDates(this.body);
      this.bodyToCheckbox();

      //Hay que pasarle la del tokem
      if (
        this.body.idInstitucionS !=
        this.authenticationService.getInstitucionSession()
      ) {
        // MODO CONSULTA
        this.disabledChkArchivada = true;
        this.disabledChkFirmeza = true;
        this.disabledChkRehabilitado = true;
        this.disabledFechaAcuerdo = true;
        this.disabledFechaArchivada = true;
        this.disabledFechaFirme = true;
        this.disabledPeriodoDesde = true;
        this.disabledPeriodoHasta = true;
        this.disabledRehabilitado = true;
        this.disabledField = true;
      } else {
        // MODO EDICIÓN
        this.deshabilitarFechas();
      }
    } else if (
      sessionStorage.getItem("nSancion") != null &&
      sessionStorage.getItem("nSancion") != undefined
    ) {
      // Insertar

      this.newBody = JSON.parse(sessionStorage.getItem("nSancion"));

      this.fillFieldsInsertMode(this.body, this.newBody);

      // this.body.idPersona = this.newBody[0].idPersona;
      // this.body.nif = this.newBody[0].nif;

      // if (this.newBody[0].denominacion != undefined) {
      //   this.body.nombre = this.newBody[0].denominacion;
      //   this.body.fechaNacimiento = this.newBody[0].fechaConstitucion;
      //   this.body.idColegio = this.newBody[0].idInstitucion;
      // } else {
      //   this.body.nombre = this.newBody[0].nombre;
      //   this.body.fechaNacimiento = this.newBody[0].fechaNacimiento;
      //   this.body.idColegio = this.newBody[0].numeroInstitucion;
      // }

      this.deshabilitarFechas();
    }

    this.permisoTarjeta = sessionStorage.getItem("permisoTarjeta");
  }

  controlFechas() {
    this.fechaMinimaFirmeza = new Date();

    this.fechaMaxAcuerdo = new Date();
    let one_day = 1000 * 60 * 60 * 24;
    let ayer = this.fechaMaxAcuerdo.getMilliseconds() - one_day;
    this.fechaMaxAcuerdo.setMilliseconds(ayer);
  }

  transformDates(body) {
    if (body.fechaAcuerdoDate != null) {
      body.fechaAcuerdoDate = new Date(body.fechaAcuerdoDate);
    } else {
      body.fechaAcuerdoDate = undefined;
    }

    if (body.fechaDesdeDate != null) {
      body.fechaDesdeDate = new Date(body.fechaDesdeDate);
    } else {
      body.fechaDesdeDate = undefined;
    }

    if (body.fechaHastaDate != null) {
      body.fechaHastaDate = new Date(body.fechaHastaDate);
    } else {
      body.fechaHastaDate = undefined;
    }

    if (body.fechaFirmezaDate != null) {
      body.fechaFirmezaDate = new Date(body.fechaFirmezaDate);
    } else {
      body.fechaFirmezaDate = undefined;
    }

    if (body.fechaRehabilitadoDate != null) {
      body.fechaRehabilitadoDate = new Date(body.fechaRehabilitadoDate);
    } else {
      body.fechaRehabilitadoDate = undefined;
    }

    if (body.fechaArchivadaDate != null) {
      body.fechaArchivadaDate = new Date(body.fechaArchivadaDate);
    } else {
      body.fechaArchivadaDate = undefined;
    }
  }

  fillFieldsInsertMode(body, newBody) {
    body.idPersona = newBody[0].idPersona;
    body.nif = newBody[0].nif;

    if (newBody[0].denominacion != undefined) {
      this.isPersona = false;
      body.nombre = newBody[0].denominacion;
      body.fechaNacimiento = newBody[0].fechaConstitucion;
      body.idColegio = newBody[0].idInstitucion;
    } else {
      this.isPersona = true;
      body.nombre = newBody[0].nombre;
      body.fechaNacimiento = newBody[0].fechaNacimiento;
      body.idColegio = newBody[0].numeroInstitucion;
    }
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        if (this.authenticationService.getInstitucionSession() != "2000") {
          this.colegios = [];
          n.combooItems.forEach(element => {
            if (
              this.authenticationService.getInstitucionSession() ==
              element.value
            ) {
              this.colegios.push(element);
              this.body.idColegio = element.value;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getValueForCombo() {
    let i = 0;
    while (this.tipoSancion.length > i) {
      if (this.tipoSancion[i].label == this.body.tipoSancion) {
        this.body.tipoSancion = this.tipoSancion[i].value;
      }
      i++;
    }
  }

  onHideDatosSancion() {
    this.showDatosSancion = !this.showDatosSancion;
  }

  return() {
    sessionStorage.removeItem("rowData");
    sessionStorage.removeItem("nuevaSancion");
    sessionStorage.setItem("back", "true");
    this.location.back();
  }

  bodyToCheckbox() {
    if (this.body.rehabilitado == "No") {
      this.body.chkRehabilitado = false;
    } else {
      this.body.chkRehabilitado = true;
    }
    if (this.body.firmeza == "No") {
      this.body.chkFirmeza = false;
    } else {
      this.body.chkFirmeza = true;
    }
    if (this.body.archivada == "No") {
      this.body.chkArchivadas = false;
    } else {
      this.body.chkArchivadas = true;
    }
  }

  getComboTipoSancion() {
    this.sigaServices.get("busquedaSanciones_comboTipoSancion").subscribe(
      n => {
        this.tipoSancion = n.combooItems;
        this.getValueForCombo();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Control de fechas

  deshabilitarAcuerdo() {
    if (this.body.fechaAcuerdoDate != undefined) {
      //Check desmarcado y fecha informada
      this.disabledFechaFirme = false;
      this.disabledFechaAcuerdo = false;
      this.disabledChkFirmeza = false;
    } else {
      //check desmarcado y fecha no informada
      this.disabledFechaFirme = true;
      this.disabledChkFirmeza = true;
      this.disabledFechaAcuerdo = false;
    }
  }

  deshabilitarFirmeza() {
    if (this.body.fechaAcuerdoDate != undefined) {
      if (this.body.fechaFirmezaDate != undefined) {
        //Check desmarcado y fecha informada
        this.disabledPeriodoDesde = false;
      } else {
        //Check desmarcado y fecha no informada
        this.disabledPeriodoDesde = true;
        this.disabledPeriodoHasta = true;

        this.disabledRehabilitado = true;
        this.disabledChkRehabilitado = true;
        this.disabledChkArchivada = true;
        this.disabledFechaArchivada = true;

        this.disabledFechaFirme = false;

        this.body.fechaArchivadaDate = undefined;
        this.body.fechaRehabilitadoDate = undefined;
        this.body.fechaHastaDate = undefined;
        this.body.fechaDesdeDate = undefined;
        // this.body.chkArchivadas = false;
      }
    }
  }

  deshabilitarFechaDesde() {
    if (
      this.body.fechaFirmezaDate != undefined ||
      this.body.chkFirmeza == true
    ) {
      if (this.body.fechaDesdeDate != undefined) {
        // Fecha informada
        this.disabledPeriodoHasta = false;
        this.disabledPeriodoDesde = false;
      } else {
        // Fecha no informada
        this.disabledPeriodoHasta = true;
        this.disabledFechaArchivada = true;
        this.disabledRehabilitado = true;

        this.body.fechaArchivadaDate = undefined;
        this.body.fechaRehabilitadoDate = undefined;
        this.body.fechaHastaDate = undefined;
        // this.body.chkArchivadas = false;
      }
    }
  }

  deshabilitarFechaFin() {
    if (
      this.body.fechaDesdeDate != undefined &&
      this.body.fechaHastaDate != undefined &&
      this.disabledPeriodoDesde == false &&
      this.disabledPeriodoHasta == false
    ) {
      if (this.body.chkRehabilitado == true) {
        // Check marcado
        this.disabledChkRehabilitado = false;
        this.disabledRehabilitado = true;
        this.body.fechaRehabilitadoDate = undefined;
        this.disabledChkArchivada = false;
      } else {
        this.disabledRehabilitado = false;
        this.disabledChkRehabilitado = false;
      }
    }
  }

  deshabilitarFechaRehabilitado() {
    if (this.disabledChkRehabilitado == false) {
      if (this.body.chkRehabilitado == true) {
        if (
          this.body.chkArchivadas == true &&
          this.disabledChkArchivada == false
        ) {
          this.disabledFechaArchivada = true;
          this.body.fechaArchivadaDate = undefined;
          // this.body.chkArchivadas = false;
        } else {
          this.disabledFechaArchivada = false;
        }
      } else {
        if (this.body.fechaRehabilitadoDate != undefined) {
          if (this.body.chkArchivadas == true) {
            this.disabledChkArchivada = false;
            this.disabledFechaArchivada = true;
            this.body.fechaArchivadaDate = undefined;
            // this.body.chkArchivadas = false;
          } else {
            this.disabledChkArchivada = false;
            this.disabledFechaArchivada = false;
          }
        } else {
          this.disabledRehabilitado = false;
          this.disabledChkArchivada = true;
          this.disabledFechaArchivada = true;

          this.body.fechaArchivadaDate = undefined;
          // this.body.chkArchivadas = false;
        }
      }
    }
  }

  deshabilitarFechas() {
    this.deshabilitarAcuerdo();
    this.deshabilitarFirmeza();
    this.deshabilitarFechaDesde();
    this.deshabilitarFechaFin();
    this.deshabilitarFechaRehabilitado();
  }

  detectDateInput() {
    if (this.body.fechaAcuerdoDate == undefined) {
      this.disabledFechaFirme = true;
      this.disabledPeriodoDesde = true;
      this.disabledPeriodoHasta = true;
      this.disabledFechaArchivada = true;
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledChkFirmeza = true;

      this.body.fechaArchivadaDate = undefined;
      this.body.fechaRehabilitadoDate = undefined;
      this.body.fechaHastaDate = undefined;
      this.body.fechaDesdeDate = undefined;
      this.body.fechaFirmezaDate = undefined;
      // this.body.chkArchivadas = false;
    } else if (this.body.fechaFirmezaDate == undefined) {
      this.disabledPeriodoDesde = true;
      this.disabledPeriodoHasta = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
      this.disabledRehabilitado = true;

      this.body.fechaArchivadaDate = undefined;
      this.body.fechaRehabilitadoDate = undefined;
      this.body.fechaHastaDate = undefined;
      this.body.fechaDesdeDate = undefined;
      // this.body.chkArchivadas = false;
    } else if (this.body.fechaDesdeDate == undefined) {
      this.disabledPeriodoHasta = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;
      this.disabledRehabilitado = true;

      this.body.fechaArchivadaDate = undefined;
      this.body.fechaRehabilitadoDate = undefined;
      this.body.fechaHastaDate = undefined;
      // this.body.chkArchivadas = false;
    } else if (this.body.fechaHastaDate == undefined) {
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;

      this.body.fechaArchivadaDate = undefined;
      // this.body.chkArchivadas = false;

      this.body.fechaRehabilitadoDate = undefined;
    } else if (this.body.fechaFirmezaDate == undefined) {
      this.disabledPeriodoHasta = true;
      this.disabledPeriodoDesde = true;
      this.disabledRehabilitado = true;
      this.disabledChkRehabilitado = true;
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;

      this.body.fechaArchivadaDate = undefined;
      this.body.fechaRehabilitadoDate = undefined;
      this.body.fechaDesdeDate = undefined;
      this.body.fechaHastaDate = undefined;
      // this.body.chkArchivadas = false;
    } else if (this.body.fechaRehabilitadoDate == undefined) {
      this.disabledChkArchivada = true;
      this.disabledFechaArchivada = true;

      this.body.fechaArchivadaDate = undefined;
      // this.body.chkArchivadas = false;
    }
  }

  // Reestablecer

  restore() {
    if (
      sessionStorage.getItem("nSancion") != null &&
      sessionStorage.getItem("nSancion") != undefined
    ) {
      this.newBody = JSON.parse(sessionStorage.getItem("nSancion"));

      this.fillFieldsInsertMode(this.body, this.newBody);
      // this.body.nombre = this.newBody[0].nombre;
      // this.body.fechaNacimiento = this.newBody[0].fechaNacimiento;
      // this.body.nif = this.newBody[0].nif;
      // this.body.idColegio = this.newBody[0].numeroInstitucion;

      this.restoreInsertMode();
    } else {
      this.restoreBody = JSON.parse(sessionStorage.getItem("rowData"));
      this.body = this.restoreBody;
      this.getComboTipoSancion();
      this.transformDates(this.body);
      this.bodyToCheckbox();
      this.deshabilitarFechas();
    }
  }

  restoreInsertMode() {
    this.body.fechaAcuerdoDate = undefined;
    this.disabledFechaAcuerdo = true;
    this.body.fechaFirmezaDate = undefined;
    this.disabledFechaFirme = true;
    this.body.fechaDesdeDate = undefined;
    this.disabledPeriodoDesde = true;
    this.body.fechaHastaDate = undefined;
    this.disabledPeriodoHasta = true;
    this.body.fechaRehabilitadoDate = undefined;
    this.disabledRehabilitado = true;
    this.body.fechaArchivadaDate = undefined;
    this.disabledFechaArchivada = true;
    this.body.chkRehabilitado = false;
    this.disabledChkRehabilitado = true;
    this.body.chkFirmeza = false;
    this.disabledChkFirmeza = true;
    this.body.chkArchivadas = false;
    this.disabledChkArchivada = true;
    this.body.texto = "";
    this.body.observaciones = "";
    this.body.refColegio = "";
    this.body.tipoSancion = "";
  }

  // Deshabilitar la fecha acuerdo en función de colegio y sanción

  disableFields() {
    if (
      this.body.idColegio != null &&
      this.body.idColegio != undefined &&
      this.body.idColegio != "" &&
      this.body.tipoSancion != null &&
      this.body.tipoSancion != undefined &&
      this.body.tipoSancion != "" &&
      this.disabledField == false
    ) {
      this.disabledFechaAcuerdo = false;
      this.disabledGuardar = false;
      return false;
    } else {
      this.disabledGuardar = true;
      this.disabledFechaAcuerdo = true;
      return true;
    }
  }

  // Control para el botón guardar

  save() {
    if (
      this.body.fechaFirmezaDate != null &&
      this.body.fechaAcuerdoDate <= this.body.fechaFirmezaDate &&
      this.body.chkFirmeza
    ) {
      if (
        this.body.fechaDesdeDate != null &&
        this.body.fechaFirmezaDate <= this.body.fechaDesdeDate
      ) {
        if (
          this.body.fechaHastaDate != null &&
          this.body.fechaDesdeDate <= this.body.fechaHastaDate
        ) {
          if (
            (this.body.fechaRehabilitadoDate != null &&
              this.body.fechaHastaDate <= this.body.fechaRehabilitadoDate) ||
            this.body.chkRehabilitado
          ) {
            this.saveSancion();
          } else if (this.body.fechaRehabilitadoDate == null) {
            this.saveSancion();
          } else {
            this.showFail("Fecha rehabilitación incorrecta");
          }
        } else if (this.body.fechaHastaDate == null) {
          this.saveSancion();
        } else {
          this.showFail("Fecha período ejecución incorrecta");
        }
      } else if (this.body.fechaDesdeDate == null) {
        this.saveSancion();
      } else {
        this.showFail("Fecha período ejecución incorrecta");
      }
    } else if (this.body.fechaFirmezaDate == null) {
      this.saveSancion();
    } else {
      this.showFail("Fecha firmeza incorrecta");
    }
  }

  saveSancion() {
    this.controlChkBox();
    if (
      sessionStorage.getItem("nuevaSancion") != null &&
      sessionStorage.getItem("nuevaSancion") != undefined
    ) {
      this.insertRecord();
      sessionStorage.removeItem("nuevaSancion");
      sessionStorage.removeItem("nSancion");
    } else {
      this.editRecord();
    }
  }

  insertRecord() {
    // this.progressSpinner = true;
    this.progressSpinner = true;
    this.sigaServices
      .post("busquedaSanciones_insertSanction", this.body)
      .subscribe(
        data => {
          sessionStorage.setItem("SancionInsertada", "true");
          this.progressSpinner = false;
        },
        error => {
          this.showFail("La acción no se ha realizado correctamente");
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.router.navigate(["busquedaSanciones"]);
        }
      );
  }

  editRecord() {
    this.progressSpinner = true;
    this.sigaServices
      .post("busquedaSanciones_updateSanction", this.body)
      .subscribe(
        data => {
          sessionStorage.setItem("SancionInsertada", "true");
          this.progressSpinner = false;
        },
        error => {
          this.showFail("La acción no se ha realizado correctamente");
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.return();
        }
      );
  }

  controlChkBox() {
    if (this.body.chkFirmeza == true) {
      this.body.firmeza = "Sí";
    } else {
      this.body.firmeza = "No";
    }

    if (this.body.chkRehabilitado == true) {
      this.body.rehabilitado = "Sí";
    } else {
      this.body.rehabilitado = "No";
    }

    if (this.body.chkArchivadas == true) {
      this.body.archivada = "Sí";
    } else {
      this.body.archivada = "No";
    }
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  clear() {
    this.msgs = [];
  }
}
