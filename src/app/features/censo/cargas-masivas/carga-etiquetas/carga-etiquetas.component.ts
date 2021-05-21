import { Response } from "@angular/http";
import { KEY_CODE } from "../../../administracion/catalogos-maestros/catalogos-maestros.component";
import { HostListener } from "@angular/core";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "../../../../_services/siga.service";
import { saveAs } from "file-saver/FileSaver";
import { CargaMasivaItem } from "../../../../models/CargaMasivaItem";
import { CargaMasivaObject } from "../../../../models/CargaMasivaObject";
import { DatePipe } from "../../../../../../node_modules/@angular/common";
import { esCalendar } from "../../../../utils/calendar";
import { DomSanitizer } from "../../../../../../node_modules/@angular/platform-browser";
import { TranslateService } from '../../../../commons/translate/translation.service';

@Component({
  selector: "app-carga-etiquetas",
  templateUrl: "./carga-etiquetas.component.html",
  styleUrls: ["./carga-etiquetas.component.scss"]
})
export class CargaEtiquetasComponent implements OnInit {
  showDatos: boolean = true;
  buscar: boolean = false;
  fechaCargaSelect: Date;
  archivoDisponible: boolean = false;
  existeArchivo: boolean = false;
  msgs: any;

  file: File = undefined;
  es: any = esCalendar;

  @ViewChild("table") table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  numSelected: number = 0;
  selectedItem: number = 10;
  @ViewChild("pUploadFile") pUploadFile;

  progressSpinner: boolean = false;
  body: CargaMasivaItem = new CargaMasivaItem();
  etiquetasSearch = new CargaMasivaObject();
  uploadFileDisable: boolean = true;
  downloadFileDisable: boolean = true;
  downloadFileLogDisable: boolean = true;
  history: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.cols = [
      { field: "fechaCarga", header: "censo.datosCv.literal.fechaCarga" },
      {
        field: "usuario",
        header: "general.boton.usuario"
      },
      {
        field: "nombreFichero",
        header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero"
      },
      {
        field: "registrosCorrectos",
        header: "cargaMasivaDatosCurriculares.numRegistrosCorrectos.literal"
      },
      {
        field: "registrosErroneos",
        header: "cargaMasivaDatosCurriculares.numRegistrosErroneos.literal"
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

  onHideDatosCv() {
    this.showDatos = !this.showDatos;
  }

  uploadFile(event: any) {
    this.progressSpinner = true;
    if (this.file != undefined) {
      this.sigaServices
        .postSendContent("cargasMasivasEtiquetas_uploadFile", this.file)
        .subscribe(
          data => {
            this.file = null;
            this.progressSpinner = false;
            this.uploadFileDisable = true;
            this.body.errores = data["error"];
            let mensaje = this.body.errores.message.toString();

            if (data["error"].code == 200) {
              this.showMessage("success", "Correcto", data["error"].message);
            } else if (data["error"].code == null) {
              this.showMessage("info", "Información", data["error"].message);
            }
          },
          error => {
            console.log(error);
            this.showFail("Error en la subida del fichero.");
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.pUploadFile.chooseLabel = "Seleccionar Archivo";
            this.progressSpinner = false;
          }
        );
    }
  }
  clear() {
    this.msgs = [];
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getFile(event: any) {
    let fileList: FileList = event.files;
    this.uploadFileDisable = false;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(xls|xlsx)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeArchivo = false;
      this.showMessage(
        "info",
        "Información",
        "La extensión del fichero no es correcta."
      );
      this.uploadFileDisable = true;
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.uploadFileDisable = false;
      this.existeArchivo = true;

      this.pUploadFile.chooseLabel = nombreCompletoArchivo;
    }
  }

  //Busca colegiados según los filtros
  isBuscar() {
    this.buscar = true;
    this.progressSpinner = true;

    // Deshabilitamos
    this.history = false;
    this.selectedDatos = [];

    this.body.tipoCarga = "GF";

    if (this.fechaCargaSelect != undefined || this.fechaCargaSelect != null) {
      this.body.fechaCarga = this.datePipe.transform(
        this.fechaCargaSelect,
        "dd/MM/yyyy"
      );
    } else {
      this.body.fechaCarga = null;
    }

    this.sigaServices
      .postPaginado("cargasMasivas_searchEtiquetas", "?numPagina=1", this.body)
      .subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.progressSpinner = false;
          this.etiquetasSearch = JSON.parse(data["body"]);
          this.datos = this.etiquetasSearch.cargaMasivaItem;
          this.table.reset();
          this.numSelected = this.selectedDatos.length;

          if (error != null && error.description != null) {
            this.msgs = [];
            this.msgs.push({
              severity:"info", 
              summary:this.translateService.instant("general.message.informacion"), 
              detail: error.description});
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadFile(data: Response) {
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("cargasMasivas_descargarEtiquetas", this.body)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          if (this.body.nombreFichero == undefined) {
            saveAs(blob, "PlantillaMasivaDatosGF.xls");
          } else {
            saveAs(blob, this.body.nombreFichero);
          } this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadOriginalFile(selectedDatos) {
    this.body = selectedDatos;
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("cargasMasivas_downloadOriginalFile", this.body)
      .subscribe(
        data => {
          if (data.size != 0) {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, this.body.nombreFichero);
          } else {
            let msg = this.translateService.instant("messages.general.error.ficheroNoExiste");
            this.showFail(msg);
          }
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadLogFile(selectedDatos) {
    this.body = selectedDatos;
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("cargasMasivas_downloadLogFile", this.body)
      .subscribe(
        data => {
          if (data.size != 0) {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, this.body.nombreFichero);
          } else {
            let msg = this.translateService.instant("messages.general.error.ficheroNoExiste");
            this.showFail(msg);
          }
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  disabledButtons(selectedDatos) {
    this.downloadFileDisable = false;
    this.numSelected = 1;
    if (selectedDatos.registrosErroneos == 0) {
      this.downloadFileLogDisable = true;
    } else {
      this.downloadFileLogDisable = false;
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
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  // PARA LA TABLA
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  setItalic(datoH) {
    let fecha = this.arreglarFecha(datoH.fechaCarga);
    if (fecha > new Date()) return false;
    else return true;
  }

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  fillFechaCarga(event) {
    this.fechaCargaSelect = event;
  }

  detectFechaCargaInput(event) {
    this.fechaCargaSelect = event;
  }


}
