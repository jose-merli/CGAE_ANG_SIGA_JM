import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { FacAbonoItem } from '../../../../models/sjcs/FacAbonoItem';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { SigaServices } from '../../../../_services/siga.service';
import { TablaAbonosSCJSComponent } from './tabla-abonos-sjcs/tabla-abonos-sjcs.component';
import { FiltrosAbonosSCJSComponent } from './filtros-abonos-sjcs/filtros-abonos-sjcs.component';


@Component({
  selector: 'app-abonos-sjcs',
  templateUrl: './abonos-sjcs.component.html',
  styleUrls: ['./abonos-sjcs.component.scss'],

})
export class AbonosSCJSComponent implements OnInit {

  progressSpinner: boolean = false;
  msgs: Message[] = [];

  buscar: boolean = false;
  datos:FacAbonoItem[] = [];

  filtro:FacAbonoItem;

  @ViewChild(TablaAbonosSCJSComponent)tabla;
  @ViewChild(FiltrosAbonosSCJSComponent) filtrosPadre;
  
  constructor(   private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe) {
    
  }
  ngOnInit() {
    this.buscar = false;
       //Asociar desde designacion
       if (sessionStorage.getItem('filtrosAbonosSJCS')) {
        this.filtro = JSON.parse(sessionStorage.getItem('filtrosAbonosSJCS'));
        this.filtrosPadre.filtros = this.filtro;
        sessionStorage.removeItem('filtrosAbonosSJCS');
        this.searchAbonos();
      }
  }

  clear() {
    this.msgs = [];
  }
  
  searchAbonos(){
    this.filtro = JSON.parse(JSON.stringify(this.filtrosPadre.filtros));
    this.progressSpinner = true;

    this.sigaServices.post("factuarcionsjscs_buscarAbonos", this.filtro).subscribe(
      n => {
        this.datos = JSON.parse(n.body).listaFacAbonoItem;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        this.datos.forEach(d => {
          d.fechaEmision = this.transformDate(d.fechaEmision);
        });

        this.buscar = true;
        
        if (this.tabla != undefined) {
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        // Comprobamos el mensaje de info de resultados
        if (error != undefined  && error.message != undefined) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.message));
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);
      }
    );
  }

  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }
 

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }



}
