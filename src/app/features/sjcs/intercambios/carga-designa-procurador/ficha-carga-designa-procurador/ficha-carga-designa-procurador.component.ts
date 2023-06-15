import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { RemesasItem } from '../../../../../models/sjcs/RemesasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '@angular/router';
import { RemesasResultadoItem } from '../../../../../models/sjcs/RemesasResultadoItem';
import { DatePipe } from '@angular/common';
import { RemesasResolucionItem } from '../../../../../models/sjcs/RemesasResolucionItem';
import { TarjetaDatosCargaDesignaProcuradorComponent } from './tarjeta-datos-carga-designa-procurador/tarjeta-datos-carga-designa-procurador.component';

@Component({
  selector: 'app-ficha-carga-designa-procurador',
  templateUrl: './ficha-carga-designa-procurador.component.html',
  styleUrls: ['./ficha-carga-designa-procurador.component.scss']
})
export class FichaCargaDesignaProcuradorComponent implements OnInit {

  @ViewChild(TarjetaDatosCargaDesignaProcuradorComponent) tarjetaDatosGeneralesCargaDesignaProcurador: TarjetaDatosCargaDesignaProcuradorComponent;
  progressSpinner: boolean = false;
  remesa;
  msgs;
  item; 
  remesaTabla;
  remesaAuxiliar : RemesasResolucionItem;
  remesaResolucion : RemesasResolucionItem = new RemesasResolucionItem();
  remesaItem:  RemesasResolucionItem = new RemesasResolucionItem();

  fichaRemesaResolucion : string = '';
  file: File = undefined;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit() {
    //console.log("321: ")
    if(localStorage.getItem('fichaCargaDesignaProcurador') == "registro"){
      this.item = localStorage.getItem('remesaItem');
      //console.log("Item -> ", this.item);
      this.remesaItem = JSON.parse(this.item);
      //console.log(this.remesaItem)
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      //console.log("Item en JSON -> ", this.remesaTabla);
      this.remesaAuxiliar = JSON.parse(this.item);
      this.fichaRemesaResolucion = localStorage.getItem('fichaCargaDesignaProcurador');
    }else if(localStorage.getItem('fichaCargaDesignaProcurador') == "nuevo"){
      this.recuperarDatosContador();
      this.tarjetaDatosGeneralesCargaDesignaProcurador.isEnabledNuevo = true;
      this.fichaRemesaResolucion = localStorage.getItem('fichaCargaDesignaProcurador');
    }
    localStorage.removeItem('fichaCargaDesignaProcurador');
  }

  save() {
    this.tarjetaDatosGeneralesCargaDesignaProcurador.save();

  }//fin save


  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  
  clear() {
    this.msgs = [];
  }
  rest(){
    this.tarjetaDatosGeneralesCargaDesignaProcurador.isEnabledNuevo = false;
    this.router.navigate(["/cargaDesignaProcurador"]);
  }


  recuperarDatosContador(){
    //console.log("Dentro del recuperarDatosContador");
    this.sigaServices
      .get("intercambios_contadorCargaDesignaProcuradores")
      .subscribe(
        data => {
          //console.log(data);
          this.rellenarDatosNuevo(data);
        },
        error => { },
        () => { }
      );
  }

  rellenarDatosNuevo(datosContador){
    if(datosContador.prefijo !== null){
      this.remesaItem.numRemesaPrefijo = datosContador.prefijo;
    }
    if(datosContador.sufijo !== null){
      this.remesaItem.numRemesaSufijo = datosContador.sufijo;
    }
  } 
  
  volver(){
    this.tarjetaDatosGeneralesCargaDesignaProcurador.isEnabledNuevo = false;
    this.router.navigate(["/cargaDesignaProcurador"]);
  }



  restablecer(){
    if(this.remesaItem.idRemesaResolucion == null){
      this.tarjetaDatosGeneralesCargaDesignaProcurador.remesaItem.observaciones= "";
      this.tarjetaDatosGeneralesCargaDesignaProcurador.remesaItem.fechaResolucion="";
      this.tarjetaDatosGeneralesCargaDesignaProcurador.remesaItem.nombreFichero = "";
      this.tarjetaDatosGeneralesCargaDesignaProcurador.file = null;
      this.tarjetaDatosGeneralesCargaDesignaProcurador.conFichero = false;
      this.tarjetaDatosGeneralesCargaDesignaProcurador.archivoDisponible = false;

    }else{
      this.tarjetaDatosGeneralesCargaDesignaProcurador.remesaItem.observaciones= this.remesaAuxiliar.observaciones;
      this.tarjetaDatosGeneralesCargaDesignaProcurador.remesaItem.fechaResolucion = this.remesaAuxiliar.fechaResolucion;
    }
  }

}