import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CargaMasivaItem } from "../../../../../models/CargaMasivaItem";
import { DatePipe } from "../../../../../../../node_modules/@angular/common";
import { SigaServices } from "../../../../../_services/siga.service";
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from "../../../../../commons/translate";
import { Message } from 'primeng/components/common/api';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Component({
  selector: 'app-formulario-subida-guardia',
  templateUrl: './formulario-subida-guardia.component.html',
  styleUrls: ['./formulario-subida-guardia.component.scss']
})
export class FormularioSubidaGuardiaComponent implements OnInit {

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
  fechaDesde;
  fechaHasta;
  observaciones;

  @Output() datosEvent = new EventEmitter<any[]>();
  @Output() buscarEvent = new EventEmitter<boolean>();
  
  constructor(private datePipe: DatePipe,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private datepipe: DatePipe) { }

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

    if(this.fechaSolicitud==undefined && this.tipo == 'I') {
      this.showFail("Debe rellenar todos los campos obligatorios");
    }else if ((this.fechaDesde==undefined && this.tipo == 'C') || (this.fechaHasta==undefined && this.tipo == 'C')){
      this.showFail("Debe rellenar todos los campos obligatorios");
    }
    else{

      this.progressSpinner = true;

        let body: CargaMasivaItem = new CargaMasivaItem();
        body.tipoCarga = this.tipo;
        body.fechaCarga = this.datePipe.transform(
          new Date(),
          "dd/MM/yyyy"
        );
        if(this.tipo == 'C'){
          body.fechaCargaDesde = this.datePipe.transform(
            this.fechaDesde,
            "dd/MM/yyyy"
          );
  
          body.fechaCargaHasta = this.datePipe.transform(
            this.fechaHasta,
            "dd/MM/yyyy"
          );
        }else if(this.tipo == 'I'){
          body.fechaSolicitudDesde = this.datePipe.transform(
            this.fechaSolicitud,
            "dd/MM/yyyy"
          );
        }
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
      }
  }

  uploadFile() {
    if(this.fechaSolicitud==undefined && this.tipo == 'I') {
      this.showFail("Debe rellenar todos los campos obligatorios");
    }else if ((this.fechaDesde==undefined && this.tipo == 'C') || (this.fechaHasta==undefined && this.tipo == 'C')){
      this.showFail("Debe rellenar todos los campos obligatorios");
    }
    else{
    this.progressSpinner = true;
    let body: CargaMasivaItem = new CargaMasivaItem();
    if (this.file != undefined) {
      if(this.tipo=="I"){
        this.sigaServices.postSendContentAndParameter(
            "cargasMasivasGuardia_uploadFileI",
            "?fechaSolicitud=" + this.datepipe.transform(this.fechaSolicitud, 'dd/MM/yyyy') ,
            this.file)
          .subscribe(
            data => {
             // this.file = undefined;
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
      }else if (this.tipo=="GC"){
        this.sigaServices
          .postSendContent("cargasMasivasGuardia_uploadFileGC", this.file)
          .subscribe(
            data => {
              //this.file = undefined;
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
        this.showMessage("info", "Información",this.translateService.instant("guardias.cargasMasivas.mensaje.calendarios"));
        this.progressSpinner = false;
        this.uploadFileDisable = true;
        this.pUploadFile.clear();
        this.pUploadFile.chooseLabel = "Seleccionar Archivo";
        this.sigaServices
        .postSendContentAndParameter(
          "cargasMasivasGuardia_uploadFileC",
          "?fechaDesde=" + this.datepipe.transform(this.fechaDesde, 'dd/MM/yyyy') + "&fechaHasta=" + this.datepipe.transform(this.fechaHasta, 'dd/MM/yyyy')+ "&observaciones=" + this.observaciones,
          this.file
        )
          .subscribe(
            data => {
              //this.file = undefined;
              this.progressSpinner = false;
              this.uploadFileDisable = true;
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
  fillFechaDesde(event){
    this.fechaDesde = event;
  }

  fillFechaHasta(event){
    this.fechaHasta = event;
  }

}
