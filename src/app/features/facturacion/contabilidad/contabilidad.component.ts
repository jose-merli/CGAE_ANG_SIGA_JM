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
  datos: FacRegistroFichContaItem[] = [];

  filtro:FacRegistroFichContaItem;

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
  
  searchExportacionesContabilidad(){
    this.filtro = JSON.parse(JSON.stringify(this.filtrosPadre.filtros));
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_buscarExportacionContabilidad", this.filtro).subscribe(
      n => {
        this.datos = JSON.parse(n.body).facRegistroFichConta;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        this.datos.forEach(d => {
          d.fechaCreacion = this.transformDate(d.fechaCreacion);
          d.fechaExportacionDesde = this.transformDate(d.fechaExportacionDesde);
          d.fechaExportacionHasta = this.transformDate(d.fechaExportacionHasta);
          d.nombreEstado = this.transformEstado(d.estado);
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
  transformEstado(estado:number){
    let nombreEstado:String;
    switch (estado) {
      case 0:
          nombreEstado ="Caso 0"
          break;
      case 1:
          nombreEstado ="Caso 1"
          break;
      case 2:
          nombreEstado ="Caso 2"
          break;
      case 3:
          nombreEstado ="Caso 3"  
          break;
      default:
          nombreEstado ="Erroneo"
          break;
    } 
    return nombreEstado;
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
