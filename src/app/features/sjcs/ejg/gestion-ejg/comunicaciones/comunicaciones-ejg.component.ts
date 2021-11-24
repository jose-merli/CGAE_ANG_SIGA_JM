import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ComunicacionesSearchItem } from '../../../../../models/ComunicacionesSearchItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from "@angular/router";
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { DataTable } from 'primeng/primeng';
import { EnviosMasivosItem } from '../../../../../models/EnviosMasivosItem';

@Component({
  selector: 'app-comunicaciones-ejg',
  templateUrl: './comunicaciones-ejg.component.html',
  styleUrls: ['./comunicaciones-ejg.component.scss']
})
export class ComunicacionesEJGComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaComunicaciones: string;
  @Input() openTarjetaComunicaciones;
  
  @ViewChild("table") table: DataTable;
  
  msgs;
  
  fichaPosible = {
    key: "comunicaciones",
    activa: false
  }
  
  resaltadoDatosGenerales: boolean=false;
  activacionTarjeta: boolean = false;
  openFicha: boolean = false;
  cols;
  buscadores = [];
  rowsPerPage: any = [];
  selectedItem: number = 10;
  item: EJGItem;
  comunicaciones: EnviosMasivosItem[] = [];
  numComunicaciones=0;
  progressSpinner: boolean = false;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  nuevo: boolean;
  estado: any;

  constructor(private persistenceService: PersistenceService,
    private router: Router, private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.numComunicaciones=0;

    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.item = this.persistenceService.getDatos();

      this.searchComunicaciones();
      this.getCols();
    }else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.item = new EJGItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaComunicaciones == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  clear() {
    this.msgs = [];
  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (key == "comunicaciones" && !this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getCols() {
    this.cols = [
      { field: "claseComunicacion", header: "informesycomunicaciones.comunicaciones.busqueda.claseComunicacion" },
      { field: "destinatario", header: "informesycomunicaciones.comunicaciones.busqueda.destinatario" },
      { field: "fechaCreacion", header: "informesycomunicaciones.enviosMasivos.fechaCreacion" },
      { field: "fechaProgramada", header: "informesycomunicaciones.comunicaciones.busqueda.fechaProgramada" },
      { field: "tipoEnvio", header: "informesycomunicaciones.comunicaciones.busqueda.tipoEnvio" },
      { field: "estadoEnvio", header: "censo.nuevaSolicitud.estado" }
    ];

    this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  onChangeRowsPerPages(event){
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  navigateTo(dato) {
    this.estado = dato[0].idEstado;

    if (this.estado != 5) {
      sessionStorage.setItem("comunicacionesSearch",  JSON.stringify(dato[0]));
      this.router.navigate(["/fichaRegistroComunicacion"]);
      //sessionStorage.setItem("filtrosCom", JSON.stringify(this.bodySearch));
    } else if (this.estado == 5) {
      this.showMessage("error",this.translateService.instant("general.message.incorrect"),this.translateService.instant("informesycomunicaciones.comunicaciones.envioProcess"));
    }
  }

  searchComunicaciones() {
    //this.progressSpinner = true;

    this.sigaServices.post("gestionejg_getComunicaciones", this.item).subscribe(
      n => {
        this.comunicaciones = JSON.parse(n.body).enviosMasivosItem;

        this.numComunicaciones = this.comunicaciones.length;
       // this.progressSpinner = false;

      },
      err => {
        console.log(err);
       // this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        
      }
    );
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
