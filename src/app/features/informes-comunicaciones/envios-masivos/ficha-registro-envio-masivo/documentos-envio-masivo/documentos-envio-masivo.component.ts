import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { DataTable } from "primeng/datatable";
import { DocumentosEnviosMasivosItem } from '../../../../../models/DocumentosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { saveAs } from "file-saver/FileSaver";


@Component({
  selector: 'app-documentos-envio-masivo',
  templateUrl: './documentos-envio-masivo.component.html',
  styleUrls: ['./documentos-envio-masivo.component.scss']
})
export class DocumentosEnvioMasivoComponent implements OnInit {

  openFicha: boolean = false;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: DocumentosEnviosMasivosItem = new DocumentosEnviosMasivosItem();
  msgs: Message[];
  file: File = undefined;


  @ViewChild('table') table: DataTable;
  selectedDatos

  fichasPosibles = [
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "programacion",
      activa: false
    },
    {
      key: "destinatarios",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    },

  ];

  constructor(
    // private router: Router,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.getDatos();

    this.selectedItem = 10;
    this.cols = [
      { field: 'nombreDocumento', header: 'Nombre del documento' },
      { field: 'pathDocumento', header: 'Enlace de descarga' }
    ]

  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      this.getDocumentos();
    }

  }


  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }


  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
      this.openFicha = !this.openFicha;
    }
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




  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  getDocumentos() {
    this.sigaServices.post("enviosMasivos_documentos", this.body.idEnvio).subscribe(
      data => {
        let datos = JSON.parse(data["body"]);
        this.datos = datos.documentoEnvioItem;
        console.log(this.datos)
      },
      err => {
        console.log(err);
      },
      () => {

      }
    );
  }

  downloadDocumento(dato) {
    let filename;
    this.sigaServices
      .post("enviosMasivos_infoDescargarDocumento", dato)
      .subscribe(
        data => {
          let a = JSON.parse(data["body"]);
          filename = a.value + a.label;
        },
        error => {
          console.log(error);
        },
        () => {
          this.sigaServices
            .postDownloadFiles("enviosMasivos_descargarDocumento", dato)
            .subscribe(data => {
              const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
              if (blob.size == 0) {
                this.showFail("messages.general.error.ficheroNoExiste");
              } else {
                //let filename = "2006002472110.pdf";
                saveAs(data, filename);
              }
            });
        }
      );
  }


  eliminar(dato) {

    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: '¿Está seguro de eliminar los documentos?',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarEliminar(dato);
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
      }
    });
  }


  confirmarEliminar(dato) {
    this.sigaServices.post("enviosMasivos_cancelar", dato).subscribe(
      data => {
        this.showSuccess('Se ha eliminado el documento correctamente');
      },
      err => {
        this.showFail('Error al eliminado el envío');
        console.log(err);
      },
      () => {
        this.getDocumentos();
        this.table.reset();
      }
    );
  }



  uploadFile(event: any) {
    let fileList: FileList = event.target.files;
    let nombreCompletoArchivo = fileList[0].name;
    // se almacena el archivo para habilitar boton guardar
    this.file = fileList[0];
    console.log(this.file)
  }

}
