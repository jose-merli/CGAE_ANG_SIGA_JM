import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { PreAsistenciaItem } from '../../../../models/guardia/PreAsistenciaItem';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { KEY_CODE } from '../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { BuscadorSolicitudesCentralitaComponent } from './buscador-solicitudes-centralita/buscador-solicitudes-centralita.component';


@Component({
  selector: 'app-guardias-solicitudes-centralita',
  templateUrl: './guardias-solicitudes-centralita.component.html',
  styleUrls: ['./guardias-solicitudes-centralita.component.scss'],

})
export class GuardiasSolicitudesCentralitaComponent implements OnInit {

  url;
  msgs: Message[] = [];
  show : boolean = false;
  rutas: string[] = [];
  progressSpinner : boolean;
  filas : PreAsistenciaItem [] = [];
  permisoEscritura : boolean = false;
  @ViewChild(BuscadorSolicitudesCentralitaComponent) buscador;
  constructor(public sigaOldServices: OldSigaServices,
    private translateService : TranslateService,
    private sigaServices: SigaServices,
    private router : Router,
    private commonServices : CommonsService,
    private persistenceService : PersistenceService) {
    //this.url = sigaServices.getOldSigaUrl("guardiasAceptadasCentralita");
  }

  ngOnInit() {
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.menuitem")];
    
    this.commonServices.checkAcceso(procesos_guardia.solicitudes_centralita)
    .then(respuesta => {

      this.permisoEscritura = respuesta;

      this.persistenceService.setPermisos(this.permisoEscritura);

       if (this.permisoEscritura == undefined) {
         sessionStorage.setItem("codError", "403");
         sessionStorage.setItem(
           "descError",
           this.translateService.instant("generico.error.permiso.denegado")
         );
         this.router.navigate(["/errorAcceso"]);
       }

    }).catch(error => console.error(error));
    
    if(sessionStorage.getItem("volver") == "true"
      && sessionStorage.getItem("filtro")){
      this.buscador.filtro = JSON.parse(sessionStorage.getItem("filtro"));
      sessionStorage.removeItem("filtro");
      this.search();
    }
  }

  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

  search(){
    if(this.checkFilters()){
      this.filas = [];
      this.progressSpinner = true;
      this.buscador.filtroAux = this.buscador.filtro;
      let reAsistenciaItem = Object.assign({},this.buscador.filtro);
      if(this.buscador.filtro.idTurno != "" && this.buscador.filtro.idTurno != undefined){
        reAsistenciaItem.idTurno = this.buscador.filtro.idTurno.toString();
      }
      if(this.buscador.filtro.idGuardia != "" && this.buscador.filtro.idGuardia != undefined){
        reAsistenciaItem.idGuardia = this.buscador.filtro.idGuardia.toString();
      }
      if(this.buscador.filtro.idComisaria != "" && this.buscador.filtro.idComisaria != undefined){
        reAsistenciaItem.idComisaria = this.buscador.filtro.idComisaria.toString();
      }
      if(this.buscador.filtro.idJuzgado != "" && this.buscador.filtro.idJuzgado != undefined){
        reAsistenciaItem.idJuzgado = this.buscador.filtroAux.idJuzgado.toString();
      }
      if(this.buscador.filtro.estado != "" && this.buscador.filtro.estado != undefined){
        reAsistenciaItem.estado = this.buscador.filtroAux.estado.toString();
      }
      // this.buscador.filtroAux.estado = this.buscador.filtroAux.estado.toString();
      sessionStorage.setItem ("filtro", JSON.stringify(this.buscador.filtro))
      this.sigaServices
      .post("busquedaPreasistencias_buscarPreasistencias", reAsistenciaItem)
      .subscribe(
        n => {
          let preasistenciasDTO = JSON.parse(n["body"]);
          if(preasistenciasDTO.error){         
              if(preasistenciasDTO.error.code == 200){ //Todo ha ido bien pero la consulta ha excedido los registros maximos
                this.showMsg('info', 'Info', preasistenciasDTO.error.description);
                this.filas = preasistenciasDTO.preasistenciaItems;
              }else{
                this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), preasistenciasDTO.error.description);
              }
          }else if(preasistenciasDTO.preasistenciaItems.length === 0){
            this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
          }else{
            this.filas = preasistenciasDTO.preasistenciaItems;
          }    
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
        },
        ()=>{
          this.progressSpinner = false;
          setTimeout(() => {
            this.commonServices.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
      
  
      this.show = true;
    }
  }

  reset(){
    this.show = false;
    this.buscador.filtro.nAvisoCentralita = "";
    this.buscador.filtro.estado = "0";
    this.buscador.filtro.idTurno = "";
    this.buscador.filtro.idGuardia = "";
    this.buscador.filtro.fechaLlamadaDsd = "";
    this.buscador.filtro.fechaLlamadaHasta = "";
    this.buscador.filtro.idComisaria = "";
    this.buscador.filtro.idJuzgado = "";
    this.buscador.filtro.numeroColegiado = "";
    this.buscador.filtro.nombreColegiado = "";
    this.buscador.filtro.idTipoCentroDetencion = "";
    this.buscador.filtroAux = this.buscador.filtro;
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

  reloadTabla(event){
    if(event){
      this.buscador.filtro = this.buscador.filtroAux;
      this.search();
    }
  }

  checkFilters(){
    if ((this.buscador.filtro.estado == null || this.buscador.filtro.estado == undefined || this.buscador.filtro.estado.length == 0) &&
        (this.buscador.filtro.fechaLlamadaDsd == null || this.buscador.filtro.fechaLlamadaDsd == undefined || this.buscador.filtro.fechaLlamadaDsd.trim() == "" )&&
        (this.buscador.filtro.fechaLlamadaHasta == null || this.buscador.filtro.fechaLlamadaHasta == undefined || this.buscador.filtro.fechaLlamadaHasta.trim() == "" )&&
        (this.buscador.filtro.idTurno == null || this.buscador.filtro.idTurno == undefined || this.buscador.filtro.idTurno.length == 0) &&
        (this.buscador.filtro.idGuardia == null || this.buscador.filtro.idGuardia == undefined || this.buscador.filtro.idGuardia.length == 0) &&
        (this.buscador.filtro.idComisaria == null || this.buscador.filtro.idComisaria == undefined || this.buscador.filtro.idComisaria.length == 0) &&
        (this.buscador.filtro.idJuzgado == null || this.buscador.filtro.idJuzgado == undefined || this.buscador.filtro.idJuzgado.length == 0) &&
        (this.buscador.filtro.nAvisoCentralita == null || this.buscador.filtro.nAvisoCentralita == undefined || this.buscador.filtro.nAvisoCentralita.trim() == "" || this.buscador.filtro.nAvisoCentralita.trim().length < 3)) {
        
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
        return false;
      } else {   
        // quita espacios vacios antes de buscar
        if (this.buscador.filtro.nAvisoCentralita != undefined && this.buscador.filtro.nAvisoCentralita != null) {
          this.buscador.filtro.nAvisoCentralita = this.buscador.filtro.nAvisoCentralita.trim();
        }
        
        return true;
      }
    }

}
