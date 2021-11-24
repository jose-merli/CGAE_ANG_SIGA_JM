import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { ListaGuardiasItem } from '../../../../../models/guardia/ListaGuardiasItem';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-ficha-lista-guardias',
  templateUrl: './ficha-lista-guardias.component.html',
  styleUrls: ['./ficha-lista-guardias.component.scss']
})
export class FichaListaGuardiasComponent implements OnInit {

  msgs: Message[] = [];
  rutas: string[] = [];
  progressSpinner : boolean = false;
  listaTarjetas = [
    {
      nombre: 'Datos Generales',
      icono: 'fa fa-user',
      detalle: false,
      fixed: false,
      opened: true,
      campos: [],
      enlaces: []
    },
    {
      nombre: 'Guardias',
      icono: 'fas fa-certificate',
      detalle: false,
      fixed: false,
      opened: true,
      campos: [],
      enlaces: []
    }
  ];
  lista : ListaGuardiasItem;
  permisosEscritura : boolean = false;
  constructor(private translateService : TranslateService,
    private router : Router,
    private persistenceService : PersistenceService,
    private commonServices : CommonsService) { }

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
    this.rutas = ['SJCS','Guardia','Lista Guardias','Ficha Lista Guardias'];

    if(sessionStorage.getItem("lista")){
      this.lista = JSON.parse(sessionStorage.getItem("lista"));
      sessionStorage.removeItem("lista");
    } else if(sessionStorage.getItem("nuevaLista")){
      this.lista = new ListaGuardiasItem();
      this.listaTarjetas[1].opened = false; //Al ser una lista nueva deshabilitamos la tarjeta Guardias hasta su creacion
      sessionStorage.removeItem("nuevaLista");
    }
  }

  openTarjetaGuardias(event){
    if(event){
      this.lista.idLista = event;
      this.listaTarjetas[1].opened = true;
    }
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

  backTo(){
      sessionStorage.setItem("volver","true");
      this.router.navigate(['/definirListasGuardias']);
    
  }
}
