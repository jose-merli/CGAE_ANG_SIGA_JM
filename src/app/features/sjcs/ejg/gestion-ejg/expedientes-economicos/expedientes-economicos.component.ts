import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { saveAs } from "file-saver/FileSaver";
import { SigaServices } from '../../../../../_services/siga.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';

@Component({
  selector: 'app-expedientes-economicos',
  templateUrl: './expedientes-economicos.component.html',
  styleUrls: ['./expedientes-economicos.component.scss']
})
export class ExpedientesEconomicosComponent implements OnInit {
 
  @Input() body: EJGItem;
  @Input() modoEdicion;
  @Input() openTarjetaExpedientesEconomicos;
  @Input() permisoEscritura: boolean = false;
  @Output() guardadoSend = new EventEmitter<void>();
  @Output() updateIntercambios = new EventEmitter<void>();

  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  showEnviarDocumentacionAdicional: boolean = false;

  cols;
  msgs;
  rowsPerPage: any = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  expedientesEcon: any;
  resumen: any = {
    f_solicitud: null,
    f_recepcion: null,
    estado: "",
    nExpedientes: 0
  };
  
 constructor(private sigaServices: SigaServices, 
  private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.getEnviarDocumentacionAdicional();
    this.getExpedientesEconomicos();
  }

  abreCierraFicha() {
    this.openTarjetaExpedientesEconomicos = !this.openTarjetaExpedientesEconomicos;
  }

  onChangeRowsPerPages() {
    //ARR: Terminar
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.expedientesEcon;
        this.numSelected = this.expedientesEcon.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
      }
    }
  }

  clear() {
    this.msgs = [];
  }

  disabledDownload(): boolean {
    return this.selectedDatos == undefined || this.selectedDatos.length == 0 || this.selectedDatos.some(d => d.idEstado != "30");
  }

  disableEnviarDocumentacionAdicional(): boolean {
    return this.selectedDatos == undefined || this.selectedDatos.length == 0 || this.selectedDatos.some(d => d.csv == undefined || d.csv.length == 0 || d.idEstado == "40");
  }

  downloadEEJ() {
    
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.progressSpinner=true;
      let data = [];
      this.selectedDatos.forEach(element => {
        let ejgData: EJGItem = new EJGItem();
        ejgData.annio = this.body.annio;
        ejgData.idInstitucion = this.body.idInstitucion;
        ejgData.numEjg = this.body.numEjg;
        ejgData.tipoEJG = this.body.tipoEJG;
        ejgData.observaciones=element.csv;
        data.push(ejgData);
      });

      this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", data).subscribe(
        data => {
          this.progressSpinner=false;
          let blob = null;
          let now = new Date();
          let month = (now.getMonth() + 1) + "";
          let nombreFichero = "eejg_" + now.getFullYear() + month.padStart(2, '0') + now.getDate() + "_" + now.getHours() + "" + now.getMinutes();
          let mime = data.type;
          blob = new Blob([data], { type: mime });
          saveAs(blob, nombreFichero);
        },
        err => {
          this.progressSpinner = false;
          if(err.status == 404){
            this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant("administracion.parametro.eejg.messageNoExistenArchivos"));
          }else{
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        }
      );
    }
  }

  confirmEnviarDocumentacionAdicional() {
    this.confirmationService.confirm({
      key: "confirmEnvioExpEconomico",
      message: this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.confirmEnviarDocAdicional"),
      icon: "fa fa-edit",
      accept: () => {
        this.enviarDocumentacionAdicional();
      },
      reject: () => {
        this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  private async enviarDocumentacionAdicional() {
      this.progressSpinner = true;
      let requests = this.selectedDatos.filter(d => d.csv != undefined && d.csv.length != 0 && d.idEstado != "40").map(d => {
        return { idPeticion: d.idPeticion };
      });
      await Promise.all(requests.map(d => this.accionEnviarDocumentacionAdicional(d))).then((values) => {
        this.progressSpinner = false;
      });
      this.showMessage("info", "Info", this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.peticionEnCurso"));
      this.updateIntercambios.emit();
  }

  private accionEnviarDocumentacionAdicional(body): Promise<any> {
    return this.sigaServices.post("gestionejg_enviaDocumentacionAdicionalExpEconomico", body).toPromise().then(
      n => {
        const body = JSON.parse(n.body);
        if (body.error != undefined) {
          return Promise.reject(n.error);
        }
      },
      err => {
        return Promise.reject();
      }
    );
  }

  private getEnviarDocumentacionAdicional() {
    this.sigaServices.get("gestionejg_esColegioConfiguradoEnvioCAJG").toPromise().then(
      n => {
        if (n.error == undefined && this.body.idExpedienteExt != undefined) {
          this.showEnviarDocumentacionAdicional = true;
        } 
      }
    )
  }

  private getCols() {
    this.cols = [
      { field: "justiciable", header: "menu.justiciaGratuita.justiciable", width: "30%" },
      { field: "solicitadoPor", header: "justiciaGratuita.ejg.datosGenerales.SolicitadoPor", width: "30%" },
      { field: "f_solicitud", header: "formacion.busquedaInscripcion.fechaSolicitud", width: "10%" },
      { field: "f_recepcion", header: "justiciaGratuita.ejg.datosGenerales.FechaRecepcion", width: "10%" },
      { field: "estado", header: "censo.busquedaSolicitudesModificacion.literal.estado", width: "20%" },
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  private updateResumen(){
    if(this.expedientesEcon.length > 0){
      this.resumen.f_solicitud = this.expedientesEcon[0].f_solicitud;
      this.resumen.f_recepcion = this.expedientesEcon[0].f_recepcion;
      this.resumen.estado = this.expedientesEcon[0].estado;
    }
    this.resumen.nExpedientes = this.expedientesEcon.length;
    this.progressSpinner = false;
  }

  private getExpedientesEconomicos() {
    this.sigaServices.post("gestionejg_getExpedientesEconomicos", this.body).subscribe(
      n => {
        this.expedientesEcon = JSON.parse(n.body).expEconItems;
        this.updateResumen();
      }, err => {
        this.progressSpinner = false;
      }
    );
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
