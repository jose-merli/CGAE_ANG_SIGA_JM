import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable, Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { PreAsistenciaItem } from '../../../../../../models/guardia/PreAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-asistencias-ficha-preasistencias',
  templateUrl: './asistencias-ficha-preasistencias.component.html',
  styleUrls: ['./asistencias-ficha-preasistencias.component.scss']
})
export class AsistenciasFichaPreasistenciasComponent implements OnInit {

  msgs: Message[] = [];
  seleccionarTodo : boolean = false;
  isLetrado : boolean = false;
  numSeleccionado : number = 0;
  activable : boolean = false;
  denegable : boolean = false;
  confirmable : boolean = false;
  progressSpinner : boolean = false;
  rows : number = 10;
  columnas = [];
  rowsPerPage = [];
  seleccionMultiple : boolean = false;
  selectedDatos = [];
  @Output() updateEstado  = new EventEmitter<string>();
  @Input() asistencias : TarjetaAsistenciaItem[] = [];
  @Input() permisoEscritura : boolean = false;
  @ViewChild("table") table: DataTable;

  constructor(private translateService : TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices : SigaServices,
    private confirmationService : ConfirmationService,
    private sigaStorageService : SigaStorageService,
    private router : Router) { }

  ngOnInit() {
    this.columnas = [

      {field: 'anioNumero', header: this.translateService.instant("justiciaGratuita.ejg.datosGenerales.annioNum")},
      {field: 'numeroColegiado', header: this.translateService.instant("facturacionSJCS.facturacionesYPagos.NumeroColegiado")},
      {field: 'nombreColegiado', header: this.translateService.instant("justiciaGratuita.justiciables.literal.colegiado")},
      {field: 'descripcionGuardia', header: this.translateService.instant("menu.justiciaGratuita.GuardiaMenu")},
      {field: 'fechaGuardia', header: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.fechaguardia")},
      {field: 'asistido', header: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.asistido")}, 

    ];

    this.rowsPerPage = [
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
    this.table.selectionMode = 'single';

    let preasistenciaItem  : PreAsistenciaItem = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));

    if(preasistenciaItem && preasistenciaItem.estado.includes('2')){
      this.activable = true;
      this.denegable = false;
      this.confirmable = false;
    }else if(preasistenciaItem && preasistenciaItem.estado.includes('1')){
      this.activable = false;
      this.denegable = false;
      this.confirmable = false;
    }else if(preasistenciaItem && preasistenciaItem.estado.includes('0')){
      this.activable = false;
      this.denegable = true;
      this.confirmable = true;
    }

    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.isLetrado = true;

    }

    if(sessionStorage.getItem("creadaFromPreasistencia") == "true"){
      this.activable = false;
      this.denegable = false;
      this.confirmable = false;
      sessionStorage.removeItem("creadaFromPreasistencia");
    }

  }
  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple(){
    if(this.table.selectionMode == 'single'){
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    }else{
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.asistencias;
      this.numSeleccionado = this.selectedDatos.length;
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;
    }
  }

  onSelectRow(){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
  }

  confirmConfirmarSolicitud(){

    this.confirmationService.confirm({
      message: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.confirmconfirmarsolicitud"),
      header: this.translateService.instant("general.cabecera.confirmacion"),
      icon: 'fa fa-question-circle',
      accept: () => {
          this.confirmarSolicitud();
      },
      reject: () => {}
    });

  }
  confirmDenegarSolicitud(){

    this.confirmationService.confirm({
      message: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.confirmdenegarsolicitud"),
      header: this.translateService.instant("general.cabecera.confirmacion"),
      icon: 'fa fa-question-circle',
      accept: () => {
          this.denegarSolicitud();
      },
      reject: () => {}
    });

  }

  activarSolicitud(){

    let preasistenciasToActivate : PreAsistenciaItem [] = []
    let preasistenciaItem  : PreAsistenciaItem = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    preasistenciasToActivate.push(preasistenciaItem)
    this.progressSpinner = true;
      this.sigaServices
      .post("busquedaPreasistencias_activarPreasistenciasDenegadas", preasistenciasToActivate)
      .subscribe(
        n => {
          let updateResponseDTO = JSON.parse(n["body"]);
          if(updateResponseDTO.error){         
              if(updateResponseDTO.error.code == 200){ //No se ha actualizado ningun registro
                this.showMsg('info', 'Info', updateResponseDTO.error.description);
              }else{
                this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), updateResponseDTO.error.description);
              }
          }else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), this.translateService.instant("general.message.registro.actualizado"));
            this.activable = false;
            this.denegable = true;
            this.confirmable = true;
            this.updateEstado.emit('PENDIENTE');
          }    
        },
        err => {
          //console.log(err);
        },
        ()=>{
          this.progressSpinner = false;
        }
      );

  }

  denegarSolicitud(){

    let preasistenciasToDeny : PreAsistenciaItem [] = []
    let preasistenciaItem  : PreAsistenciaItem = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    preasistenciasToDeny.push(preasistenciaItem)
    this.progressSpinner = true;
      this.sigaServices
      .post("busquedaPreasistencias_denegarPreasistencias", preasistenciasToDeny)
      .subscribe(
        n => {
          let updateResponseDTO = JSON.parse(n["body"]);
          if(updateResponseDTO.error){         
              if(updateResponseDTO.error.code == 200){ //No se ha actualizado ningun registro
                this.showMsg('info', 'Info', updateResponseDTO.error.description);
              }else{
                this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), updateResponseDTO.error.description);
              }
          }else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), this.translateService.instant("general.message.registro.actualizado"));
            this.activable = true;
            this.denegable = false;
            this.confirmable = false;
            this.updateEstado.emit('DENEGADA');
          }    
        },
        err => {
          //console.log(err);
        },
        ()=>{
          this.progressSpinner = false;
        }
      );

  }

  confirmarSolicitud(){

    let preasistenciaItem  : PreAsistenciaItem = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));

    //Redirigimos a la ficha de asistencia para crear la asistencia y posteriormente confirmar la preasistencia
    sessionStorage.setItem("preasistenciaItemLink", JSON.stringify(preasistenciaItem));
    this.router.navigate(["/fichaAsistencia"]);

  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
}
