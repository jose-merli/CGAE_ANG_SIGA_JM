import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { RemesasItem } from '../../../../models/sjcs/RemesasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Router } from '@angular/router';
import { TarjetaDatosGeneralesRemesasResolucionesComponent } from './tarjeta-datos-generales-remesas-resoluciones/tarjeta-datos-generales-remesas-resoluciones.component';
import { RemesasResultadoItem } from '../../../../models/sjcs/RemesasResultadoItem';
import { DatePipe } from '@angular/common';
import { RemesasResolucionItem } from '../../../../models/sjcs/RemesasResolucionItem';

@Component({
  selector: 'app-ficha-remesas-resoluciones',
  templateUrl: './ficha-remesas-resoluciones.component.html',
  styleUrls: ['./ficha-remesas-resoluciones.component.scss']
})
export class FichaRemesasResolucionesComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesRemesasResolucionesComponent) tarjetaDatosGeneralesRemesasResoluciones: TarjetaDatosGeneralesRemesasResolucionesComponent;
  progressSpinner: boolean = false;
  remesa;
  msgs;
  item; 
  remesaTabla;
  remesaAuxiliar : RemesasResultadoItem;
  remesaResolucion : RemesasResolucionItem = new RemesasResolucionItem();
  remesaItem: RemesasResultadoItem = new RemesasResultadoItem(
    {
    'idRemesaResultado': null,
    'numRemesaPrefijo': '',
    'numRemesaNumero': '',
    'numRemesaSufijo': '',
    'numRegistroPrefijo': '',
    'numRegistroNumero': '',
    'numRegistroSufijo': '',
    'nombreFichero': '',
    'fechaRemesaDesde': '',
    'fechaRemesaHasta': '',
    'fechaCargaDesde': '',
    'fechaCargaHasta': '',
    'observacionesRemesaResultado': '',
    'fechaCargaRemesaResultado': '',
    'fechaResolucionRemesaResultado': '',
    'idRemesa': null,
    'numeroRemesa': '',
    'prefijoRemesa': '',
    'sufijoRemesa': '',
    'descripcionRemesa': '',
    'numRegistroRemesaCompleto': '',
    'numRemesaCompleto': ''
    }
  );

  fichaRemesaResolucion : string = '';
  file: File = undefined;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit() {
    console.log("321: ")
    if(localStorage.getItem('fichaRemesaResolucion') == "registro"){
      this.item = localStorage.getItem('remesaItem');
      console.log("Item -> ", this.item);
      this.remesaItem = JSON.parse(this.item);
      console.log(this.remesaItem)
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      console.log("Item en JSON -> ", this.remesaTabla);
      this.remesaAuxiliar = JSON.parse(this.item);
      this.fichaRemesaResolucion = localStorage.getItem('fichaRemesaResolucion');
    }else if(localStorage.getItem('fichaRemesaResolucion') == "nuevo"){
      this.recuperarDatosContador();
      this.tarjetaDatosGeneralesRemesasResoluciones.isEnabledNuevo = true;
      this.fichaRemesaResolucion = localStorage.getItem('fichaRemesaResolucion');
    }
    localStorage.removeItem('fichaRemesaResultado');
  }

  save() {
    this.tarjetaDatosGeneralesRemesasResoluciones.save();

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
    this.tarjetaDatosGeneralesRemesasResoluciones.isEnabledNuevo = false;
    this.router.navigate(["/remesasResoluciones"]);
  }


  recuperarDatosContador(){
    console.log("Dentro del recuperarDatosContador");
    this.sigaServices
      .get("remesasResultados_recuperarDatosContador")
      .subscribe(
        data => {
          console.log(data);
          this.rellenarDatosNuevo(data);
        },
        error => { },
        () => { }
      );
  }

  rellenarDatosNuevo(datosContador){
    if(datosContador.prefijo !== null){
      this.remesaItem.prefijoRemesa = datosContador.prefijo;
    }
    if(datosContador.sufijo !== null){
      this.remesaItem.sufijoRemesa = datosContador.sufijo;
    }
  } 
  
  volver(){
    this.tarjetaDatosGeneralesRemesasResoluciones.isEnabledNuevo = false;
    this.router.navigate(["/remesasResoluciones"]);
  }



  restablecer(){
    if(this.remesaItem.idRemesa == null){
      this.tarjetaDatosGeneralesRemesasResoluciones.remesaItem.observaciones= "";
      this.tarjetaDatosGeneralesRemesasResoluciones.remesaItem.fechaResolucion="";
      this.tarjetaDatosGeneralesRemesasResoluciones.remesaItem.nombreFichero = "";
      this.tarjetaDatosGeneralesRemesasResoluciones.file = null;
      this.tarjetaDatosGeneralesRemesasResoluciones.conFichero = false;
      this.tarjetaDatosGeneralesRemesasResoluciones.archivoDisponible = false;

    }else{
      this.tarjetaDatosGeneralesRemesasResoluciones.remesaItem.observaciones= this.remesaAuxiliar.observacionesRemesaResultado;
      this.tarjetaDatosGeneralesRemesasResoluciones.remesaItem.fechaResolucion = this.remesaAuxiliar.fechaResolucionRemesaResultado;
    }
  }

}