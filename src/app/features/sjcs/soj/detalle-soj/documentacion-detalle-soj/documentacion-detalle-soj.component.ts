import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild,Input } from '@angular/core';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { DocumentacionAsistenciaItem } from '../../../../../models/guardia/DocumentacionAsistenciaItem';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { datos_combos } from '../../../../../utils/datos_combos';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { DatePipe } from '@angular/common';
import { DocumentacionSojItem } from '../../../../../models/sjcs/DocumentacionSojItem';
import { Calendar } from 'primeng/primeng';

@Component({
  selector: 'app-documentacion-detalle-soj',
  templateUrl: './documentacion-detalle-soj.component.html',
  styleUrls: ['./documentacion-detalle-soj.component.scss']
})
export class DocumentacionDetalleSojComponent implements OnInit, OnChanges {

  progressSpinner: boolean = false;
  msgs: any[];

  rows : number = 10;
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
  columnas: any[] = [];

  // Selección de filas
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  numSeleccionado : number = 0;
  selectedDatos : any[] = [];
  documentaciones : DocumentacionSojItem[];

  // Información colegiado actual
  isLetrado : boolean;
  idPersonaUsuario : string;
  body: FichaSojItem;
  registroSalida: String;
  registroEntrada: String;
  fechaLimite: Date;
  fechaPresentacion: Date;

  // Permisos
  disableDelete : boolean = true;
  nuevoDisabled: boolean = true;

  // Tabla
  @ViewChild("table") table: DataTable;
  @Input() bodyInicial: FichaSojItem;
  @Input() permisoEscritura;

  constructor(
    private sigaStorageService: SigaStorageService,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.isLetrado = this.sigaStorageService.isLetrado;
    this.idPersonaUsuario = this.sigaStorageService.idPersona;
    if (this.bodyInicial != undefined) {
      this.getDocumentosSOJ();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getDocumentosSOJ(){
    this.progressSpinner = true;
    this.sigaServices.post("gestionSoj_getDocumentosSOJ", this.bodyInicial).subscribe(
      data => {
        let responseBody = JSON.parse(data.body);
        if (responseBody != undefined){
          this.documentaciones = [];
          responseBody.documentacionSojItems.forEach(element => {
            // Mapear campos Documentos.
            let nuevoDoc: DocumentacionSojItem = new DocumentacionSojItem();
            nuevoDoc.idDocumentacion = element.idDocumentacion;
            nuevoDoc.fechaLimite = element.fechaLimite;
            nuevoDoc.fechaPresentacion = element.fechaPresentacion;
            nuevoDoc.registroEntrada = element.registroEntrada;
            nuevoDoc.registroSalida = element.registroSalida;
            nuevoDoc.documentacion = element.documentacion;
            nuevoDoc.nuevo = false;
            nuevoDoc.anio = element.anio;
            nuevoDoc.numero = element.numero;
            nuevoDoc.idtiposoj = element.idtiposoj;

            this.documentaciones.push(nuevoDoc);
          });
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
      () => {
        this.progressSpinner = false;
      }
    )
  }

  fillFechaLimite(event,ri) {
    this.documentaciones[ri].fechaLimite = this.datePipe.transform(event, 'dd/MM/yyyy');
  }

  fillFechaPresentacion(event,ri) {
    this.documentaciones[ri].fechaPresentacion = this.datePipe.transform(event, 'dd/MM/yyyy');
  }

  nuevoDoc() {
    this.nuevoDisabled = false;
    let nuevoDoc: DocumentacionSojItem = new DocumentacionSojItem();
    nuevoDoc.nuevoRegistro = true;
    nuevoDoc.fechaLimite = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    nuevoDoc.fechaPresentacion = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    nuevoDoc.registroSalida = '';
    nuevoDoc.registroEntrada = '';
    nuevoDoc.documentacion = '';
    nuevoDoc.nuevo = true;
    nuevoDoc.idDocumentacion = "1";
    nuevoDoc.anio = this.bodyInicial.anio;
    nuevoDoc.numero = this.bodyInicial.numero;
    nuevoDoc.idtiposoj = this.bodyInicial.idTipoSoj;
    this.documentaciones = [nuevoDoc, ...this.documentaciones];
  }

  save() {
    if (this.documentaciones != undefined) {
      this.progressSpinner = true;
      this.sigaServices.post("gestionSoj_saveDocumentosSOJ", this.documentaciones).subscribe(
        n => {
          this.progressSpinner = false;
          let result = n;
          if (result.error) {
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getDocumentosSOJ();
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );
    }
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
    
  }
  


  delete() {
    this.confirmationService.confirm({
      key: "confirmEliminar",
      message: this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.seguroEliminarDocumentos"),
      icon: "fa fa-question-circle",
      accept: () => { this.executeDelete(); },
      reject: () => { this.showMsg('info', "Cancelado", this.translateService.instant("general.message.accion.cancelada")); }
    });
  }

  executeDelete() {

    this.progressSpinner = true;
    let documentos: DocumentacionSojItem[] = [];
    if (Array.isArray(this.selectedDatos)) {
      documentos = this.selectedDatos;
    } else {
      documentos.push(this.selectedDatos);
    }

    this.sigaServices
        .post("gestionSoj_deleteDocumentosSOJ", documentos)
        .subscribe(
          n => {
            let result = n;
            if (result.error) {
              this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.getDocumentosSOJ();
              this.disableDelete = true;
            }
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );

  }
  onChangeAsociado(documento: DocumentacionAsistenciaItem) {
    if (documento.asociado
      && documento.asociado != '0') {

      documento.disableIdTipoDoc = true;
      documento.idTipoDoc = '2';

    } else {
      documento.disableIdTipoDoc = false;
      documento.idTipoDoc = '';
    }
  }
  

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple() {
    if (this.table.selectionMode == 'single') {
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    } else {
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
    this.disableDelete = true;
  }

  onChangeSeleccionarTodo() {
    if (this.seleccionarTodo) {
      this.selectedDatos = this.documentaciones;
      this.numSeleccionado = this.selectedDatos.length;
      this.disableDelete = false;
    } else {
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.disableDelete = true;
    }
  }

  onSelectRow(documentacion: any) {

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
    this.disableDelete = false;


  }

  actualizaSeleccionados() {
    if (this.table.selectionMode == 'single') {
      this.numSeleccionado = 0;
      this.disableDelete = true;
    } else {
      this.numSeleccionado = this.selectedDatos.length;
      if (this.numSeleccionado <= 0) {
        this.disableDelete = true;
      }
    }
  }

  styleObligatorio(evento) {
    if ((evento == undefined || evento == null || evento == "")) {
      return this.commonServices.styleObligatorio(evento);
    }
  }

  clear() {
    this.msgs = [];
  }
}
