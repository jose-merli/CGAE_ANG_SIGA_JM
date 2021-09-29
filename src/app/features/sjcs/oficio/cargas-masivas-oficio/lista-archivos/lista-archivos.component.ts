import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges } from '@angular/core';
import { SigaServices } from "../../../../../_services/siga.service";
import { saveAs } from "file-saver/FileSaver";
import { TranslateService } from "../../../../../commons/translate";

@Component({
  selector: 'app-lista-archivos',
  templateUrl: './lista-archivos.component.html',
  styleUrls: ['./lista-archivos.component.scss']
})
export class ListaArchivosComponent implements OnInit {

  @Input() datos: any[];
  @Input() buscar: boolean = false;
  downloadFileDisable: boolean = true;

  @ViewChild("table") table;

  msgs: any[];
  selectedDatos: any[] = [];
  numSelected: number = 0;
  selectedItem: number = 10;
  sortO: number = 1;
  
  progressSpinner: boolean = false;

  cols = [
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

  rowsPerPage = [
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

  constructor(private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.numSelected = this.selectedDatos.length;
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  clear() {
    this.msgs = [];
  }

  downloadLogFile(selectedDatos){
    let body = selectedDatos;
    this.progressSpinner = true;

    this.sigaServices
      .postDownloadFiles(
        "cargaMasivaDatosCurriculares_downloadLogFile",
        body
      )
      .subscribe(
        data => {

          if (data.size != 0) {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, body.nombreFichero);
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

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  disabledButtons(selectedDatos) {
    if(selectedDatos.length==1)  this.downloadFileDisable = false;
    else  this.downloadFileDisable = false;
    
  }

}
