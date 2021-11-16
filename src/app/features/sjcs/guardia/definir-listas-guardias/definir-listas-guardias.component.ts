import { Location } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { ListaGuardiasItem } from '../../../../models/guardia/ListaGuardiasItem';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { KEY_CODE } from '../../../censo/busqueda-censo-general/busqueda-censo-general.component';
import { BuscadorListaGuardiasComponent } from './buscador-lista-guardias/buscador-lista-guardias.component';


@Component({
  selector: 'app-definir-listas-guardias',
  templateUrl: './definir-listas-guardias.component.html',
  styleUrls: ['./definir-listas-guardias.component.scss'],

})
export class DefinirListasGuardiasComponent implements OnInit {

  show : boolean = false;
  msgs : Message[] = [];
  rutas : string [] = []
  progressSpinner : boolean = false;
  listas : ListaGuardiasItem [] = [];
  permisosEscritura : boolean = false;

  @ViewChild(BuscadorListaGuardiasComponent) buscador : BuscadorListaGuardiasComponent;
  constructor(private translateService : TranslateService,
    private sigaServices : SigaServices,
    private router : Router,
    private commonServices : CommonsService,
    private persistenceService : PersistenceService,
    private location : Location) {
    
  }

  ngOnInit() {

    this.commonServices.checkAcceso(procesos_guardia.listas_guardia)
    .then(respuesta => {

      this.permisosEscritura = respuesta;

      this.persistenceService.setPermisos(this.permisosEscritura);

       if (this.permisosEscritura == undefined) {
         sessionStorage.setItem("codError", "403");
         sessionStorage.setItem(
           "descError",
           this.translateService.instant("generico.error.permiso.denegado")
         );
         this.router.navigate(["/errorAcceso"]);
       }

    }).catch(error => console.error(error));

    this.rutas = ['SJCS',this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),'Configurar Listado Guardias'];

    if(sessionStorage.getItem("filtroListaGuardia") && sessionStorage.getItem("volver")){
      this.buscador.filtro = JSON.parse(sessionStorage.getItem("filtroListaGuardia"));
      if(this.buscador.filtro.idGrupoZona){
        this.buscador.getComboZona();
      }
      this.search();
      sessionStorage.removeItem("filtroListaGuardia");
      sessionStorage.removeItem("volver");
    }else{
      this.buscador.filtro.idTipo = '1'; //Seteamos valor por defecto
    }
  }

  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  reset(){
    this.buscador.filtro = Object.assign({}, this.buscador.filtroAux);
  }

  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

  nuevaLista(){
    sessionStorage.setItem("nuevaLista","true");
    sessionStorage.setItem("filtroListaGuardia",JSON.stringify(this.buscador.filtro));
    this.router.navigate(['/fichaListaGuardias']);
  }

  search(){
    if (this.checkFilters()){
    this.hideResponse();
    this.progressSpinner = true;
    let listaGuardiasItem = Object.assign({},this.buscador.filtro);
    if(this.buscador.filtro.idGrupoZona  && this.buscador.filtro.idGrupoZona.length > 0){
      listaGuardiasItem.idGrupoZona = this.buscador.filtro.idGrupoZona.toString();
    }else{
      listaGuardiasItem.idGrupoZona = "";
    }
    if(this.buscador.filtro.idZona && this.buscador.filtro.idZona.length > 0){
      listaGuardiasItem.idZona = this.buscador.filtro.idZona.toString();
    }else{
      listaGuardiasItem.idZona = "";
    }
    this.sigaServices
    .post("listasGuardias_searchListaGuardias", listaGuardiasItem)
    .subscribe(
      n => {
        let listaGuardiasDTO = JSON.parse(n["body"]);
        if(listaGuardiasDTO.error && listaGuardiasDTO.error.code != 200){
          this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), listaGuardiasDTO.error.description);
        }else if(listaGuardiasDTO.listaGuardiasItems.length === 0){
          this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
        }else{
          if(listaGuardiasDTO.error && listaGuardiasDTO.error.code == 200){ //Todo ha ido bien pero la consulta ha excedido los registros maximos
            this.showMsg('info', 'Info', listaGuardiasDTO.error.description);
          }
          let listaGuardiasItems : ListaGuardiasItem [] = listaGuardiasDTO.listaGuardiasItems;
          this.buscador.filtroAux = Object.assign({},this.buscador.filtro);
          this.listas = listaGuardiasItems;
          this.showResponse();
        }    
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
      },
      () =>{
        this.progressSpinner = false;
      }
    );
    }
  }
checkFilters(){
  if (
    (this.buscador.filtro.nombre == null ||
      this.buscador.filtro.nombre == undefined ||
      this.buscador.filtro.nombre.trim().length < 3) &&
    (this.buscador.filtro.idGrupoZona == null ||
      this.buscador.filtro.idGrupoZona == undefined) &&
    (this.buscador.filtro.idTipo == null ||
      this.buscador.filtro.idTipo == undefined ||
      this.buscador.filtro.idTipo.trim().length < 3) &&
    (this.buscador.filtro.idZona == null ||
      this.buscador.filtro.idZona == undefined ||
      this.buscador.filtro.idZona.trim().length < 3) &&
    (this.buscador.filtro.lugar == undefined ||
      this.buscador.filtro.lugar == null||
      this.buscador.filtro.lugar.trim().length < 3) &&
    (this.buscador.filtro.observaciones == null ||
      this.buscador.filtro.observaciones == undefined ||
      this.buscador.filtro.observaciones.trim().length < 3) &&
    (this.buscador.filtro.tipoDesc == null ||
      this.buscador.filtro.tipoDesc == undefined ||
      this.buscador.filtro.tipoDesc.trim().length < 3)
    ) {
    this.showSearchIncorrect();
    this.progressSpinner = false;
    return false;
  } else {
    return true;
  }
}
showSearchIncorrect() {
  this.msgs = [];
  this.msgs.push({
    severity: "error",
    summary: this.translateService.instant("general.message.incorrect"),
    detail: this.translateService.instant(
      "cen.busqueda.error.busquedageneral"
    )
  });
}
}
