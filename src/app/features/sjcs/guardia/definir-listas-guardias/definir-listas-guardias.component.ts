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
    this.hideResponse();
    this.progressSpinner = true;
    let listaGuardiasItem = Object.assign({},this.buscador.filtro);
    if(this.buscador.filtro.idGrupoZona != "" && this.buscador.filtro.idGrupoZona != undefined){
      listaGuardiasItem.idGrupoZona = this.buscador.filtro.idGrupoZona.toString();
    }
    if(this.buscador.filtro.idZona != "" && this.buscador.filtro.idZona != undefined){
      listaGuardiasItem.idZona = this.buscador.filtro.idZona.toString();
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
