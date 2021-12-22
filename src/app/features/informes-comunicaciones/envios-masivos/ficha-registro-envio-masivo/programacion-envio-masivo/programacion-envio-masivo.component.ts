import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProgEnviosMasivosItem } from '../../../../../models/ProgramacionEnviosMasivosItem';
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { Message } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { saveAs } from "file-saver/FileSaver";
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-programacion-envio-masivo',
  templateUrl: './programacion-envio-masivo.component.html',
  styleUrls: ['./programacion-envio-masivo.component.scss']
})
export class ProgramacionEnvioMasivoComponent implements OnInit {


  openFicha: boolean = false;
  body: ProgEnviosMasivosItem = new ProgEnviosMasivosItem();
  bodyInicial: ProgEnviosMasivosItem = new ProgEnviosMasivosItem();
  es: any = esCalendar;
  fecha: Date;
  msgs: Message[];
  arrayProgramar: any[];
  currentDate: Date;
  currentDateInitial: Date;
  estados: any[];
  noEditar: boolean = false;
  resaltadoDatos: boolean = false;

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
      key: "destinatariosIndv",
      activa: false
    },
    {
      key: "destinatariosList",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    }
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService
  ) {



  }

  ngOnInit() {
    this.resaltadoDatos=true;
    this.getEstadosEnvios();

    this.getDatos();

    this.currentDateInitial = new Date();
    this.currentDate = new Date();

    if(this.body.fechaProgramada==undefined || this.body.fechaProgramada==null){
      this.abreCierraFicha();
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

  showWarning(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "warn", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }



  abreCierraFicha() {
    if(!this.openFicha){
      this.onlyCheckDatos();
    }
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
      this.openFicha = !this.openFicha;
      if (!this.body.fechaProgramada) {
        this.getDatos();
      }
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




  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      this.body.fechaProgramada = this.body.fechaProgramada ? new Date(this.body.fechaProgramada) : null;
      this.body.fechaCreacion = this.body.fechaCreacion ? new Date(this.body.fechaCreacion) : null;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.bodyInicial.idEstado != '1' && this.bodyInicial.idEstado != '4') {
        this.noEditar = true;
      }
    }
    // else if (sessionStorage.getItem("crearNuevoEnvio") == null) {
    //   this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
    //   this.body.fechaProgramada = this.body.fechaProgramada ? new Date(this.body.fechaProgramada) : null;
    //   this.body.fechaCreacion = this.body.fechaCreacion;
    // }

  }


  restablecer() {
    this.onlyCheckDatos();
    this.resaltadoDatos=false;
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    if (this.body.fechaProgramada != null) {
      this.body.fechaProgramada = new Date(this.body.fechaProgramada)
    }

  }

  guardar() {
    this.onlyCheckDatos();
    this.resaltadoDatos=false;
    if (this.currentDate > this.body.fechaProgramada) {
      this.showWarning(this.translateService.instant(
        "informesycomunicaciones.enviosMasivos.errorFechaInferior"
      ));
    } else {
      this.arrayProgramar = [];
      let objProgramar = {
        idEnvio: this.body.idEnvio,
        idInstitucion: this.body.idInstitucion,
        fechaProgramada: new Date(this.body.fechaProgramada),
        idEstado: this.body.idEstado,
        idTipoEnvios: this.body.idTipoEnvios,
        idPlantillaEnvios: this.body.idPlantillaEnvios,
        descripcion: this.body.descripcion

      }
      this.arrayProgramar.push(objProgramar);
      this.sigaServices.post("enviosMasivos_programar", this.arrayProgramar).subscribe(
        data => {
          this.showSuccess(this.translateService.instant("informesycomunicaciones.enviosMasivos.programCorrect"));
          this.body.fechaProgramada = objProgramar.fechaProgramada;
          sessionStorage.setItem("enviosMasivosSearch", JSON.stringify(this.body));
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        },
        err => {
          this.showFail(this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorEnvio"));
          //console.log(err);
        },
        () => {
        }
      );
    }
  }

  getEstadosEnvios() {
    this.sigaServices.get("enviosMasivos_estado").subscribe(
      data => {
        this.estados = data.combooItems;
        this.estados.unshift({ label: this.translateService.instant("tablas.literal.seleccionarTodo"), value: '' });
      },
      err => {
        //console.log(err);
      }
    );
  }

  isGuardarDisabled() {
    if (this.body.fechaProgramada != null) {
      return false;
    }
    return true;
  }

  fillFechaCreacion(event) {
    this.body.fechaCreacion = event;
  }

  fillFechaProgramada(event) {
    this.onlyCheckDatos();
    this.body.fechaProgramada = event;

    if (this.body.fechaProgramada != null)
      if (
        this.body.fechaProgramada.getHours() > this.currentDate.getHours() &&
        this.body.fechaProgramada.getDate() == this.currentDate.getDate() &&
        this.body.fechaProgramada.getMonth() == this.currentDate.getMonth() &&
        this.body.fechaProgramada.getFullYear() == this.currentDate.getFullYear()) {

        this.currentDate.setMinutes(0);
      } else if (this.body.fechaProgramada.getDate() == this.currentDate.getDate() &&
        this.body.fechaProgramada.getMonth() == this.currentDate.getMonth() &&
        this.body.fechaProgramada.getFullYear() == this.currentDate.getFullYear() &&
        this.body.fechaProgramada.getHours() == this.currentDate.getHours()) {

        this.currentDate.setMinutes(this.currentDateInitial.getMinutes());
      }
  }

  downloadLogFile() {

    let objDownload = {      
      idEnvio: this.body.idEnvio,
      idInstitucion: this.body.idInstitucion
    };

    this.sigaServices.post("enviosMasivos_nombreFicheroLog", objDownload).subscribe(
      response => {
        let fileInfo = JSON.parse(response["body"]);

        this.sigaServices
            .postDownloadFiles("enviosMasivos_descargarLog", objDownload)
            .subscribe(data => {
              const blob = new Blob([data], { type: "application/octet-stream" });
              if (blob.size == 0) {          
                this.showFail(this.translateService.instant(
                  "message.enviomasivo.log.noexiste"
                ));          

              } else {
                saveAs(data, fileInfo.name);
              }
            });
        },
        err => {
          this.showFail(this.translateService.instant(
            "message.enviomasivo.log.noexiste"
          ));  
        }
    );    
  }
  
  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  checkDatos(){
    if(!this.isGuardarDisabled()){
      this.guardar();
    }else{
      if(this.body.fechaProgramada==undefined || this.body.fechaProgramada==null){
        this.muestraCamposObligatorios();
      }else{
        this.guardar();
      }
    }
  }

  onlyCheckDatos(){
    if(this.isGuardarDisabled() && (this.body.fechaProgramada==undefined || this.body.fechaProgramada==null)){
      this.resaltadoDatos=true;
    }
  }
}
