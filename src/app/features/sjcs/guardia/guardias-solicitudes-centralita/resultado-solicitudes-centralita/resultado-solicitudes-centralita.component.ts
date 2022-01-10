import { AfterViewInit, EventEmitter } from '@angular/core';
import { ChangeDetectorRef, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-resultado-solicitudes-centralita',
  templateUrl: './resultado-solicitudes-centralita.component.html',
  styleUrls: ['./resultado-solicitudes-centralita.component.scss']
})
export class ResultadoSolicitudesCentralitaComponent implements OnInit, AfterViewInit {

  msgs: Message[] = [];
  columnas = [];
  loading : boolean = false;
  @Input() preAsistencias :  PreAsistenciaItem [] = [];
  @Input() permisoEscritura : boolean = false;
  selectedDatos = [];
  rows : number = 10;
  rowsPerPage = [];
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  isLetrado : boolean = false;
  numSeleccionado : number = 0;
  activable : boolean = false;
  denegable : boolean = false;
  confirmable : boolean = false;
  progressSpinner : boolean = false;
  @Output() buscar  = new EventEmitter<boolean>();
  @ViewChild("table") table: DataTable;
  constructor(private translateService : TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaStorageService : SigaStorageService,
    private confirmationService: ConfirmationService,
    private sigaServices : SigaServices,
    private router: Router,
    private commonsService : CommonsService) { }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.commonsService.scrollTablaFoco('tablaFoco');
    }, 5);
  }

  ngOnInit() {
    this.columnas =[

      {field: 'nAvisoCentralita', header: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.navisocentralita")},
      {field: 'numeroColegiado', header: this.translateService.instant("facturacionSJCS.facturacionesYPagos.NumeroColegiado")},
      {field: 'nombreColegiado', header: this.translateService.instant("justiciaGratuita.justiciables.literal.colegiado")},
      {field: 'descripcionGuardia', header: this.translateService.instant("menu.justiciaGratuita.GuardiaMenu")}, //Identificador de centralita y nombre guardia
      {field: 'fechaLlamada', header: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.fechahorallamada")},
      {field: 'centroDetencion', header: this.translateService.instant("gratuita.volantesExpres.literal.centroDetencion")}, //Identificador de centralita y nombre del centro
      {field: 'descripcionEstado', header: this.translateService.instant("censo.fichaIntegrantes.literal.estado")}

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

    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.isLetrado = true;

    }
    this.table.selectionMode = 'multiple';
  }

  clear() {
    this.msgs = [];
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
      this.selectedDatos = this.preAsistencias;
      this.numSeleccionado = this.selectedDatos.length;
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;
    }
  }

  onSelectRow(data){

    if(data && data.estado == '2'){
      this.activable = true;
      this.denegable = false;
      this.confirmable = false;
    }else if(data && data.estado == '1'){
      this.activable = false;
      this.denegable = false;
      this.confirmable = false;
    }else if(data && data.estado == '0'){
      this.activable = false;
      this.denegable = true;
      this.confirmable = true;
    }

    if(this.table.selectionMode == 'single'){       //Redirigimos a tarjeta de Preasistencia
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }

    if(data && data.estado == '0' && this.numSeleccionado > 1){ // Solo se confirman de una en una
      this.confirmable = false;
    }
  }
  onClickEnlace(preasistencia : PreAsistenciaItem){
    sessionStorage.setItem("preasistenciaItemLink", JSON.stringify(preasistencia));
    this.router.navigate(["/fichaPreasistencia"]);
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
    if(!Array.isArray(this.selectedDatos)){
      preasistenciasToActivate.push(this.selectedDatos);
    }else {
      preasistenciasToActivate = this.selectedDatos;
    }

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
            this.buscar.emit(true);
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
    if(!Array.isArray(this.selectedDatos)){
      preasistenciasToDeny.push(this.selectedDatos);
    }else {
      preasistenciasToDeny = this.selectedDatos;
    }

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
            this.buscar.emit(true);
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

    let selectedData;

    if(Array.isArray(this.selectedDatos)
        && this.selectedDatos.length > 0){
      selectedData = this.selectedDatos[0];
    }else{
      selectedData = this.selectedDatos;
    }

    //Redirigimos a la ficha de asistencia para crear la asistencia y posteriormente confirmar la preasistencia
    sessionStorage.setItem("preasistenciaItemLink", JSON.stringify(selectedData));
    this.router.navigate(["/fichaAsistencia"]);

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
