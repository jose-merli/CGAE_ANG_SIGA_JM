import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CargaMasivaItem } from "../../../../../models/CargaMasivaItem";
import { DatePipe } from "../../../../../../../node_modules/@angular/common";
import { SigaServices } from "../../../../../_services/siga.service";
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from "../../../../../commons/translate";
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-formulario-subida',
  templateUrl: './formulario-subida.component.html',
  styleUrls: ['./formulario-subida.component.scss']
})
export class FormularioSubidaComponent implements OnInit {

  showSubidaFichero: boolean = true;
  uploadFileDisable: boolean = true;

  @Input()tipo:string ;

  @ViewChild("pUploadFile") pUploadFile;
  progressSpinner: boolean = false;
  fechaSolicitud: Date = undefined;
  file: File = undefined;
  msgs: Message[] = [];
  datos: any[];
  selectedDatos;

  @Output() datosEvent = new EventEmitter<any[]>();
  @Output() buscarEvent = new EventEmitter<boolean>();
  
  constructor(private datePipe: DatePipe,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
        
    this.file = undefined;
    this.fechaSolicitud = undefined;
    if(this.pUploadFile != undefined ){
      this.pUploadFile.clear();
      this.pUploadFile.chooseLabel = "Seleccionar Archivo";
    }
    
}

  abreCierraSubidaFichero(){
    this.showSubidaFichero=!this.showSubidaFichero;
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

  isBuscar() {

    if(this.fechaSolicitud==undefined) this.showFail("Debe rellenar todos los campos obligatorios");
    else{
      this.progressSpinner = true;

      let body: CargaMasivaItem = new CargaMasivaItem();
      body.tipoCarga = this.tipo;

      if (this.fechaSolicitud != undefined && this.fechaSolicitud != null) {
        body.fechaCarga = this.datePipe.transform(
          this.fechaSolicitud,
          "dd/MM/yyyy"
        );
      

      this.sigaServices
        .postPaginado(
          "cargaMasivaDatosCurriculares_searchCV",
          "?numPagina=1",
          body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            let error = JSON.parse(data.body).error;
            let etiquetasSearch = JSON.parse(data["body"]);
            this.datos = etiquetasSearch.cargaMasivaItem;

            //this.table.reset();
            //this.numSelected = this.selectedDatos.length;
            this.sendDatos();
            this.sendBuscar();
            if (error != null && error.description != null) {
              this.msgs = [];
              this.msgs.push({
                severity:"info", 
                summary:this.translateService.instant("general.message.informacion"), 
                detail: error.description});
            }
          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            setTimeout(()=>{
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
      } else {
        body.fechaCarga = null;
      }
    }
  }

  uploadFile() {
    this.progressSpinner = true;
    let body: CargaMasivaItem = new CargaMasivaItem();
    if (this.file != undefined) {
      if(this.tipo=="IT"){
        this.sigaServices
          .postSendContent("cargasMasivasOficio_uploadFileIT", this.file)
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
              this.showFail("Se ha producido un error al cargar el fichero, vuelva a intentarlo de nuevo pasados unos minutos");
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
        this.sigaServices
          .postSendContent("cargasMasivasOficio_uploadFileBT", this.file)
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
              this.showFail("Se ha producido un error al cargar el fichero, vuelva a intentarlo de nuevo pasados unos minutos");
              this.progressSpinner = false;
            },
            () => {
              this.pUploadFile.clear();
              this.progressSpinner = false;
              this.pUploadFile.chooseLabel = "Seleccionar Archivo";
            }
          );
      }
    }
    else{
      this.progressSpinner = false;
      this.showMessage("info", "Información", "Debe rellenar todos los campos obligatorios");
    }
  }

  fillFechaCarga(event) {
    this.fechaSolicitud = event;
  }

  detectFechaCargaInput(event) {
    this.fechaSolicitud = event;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  clear() {
    this.msgs = [];
  }

  sendDatos() {
    this.datosEvent.emit(this.datos);
  }

  sendBuscar() {
    this.buscarEvent.emit(true);
  }

}
