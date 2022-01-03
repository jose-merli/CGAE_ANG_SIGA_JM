import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Location } from "@angular/common";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { DataTable } from "primeng/datatable";
import { DatosBancariosItem } from "./../../../../../../app/models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../../../../app/models/DatosBancariosObject";
import { BancoBicItem } from "./../../../../../../app/models/BancoBicItem";
import { BancoBicObject } from "./../../../../../../app/models/BancoBicObject";
import { DatosMandatosItem } from "./../../../../../../app/models/DatosMandatosItem";
import { DatosMandatosObject } from "./../../../../../../app/models/DatosMandatosObject";
import { DatosBancariosSearchAnexosItem } from "./../../../../../../app/models/DatosBancariosSearchAnexosItem";
import { DatosBancariosAnexoObject } from "./../../../../../../app/models/DatosBancariosAnexoObject";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Router } from '@angular/router';
//import "rxjs/Rx";
import { saveAs } from "file-saver/FileSaver";
import { CommonsService } from '../../../../../_services/commons.service';
import { MultiSelect } from 'primeng/multiselect';
import { RevisionAutLetradoItem } from "../../../../../models/RevisionAutLetradoItem";

@Component({
  selector: "app-consultar-datos-bancarios",
  templateUrl: "./consultar-datos-bancarios.component.html",
  styleUrls: ["./consultar-datos-bancarios.component.scss"]
})
export class ConsultarDatosBancariosComponent implements OnInit {
  //fichasPosibles: any[];

  openFichaCuentaBancaria: boolean = true;
  openFichaDatosMandatos: boolean = false;
  openFichaListadoFicherosAnexos: boolean = false;
  progressSpinner: boolean = false;
  editar: boolean = false;
  blockCrear: boolean = true;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  editarMandato: boolean = false;
  formValido: boolean;
  ibanValido: boolean;
  bicValido: boolean;
  titularValido: boolean;
  identificacionValida: boolean;
  tipoCuentaSeleccionado: boolean;
  revisionCuentas: boolean = false;
  nuevo: boolean = false;
  checkProducto: boolean = false;
  checkServicio: boolean;
  checkFirma: boolean = true;
  isSelectedProducto: boolean;
  isSelectedServicio: boolean;
  isCheckedProducto: boolean;
  isCheckedServicio: boolean;
  isInterEmpresaProducto: boolean = false;
  isInterEmpresaServicio: boolean = false;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  displayFirmar: boolean = false;
  displayNuevo: boolean = false;
  isEditable: boolean = false;
  isCancelEdit: boolean = false;
  mandatoAnexoVacio: boolean = false;
  activarMsgErrorProd: boolean;
  activarMsgErrorServ: boolean;
  editarExt: boolean = false;
  //activarRestablecer: boolean = false;
  fichaMisDatos: boolean = false;
  idCuenta: String;
  idPersona: String;
  bic: String;
  banco: String;

  nifTitular: String;
  titular: String;
  textFilter: String;
  textSelected: String = "{0} registros seleccionados";
  registroEditable: String;
  descripcion: String;
  firmaFechaDate: Date;
  firmaLugar: String;
  iban: String;
  tipoCIF: String;
  isLetrado: Boolean;
  msgs: Message[];
  usuarioBody: DatosBancariosItem = new DatosBancariosItem();
  cols: any = [];
  cols2: any = [];
  rowsPerPage: any = [];
  tipoCuenta: any[] = [];
  selectedTipo: any[] = [];
  combooItemsProducto: any[] = [];
  combooItemsServicio: any[] = [];
  uploadedFiles: any[] = [];
  selectedEsquemaProducto: any = {};
  selectedEsquemaServicio: any = {};
  comboProductoServicio: any[] = [];
  selectedProductoServicio: any = {};
  datosPrevios: any = {};
  tipoIdentificacion: String;
  deshabilitaDescarga: boolean = true;

  currentRoute: String;
  idClaseComunicacion: String;
  keys: any[] = [];

  numSelected: number = 0;
  selectedItem: number = 10;

  datefechaUso: Date;
  datefirmaFecha: Date;

  permisos: Boolean = true;
  body: DatosBancariosItem = new DatosBancariosItem();
  checkBody: DatosBancariosItem = new DatosBancariosItem();

  bodySearch: DatosBancariosObject = new DatosBancariosObject();

  bodyBancoBic: BancoBicItem = new BancoBicItem();
  bodyBancoBicSearch: BancoBicObject = new BancoBicObject();

  bodyDatosMandatos: DatosMandatosItem = new DatosMandatosItem();
  bodyDatosMandatosSearch: DatosMandatosObject = new DatosMandatosObject();

  bodyDatosBancariosAnexo: DatosBancariosSearchAnexosItem = new DatosBancariosSearchAnexosItem();
  bodyDatosBancariosAnexoSearch: DatosBancariosAnexoObject = new DatosBancariosAnexoObject();
  bodyEditar: DatosBancariosSearchAnexosItem = new DatosBancariosSearchAnexosItem();

  displayAuditoria: boolean = false;
  showGuardarAuditoria: boolean = false;
  disabledAction: boolean = false;
  disabledFirma: boolean = false;
  file: File = undefined;
  ocultarMotivo: boolean = undefined;
  showComunicar: boolean = false;

  editarAnexo: boolean = false;
  lengthCountryCode: Number = 0;
  // historico:boolean = false;
  activaServicios: boolean = false;
  activaProductos: boolean = false;
  @ViewChild("table")
  table: DataTable;
  selectedDatos;
  migaPan;
  progressSpinner2: boolean = true;

  resaltadoDatosBancarios: boolean = false;
  resaltadoFirma:boolean = false;
  resaltadoNuevo:boolean = false;
  
  @ViewChild("fubauto") fubauto;

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonsService,
    private router: Router

  ) { }

  ngOnInit() {
    this.resaltadoDatosBancarios=true;
    this.progressSpinner = true;
    // this.resaltadoDatosBancarios=false;
    this.resaltadoFirma=false;
    this.resaltadoNuevo=false;
    this.migaPan = sessionStorage.getItem("migaPan");
    this.currentRoute = this.router.url;
    sessionStorage.removeItem('consultasSearch');
    if (sessionStorage.getItem("permisos")) {
      this.permisos = JSON.parse(sessionStorage.getItem("permisos"));
    }

    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    if (sessionStorage.getItem("isLetrado")) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
      // sessionStorage.removeItem("fichaColegial");
    } else {
      this.isLetrado = true;
    }
    // busquedaPerJuridica_datosBancariosInsert
    if (sessionStorage.getItem("fichaColegial")) {
      this.fichaMisDatos = true;
      sessionStorage.removeItem("fichaColegial");
    }
    sessionStorage.setItem("editarDatosBancarios", "true");
    this.textFilter = "Elegir";

    // if(sessionStorage.getItem("historico") == "true"){
    //   this.historico = true;
    // }else{
    //   this.historico = false;
    // }

    // obtener parametro para saber si se oculta la auditoria
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.tipoIdentificacion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.tipoCuenta = [
      { name: "Abono", code: "A" },
      { name: "Cargo", code: "C" },
      { name: "Cuenta SCJS", code: "S" }
    ];
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody[0] != undefined) {
      this.usuarioBody = this.usuarioBody[0];
    }
    if (sessionStorage.getItem("idPersona")) {
      this.idPersona = JSON.parse(sessionStorage.getItem("idPersona"));
      this.usuarioBody.idPersona = this.idPersona;
      sessionStorage.setItem("usuarioBody", JSON.stringify(this.usuarioBody));
    } else {
      this.idPersona = this.usuarioBody.idPersona;
    }
    this.idCuenta = sessionStorage.getItem("idCuenta");
    // sessionStorage.removeItem("idCuenta");

    this.bic = sessionStorage.getItem("bic");
    sessionStorage.removeItem("bic");

    this.registroEditable = sessionStorage.getItem("editar");

    if (this.registroEditable == "true") {
      // editar
      this.cargarModoEdicion();
    } else {
      // nuevo
      this.cargarModoNuevoRegistro();
    }

    if (sessionStorage.getItem("nombreTitular")) {
      this.body.titular = JSON.parse(sessionStorage.getItem("nombreTitular"));
    }
    // Listado ficheros anexos

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

    this.cols = [{ field: "descripcion", header: "Descripcion" }];
    this.cols2 = [
      { field: "tipo", header: "Tipo" },
      { field: "tipoMandato", header: "Tipo mandato" },
      { field: "fechaUso", header: "Fecha Uso" },
      { field: "firmaFecha", header: "Fecha de firma" },
      { field: "firmaLugar", header: "Lugar de la firma" }
    ];

    this.editar = JSON.parse(sessionStorage.getItem("editar"));

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          let parametroOcultarMotivo = JSON.parse(data.body);
          if (parametroOcultarMotivo.parametro == "S" || parametroOcultarMotivo.parametro == "s") {
            this.ocultarMotivo = true;
          } else if (parametroOcultarMotivo.parametro == "N" || parametroOcultarMotivo.parametro == "n") {
            this.ocultarMotivo = false;
          } else {
            this.ocultarMotivo = undefined;
          }
        },
        err => {
          console.log(err);
        }, () => {
          this.progressSpinner2 = false;
        }
      );


    this.progressSpinner = false;
  }

  downloadAnexo(selectedDatos) {
    let dato = selectedDatos;
    let filename;

    this.sigaServices
      .post("busquedaPerJuridica_fileDownloadInformation", dato)
      .subscribe(
        data => {
          let a = JSON.parse(data["body"]);
          filename = a.value + "." + a.label;
        },
        error => {
          console.log(error);
        },
        () => {
          this.sigaServices
            .postDownloadFiles("busquedaPerJuridica_downloadFile", dato)
            .subscribe(data => {
              const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
              if (blob.size == 0) {
                this.showFail("messages.general.error.ficheroNoExiste");
              } else {
                //let filename = "2006002472110.pdf";
                saveAs(blob, filename);
              }
            });
        }
      );
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  // Abrir fichasPosibles

  abrirFichaCuentaBancaria() {
    this.openFichaCuentaBancaria = !this.openFichaCuentaBancaria;
  }

  abrirFichaDatosMandatos() {
    this.openFichaDatosMandatos = !this.openFichaDatosMandatos;
  }

  abrirFichaListadoFicherosAnexos() {
    this.openFichaListadoFicherosAnexos = !this.openFichaListadoFicherosAnexos;
  }

  // Métodos datosCuentaBancaria

  cargarModoEdicion() {
    this.cargarDatosCuentaBancaria();

    this.cargarDatosMandatos();
    this.nuevo = false;
    this.editar = true;

    this.cargarDatosAnexos();
  }

  cargarModoNuevoRegistro() {
    //if (this.usuarioBody[0].denominacion != undefined) {
    if (this.usuarioBody.denominacion != undefined) {
      this.body.titular = this.usuarioBody.denominacion;
      this.checkBody.titular = this.usuarioBody.denominacion;
    }

    //this.body.nifTitular = this.usuarioBody[0].nif;

    this.nuevo = true;
    this.editar = false;
  }

  // Funciones datos cuenta bancaria
  cargarDatosCuentaBancaria() {
    this.body.idPersona = this.idPersona;
    this.body.idCuenta = this.idCuenta;
    this.checkBody.idCuenta = this.idCuenta;
    this.checkBody.idPersona = this.idPersona;

    this.sigaServices
      .postPaginado("datosCuentaBancaria_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.bodySearch = JSON.parse(data["body"]);
          this.body = this.bodySearch.datosBancariosItem[0];
          this.checkBody = JSON.parse(
            JSON.stringify(this.bodySearch.datosBancariosItem[0])
          );
          this.iban = this.body.iban;
          this.bic = this.body.bic;
          if (this.registroEditable == "false") {
            this.body.bic = this.bic;
          }
          this.banco = this.body.banco;

          if (this.body == undefined) {
            this.body = new DatosBancariosItem();
          }

          this.rellenarComboTipoCuenta(this.body.tipoCuenta);
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(this.bodySearch.error.message.toString());
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.activarCamposMandatos();
          this.autogenerarDatos();
          this.checkBody = JSON.parse(JSON.stringify(this.body));
          this.progressSpinner = false;
        }
      );
  }

  rellenarComboTipoCuenta(body) {
    this.selectedTipo = [];
    var salir = false;
    this.tipoCuenta.forEach(element1 => {
      body.forEach(element2 => {
        if (!salir && element1.code == element2) {
          this.selectedTipo.push(element1);
          salir = true;
        } else {
          salir = false;
        }
      });
    });
  }

  // busquedaPerJuridica_datosBancariosInsert
  guardarRegistro() {
    this.progressSpinner = true;
    this.resaltadoDatosBancarios= false;
    this.resaltadoFirma=false;
    this.resaltadoNuevo=false;
    this.body.revisionCuentas = this.revisionCuentas;
    this.body.idPersona = this.idPersona;

    this.getArrayTipoCuenta();

    //this.body.motivo = "registro creado";
    this.sigaServices.post("datosCuentaBancaria_insert", this.body).subscribe(
      data => {
        this.idCuenta = JSON.parse(data["body"]).id;
        //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
        let peticion = new RevisionAutLetradoItem();
        peticion.idPersona = this.body.idPersona.toString();
        peticion.fechaProcesamiento = new Date();
        this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();
        this.showSuccess("Se han guardado correctamente los datos");
        sessionStorage.setItem("editar", "true");
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(this.bodySearch.error.message.toString());
        console.log(error);
        this.progressSpinner = false;
        //Error al insertar los mandatos de las cuentas
        if (
          this.bodySearch.error.message.toString() ==
          "messages.censo.direcciones.facturacion"
        ) {
          this.eliminarItem();
          this.progressSpinner = false;
        }
      },
      () => {
        if (this.ocultarMotivo == false) {
          this.cerrarAuditoria();
        }
        this.body.idCuenta = this.idCuenta;
        this.selectedTipo = [];
        this.body.motivo = undefined;
        this.registroEditable = "true";
        this.searchDatosBancarios();
        this.cargarModoEdicion();
        this.progressSpinner = false;
        this.cargarDatosCuentaBancaria();
        this.activarCamposMandatos();
      }
    );
  }

  searchDatosBancarios() {
    this.progressSpinner = true;
    this.sigaServices
      .postPaginado(
        "fichaDatosBancarios_datosBancariosSearch",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          let searchDatosBancariosIdPersona = JSON.parse(data["body"]);
          sessionStorage.setItem("allBanksData", JSON.stringify(searchDatosBancariosIdPersona.datosBancariosItem));
        },
        error => {
        }
      );
  }

  modo() {
    this.registroEditable = sessionStorage.getItem("editar");
    if (this.registroEditable == "false") {
      this.guardarRegistro();
    } else {
      this.editarRegistro();
    }
  }

  solicitarGuardarRegistro() {
    this.progressSpinner = true;
    this.resaltadoDatosBancarios= false;
    this.resaltadoFirma=false;
    this.resaltadoNuevo=false;
    this.body.revisionCuentas = this.revisionCuentas;
    this.body.idPersona = this.idPersona;

    this.getArrayTipoCuenta();

    this.sigaServices
      .post("busquedaPerJuridica_solicitudInsertBanksData", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.body = JSON.parse(data["body"]);
          this.showSuccess("Se ha presentado correctamente la solicitud");

          sessionStorage.setItem("editar", "true");
          let err = JSON.parse(data["body"]);
          if (err.error.description != "") {
            sessionStorage.setItem("solimodifMensaje", err.error.description);
          }
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          if (this.bodySearch.error.message != undefined) {
            this.showFail(this.bodySearch.error.message.toString());
          } else {
            this.showFailDefecto();
          }
          console.log(error);
          //Error al insertar los mandatos de las cuentas
          if (this.bodySearch.error.message != undefined) {
            if (
              this.bodySearch.error.message.toString() ==
              "messages.censo.direcciones.facturacion"
            ) {
              this.eliminarItem();
            }
          }

          this.progressSpinner = false;

        },
        () => {
          this.location.back();
          this.idCuenta = this.body.id;
          this.cerrarAuditoria();
          this.selectedTipo = [];
          this.body.motivo = null;
          this.searchDatosBancarios();
          this.cargarModoEdicion();
          this.idCuenta = this.body.idCuenta;
          this.activarCamposMandatos();
        }
      );
  }

  showFailDefecto() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  editarRegistro() {
    if (!this.editar) {
      if (this.isLetrado) {
        this.solicitarGuardarRegistro();
      } else {
        this.guardarRegistro();
      }
    } else {
      if (this.isLetrado) {
        this.solicitarGuardarRegistro();
      } else {
        this.progressSpinner = true;
        this.resaltadoDatosBancarios= false;
        this.resaltadoFirma=false;
        this.resaltadoNuevo=false;
        this.body.revisionCuentas = this.revisionCuentas;
        this.body.idPersona = this.idPersona;

        this.getArrayTipoCuenta();

        this.sigaServices
          .post("datosCuentaBancaria_update", this.body)
          .subscribe(
            data => {
              this.progressSpinner = false;
              this.body.status = data.status;
              
              //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
              let peticion = new RevisionAutLetradoItem();
              peticion.idPersona = this.body.idPersona.toString();
              peticion.fechaProcesamiento = new Date();
              this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();
              
              this.showSuccess("Se han guardado correctamente los datos");
            },
            error => {
              this.bodySearch = JSON.parse(error["error"]);
              this.showFail(this.bodySearch.error.message.toString());
              console.log(error);
              //Error al insertar los mandatos de las cuentas
              if (
                this.bodySearch.error.message.toString() ==
                "messages.censo.direcciones.facturacion"
              ) {
                this.eliminarItem();
              }
              this.progressSpinner = false;
            },
            () => {
              // auditoria
              this.cerrarAuditoria();
              this.body.motivo = null;
              this.searchDatosBancarios();
              this.idCuenta = this.body.idCuenta;
              this.cargarDatosMandatos();
              this.cargarDatosAnexos();
              this.cargarDatosCuentaBancaria();
              this.activarCamposMandatos();

            }

          );
      }
    }
  }

  eliminarItem() {
    let values: any[] = [];
    this.selectedTipo.forEach((value: any, key: number) => {
      if (value.code != "C") {
        values.push(value);
      }
    });
    this.selectedTipo = values;
  }

  getArrayTipoCuenta() {
    this.body.tipoCuenta = [];
    this.selectedTipo.forEach(element => {
      this.body.tipoCuenta.push(element.code);
    });
  }

  restablecer() {
    this.resaltadoDatosBancarios=true;
    this.confirmationService.confirm({
      message: "¿Desea restablecer los datos?",
      icon: "fa fa-info",
      accept: () => {
        this.activarCamposMandatos();
        this.cargarDatosCuentaBancaria();
        this.resaltadoDatosBancarios=false;
        this.resaltadoFirma=false;
        this.resaltadoNuevo=false;
        //this.activarRestablecer = true;
      }
    });
  }

  igualInicio() {
    let validarTipoCuenta = [];
    if (this.selectedTipo.length > 0) {
      this.selectedTipo.forEach(element => {
        validarTipoCuenta.push(element.code);
      });

      this.body.tipoCuenta = validarTipoCuenta.sort();
      let orderTipoCuenta = [];
      if (this.checkBody.tipoCuenta != undefined) {
        orderTipoCuenta = this.checkBody.tipoCuenta.sort();
      }
      this.checkBody.tipoCuenta = orderTipoCuenta;
      if (JSON.stringify(this.body) == JSON.stringify(this.checkBody)) {
        if (this.checkBody.tipoCuenta == null || this.checkBody.tipoCuenta == undefined) {
          if (validarTipoCuenta.length > 0) {
            return false;
          } else {
            return true;
          }
        } else {
          if (
            JSON.stringify(validarTipoCuenta.sort()) ==
            JSON.stringify(this.checkBody.tipoCuenta.sort())
          ) {
            return true;
          } else {
            return false;
          }
        }

      } else {
        return false;
      }
    } else {
      if (JSON.stringify(this.body) == JSON.stringify(this.checkBody)) {
        return true;
      } else {
        return false;
      }
    }
  }

  restablecerNuevo() {
    this.confirmationService.confirm({
      message: "¿Desea restablecer los datos?",
      icon: "fa fa-info",
      accept: () => {
        if (this.usuarioBody.denominacion != undefined) {
          this.body.titular = this.usuarioBody.denominacion;
        } else {
          this.body.titular = "";
        }
        //this.body.nifTitular = this.usuarioBody[0].nif;
        this.ibanValido = undefined;
        this.bicValido = undefined;
        this.body.iban = "";
        this.iban = "";
        this.body.bic = "";
        this.body.banco = "";
        this.body.cuentaContable = "";
        this.textSelected = "";
        this.selectedTipo = [];

        this.nuevo = true;
        this.editar = false;
        this.checkBody = JSON.parse(JSON.stringify(this.body));
        this.resaltadoDatosBancarios=false;
        this.resaltadoFirma=false;
        this.resaltadoNuevo=false;
      }
    });
  }

  autogenerarDatos() {
    this.body.iban = this.iban;

    if (this.body.iban != null && this.body.iban != "") {
      var ccountry = this.body.iban.substring(0, 2);
      if (ccountry == "ES") {
        this.editarExt = false;

        if (this.isValidIBAN()) {
          this.recuperarBicBanco();

          this.ibanValido = true;
        } else {
          this.body.banco = "";
          this.body.bic = "";

          this.ibanValido = false;
        }
      } else {
        this.checkIbanExt(ccountry);
      }
    } else {
      this.body.banco = "";
      this.body.bic = "";

      this.ibanValido = false;
    }
  }

  recuperarBicBanco() {
    if (this.editarExt) {
      if (this.validarBIC()) {
        this.bicValido = true;
      } else {
        this.bicValido = false;
      }
    } else {
      this.sigaServices
        .post("datosCuentaBancaria_BIC_BANCO", this.body)
        .subscribe(
          data => {
            this.bodyBancoBicSearch = JSON.parse(data["body"]);
            this.bodyBancoBic = this.bodyBancoBicSearch.bancoBicItem[0];

            this.body.banco = this.bodyBancoBic.banco;
            this.body.bic = this.bodyBancoBic.bic;
            this.iban = this.body.iban.replace(/\s/g, "");

            // this.editar = false;
          },
          error => {
            this.bodyBancoBicSearch = JSON.parse(error["error"]);
            this.showFail(this.bodyBancoBicSearch.error.message.toString());
          }
        );
    }
  }

  // Validar IDENTIFICACIÓN

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

  // Resto de validaciones

  isValidIBAN(): boolean {
    this.body.iban = this.body.iban.replace(/\s/g, "");

    // IBAN ESPAÑOL
    if (this.body.iban.length != 24) {
      return false;
    }

    let firstLetters = this.body.iban.substring(0, 1);
    let secondfirstLetters = this.body.iban.substring(1, 2);
    let num1 = this.getnumIBAN(firstLetters);
    let num2 = this.getnumIBAN(secondfirstLetters);

    let isbanaux = String(num1) + String(num2) + this.body.iban.substring(2);
    // Se mueve los 6 primeros caracteres al final de la cadena.
    isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);

    //Se calcula el resto, llamando a la función modulo97, definida más abajo
    let resto = this.modulo97(isbanaux);
    if (resto == "1") {
      return true;
    } else {
      return false;
    }
  }

  getnumIBAN(letter) {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters.search(letter) + 10;
  }

  modulo97(iban) {
    var parts = Math.ceil(iban.length / 7);
    var remainer = "";

    for (var i = 1; i <= parts; i++) {
      remainer = String(
        parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97
      );
    }

    return remainer;
  }
  validarIban(): boolean {
    if (
      (this.body.iban != null ||
        this.body.iban != undefined ||
        this.body.iban != "") &&
      (this.isValidIBAN() || this.isValidIbanExt())
    ) {
      this.ibanValido = true;
      return true;
    } else {
      this.ibanValido = false;
      return false;
    }
  }

  checkIbanExt(ccountry) {
    this.sigaServices
      .post("datosCuentaBancaria_getLengthCodCountry", ccountry)
      .subscribe(
        data => {
          this.lengthCountryCode = JSON.parse(data["body"]);
        },
        error => { },
        () => {
          if (this.isValidIbanExt()) {
            this.ibanValido = true;
            // Habilitamos el BIC

            this.editarExt = true;

            if (this.bic == undefined) {
              if (this.registroEditable == "false") {
                this.body.banco = "BANCO EXTRANJERO";
              } else {
                this.body.banco = "";
              }
              this.body.bic = "";
            } else {
              if (this.iban.substring(0, 2) != "ES") {
                if (this.bic == undefined) {
                  this.body.bic = "";
                } else {
                  if (
                    this.body.bic.charAt(4) !=
                    this.iban.substring(0, 2).charAt(0) &&
                    this.body.bic.charAt(5) !=
                    this.iban.substring(0, 2).charAt(1)
                  ) {
                    this.body.bic = "";
                  }
                }
                // } else {
                //   this.body.bic = this.bic;
                // }

                if (this.registroEditable == "false") {
                  this.body.bic = "";
                }

                this.body.banco = "BANCO EXTRANJERO";
              } else {
                this.body.bic = this.bic;
                this.body.banco = this.banco;
                this.editarExt = false;
              }
            }
          } else {
            this.body.banco = "";
            this.body.bic = "";
            this.editarExt = false;
            this.ibanValido = false;
          }

          if (this.editarExt) {
            this.editar = true;
          } else {
            this.editar = false;
          }

          //sessionStorage.removeItem("bic");
        }
      );
  }

  isValidIbanExt(): boolean {
    if (this.body.iban.length == this.lengthCountryCode) {
      return true;
    } else {
      return false;
    }
  }

  validarTitular(): boolean {
    if (this.body.titular != undefined && this.body.titular.trim() != "") {
      this.titularValido = true;
      return true;
    } else {
      this.titularValido = false;
      return false;
    }
  }

  validarTipoCuenta(): boolean {
    if (this.selectedTipo.length >= 1) {
      this.tipoCuentaSeleccionado = true;
      return true;
    } else {
      this.tipoCuentaSeleccionado = false;
      return false;
    }
  }

  validarBIC(): boolean {
    var ccountry = this.body.iban.substring(0, 2);
    if (
      this.body.bic != null &&
      this.body.bic != undefined &&
      this.body.bic != "" &&
      (this.body.bic.length >= 8) &&
      this.body.bic.charAt(4) == ccountry.charAt(0) &&
      this.body.bic.charAt(5) == ccountry.charAt(1)
    ) {
      this.bicValido = true;
      return true;
    } else {
      this.bicValido = false;
      return false;
    }
  }

  // MENSAJE PARA INCIDENCIA 574 EN CASO DE CAMBIAR.
  // this.confirmationService.confirm({
  //   message: "¿Quiere revisar las suscripciones y facturas para asignarlas según corresponda a esta cuenta?",
  //   icon: "fa fa-info",
  //   accept: () => {
  //     this.revisionCuentas = true;
  //     this.registroEditable = sessionStorage.getItem("editar");
  //   },
  //   reject: () => {
  //     this.revisionCuentas = true;
  //     this.registroEditable = sessionStorage.getItem("editar");
  //     if (this.registroEditable == "false") {
  //       this.body.noRevisarServicios = true;
  //       // if (this.isLetrado) {
  //       //   this.solicitarGuardarRegistro();
  //       // } else {
  //       //   this.guardarRegistro();
  //       // }
  //     } else {
  //       // dependiendo de esta variable, se muestra o no la auditoria
  //       this.body.motivo = null;
  //       if (this.ocultarMotivo) {
  //         if (this.isLetrado) {
  //           this.solicitarGuardarRegistro();
  //         } else {
  //           this.editarRegistro();
  //         }
  //       } else {
  //         this.displayAuditoria = true;
  //         this.showGuardarAuditoria = false;
  //       }
  //     }
  //   }
  // });


  validarCuentaSJCS() {
    if (this.registroEditable == "true") {
      this.confirmationService.confirm({
        message: this.translateService.instant("censo.alterMutua.literal.revisionServiciosyFacturasCuentas"),
        icon: "fa fa-info",
        accept: () => {
          this.revisionCuentas = true;
          this.registroEditable = sessionStorage.getItem("editar");
          if (this.registroEditable == "false") {
            if (this.isLetrado) {
              this.solicitarGuardarRegistro();
            } else {
              this.guardarRegistro();
            }
          } else {
            // dependiendo de esta variable, se muestra o no la auditoria
            this.body.motivo = null;
            if (this.ocultarMotivo) {
              if (this.isLetrado) {
                this.solicitarGuardarRegistro();
              } else {
                this.editarRegistro();
              }
            } else {
              this.displayAuditoria = true;
              this.showGuardarAuditoria = false;
            }
          }
        },
        reject: () => {
          this.showGuardarAuditoria = false;
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
    } else {
      this.validarCuentaCargo();
    }

  }

  validaCargoEliminado() {
    // let bancos = JSON.parse(sessionStorage.getItem("allBanksData"));
    // let numBancos = 0;
    // for (let i in bancos) {
    //   if (bancos[i].uso != "ABONO/SJCS" && bancos[i].uso != "/SJCS" && bancos[i].uso != "ABONO") {
    //     numBancos++;
    //   }
    // }
    // if (numBancos <= 1) {
    this.confirmationService.confirm({
      message: this.translateService.instant("censo.alterMutua.literal.revisionServiciosyFacturasCuentas"),
      icon: "fa fa-info",
      accept: () => {
        this.revisionCuentas = true;
        this.registroEditable = sessionStorage.getItem("editar");
        if (this.registroEditable == "false") {
          if (this.isLetrado) {
            this.solicitarGuardarRegistro();
          } else {
            this.guardarRegistro();
          }
        } else {
          // dependiendo de esta variable, se muestra o no la auditoria
          this.body.motivo = null;
          if (this.ocultarMotivo) {
            if (this.isLetrado) {
              this.solicitarGuardarRegistro();
            } else {
              this.editarRegistro();
            }
          } else {
            this.displayAuditoria = true;
            this.showGuardarAuditoria = false;
          }
        }
      },
      reject: () => {
        this.revisionCuentas = false;
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
        // this.registroEditable = sessionStorage.getItem("editar");
        // if (this.registroEditable == "false") {
        //   this.guardarRegistro();
        // } else {
        //   // dependiendo de esta variable, se muestra o no la auditoria
        //   this.body.motivo = undefined;
        //   if (this.ocultarMotivo) {
        //     this.editarRegistro();
        //   } else {
        //     this.displayAuditoria = true;
        this.showGuardarAuditoria = false;
        //   }
        // }
      }
    });
    // } else {
    //   if (this.registroEditable == "false") {
    //     if (this.isLetrado) {
    //       this.solicitarGuardarRegistro();
    //     } else {
    //       this.guardarRegistro();
    //     }
    //   } else {
    //     if (this.isLetrado) {
    //       if (this.ocultarMotivo == false) {
    //         this.displayAuditoria = true;
    //       } else {
    //         this.displayAuditoria = false;
    //         this.editarRegistro();
    //       }

    //       this.showGuardarAuditoria = false;
    //       this.body.motivo = null;
    //     } else {
    //       this.editarRegistro();
    //     }
    //   }
    // }
  }

  validarCuentaCargo() {
    // if (this.registroEditable == "true") {

    // } else {
    this.confirmationService.confirm({
      message: this.translateService.instant("censo.alterMutua.literal.preguntaRevisionServiciosyFacturasCuentas"),
      icon: "fa fa-info",
      accept: () => {
        this.revisionCuentas = true;
        this.registroEditable = sessionStorage.getItem("editar");
        if (this.registroEditable == "false") {
          if (this.isLetrado) {
            this.solicitarGuardarRegistro();
          } else {
            this.guardarRegistro();
          }
        } else {
          // dependiendo de esta variable, se muestra o no la auditoria
          this.body.motivo = null;
          if (this.ocultarMotivo) {
            if (this.isLetrado) {
              this.solicitarGuardarRegistro();
            } else {
              this.editarRegistro();
            }
          } else {
            this.displayAuditoria = true;
            this.showGuardarAuditoria = false;
          }
        }
      },
      reject: () => {
        this.revisionCuentas = false;
        this.body.noRevisarServicios = true;
        this.registroEditable = sessionStorage.getItem("editar");
        if (this.registroEditable == "false") {
          this.body.noRevisarServicios = true;
          if (this.isLetrado) {
            this.solicitarGuardarRegistro();
          } else {
            this.guardarRegistro();
          }
        } else {
          // dependiendo de esta variable, se muestra o no la auditoria
          this.body.motivo = null;
          if (this.ocultarMotivo) {
            if (this.isLetrado) {
              this.solicitarGuardarRegistro();
            } else {
              this.editarRegistro();
            }
          } else {
            this.displayAuditoria = true;
            this.showGuardarAuditoria = false;
          }
        }
        // this.revisionCuentas = false;
        // this.registroEditable = sessionStorage.getItem("editar");
        // if (this.registroEditable == "false") {
        //   this.guardarRegistro();
        // } else {
        //   // dependiendo de esta variable, se muestra o no la auditoria
        //   this.body.motivo = undefined;
        //   if (this.ocultarMotivo) {
        //     this.editarRegistro();
        //   } else {
        //     this.displayAuditoria = true;
        //     this.showGuardarAuditoria = false;
        //   }
        // }
      }
    });
    // }
  }

  validarIdentificacion() {
    if (this.checkTypeCIF(this.body.nifTitular)) {
      this.identificacionValida = true;
      return true;
    } else {
      this.identificacionValida = false;
      return false;
    }
  }

  condiciones() {
    if (
      this.body.iban == null ||
      this.body.iban == undefined ||
      this.body.iban == "" ||
      (this.body.iban && this.validarIban() == false) ||
      this.body.bic == null ||
      this.body.bic == undefined ||
      this.body.bic == "" ||
      (this.editarExt && this.body.bic && this.validarBIC() == false) ||
      this.selectedTipo.length == 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  validarFormulario() {
    var revisionCuentas;
    if (
      this.validarIban() &&
      this.validarBIC() &&
      this.validarTipoCuenta() &&
      this.validarTitular()
      //&&     this.validarIdentificacion()
    ) {
      this.formValido = true;
      this.getArrayTipoCuenta();
      if (this.checkBody.tipoCuenta != undefined) {
        if (this.checkBody.tipoCuenta.indexOf("C") !== -1 || this.checkBody.tipoCuenta.indexOf("A") !== -1 ||
          this.checkBody.tipoCuenta.indexOf("S") !== -1) {
          // let bancos = JSON.parse(sessionStorage.getItem("allBanksData"));
          // let numBancos = 0;
          // let encontrado = 
          // for (let i in bancos) {
          //   if (bancos[i].uso != "ABONO/SJCS" && bancos[i].uso != "SJCS" && bancos[i].uso != "ABONO") {
          //     numBancos++;
          //   }
          // }
          // if (numBancos <= 1) {
          //   this.validarCuentaSJCS();

          //Si se ha eliminado alguna cuenta muestra un aviso de la revision de las facturas
          if (this.checkBody.tipoCuenta.indexOf("C") !== -1 && this.body.tipoCuenta.indexOf("C") == -1 ||
            this.checkBody.tipoCuenta.indexOf("A") !== -1 && this.body.tipoCuenta.indexOf("A") == -1 ||
            this.checkBody.tipoCuenta.indexOf("S") !== -1 && this.body.tipoCuenta.indexOf("S") == -1) {
            this.validaCargoEliminado();
            //Si se añade una cuenta de cargo se muestra un mensaje preguntando la revision de las facturas
          } else if (this.body.tipoCuenta.indexOf("C") !== -1 && this.body.tipoCuenta.indexOf("C") !== -1) {
            this.validarCuentaCargo();
          } else {
            this.revisionCuentas = false;
            this.registroEditable = sessionStorage.getItem("editar");
            if (this.registroEditable == "false") {
              if (this.isLetrado) {
                this.solicitarGuardarRegistro();
              } else {
                this.guardarRegistro();
              }
            } else {
              if (this.ocultarMotivo == false) {
                this.displayAuditoria = true;
              } else {
                this.displayAuditoria = false;
                this.editarRegistro();
              }

              this.showGuardarAuditoria = false;
              this.body.motivo = null;
            }
          }
        } else {
          this.validarCuentaCargo();
        }
      } else if (this.checkBody.tipoCuenta == undefined) {
        let bancos = JSON.parse(sessionStorage.getItem("allBanksData"));
        let numBancos = 0;
        // let encontrado = 
        for (let i in bancos) {
          if (bancos[i].uso != "ABONO/SJCS" && bancos[i].uso != "/SJCS" && bancos[i].uso != "ABONO") {
            numBancos++;
          }
        }
        if (numBancos <= 1) {
          this.validarCuentaSJCS();
        } else if (this.body.tipoCuenta.indexOf("C") !== -1) {
          this.validarCuentaCargo();
        } else {
          this.revisionCuentas = false;
          this.registroEditable = sessionStorage.getItem("editar");
          if (this.registroEditable == "false") {
            if (this.isLetrado) {
              this.solicitarGuardarRegistro();
            } else {
              this.guardarRegistro();
            }
          } else {
            if (this.ocultarMotivo == false) {
              this.displayAuditoria = true;
            } else {
              this.displayAuditoria = false;
              this.editarRegistro();
            }

            this.showGuardarAuditoria = false;
            this.body.motivo = null;
          }
        }
        // Editando cuenta cargo
      } else if (this.body.tipoCuenta.indexOf("C") !== -1 && this.checkBody.tipoCuenta != undefined) {
        if (this.checkBody.tipoCuenta.indexOf("C") == -1) {
          this.validarCuentaCargo();
        } else {
          this.revisionCuentas = false;
          this.registroEditable = sessionStorage.getItem("editar");
          if (this.registroEditable == "false") {
            if (this.isLetrado) {
              this.solicitarGuardarRegistro();
            } else {
              this.guardarRegistro();
            }
          } else {
            if (this.ocultarMotivo == false) {
              this.displayAuditoria = true;
            } else {
              this.displayAuditoria = false;
              this.editarRegistro();
            }

            this.showGuardarAuditoria = false;
            this.body.motivo = null;
          }
        }
        // creando cargo
      } else if (this.body.tipoCuenta.indexOf("C") !== -1 && this.checkBody.tipoCuenta == undefined) {
        this.validarCuentaCargo();
      } else {
        this.revisionCuentas = false;
        this.registroEditable = sessionStorage.getItem("editar");
        if (this.registroEditable == "false") {
          if (this.isLetrado) {
            this.solicitarGuardarRegistro();
          } else {
            this.guardarRegistro();
          }
        } else {
          if (this.ocultarMotivo == false) {
            this.displayAuditoria = true;
          } else {
            this.displayAuditoria = false;
            this.editarRegistro();
          }

          this.showGuardarAuditoria = false;
          this.body.motivo = null;
        }
      }
    } else {
      this.formValido = false;
    }
  }

  // Funciones datos datosMandatos

  cargarDatosMandatos() {
    this.bodyDatosMandatos.idPersona = this.idPersona;
    this.bodyDatosMandatos.idCuenta = this.idCuenta;

    this.sigaServices
      .postPaginado(
        "datosMandatos_search",
        "?numPagina=1",
        this.bodyDatosMandatos
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyDatosMandatosSearch = JSON.parse(data["body"]);
          this.bodyDatosMandatos = this.bodyDatosMandatosSearch.mandatosItem[0];

          if (this.bodyDatosMandatos == undefined) {
            this.bodyDatosMandatos = new DatosMandatosItem();
            this.mandatoAnexoVacio = true;
          } else {
            this.mandatoAnexoVacio = false;
          }

          this.rellenarComboEsquema();
        },
        error => {
          this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
          this.showFail(this.bodyDatosMandatosSearch.error.message.toString());
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  rellenarComboEsquema() {
    this.sigaServices.get("datosMandatos_comboEsquema").subscribe(
      data => {
        this.combooItemsProducto = data.combooItems;
        this.combooItemsServicio = data.combooItems;

        this.selectedEsquemaProducto = this.combooItemsProducto[0];
        this.selectedEsquemaServicio = this.combooItemsServicio[0];

        if (this.bodyDatosMandatos != null) {
          var producto = this.filtrarItemsComboEsquema(
            this.combooItemsProducto,
            this.bodyDatosMandatos.esquemaProducto
          );

          this.selectedEsquemaProducto = producto[0];

          var servicio = this.filtrarItemsComboEsquema(
            this.combooItemsServicio,
            this.bodyDatosMandatos.esquemaServicio
          );
          this.selectedEsquemaServicio = servicio[0];
        }
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(this.bodySearch.error.message.toString());
      }
    );
  }

  filtrarItemsComboEsquema(comboEsquema, buscarElemento) {
    return comboEsquema.filter(function (obj) {
      return obj.value == buscarElemento;
    });
  }

  onChangeEsquemaProducto(e) {
    this.selectedEsquemaProducto = e.value;
    if (this.capturarEventoInterempresa(e, this.selectedEsquemaProducto)) {
      this.isInterEmpresaProducto = true;
      this.isSelectedProducto = true;
      this.checkProducto = false;
    } else {
      this.isInterEmpresaProducto = false;
      this.isSelectedProducto = false;
    }
  }

  onChangeEsquemaServicio(e) {
    this.selectedEsquemaServicio = e.value;
    if (this.capturarEventoInterempresa(e, this.selectedEsquemaServicio)) {
      this.isInterEmpresaServicio = true;
      this.isSelectedServicio = true;
      this.checkServicio = false;
    } else {
      this.isInterEmpresaServicio = false;
      this.isSelectedServicio = false;
    }
  }

  capturarEventoInterempresa(evento, esquema): boolean {
    if (evento && esquema.value == "2") {
      return true;
    } else {
      return false;
    }
  }

  guardarMandato() {
    this.bodyDatosMandatos.idPersona = this.idPersona;
    this.bodyDatosMandatos.idCuenta = this.idCuenta;

    if (this.activaServicios && !this.activaProductos) {
      if (this.selectedEsquemaServicio) {
        this.bodyDatosMandatos.idMandato = this.bodyDatosMandatos.idMandatoServicio;
        this.bodyDatosMandatos.esquema = this.selectedEsquemaServicio.value;
        this.bodyDatosMandatos.tipoId = this.bodyDatosMandatos.tipoIdServicio;
        this.bodyDatosMandatos.identif = this.bodyDatosMandatos.identifServicio;
        this.bodyDatosMandatos.referencia = this.bodyDatosMandatos.referenciaServicio;
        this.guardar(this.bodyDatosMandatos);
      }
    } else if (!this.activaServicios && this.activaProductos) {
      if (this.selectedEsquemaProducto) {
        this.bodyDatosMandatos.idMandato = this.bodyDatosMandatos.idMandatoProducto;
        this.bodyDatosMandatos.esquema = this.selectedEsquemaProducto.value;
        this.bodyDatosMandatos.tipoId = this.bodyDatosMandatos.tipoIdProducto;
        this.bodyDatosMandatos.identif = this.bodyDatosMandatos.identifProducto;
        this.bodyDatosMandatos.referencia = this.bodyDatosMandatos.referenciaProducto;
        this.guardar(this.bodyDatosMandatos);
      }
    } else {
      if (this.selectedEsquemaServicio) {
        this.bodyDatosMandatos.idMandato = this.bodyDatosMandatos.idMandatoServicio;
        this.bodyDatosMandatos.esquema = this.selectedEsquemaServicio.value;
        this.bodyDatosMandatos.tipoId = this.bodyDatosMandatos.tipoIdServicio;
        this.bodyDatosMandatos.identif = this.bodyDatosMandatos.identifServicio;
        this.bodyDatosMandatos.referencia = this.bodyDatosMandatos.referenciaServicio;
        this.guardar(this.bodyDatosMandatos);
      }
      if (this.selectedEsquemaProducto) {
        this.bodyDatosMandatos.idMandato = this.bodyDatosMandatos.idMandatoProducto;
        this.bodyDatosMandatos.esquema = this.selectedEsquemaProducto.value;
        this.bodyDatosMandatos.tipoId = this.bodyDatosMandatos.tipoIdProducto;
        this.bodyDatosMandatos.identif = this.bodyDatosMandatos.identifProducto;
        this.bodyDatosMandatos.referencia = this.bodyDatosMandatos.referenciaProducto;
        this.guardar(this.bodyDatosMandatos);
      }
    }

  }

  guardar(body) {
    this.progressSpinner = true;
    this.sigaServices.post("datosMandatos_insert", body).subscribe(
      data => {
        this.progressSpinner = false;
        this.bodyDatosMandatos.status = data.status;
              
        //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
        let peticion = new RevisionAutLetradoItem();
        peticion.idPersona = this.body.idPersona.toString();
        peticion.fechaProcesamiento = new Date();
        this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();

        this.showSuccess("Se ha guardado el esquema");
      },
      error => {
        this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
        // this.showFail(this.bodyDatosMandatosSearch.error.message.toString());
        console.log(error);
        this.progressSpinner = false;
      }
    );
  }

  validarCheckProducto(): boolean {
    if (this.checkProducto === true) {
      this.isCheckedProducto = true;
      return true;
    } else {
      this.isCheckedProducto = false;
      return false;
    }
  }

  validarCheckServicio(): boolean {
    if (this.checkServicio === true) {
      this.isCheckedServicio = true;
      return true;
    } else {
      this.isCheckedServicio = false;
      return false;
    }
  }

  validarGuardarMandato() {
    if (
      ((this.isInterEmpresaProducto && this.validarCheckProducto()) ||
        !this.isInterEmpresaProducto) &&
      ((this.isInterEmpresaServicio && this.validarCheckServicio()) ||
        !this.isInterEmpresaServicio)
    ) {
      this.formValido = true;
      this.guardarMandato();

      this.activarMsgErrorProd = false;
      this.activarMsgErrorServ = false;
    } else {
      this.formValido = false;

      if (this.isSelectedProducto == true) {
        this.activarMsgErrorProd = true;
      }

      if (this.isSelectedServicio == true) {
        this.activarMsgErrorServ = true;
      }
    }
  }

  // Métodos listadoFicherosAnexos
  activarCamposMandatos() {
    this.activaServicios = false;
    this.activaProductos = false;
    for (let i in this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem) {
      if (this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].tipo == "MANDATO" && this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].tipoMandato == "SERVICIO" && this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].firmaFecha == undefined && this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].firmaFechaDate == undefined) {
        this.activaServicios = true;
      }
      if (this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].tipo == "MANDATO" && this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].tipoMandato == "PRODUCTO" && this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].firmaFecha == undefined && this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[i].firmaFechaDate == undefined) {
        this.activaProductos = true;
      }
    }
  }

  cargarDatosAnexos() {
    this.progressSpinner = false;
    this.bodyDatosBancariosAnexo.idPersona = this.idPersona;
    this.bodyDatosBancariosAnexo.idCuenta = this.idCuenta;
    this.resaltadoFirma=false;

    this.sigaServices
      .postPaginado(
        "anexos_search",
        "?numPagina=1",
        this.bodyDatosBancariosAnexo
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyDatosBancariosAnexoSearch = JSON.parse(data["body"]);
          this.bodyDatosBancariosAnexo = this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[0];

          if (this.bodyDatosBancariosAnexo == undefined) {
            this.bodyDatosBancariosAnexo = new DatosBancariosSearchAnexosItem();
            this.mandatoAnexoVacio = true;
          } else {
            this.mandatoAnexoVacio = false;
          }

          this.rellenarComboProductoServicio(
            this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem
          );
        },
        error => {
          this.bodyDatosBancariosAnexoSearch = JSON.parse(error["error"]);
          // this.showFail(
          //   this.bodyDatosBancariosAnexoSearch.error.message.toString()
          // );
          console.log(error);
          this.progressSpinner = false;
        }, () => {
          this.activarCamposMandatos();
        }
      );
  }

  rellenarComboProductoServicio(bodyDatosBancariosAnexo) {

    bodyDatosBancariosAnexo.forEach(element => {
      if (element.tipo === "MANDATO") {
        this.comboProductoServicio.push({
          label: element.tipoMandato,
          value: element.idMandato
        });
      }
    });

    this.selectedProductoServicio = this.comboProductoServicio[0];
  }

  onChangeComboProductoServicio(e) {
    this.selectedProductoServicio = e.value;
  }

  activarPaginacion() {
    if (this.bodyDatosBancariosAnexoSearch != null && this.bodyDatosBancariosAnexoSearch != undefined && 
      (!this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem ||
      this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.length == 0)
    )
      return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  // Operaciones insertar anexo

  mostrarDialogoNuevo() {
    this.displayNuevo = true;
  }

  validarInsertarAnexo(): boolean {
    if (
      this.datefechaUso != null &&
      this.selectedProductoServicio.length == 1
    ) {
      this.formValido = true;
    } else {
      this.formValido = false;
    }

    return this.formValido;
  }

  insertarAnexo() {
    this.bodyDatosBancariosAnexo.idPersona = this.idPersona;
    this.bodyDatosBancariosAnexo.idCuenta = this.idCuenta;
    this.bodyDatosBancariosAnexo.idAnexo = "";
    this.bodyDatosBancariosAnexo.idMandato = this.selectedProductoServicio;
    this.bodyDatosBancariosAnexo.esquema = "";
    this.bodyDatosBancariosAnexo.firmaLugar = "";
    this.bodyDatosBancariosAnexo.firmaFecha = null;

    this.bodyDatosBancariosAnexo.fechaUsoDate = this.datefechaUso;
    this.bodyDatosBancariosAnexo.descripcion = this.descripcion;

    this.progressSpinner = true;
    this.resaltadoNuevo=false;

    this.sigaServices
      .post("anexos_insert", this.bodyDatosBancariosAnexo)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyDatosBancariosAnexo.status = data.status;
          this.bodyDatosBancariosAnexo.id = data.id;
              
          //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
          let peticion = new RevisionAutLetradoItem();
          peticion.idPersona = this.body.idPersona.toString();
          peticion.fechaProcesamiento = new Date();
          this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();

          this.showSuccess("Se han guardado correctamente los datos");

          this.displayNuevo = false;
        },
        error => {
          this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
          this.showFail(this.bodyDatosMandatosSearch.error.message.toString());
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.limpiarDatosAnexo();
          this.activarCamposMandatos();
        }
      );
    this.activarCamposMandatos();
  }

  limpiarDatosAnexo() {
    this.descripcion = "";
    this.datefechaUso = null;
    this.selectedProductoServicio = [];
    this.comboProductoServicio = [];
    this.resaltadoNuevo=false;

    this.cargarDatosAnexos();
  }

  // Operaciones editar/firmar

  mostrarDialogoFirmar(selectedDatos) {
    let dato = selectedDatos;

    this.displayFirmar = true;
    this.disabledFirma = false;
    this.bodyDatosBancariosAnexo.idPersona = this.idPersona;
    this.bodyDatosBancariosAnexo.idCuenta = this.idCuenta;
    // if(dato.idAnexo != undefined)
    this.bodyDatosBancariosAnexo.idAnexo = dato.idAnexo;
    this.bodyDatosBancariosAnexo.idMandato = dato.idMandato;
    this.bodyDatosBancariosAnexo.tipoMandato = dato.tipoMandato;
    this.bodyDatosBancariosAnexo.esquema = "";

    if (dato.firmaLugar != null) {
      this.firmaLugar = dato.firmaLugar;
      this.disabledFirma = true;
    } else {
      this.firmaLugar = null;
    }

    if (dato.fechaUso != null) {
      let fUso = this.obtenerFecha(dato.fechaUso);
      this.bodyDatosBancariosAnexo.fechaUsoDate = new Date(fUso);
    } else {
      this.bodyDatosBancariosAnexo.fechaUsoDate = null;
    }

    if (dato.firmaFecha != null) {
      let fFirma = this.obtenerFecha(dato.firmaFecha);
      this.firmaFechaDate = new Date(fFirma);
    } else {
      this.firmaFechaDate = null;
    }

    this.datosPrevios = {
      firmaLugar: this.firmaLugar,
      firmaFechaDate: this.firmaFechaDate
    };
  }

  obtenerFecha(fecha): string {
    var firstElem = fecha.substring(0, fecha.indexOf("/"));
    var secondElem = fecha.substring(
      fecha.indexOf("/") + 1,
      fecha.lastIndexOf("/")
    );
    var lastElem = fecha.substring(fecha.lastIndexOf("/") + 1, fecha.length);

    return lastElem + "/" + secondElem + "/" + firstElem;
  }

  restablecerDatosFirma() {
    this.firmaLugar = this.datosPrevios.firmaLugar;
    this.firmaFechaDate = this.datosPrevios.firmaFechaDate;
    this.file = undefined;
    this.checkFirma = true;
    this.resaltadoFirma=false;
    this.resaltadoNuevo=false;
  }

  validarFirma(): boolean {
    if (
      this.checkFirma == true &&
      (this.firmaLugar != null || this.firmaLugar != undefined) &&
      this.firmaFechaDate != null
    ) {
      this.formValido = true;
    } else {
      this.formValido = false;
    }

    return this.formValido;
  }

  editarDescripcion() {
    var keepGoing = true;

    this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.forEach(
      (value: DatosBancariosSearchAnexosItem, key: number) => {
        if (keepGoing) {
          if (value.editar == true) {
            this.bodyEditar = new DatosBancariosSearchAnexosItem();
            this.bodyEditar.idPersona = value.idPersona;
            this.bodyEditar.idCuenta = value.idCuenta;
            this.bodyEditar.idAnexo = value.idAnexo;
            this.bodyEditar.idMandato = value.idMandato;
            this.bodyEditar.esquema = "";
            this.bodyEditar.firmaLugar = value.firmaLugar;

            if (value.fechaUso != null) {
              let fUso = this.obtenerFecha(value.fechaUso);
              this.bodyEditar.fechaUsoDate = new Date(fUso);
            } else {
              this.bodyEditar.fechaUsoDate = null;
            }

            if (value.firmaFecha != null) {
              let fecha = this.obtenerFecha(value.firmaFecha);
              let fFirma = fecha.replace(/\//g, "-");
              this.bodyEditar.firmaFechaDate = new Date(
                (fFirma += "T00:00:00.001Z")
              );
            } else {
              this.bodyEditar.firmaFecha = null;
            }

            this.bodyEditar.descripcion = value.descripcion;
            this.bodyEditar.tipo = value.tipo;
            keepGoing = false;
          }
        }
      }
    );

    this.actualizarDescripcionAnexo(this.bodyEditar);
  }

  comprobarCampoMotivo() {
    if (
      this.body.motivo != null &&
      this.body.motivo != "" &&
      this.body.motivo.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  firmarFicheroAnexo() {
    this.bodyDatosBancariosAnexo.firmaFechaDate = this.firmaFechaDate;
    this.bodyDatosBancariosAnexo.firmaLugar = this.firmaLugar;

    this.actualizar(this.bodyDatosBancariosAnexo);
    this.firmaLugar = this.datosPrevios.firmaLugar;
    this.firmaFechaDate = this.datosPrevios.firmaFechaDate;
    this.checkFirma = true;
    this.selectMultiple = false;
  }

  actualizar(body) {
    this.progressSpinner = true;
    this.sigaServices.post("anexos_update", body).subscribe(
      data => {
        this.progressSpinner = false;
        this.bodyDatosBancariosAnexo.status = data.status;
        this.resaltadoFirma=false;
              
        //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
        let peticion = new RevisionAutLetradoItem();
        peticion.idPersona = this.body.idPersona.toString();
        peticion.fechaProcesamiento = new Date();
        this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();

        if (this.file != undefined) {
          this.progressSpinner = true;

          this.sigaServices
            .postSendFileAndParametersDataBank(
              "busquedaPerJuridica_uploadFile",
              this.file,
              body.idPersona,
              body.idCuenta,
              body.idMandato,
              body.idAnexo,
              body.tipoMandato
            )
            .subscribe(data => {
              this.file = undefined;

              let idAnexo = this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.findIndex(x => x.idAnexo == this.selectedDatos.idAnexo &&
                x.idCuenta == this.selectedDatos.idCuenta && x.idMandato == this.selectedDatos.idMandato &&
                x.tipoMandato == this.selectedDatos.tipoMandato && x.descripcion == this.selectedDatos.descripcion);

              if (data.id != undefined && data.id != null && data.id != "") {
                this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[idAnexo].idFicheroFirma = data.id;
              }
              this.progressSpinner = false;
              this.showSuccess("Se han editado correctamente los datos");
              this.displayFirmar = false;
            },
              error => {
                this.showFailFile(
                  "Error al cargar el archivo. El tamaño del archivo no puede exceder de 1MB"
                );
                console.log(error);
                this.progressSpinner = false;
                this.displayFirmar = false;
              },
              () => {
                this.progressSpinner = false;
                this.displayFirmar = false;
              }
            );
        } else {
          this.showSuccess("Se han editado correctamente los datos");
          this.displayFirmar = false;
        }
      },
      error => {
        this.bodyDatosBancariosAnexoSearch = JSON.parse(error["error"]);
        this.showFail(
          this.bodyDatosBancariosAnexoSearch.error.message.toString()
        );
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        this.selectedProductoServicio = [];
        this.comboProductoServicio = [];
        this.fubauto.chooseLabel = "Seleccionar Archivo";

        this.cargarDatosAnexos();
        this.activarCamposMandatos();
      }
    );
  }

  actualizarDescripcionAnexo(body) {
    if (body.tipo == "ANEXO") {
      this.actualizar(body);
      this.editar = false;
    } else {
      this.showFail("message.error.editar.descripcion.mandato");
      this.selectedProductoServicio = [];
      this.comboProductoServicio = [];
      this.editar = false;
      this.editarAnexo = false;
      this.cargarDatosAnexos();
    }
  }

  onBasicUpload(event) {
    this.showInfo("Fichero adjuntado");
  }

  onEditCancel() {
    this.editar = false;
    this.editarAnexo = false;
  }

  editarCompleto(event) {
    let data = event.data;
    //compruebo si la edicion es correcta con la basedatos
    if (this.onlySpaces(data.descripcion)) {
      this.blockCrear = true;
    } else {
      this.editar = true;
      this.editarAnexo = true;
      this.blockCrear = false;
      this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.forEach(
        (value: DatosBancariosSearchAnexosItem, key: number) => {
          if (
            value.idMandato == data.idMandato &&
            value.idAnexo == data.idAnexo
          ) {
            value.editar = true;
          }
        }
      );

    }
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
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

  activaDescarga(evento) {
    if (evento.data.idFicheroFirma != null) {
      this.deshabilitaDescarga = false;
    } else {
      this.deshabilitaDescarga = true;
    }
  }

  controlarEdicion(evento) {
    this.activaDescarga(evento);
    if (!this.selectMultiple) {
      this.editar = true;
      this.editarAnexo = true;
    } else {
      this.editar = false;
      this.editarAnexo = false;
    }
  }

  // Métodos comunes
  ngOnDestroy() {
    sessionStorage.removeItem("idPersona");
    sessionStorage.removeItem("allBanksData");
    sessionStorage.removeItem("nombreTitular");
  }
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  showFailFile(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "Error", detail: mensaje });
  }

  backTo() {
    this.location.back();
  }

  uploadFile(event: any) {
    console.log("Event", event);
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (extensionArchivo == null) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;

      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.fubauto.chooseLabel = nombreCompletoArchivo;
    }
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Error al adjuntar la imagen"
    });
  }

  clear() {
    this.msgs = [];
  }

  //Diálogo de comunicación: ver y enviar servicio
  onComunicar(dato) {

    let tipo = "";

    let distinto = false;
    let anexo = dato.idAnexo;

    // if (dato.length == 1) {
    distinto = false;
    if (anexo == null) {
      tipo = "Orden";
    } else {
      tipo = "Anexo";
    }
    // } else {
    //   dato.forEach(element => {
    //     if (anexo == null) {
    //       tipo = "Orden";
    //       if (element.idAnexo != null) {
    //         if (!distinto)
    //           distinto = true;
    //       }
    //     } else {
    //       tipo = "Anexo";
    //       if (element.idAnexo == null) {
    //         if (!distinto)
    //           distinto = true;
    //       }
    //     }
    //   });
    // }


    if (!distinto) {
      sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString() + tipo);
      //IDMODULO de CENSO es 3
      sessionStorage.setItem("idModulo", '3');
      this.getDatosComunicar(tipo);


    } else {
      this.showInfo('Solo se puede comunicar un mismo tipo de mandato');
    }
  }



  getDatosComunicar(tipo) {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString() + tipo;

    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
          data => {
            this.keys = JSON.parse(data['body']).keysItem;

            // this.selectedDatos.forEach(element => {
            let keysValues = [];
            this.keys.forEach(key => {
              if (this.selectedDatos[key.nombre] != undefined) {
                keysValues.push(this.selectedDatos[key.nombre]);
              }
            })
            datosSeleccionados.push(keysValues);
            // });

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

  onEnviarComunicacion() {
    this.showComunicar = false;
  }

  fillFechaFirmada(event) {
    this.firmaFechaDate = event;
  }

  detectFechaFirmadaInput(event) {
    this.firmaFechaDate = event;
  }

  fillFechaUso(event) {
    this.datefechaUso = event;
  }

  detectFechaUsoInput(event) {
    this.datefechaUso = event;
  }

  styleObligatorio(ficha, evento){
    if((evento == null || evento == undefined || evento == "") && ficha=="datosBancarios" && this.resaltadoDatosBancarios){
      return "camposObligatorios";
    }    

    if((evento == null || evento == undefined || evento == "") && ficha=="firma" && this.resaltadoFirma){
      return "camposObligatorios";
    }   
    
    if((evento == null || evento == undefined || evento == "" || evento.value=="") && ficha=="nuevo" && this.resaltadoNuevo){
      return "camposObligatorios";
    } 
  }

  muestraCamposObligatorios(ficha){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    
    if(ficha=="datosBancarios"){
      this.resaltadoDatosBancarios=true;
    }

    if(ficha=="firma"){
      this.resaltadoFirma=true;
    }

    if(ficha=="nuevo"){
      this.resaltadoNuevo=true;
    }
  }

  checkDatos(ficha){
    if(ficha=='datosBancarios'){
      if(!this.igualInicio() || !this.condiciones()){      
        if(this.selectedTipo  == undefined || this.selectedTipo.length==0 || this.iban=='' || this.bic == '' || this.body.titular==''){
          this.muestraCamposObligatorios(ficha);
        }else{
          this.validarFormulario();
        }      
      }else{
        if(ficha=='datosBancarios'){
          this.muestraCamposObligatorios(ficha);
        }
      }
    }

    if(ficha=='firma'){
      if(!this.validarFirma() || this.firmaLugar=='' || this.firmaFechaDate==undefined){
        this.muestraCamposObligatorios(ficha);
      }else{  
        this.firmarFicheroAnexo();
      }
    }

    if(ficha=='nuevo'){
      if(!this.validarInsertarAnexo() || this.datefechaUso==undefined || this.selectedProductoServicio.length==0){
        this.muestraCamposObligatorios(ficha);
      }else{
        this.insertarAnexo();
      }
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }

}
