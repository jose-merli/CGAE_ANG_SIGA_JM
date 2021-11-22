import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { KEY_CODE } from '../../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";
import { CargaMasivaItem } from '../../../../../models/CargaMasivaItem';
import { procesos_intercambios } from '../../../../../permisos/procesos_intercambios';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';

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
  permisoCargarFichero: boolean = true;

  @Input() permisoEscritura;
  @Output() tipoEvent = new EventEmitter<string>();
  @ViewChild("pUploadFile") pUploadFile;
  @Output() filtrosValues = new EventEmitter<CargaMasivaItem>();

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.showTipo = true;
    /* this.commonsService.checkAcceso(procesos_intercambios.cargarFicheroCMProcuradores)
      .then(respuesta => {

        this.permisoCargarFichero = respuesta;

        this.persistenceService.setPermisos(this.permisoCargarFichero);

        if (this.permisoCargarFichero == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    ).catch(error => console.error(error)); */
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

  checkPermisosCargarFichero() {
    let msg = this.commonsService.checkPermisos(this.permisoCargarFichero, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
        this.uploadFile();
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

  uploadFile() {
    this.progressSpinner = true;
    let body: CargaMasivaItem = new CargaMasivaItem();
    if (this.file != undefined) {
    this.sigaServices
      .postSendContent("intercambios_cargarFicheroCargaMasivaProcuradores", this.file)
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
