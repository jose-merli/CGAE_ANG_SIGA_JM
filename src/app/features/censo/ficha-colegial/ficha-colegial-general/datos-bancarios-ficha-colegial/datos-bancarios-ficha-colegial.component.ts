import { Component, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cardService } from "./../../../../../_services/cardSearch.service";
import { Location } from "@angular/common";
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { AutoComplete, Dialog, Calendar, DataTable } from 'primeng/primeng';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialColegialesObject } from '../../../../../models/FichaColegialColegialesObject';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { ComboEtiquetasItem } from '../../../../../models/ComboEtiquetasItem';
import * as moment from 'moment';
import { BusquedaSancionesItem } from '../../../../../models/BusquedaSancionesItem';
import { BusquedaSancionesObject } from '../../../../../models/BusquedaSancionesObject';
import { DatosBancariosItem } from '../../../../../models/DatosBancariosItem';
import { DatosBancariosObject } from '../../../../../models/DatosBancariosObject';

@Component({
  selector: 'app-datos-bancarios-ficha-colegial',
  templateUrl: './datos-bancarios-ficha-colegial.component.html',
  styleUrls: ['./datos-bancarios-ficha-colegial.component.scss']
})
export class DatosBancariosFichaColegialComponent implements OnInit {
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  idPersona: any;
  esColegiado: boolean;
  isColegiadoEjerciente: boolean = false;
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  activacionTarjeta: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  desactivarVolver: boolean = true;
  fichasPosibles = [
    {
      key: "bancarios",
      activa: false
    },
  ];
  selectedItemBancarios: number = 10;

  openFicha: boolean = false;
  tarjetaBancarios: string;
  tarjetaBancariosNum: string;
  datosBancarios: DatosBancariosItem[] = [];
  numSelectedBancarios: number = 0;
  bodyDatosBancarios: DatosBancariosItem;
  selectAllBancarios: boolean = false;
  selectMultipleBancarios: boolean = false;
  selectedDatosBancarios;
  icon: string;
  msgs: Message[];
  progressSpinner: boolean = false;
  searchDatosBancariosIdPersona = new DatosBancariosObject();
  mostrarDatosBancarios: boolean = false;
  DescripcionDatosBancarios;
  camposDesactivados: boolean = false;
  isLetrado: boolean;
  permisos: boolean = true;
  colsBancarios;
  rowsPerPage;
  constructor(private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private cardService: cardService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    // private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe,
    private location: Location,) { }

  ngOnInit() {
    this.generalBody = new FichaColegialGeneralesItem();
    this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.checkGeneralBody = new FichaColegialGeneralesItem();
    this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));

    this.idPersona = this.generalBody.idPersona;
    if (sessionStorage.getItem("esColegiado")) {
      this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
    } else {
      this.esColegiado = true;
    }
    this.getLetrado();
    if (this.esColegiado) {
      if (this.colegialesBody.situacion == "20") {
        this.isColegiadoEjerciente = true;
      } else {
        this.isColegiadoEjerciente = false;
      }
    }


    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    if (!this.esNewColegiado && this.generalBody.idPersona != null && this.generalBody.idPersona != undefined) {
      this.onInitDatosBancarios(); 
    }

    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "288";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaBancariosNum = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        this.tarjetaBancarios = this.tarjetaBancariosNum;
      }
    );
    this.colsBancarios = [
      {
        field: "titular",
        header: "Titular"
      },
      {
        field: "iban",
        header: "Código de cuenta (IBAN)"
      },
      {
        field: "bic",
        header: "Banco (BIC)"
      },
      {
        field: "uso",
        header: "Uso"
      },
      {
        field: "fechaFirmaServicios",
        header: "Fecha firma del mandato de servicios"
      },
      {
        field: "fechaFirmaProductos",
        header: "Fecha firma del mandato de productos"
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

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }

  activarPaginacionBancarios() {
    if (!this.datosBancarios || this.datosBancarios.length == 0) return false;
    else return true;
  }

  actualizaSeleccionadosBancarios(selectedDatos) {
    this.numSelectedBancarios = selectedDatos.length;
  }

  onInitDatosBancarios() {
    this.bodyDatosBancarios = new DatosBancariosItem();
    this.bodyDatosBancarios.idPersona = this.idPersona;
    this.bodyDatosBancarios.historico = false;
    this.searchDatosBancarios();
  }

  onChangeSelectAllBancarios() {
    if (this.selectAllBancarios === true) {
      this.numSelectedBancarios = this.datosBancarios.length;
      this.selectMultipleBancarios = false;
      this.selectedDatosBancarios = this.datosBancarios;
    } else {
      this.selectedDatosBancarios = [];
      this.numSelectedBancarios = 0;
    }
  }

  isSelectMultipleBancarios() {
    this.selectMultipleBancarios = !this.selectMultipleBancarios;
    if (!this.selectMultipleBancarios) {
      this.numSelectedBancarios = 0;
      this.selectedDatosBancarios = [];
    } else {
      this.selectAllBancarios = false;
      this.selectedDatosBancarios = [];
      this.numSelectedBancarios = 0;
    }
  }

  confirmarEliminar(selectedDatos) {
    // let cargosBorrados = 0;
    // let cargosExistentes = 0;
    // for (let i in selectedDatos) {
    //   // if (selectedDatos[i].uso != "ABONO/SJCS" && selectedDatos[i].uso != "/SJCS" && selectedDatos[i].uso != "ABONO") {
    //   cargosBorrados++;
    //   // }
    // }
    // for (let i in this.datosBancarios) {
    //   for (let i2 in selectedDatos) {
    //     if (this.datosBancarios[i].uso == selectedDatos[i2].uso) {
    //       cargosExistentes++;
    //     }
    //   }

    // }
    // if (cargosExistentes <= cargosBorrados) {
    let mess = this.translateService.instant("censo.alterMutua.literal.revisionServiciosyFacturasCuentas");
    this.icon = "fa fa-trash-alt";
    let keyConfirmation = "alterMutua";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: this.icon,
      accept: () => {
        this.eliminarRegistro(selectedDatos);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];

        this.selectedDatosBancarios = [];
        this.selectMultipleBancarios = false;
      }
    });
    // } else {
    //   let mess = this.translateService.instant("messages.deleteConfirmation");
    //   let icon = "fa fa-trash-alt";
    //   this.confirmationService.confirm({
    //     message: mess,
    //     icon: icon,
    //     accept: () => {
    //       this.eliminarRegistro(selectedDatos);
    //     },
    //     reject: () => {
    //       this.msgs = [
    //         {
    //           severity: "info",
    //           summary: "info",
    //           detail: this.translateService.instant(
    //             "general.message.accion.cancelada"
    //           )
    //         }
    //       ];

    //       this.selectedDatosBancarios = [];
    //       this.selectMultipleBancarios = false;
    //     }
    //   });
    // }
  }

  eliminarRegistro(selectedDatos) {
    this.progressSpinner = true;

    let item = new DatosBancariosItem();

    item.idCuentas = [];
    item.idPersona = this.idPersona;

    selectedDatos.forEach(element => {
      item.idCuentas.push(element.idCuenta);
    });

    this.sigaServices.post("datosBancarios_delete", item).subscribe(
      data => {
        this.progressSpinner = false;
        if (selectedDatos.length == 1) {
          this.showSuccessDetalle(
            this.translateService.instant("messages.deleted.success")
          );
        } else {
          this.showSuccessDetalle(
            selectedDatos.length +
            " " +
            this.translateService.instant("messages.deleted.selected.success")
          );
        }
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        // this.historico = true;
        this.selectedDatosBancarios = [];
        this.selectMultipleBancarios = false;
        this.searchDatosBancarios();
      }
    );
  }
  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
  }
  searchDatosBancarios() {
    if (this.emptyLoadFichaColegial != true) {
      this.progressSpinner = true;
      this.sigaServices
        .postPaginado(
          "fichaDatosBancarios_datosBancariosSearch",
          "?numPagina=1",
          this.bodyDatosBancarios
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.searchDatosBancariosIdPersona = JSON.parse(data["body"]);
            this.datosBancarios = this.searchDatosBancariosIdPersona.datosBancariosItem;
          },
          error => {
            this.searchDatosBancariosIdPersona = JSON.parse(error["error"]);
            this.showFailDetalle(
              JSON.stringify(
                this.searchDatosBancariosIdPersona.error.description
              )
            );
            console.log(error);
            this.progressSpinner = false;
          }, () => {
            if (this.datosBancarios.length > 0) {
              this.mostrarDatosBancarios = true;
              for (let i = 0; i <= this.datosBancarios.length - 1; i++) {
                this.DescripcionDatosBancarios = this.datosBancarios[i];
              }
            }
          }
        );

    }
  }
  showFailDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }
  redireccionarDatosBancarios(dato) {
    if (this.camposDesactivados != true) {
      if (!this.selectMultipleBancarios) {
        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idCuenta", dato[0].idCuenta);
          //sessionStorage.setItem("permisos", JSON.stringify(this.permisos));

          if (dato[0].fechaBaja != null || this.tarjetaBancarios == '2') {
            sessionStorage.setItem("permisos", "false");
          } else {
            sessionStorage.setItem("permisos", "true");
          }
          sessionStorage.setItem("allBanksData", JSON.stringify(this.datosBancarios));
          sessionStorage.setItem("editar", "true");
          sessionStorage.setItem("idPersona", this.idPersona);
          sessionStorage.setItem("fichaColegial", "true");
          sessionStorage.setItem("datosCuenta", JSON.stringify(dato[0]));
          sessionStorage.setItem("usuarioBody", JSON.stringify(dato[0]));
          sessionStorage.setItem("historico", JSON.stringify(this.bodyDatosBancarios.historico));

        } else {
          sessionStorage.setItem("editar", "false");
        }

        let migaPan = "";

        if (this.esColegiado) {
          migaPan = this.translateService.instant("menu.censo.fichaColegial");
        } else {
          migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
        }

        sessionStorage.setItem("migaPan", migaPan);
        this.router.navigate(["/consultarDatosBancarios"]);
      } else {
        this.numSelectedBancarios = this.selectedDatosBancarios.length;
      }
    }
  }

  nuevaCuentaBancaria() {
    sessionStorage.setItem("allBanksData", JSON.stringify(this.datosBancarios));
    sessionStorage.setItem("nombreTitular", JSON.stringify(this.generalBody.nombre));
    sessionStorage.removeItem("permisos");
    sessionStorage.setItem("fichaColegial", "true");
    sessionStorage.setItem(
      "usuarioBody",
      sessionStorage.getItem("personaBody")
    );
    sessionStorage.setItem("editar", "false");

    let migaPan = "";

    if (this.esColegiado) {
      migaPan = this.translateService.instant("menu.censo.fichaColegial");
    } else {
      migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
    }

    sessionStorage.setItem("migaPan", migaPan);
    this.router.navigate(["/consultarDatosBancarios"]);
  }

  searchHistoricoDatosBancarios() {
    this.bodyDatosBancarios.historico = true;
    this.bodyDatosBancarios.idPersona = this.idPersona;
    this.searchDatosBancarios();
  }
  activadoBotonesLetrado() {
    if (this.isLetrado) {
      return true;
    } else {
      return this.camposDesactivados;
    }
  }
  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
  }
  clear() {
    this.msgs = [];
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
}
