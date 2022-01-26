import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { Message } from 'primeng/components/common/message';
import { FiltrosExportacionesContabilidadComponent } from './filtros-exportaciones-contabilidad/filtros-exportaciones-contabilidad.component';
import { TablaExportacionesContabilidadComponent } from './tabla-exportaciones-contabilidad/tabla-exportaciones-contabilidad.component';
import { FacRegistroFichContaItem } from '../../../models/FacRegistroFichContaItem';
import { TranslateService } from '../../../commons/translate';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss'],

})
export class ContabilidadComponent implements OnInit {

  
  progressSpinner: boolean = false;
  msgs: Message[] = [];

  buscar: boolean = false;
  enabledSave: boolean = false;
  disabledNuevo: boolean = false;

  datos: FacRegistroFichContaItem[] = [];

  filtro:FacRegistroFichContaItem;
  historico:boolean = false;

  @ViewChild(FiltrosExportacionesContabilidadComponent) filtrosPadre;
  @ViewChild(TablaExportacionesContabilidadComponent) tabla;


  constructor(   private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe) {
    
  }

  ngOnInit() {
    this.buscar = false;
  }

  clear() {
    this.msgs = [];
  }
  
  ultimaFechaHasta: Date;
  searchExportacionesContabilidad(event){
    this.filtro = JSON.parse(JSON.stringify(this.filtrosPadre.filtros));
    this.progressSpinner = true;

    if(event == true){
      this.filtro.historico = true;
    }else{
      this.filtro.historico = false;
    }

    this.sigaServices.post("facturacionPyS_buscarExportacionContabilidad", this.filtro).subscribe(
      n => {
        this.datos = JSON.parse(n.body).facRegistroFichConta;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        //Fecha desde: en caso de registro nuevo, será un selector de fecha obligatorio, que por defecto se cargará 
        //con la siguiente fecha a la última “fecha hasta” exportada que no esté de baja.
        this.ultimaFechaHasta = new Date(0);
        this.datos.forEach(registro =>{
          if(registro.fechaBaja == null){
            let fechaExportacionHastaRegistro = new Date(registro.fechaExportacionHasta);
            if(this.ultimaFechaHasta < fechaExportacionHastaRegistro){
              this.ultimaFechaHasta = fechaExportacionHastaRegistro;
            }
          }
        })

        this.datos.forEach(d => {
          d.fechaCreacion = this.transformDate(d.fechaCreacion);
          d.fechaExportacionDesde = this.transformDate(d.fechaExportacionDesde);
          d.fechaExportacionHasta = this.transformDate(d.fechaExportacionHasta);
        });

        if(event == true){
          let thereIsHistoricalRegister;
          this.datos.forEach(registro => {
            if (registro.fechaBaja != null) {
              thereIsHistoricalRegister = true;
            }
          });

          if (thereIsHistoricalRegister != true) {
            this.historico = false;
            //Mensaje informativo en caso de que no haya registros eliminados.
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("facturacion.maestros.tiposproductosservicios.nohistorico"));

          }
        }else{
          this.historico = false;
        }

        this.buscar = true;
        this.enabledSave = false;
        this.disabledNuevo = false;
        
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
