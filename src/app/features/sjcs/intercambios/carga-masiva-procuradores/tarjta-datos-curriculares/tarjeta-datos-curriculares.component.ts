import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { KEY_CODE } from '../../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";
import { CargaMasivaItem } from '../../../../../models/CargaMasivaItem';

@Component({
  selector: 'app-tarjeta-datos-curriculares',
  templateUrl: './tarjeta-datos-curriculares.component.html',
  styleUrls: ['./tarjeta-datos-curriculares.component.scss']
})
export class TarjetaDatosCurricularesComponent implements OnInit {

  msgs: any[];
  progressSpinner: boolean = false;
  filtro: CargaMasivaItem = new CargaMasivaItem();
  showTipo: boolean = false;
  file: File = undefined;
  uploadFileDisable: boolean = true;

  @Input() permisoEscritura;
  @Output() tipoEvent = new EventEmitter<string>();
  @ViewChild("pUploadFile") pUploadFile;
  @Output() filtrosValues = new EventEmitter<CargaMasivaItem>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.showTipo = true;

  }

  fillFechaCarga(event) {
    if (event != null) {
      this.filtro.fechaCarga = event;
    }
  }

  getFile(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
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
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;
      this.showMessage(
        "info",
        "Información",
        "La extensión del fichero no es correcta."
      );
      this.uploadFileDisable = true;
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.pUploadFile.chooseLabel = nombreCompletoArchivo;
    }
  }

  descargarModelo(){
    this.progressSpinner = true;

    this.sigaServices.postDownloadFilesWithFileName("intercambios_descargarModeloCargaMasivaProcuradores", undefined).subscribe(
      (response: {file: Blob, filename: string}) => {
        let filename = response.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
        saveAs(response.file, filename);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El archivo no existe"); 
      }
    );

    
      this.progressSpinner = false;
  }

  search() {
    this.filtrosValues.emit(this.filtro);
  }

  abreCierraTipo(){
    this.showTipo=!this.showTipo;
  }
  
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

	clear() {
		this.msgs = [];
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

}
