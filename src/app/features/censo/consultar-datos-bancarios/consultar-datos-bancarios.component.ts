import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";

import { Location } from "@angular/common";

import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";

import { SelectItem } from "primeng/api";
import { DataTable } from "primeng/datatable";

import { DatosBancariosItem } from "./../../../../app/models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../../app/models/DatosBancariosObject";

import { BancoBicItem } from "./../../../../app/models/BancoBicItem";
import { BancoBicObject } from "./../../../../app/models/BancoBicObject";

import { DatosMandatosItem } from "./../../../../app/models/DatosMandatosItem";
import { DatosMandatosObject } from "./../../../../app/models/DatosMandatosObject";

import { DatosBancariosSearchAnexosItem } from "./../../../../app/models/DatosBancariosSearchAnexosItem";
import { DatosBancariosAnexoObject } from "./../../../../app/models/DatosBancariosAnexoObject";

import { SigaServices } from "./../../../_services/siga.service";
//import "rxjs/Rx";
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: "app-consultar-datos-bancarios",
  templateUrl: "./consultar-datos-bancarios.component.html",
  styleUrls: ["./consultar-datos-bancarios.component.scss"]
})
export class ConsultarDatosBancariosComponent implements OnInit {
  //fichasPosibles: any[];

  openFichaCuentaBancaria: boolean = false;
  openFichaDatosMandatos: boolean = false;
  openFichaListadoFicherosAnexos: boolean = false;
  progressSpinner: boolean = false;
  editar: boolean = false;
  blockCrear: boolean = true;

  editarMandato: boolean = false;
  formValido: boolean;
  ibanValido: boolean;
  titularValido: boolean;
  tipoCuentaSeleccionado: boolean;
  revisionCuentas: boolean = false;
  nuevo: boolean = false;
  checkProducto: boolean = false;
  checkServicio: boolean = false;
  checkFirma: boolean = true;
  isSelectedProducto: boolean;
  isSelectedServicio: boolean;
  isCheckedProducto: boolean;
  isCheckedServicio: boolean;
  isInterEmpresaProducto: boolean;
  isInterEmpresaServicio: boolean;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  displayFirmar: boolean = false;
  displayNuevo: boolean = false;
  isEditable: boolean = false;
  isCancelEdit: boolean = false;

  idCuenta: String;
  idPersona: String;

  nifTitular: String;
  titular: String;
  textFilter: String;
  textSelected: String = "{0} grupos seleccionados";
  registroEditable: String;
  descripcion: String;
  firmaFechaDate: Date;
  firmaLugar: String;

  msgs: Message[];
  usuarioBody: any[];
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

  numSelected: number = 0;
  selectedItem: number = 10;

  datefechaUso: Date;
  datefirmaFecha: Date;

  body: DatosBancariosItem = new DatosBancariosItem();
  bodySearch: DatosBancariosObject = new DatosBancariosObject();

  bodyBancoBic: BancoBicItem = new BancoBicItem();
  bodyBancoBicSearch: BancoBicObject = new BancoBicObject();

  bodyDatosMandatos: DatosMandatosItem = new DatosMandatosItem();
  bodyDatosMandatosSearch: DatosMandatosObject = new DatosMandatosObject();

  bodyDatosBancariosAnexo: DatosBancariosSearchAnexosItem = new DatosBancariosSearchAnexosItem();
  bodyDatosBancariosAnexoSearch: DatosBancariosAnexoObject = new DatosBancariosAnexoObject();
  bodyEditar: DatosBancariosSearchAnexosItem = new DatosBancariosSearchAnexosItem();

  file: File = undefined;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.textFilter = "Elegir";

    this.tipoCuenta = [
      { name: "Abono", code: "A" },
      { name: "Cargo", code: "C" },
      { name: "Cuenta SCJS", code: "S" }
    ];

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.idPersona = this.usuarioBody[0].idPersona;
    this.idCuenta = sessionStorage.getItem("idCuenta");

    this.registroEditable = sessionStorage.getItem("editar");

    if (this.registroEditable == "true") {
      // editar
      this.cargarModoEdicion();
    } else {
      // nuevo
      this.cargarModoNuevoRegistro();
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
  }

  downloadAnexo(dato) {
    let filename;
    this.sigaServices
      .post("busquedaPerJuridica_fileDownloadInformation", dato)
      .subscribe(data => {
        let a = JSON.parse(data["body"]);
        filename = a.value + a.label;
      }),
      () => {
        this.sigaServices
          .postDownloadFiles("busquedaPerJuridica_downloadFile", dato)
          .subscribe(data => {
            const blob = new Blob([data], { type: "text/csv" });
            if (blob.size == 0) {
              this.showFail("no existe fichero para descargar");
            } else {
              //let filename = "2006002472110.pdf";
              saveAs(data, filename);
            }
          });
      };
  }

  // setItalic(datoH) {
  //   let a = datoH;
  //   if (datoH.tipo == "ANEXO") {
  //     this.averahora = true;
  //     return true;
  //   } else if (datoH.tipo == "MANDATO") {
  //     this.averahora = false;
  //     return false;
  //   }
  // }

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
    this.editar = false;

    this.cargarDatosMandatos();
    this.nuevo = false;

    this.cargarDatosAnexos();
  }

  cargarModoNuevoRegistro() {
    this.body.titular = this.usuarioBody[0].denominacion;
    this.body.nifTitular = this.usuarioBody[0].nif;

    this.nuevo = true;
    this.editar = false;
  }

  // Funciones datos cuenta bancaria
  cargarDatosCuentaBancaria() {
    this.body.idPersona = this.idPersona;
    this.body.idCuenta = this.idCuenta;
    //this.body.idCuenta = sessionStorage.getItem("idCuenta");

    console.log("eewe", this.body);

    this.sigaServices
      .postPaginado("datosCuentaBancaria_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.body = this.bodySearch.datosBancariosItem[0];

          if (this.body == undefined) {
            this.body = new DatosBancariosItem();
          }

          this.rellenarComboTipoCuenta(this.body.tipoCuenta);
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.message));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  rellenarComboTipoCuenta(body) {
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

  guardarRegistro() {
    this.progressSpinner = true;

    this.body.revisionCuentas = this.revisionCuentas;
    this.body.idPersona = this.idPersona;

    this.getArrayTipoCuenta();

    console.log("ere", this.body);

    this.sigaServices.post("datosCuentaBancaria_insert", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.body = JSON.parse(data["body"]);

        this.showSuccess("Se han guardado correctamente los datos");
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(this.bodySearch.error.message.toString());
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        this.idCuenta = this.body.id;
        this.cargarModoEdicion();
      }
    );
  }

  editarRegistro() {
    this.progressSpinner = true;

    this.body.revisionCuentas = this.revisionCuentas;
    this.body.idPersona = this.idPersona;

    this.getArrayTipoCuenta();

    this.sigaServices.post("datosCuentaBancaria_update", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.body.status = data.status;

        this.showSuccess("Se han guardado correctamente los datos");
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(this.bodySearch.error.message.toString());
        console.log(error);
        this.progressSpinner = false;
      }
    );
  }

  getArrayTipoCuenta() {
    this.body.tipoCuenta = [];
    this.selectedTipo.forEach(element => {
      this.body.tipoCuenta.push(element.code);
    });
  }

  restablecer() {
    this.confirmationService.confirm({
      message: "¿Desea restablecer los datos?",
      icon: "fa fa-info",
      accept: () => {
        this.cargarDatosCuentaBancaria();
      }
    });
  }

  restablecerNuevo() {
    this.confirmationService.confirm({
      message: "¿Desea restablecer los datos?",
      icon: "fa fa-info",
      accept: () => {
        this.body.titular = this.usuarioBody[0].denominacion;
        this.body.nifTitular = this.usuarioBody[0].nif;
        this.body.iban = "";
        this.body.bic = "";
        this.body.banco = "";
        this.body.cuentaContable = "";
        this.textSelected = "";
        this.selectedTipo = [];

        this.nuevo = true;
        this.editar = false;
      }
    });
  }

  autogenerarDatos() {
    if (this.isValidIBAN() && this.body.iban.length == 24) {
      this.recuperarBicBanco();
      this.ibanValido = true;
    } else {
      this.body.banco = "";
      this.body.bic = "";
    }
  }

  recuperarBicBanco() {
    this.sigaServices
      .post("datosCuentaBancaria_BIC_BANCO", this.body)
      .subscribe(
        data => {
          console.log("data", data);
          this.bodyBancoBicSearch = JSON.parse(data["body"]);
          this.bodyBancoBic = this.bodyBancoBicSearch.bancoBicItem[0];

          this.body.banco = this.bodyBancoBic.banco;
          this.body.bic = this.bodyBancoBic.bic;

          console.log("bic", this.bodyBancoBic.bicEspanol);

          if (this.bodyBancoBic.bicEspanol == "1") {
            this.editar = false;
          } else {
            this.editar = true;
          }
        },
        error => {
          this.bodyBancoBicSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodyBancoBicSearch.error.message));
        }
      );
  }

  isValidIBAN(): boolean {
    return (
      this.body.iban &&
      typeof this.body.iban === "string" &&
      /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(
        this.body.iban
      )
    );
  }

  validarIban(): boolean {
    if (
      (this.body.iban != null || this.body.iban != undefined) &&
      this.isValidIBAN() &&
      this.body.iban.length == 24
    ) {
      this.ibanValido = true;
      return true;
    } else {
      this.ibanValido = false;
      return false;
    }
  }

  validarTitular(): boolean {
    if (this.body.titular.trim() != "" && this.body.titular != undefined) {
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

  validarBIC() {
    if (this.body.bic.length) {
    }
  }

  validarCuentaCargo() {
    this.confirmationService.confirm({
      message:
        "¿Desea guardar los cambios?" /*this.translateService.instant(
        //"censo.tipoCuenta.cargo.confirmacionProcesoAltaCuentaCargos"
       
      ),*/,
      icon: "fa fa-info",
      accept: () => {
        this.revisionCuentas = true;

        if (this.registroEditable == "false") {
          this.guardarRegistro();
        } else {
          this.editarRegistro();
        }
      },
      reject: () => {
        // this.revisionCuentas = false;
        // if (this.registroEditable == "false") {
        //   this.guardarRegistro();
        // } else {
        //   this.editarRegistro();
        // }
      }
    });
  }

  validarFormulario() {
    var revisionCuentas;
    if (
      this.validarIban() &&
      this.validarTitular() &&
      this.validarTipoCuenta()
    ) {
      this.formValido = true;

      this.getArrayTipoCuenta();
      if (this.body.tipoCuenta.indexOf("C") !== -1) {
        this.validarCuentaCargo();
      } else {
        this.revisionCuentas = false;
        if (this.registroEditable == "false") {
          this.guardarRegistro();
        } else {
          this.editarRegistro();
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
          }

          this.rellenarComboEsquema();
        },
        error => {
          this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
          this.showFail(
            JSON.stringify(this.bodyDatosMandatosSearch.error.message)
          );
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
          console.log("combo", this.combooItemsProducto);
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
        this.showFail(JSON.stringify(this.bodySearch.error.message));
      }
    );
  }

  filtrarItemsComboEsquema(comboEsquema, buscarElemento) {
    return comboEsquema.filter(function(obj) {
      return obj.value == buscarElemento;
    });
  }

  onChangeEsquemaProducto(e) {
    this.selectedEsquemaProducto = e.value;
    if (this.capturarEventoInterempresa(e, this.selectedEsquemaProducto)) {
      this.isInterEmpresaProducto = true;
      this.isSelectedProducto = true;
    } else {
      this.isInterEmpresaProducto = false;
      this.isSelectedProducto = false;
    }
    console.log("Seleccionado", this.selectedEsquemaProducto);
  }

  onChangeEsquemaServicio(e) {
    this.selectedEsquemaServicio = e.value;
    if (this.capturarEventoInterempresa(e, this.selectedEsquemaServicio)) {
      this.isInterEmpresaServicio = true;
      this.isSelectedServicio = true;
    } else {
      this.isInterEmpresaServicio = false;
      this.isSelectedServicio = false;
    }
    console.log("Seleccionado", this.selectedEsquemaServicio);
  }

  capturarEventoInterempresa(evento, esquema): boolean {
    if (evento && esquema.value == "2") {
      return true;
    } else {
      return false;
    }
  }

  guardarMandato() {
    console.log("Body mandato a guardar", this.bodyDatosMandatos);
    this.bodyDatosMandatos.idPersona = this.idPersona;
    this.bodyDatosMandatos.idCuenta = this.idCuenta;

    if (this.selectedEsquemaProducto) {
      this.bodyDatosMandatos.idMandato = this.bodyDatosMandatos.idMandatoProducto;
      this.bodyDatosMandatos.esquema = this.selectedEsquemaProducto.value;
      this.guardar(this.bodyDatosMandatos);
    }

    if (this.selectedEsquemaServicio) {
      this.bodyDatosMandatos.idMandato = this.bodyDatosMandatos.idMandatoServicio;
      this.bodyDatosMandatos.esquema = this.selectedEsquemaServicio.value;
      this.guardar(this.bodyDatosMandatos);
    }
  }

  guardar(body) {
    this.progressSpinner = true;
    this.sigaServices.post("datosMandatos_insert", body).subscribe(
      data => {
        this.progressSpinner = false;
        this.bodyDatosMandatos.status = data.status;

        this.showSuccess("Se ha guardado el esquema");
      },
      error => {
        this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
        this.showFail(
          JSON.stringify(this.bodyDatosMandatosSearch.error.message)
        );
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
      (this.isInterEmpresaProducto &&
        this.validarCheckProducto() &&
        (this.isInterEmpresaServicio && this.validarCheckServicio())) ||
      !this.isInterEmpresaServicio ||
      !this.isInterEmpresaProducto
    ) {
      this.formValido = true;
      this.guardarMandato();
    } else {
      this.formValido = false;
    }
  }

  // Métodos listadoFicherosAnexos

  cargarDatosAnexos() {
    this.progressSpinner = false;
    this.bodyDatosBancariosAnexo.idPersona = this.idPersona;
    this.bodyDatosBancariosAnexo.idCuenta = this.idCuenta;

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
          console.log("body seearch", this.bodyDatosBancariosAnexoSearch);
          this.bodyDatosBancariosAnexo = this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem[0];
          console.log("anexo", this.bodyDatosBancariosAnexo);

          if (this.bodyDatosBancariosAnexo == undefined) {
            this.bodyDatosBancariosAnexo = new DatosBancariosSearchAnexosItem();
          }

          this.rellenarComboProductoServicio(
            this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem
          );

          console.log(
            "longitud anexo1",
            this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.length
          );
        },
        error => {
          this.bodyDatosBancariosAnexoSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.message));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  rellenarComboProductoServicio(bodyDatosBancariosAnexo) {
    this.comboProductoServicio.push({
      label: "Seleccione el tipo",
      value: ""
    });

    bodyDatosBancariosAnexo.forEach(element => {
      if (element.tipo === "MANDATO") {
        this.comboProductoServicio.push({
          label: element.tipoMandato,
          value: element.idMandato
        });
      }
    });

    this.selectedProductoServicio = this.comboProductoServicio[0];

    console.log("Combo anexo producto/servicio", this.comboProductoServicio);
  }

  onChangeComboProductoServicio(e) {
    this.selectedProductoServicio = e.value;
    console.log(
      "Selected combo producto servicio",
      this.selectedProductoServicio
    );
  }

  activarPaginacion() {
    if (
      !this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem ||
      this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.length == 0
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
    // var options = {
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "numeric"
    // };

    // this.bodyDatosBancariosAnexo.firmaFecha = this.datefirmaFecha.toLocaleString(
    //   "es",
    //   options
    // );
    this.bodyDatosBancariosAnexo.fechaUsoDate = this.datefechaUso;
    this.bodyDatosBancariosAnexo.descripcion = this.descripcion;

    this.progressSpinner = true;

    this.sigaServices
      .post("anexos_insert", this.bodyDatosBancariosAnexo)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyDatosBancariosAnexo.status = data.status;
          this.bodyDatosBancariosAnexo.id = data.id;

          this.showSuccess("Se han guardado correctamente los datos");

          this.displayNuevo = false;
        },
        error => {
          this.bodyDatosMandatosSearch = JSON.parse(error["error"]);
          this.showFail(
            JSON.stringify(this.bodyDatosMandatosSearch.error.message)
          );
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.limpiarDatosAnexo();
        }
      );
  }

  limpiarDatosAnexo() {
    this.descripcion = "";
    this.datefechaUso = null;
    this.selectedProductoServicio = [];
    this.comboProductoServicio = [];

    this.cargarDatosAnexos();
  }

  // Operaciones editar/firmar

  mostrarDialogoFirmar(dato) {
    console.log("Selected row", dato);
    this.displayFirmar = true;

    this.bodyDatosBancariosAnexo.idPersona = this.idPersona;
    this.bodyDatosBancariosAnexo.idCuenta = this.idCuenta;
    this.bodyDatosBancariosAnexo.idAnexo = dato.idAnexo;
    this.bodyDatosBancariosAnexo.idMandato = dato.idMandato;
    this.bodyDatosBancariosAnexo.tipoMandato = dato.tipoMandato;
    this.bodyDatosBancariosAnexo.esquema = "";

    if (dato.firmaLugar != null) {
      this.firmaLugar = dato.firmaLugar;
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

    this.bodyDatosBancariosAnexo.descripcion = "";

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
    console.log("datos previos", this.datosPrevios);

    this.firmaLugar = this.datosPrevios.firmaLugar;
    this.firmaFechaDate = this.datosPrevios.firmaFechaDate;
    this.checkFirma = true;
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
            console.log("Editar fila", this.bodyEditar);

            keepGoing = false;
          }
        }
      }
    );

    this.actualizarDescripcionAnexo(this.bodyEditar);
  }

  firmarFicheroAnexo() {
    this.bodyDatosBancariosAnexo.firmaFechaDate = this.firmaFechaDate;
    this.bodyDatosBancariosAnexo.firmaLugar = this.firmaLugar;

    this.actualizar(this.bodyDatosBancariosAnexo);
    // console.log("value selection", this.selectMultiple);
    // this.selectedDatos = [];
    // this.selectedDatos.push(this.datosPrevios);
    this.selectMultiple = false;
  }

  actualizar(body) {
    this.progressSpinner = true;
    this.sigaServices.post("anexos_update", body).subscribe(
      data => {
        this.progressSpinner = false;
        this.bodyDatosBancariosAnexo.status = data.status;

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
          });

        this.showSuccess("Se han editado correctamente los datos");

        this.displayFirmar = false;
      },
      error => {
        this.bodyDatosBancariosAnexoSearch = JSON.parse(error["error"]);
        this.showFail(
          JSON.stringify(this.bodyDatosBancariosAnexoSearch.error.message)
        );
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        this.selectedProductoServicio = [];
        this.comboProductoServicio = [];

        this.cargarDatosAnexos();
      }
    );
  }

  actualizarDescripcionAnexo(body) {
    if (body.tipo == "ANEXO") {
      this.actualizar(body);
      this.editar = false;
    } else {
      this.showFail("No se puede editar la descripción de un mandato.");
      this.selectedProductoServicio = [];
      this.comboProductoServicio = [];
      this.editar = false;
      this.cargarDatosAnexos();
    }
  }

  onBasicUpload(event) {
    this.showInfo("Fichero adjuntado");
  }

  onEditCancel() {
    this.editar = false;
  }

  editarCompleto(event) {
    let data = event.data;
    console.log("DAta aaaa", data);
    //compruebo si la edicion es correcta con la basedatos
    if (this.onlySpaces(data.descripcion)) {
      this.blockCrear = true;
    } else {
      this.editar = true;
      this.blockCrear = false;
      this.bodyDatosBancariosAnexoSearch.datosBancariosAnexoItem.forEach(
        (value: DatosBancariosSearchAnexosItem, key: number) => {
          // if (value.tipo == "ANEXO") {
          if (
            value.idMandato == data.idMandato &&
            value.idAnexo == data.idAnexo
          ) {
            value.editar = true;
            // }
          }
        }
      );
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

  controlarEdicion() {
    if (!this.selectMultiple) {
      this.editar = true;
    } else {
      this.editar = false;
    }
  }

  // Métodos comunes

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

  backTo() {
    this.location.back();
  }

  uploadFile(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;

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
}
