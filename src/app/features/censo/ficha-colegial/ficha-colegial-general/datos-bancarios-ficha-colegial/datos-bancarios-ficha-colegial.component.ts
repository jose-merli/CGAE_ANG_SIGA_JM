import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, SimpleChanges, OnChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
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
import { Table } from 'primeng/table';

@Component({
  selector: 'app-datos-bancarios-ficha-colegial',
  templateUrl: './datos-bancarios-ficha-colegial.component.html',
  styleUrls: ['./datos-bancarios-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosBancariosFichaColegialComponent implements OnInit, OnChanges {
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  @Input() esColegiado: boolean = null;
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
  @Input() tarjetaBancarios: string;
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
  permisos: boolean = true;
  colsBancarios;
  rowsPerPage;
  mostrarNumero:Boolean = false;
  message;
  messageNoContent;
  @Input() isLetrado;
  @Input() idPersona;
  @Input() openBanca;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @ViewChild("tableBancarios")
  tableBancarios: Table;
  disabledAction: boolean = false;
  constructor(private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    // private sanitizer: DomSanitizer,
    private router: Router) { }

  ngOnInit() {
    if (sessionStorage.getItem("disabledAction") == "true") { // Esto disablea tela de cosas funciona como medio permisos. 
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    this.getCols();

  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (this.esColegiado != null)
      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }
    if (this.idPersona != undefined) {
      if (this.bodyDatosBancarios == undefined && (this.tarjetaBancarios == "3" || this.tarjetaBancarios == "2")){
        this.onInitDatosBancarios();
        if(this.tarjetaBancarios == "3"){
          this.permisos = true;
        }else{
          this.permisos = false;
        }
        this.getLetrado();
      }
    }
    if (this.openBanca == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('bancarios');
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
  }



  getCols() {
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
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  activarPaginacionBancarios() {
    if (!this.datosBancarios || this.datosBancarios.length == 0) return false;
    else return true;
  }

  actualizaSeleccionadosBancarios(selectedDatos) {
    this.numSelectedBancarios = selectedDatos.length;
  }

  onInitDatosBancarios() {
    this.selectAllBancarios = false;
    this.selectMultipleBancarios = false;
    this.selectedDatosBancarios = [];
    this.bodyDatosBancarios = new DatosBancariosItem();
    this.bodyDatosBancarios.idPersona = this.idPersona;
    this.bodyDatosBancarios.historico = false;
    this.searchDatosBancarios();
  }

  ocultarHistoricoDatosBancarios(){
    this.progressSpinner = true;
    this.onInitDatosBancarios();
  }

  clickFilaBancarios(event) {
    if (event.data && !event.data.fechaBaja && this.bodyDatosBancarios.historico) {
      this.selectedDatosBancarios.pop();
    }
  }
  onChangeSelectAllBancarios() {
    if (this.selectAllBancarios === true) {
      if (this.bodyDatosBancarios.historico) {
        this.numSelectedBancarios = this.selectedDatosBancarios.length;
        this.selectMultipleBancarios = false;
        this.selectedDatosBancarios = this.datosBancarios.filter(dato => dato.fechaBaja != undefined)
      } else {
        this.numSelectedBancarios = this.datosBancarios.length;
        this.selectMultipleBancarios = false;
        this.selectedDatosBancarios = this.datosBancarios;
      }

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
    let mess = this.translateService.instant("censo.alterMutua.literal.revisionServiciosyFacturasCuentas");
    this.icon = "fa fa-trash-alt";
    let keyConfirmation = "deleteBancarios";

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
        //this.progressSpinner = false;
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
        //console.log(error);
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
    this.mostrarNumero = false;
    if (this.emptyLoadFichaColegial != true) {
      //this.progressSpinner = true;
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
            if (this.datosBancarios.length > 0) {
              sessionStorage.setItem("ibanAlterMutua", this.datosBancarios[0].iban.toString());
            }
          },
          error => {
            this.mostrarNumero = true;
            this.searchDatosBancariosIdPersona = JSON.parse(error["error"]);
            this.showFailDetalle(
              JSON.stringify(
                this.searchDatosBancariosIdPersona.error.description
              )
            );
            //console.log(error);
            this.progressSpinner = false;
          }, () => {
            if (this.datosBancarios.length > 0) {
              this.mostrarDatosBancarios = true;
              for (let i = 0; i <= this.datosBancarios.length - 1; i++) {
                this.DescripcionDatosBancarios = this.datosBancarios[i];
              }
            }
            if (this.datosBancarios.length == 0) {
              this.message = this.datosBancarios.length.toString();
              this.messageNoContent = this.translateService.instant(
                "general.message.no.registros"
              );
              this.mostrarNumero = true;
  
            } else {
              this.message = this.datosBancarios.length.toString();
              this.mostrarNumero = true;
  
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
    this.selectedDatosBancarios = [];
    this.selectMultipleBancarios = false;
    this.selectAllBancarios = false;
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
  clear() {
    this.msgs = [];
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
  onChangeRowsPerPages(event) {
    this.selectedItemBancarios = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableBancarios.reset();
  }
  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
  }

}
