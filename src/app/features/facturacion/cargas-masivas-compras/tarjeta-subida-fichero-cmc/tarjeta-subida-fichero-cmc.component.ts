import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { CargaMasivaItem } from '../../../../models/CargaMasivaItem';
import { SigaServices } from '../../../../_services/siga.service';
import { KEY_CODE } from '../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';

@Component({
  selector: 'app-tarjeta-subida-fichero-cmc',
  templateUrl: './tarjeta-subida-fichero-cmc.component.html',
  styleUrls: ['./tarjeta-subida-fichero-cmc.component.scss']
})
export class TarjetaSubidaFicheroCmcComponent implements OnInit {

  msgs: any[];
  progressSpinner: boolean = false;
  filtro: CargaMasivaItem = new CargaMasivaItem();
  showTipo: boolean = false;
  file: File = undefined;
  uploadFileDisable: boolean = true;

  
  @ViewChild("pUploadFile") pUploadFile;
  @Output() filtrosValues = new EventEmitter<CargaMasivaItem>();
  @Input("permisoEscritura") permisoEscrituta;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.file = undefined;
    this.filtro.fechaCarga = undefined;
    if(this.pUploadFile != undefined ){
      this.pUploadFile.clear();
      this.pUploadFile.chooseLabel = "Seleccionar Archivo";
    }
}

  fillFechaCarga(event) {
      this.filtro.fechaCarga = event;
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

  uploadFile() {
    this.progressSpinner = true;
    let body: CargaMasivaItem = new CargaMasivaItem();
    if (this.file != undefined) {
    this.sigaServices
      .postSendContent("cargasMasivasCompras_cargarFichero", this.file)
      .subscribe(
        data => {
          this.file = undefined;
          this.progressSpinner = false;
          this.uploadFileDisable = true;
          body.errores = data["error"];

          if (data["error"].code == 200) {
            this.showMessage("success", "Correcto", data["error"].message);
          } else if (data["error"].code == null) {
            this.showMessage("info", "Información", data["error"].message);
          }
        },
        error => {
          this.showMessage("error", "", "Se ha producido un error al cargar el fichero, vuelva a intentarlo de nuevo pasados unos minutos");
          this.progressSpinner = false;
        },
        () => {
          this.pUploadFile.clear();
          this.progressSpinner = false;
          this.pUploadFile.chooseLabel = "Seleccionar Archivo";
        }
      );
    }
    else{
      this.progressSpinner = false;
      this.showMessage("info", "Información", "Debe rellenar todos los campos obligatorios");
    }
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
