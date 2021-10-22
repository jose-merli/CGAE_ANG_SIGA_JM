import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { RemesasItem } from '../../../../models/sjcs/RemesasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Router } from '@angular/router';
import { TarjetaDatosGeneralesRemesasResultadosComponent } from './tarjeta-datos-generales-remesas-resultados/tarjeta-datos-generales-remesas-resultados.component';
import { RemesasResultadoItem } from '../../../../models/sjcs/RemesasResultadoItem';
import { ContadorItem } from '../../../../models/ContadorItem';
import { DatePipe } from '@angular/common';
import { RemesasResolucionItem } from '../../../../models/sjcs/RemesasResolucionItem';
import { TarjetaRemesasEnvioComponent } from './tarjeta-remesas-envio/tarjeta-remesas-envio.component';

@Component({
  selector: 'app-ficha-remesas-resultados',
  templateUrl: './ficha-remesas-resultados.component.html',
  styleUrls: ['./ficha-remesas-resultados.component.scss']
})
export class FichaRemesasResultadosComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesRemesasResultadosComponent) tarjetaDatosGeneralesRemesasResultados: TarjetaDatosGeneralesRemesasResultadosComponent;
  @ViewChild(TarjetaRemesasEnvioComponent) tarjetaRemesaEnvio :TarjetaRemesasEnvioComponent;
  progressSpinner: boolean = false;
  remesa;
  msgs;
  item;
  remesaTabla;
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

  fichaRemesaResultado : string = '';
  file: File = undefined;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit() {
    console.log("321: ")
    if(localStorage.getItem('fichaRemesaResultado') == "registro"){
      this.item = localStorage.getItem('remesaItem');
      console.log("Item -> ", this.item);
      this.remesaItem = JSON.parse(this.item);
      console.log(this.remesaItem)
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      console.log("Item en JSON -> ", this.remesaTabla);
      this.fichaRemesaResultado = localStorage.getItem('fichaRemesaResultado');
    }else if(localStorage.getItem('fichaRemesaResultado') == "nuevo"){
      this.recuperarDatosContador();
      this.tarjetaDatosGeneralesRemesasResultados.isEnabledNuevo = true;
      this.fichaRemesaResultado = localStorage.getItem('fichaRemesaResultado');
    }
    localStorage.removeItem('fichaRemesaResultado');
  }

  save() {
    this.tarjetaDatosGeneralesRemesasResultados.save();

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
    this.tarjetaDatosGeneralesRemesasResultados.isEnabledNuevo = false;
    this.router.navigate(["/remesasResultado"]);
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
    this.tarjetaDatosGeneralesRemesasResultados.isEnabledNuevo = false;
    this.router.navigate(["/remesasResultado"]);
  }

}
