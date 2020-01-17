import { Component, OnInit, SimpleChanges, Input, HostListener, Output } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { Location } from '@angular/common'
import { CommonsService } from '../../../../_services/commons.service';
@Component({
  selector: 'app-gestion-ejg',
  templateUrl: './gestion-ejg.component.html',
  styleUrls: ['./gestion-ejg.component.scss']
})
export class GestionEjgComponent implements OnInit {
  // @Input() modoEdicion;
  @Output() modoEdicion;
  // @Output() body;
  // @Output() modoEdicionSend = new EventEmitter<any>();
  // modoEdicion: boolean;
  openFicha: boolean = true;
  showTarjeta: boolean = true;
  progressSpinner: boolean = false;
  permisos;
  nuevo;
  icono = "clipboard";
  msgs;
  body: EJGItem = new EJGItem();
  datosFamiliares: any;
  datos;
  // datosItem: EJGItem;
  idEJG;
  filtros;
  filtrosAux;
  permisoEscritura: boolean = true;

  constructor(private sigaServices: SigaServices,
    private route: ActivatedRoute,
    private location: Location,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    this.commonsService.scrollTop();
    if (this.persistenceService.getPermisos() != undefined)
    // this.permisoEscritura = this.persistenceService.getPermisos()
    // De momento todo disabled, funcionalidades FAC.Cuando esté todo cambiar Permisos. 
      this.permisoEscritura = false;
    this.body = this.persistenceService.getDatos();
    this.datos = [
      {
        label: "Año/Numero EJG",
        value: this.body.numAnnioProcedimiento
      },
      {
        label: "Apellidos, Nombre Solicitante",
        value: this.body.nombreApeSolicitante
      },

      {
        label: "Estado EJG",
        value: this.body.estadoEJG
      },
      {
        label: "Apellidos, Nombre Designado",
        value: this.body.apellidosYNombre
      },
      {
        label: "Dictamen",
        value: this.body.dictamenSing
      },
      {
        label: "Resolución CAJG",
        value: this.body.resolucion
      },
      {
        label: "Impugnación",
        value: this.body.impugnacion
      },
    ];
    if (this.body != undefined || this.body != null) {
      this.modoEdicion = true;
      //  if (this.dato.fechabaja != null) {
      //    this.modoEdicion = true;
      //    this.persistenceService.setPermisos(false);
      //  }
    } else {
      //  hemos pulsado nuevo
      this.body = new EJGItem();
      //  this.buscar = false;
      this.modoEdicion = false;
    }
  }

  clear() {
    this.msgs = [];
  }
  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idEJG = event.idEJG
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
  backTo() {
    this.location.back();
  }
}
