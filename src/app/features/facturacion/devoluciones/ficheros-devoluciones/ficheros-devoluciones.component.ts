import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { TranslateService } from '../../../../commons/translate';
import { FicherosDevolucionesItem } from '../../../../models/FicherosDevolucionesItem';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosFicherosDevolucionesComponent } from './filtros-ficheros-devoluciones/filtros-ficheros-devoluciones.component';
import { TablaFicherosDevolucionesComponent } from './tabla-ficheros-devoluciones/tabla-ficheros-devoluciones.component';


@Component({
  selector: 'app-ficheros-devoluciones',
  templateUrl: './ficheros-devoluciones.component.html',
  styleUrls: ['./ficheros-devoluciones.component.scss'],

})
export class FicherosDevolucionesComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  buscar: boolean = false;
  datos: FicherosDevolucionesItem[] = [];

  filtro;

  @ViewChild(FiltrosFicherosDevolucionesComponent) filtros;
  @ViewChild(TablaFicherosDevolucionesComponent) tabla;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe
  ) {  }

  ngOnInit() {
    this.buscar = false;
    // this.permisoEscritura=true //cambiar cuando se implemente los permisos
  }

  searchFicherosDevoluciones() {
    this.filtro = JSON.parse(JSON.stringify(this.filtros.body));
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_getFicherosDevoluciones", this.filtro).subscribe(
      n => {
        this.datos = JSON.parse(n.body).ficherosDevolucionesItems;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        this.datos.forEach(d => {
          d.fechaCreacion = this.transformDate(d.fechaCreacion);
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

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  // Funciones de utilidad

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
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

}
