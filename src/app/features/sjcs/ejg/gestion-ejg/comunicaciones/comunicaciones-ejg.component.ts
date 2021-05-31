import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ComunicacionesSearchItem } from '../../../../../models/ComunicacionesSearchItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from "@angular/router";
import { DataTable } from 'primeng/datatable';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
@Component({
  selector: 'app-comunicaciones-ejg',
  templateUrl: './comunicaciones-ejg.component.html',
  styleUrls: ['./comunicaciones-ejg.component.scss']
})
export class ComunicacionesEJGComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaComunicaciones: string;
 //@Input() comunicaciones;
  @Input() openTarjetaComunicaciones;
  

  msgs;
  fichaPosible = {
    key: "comunicaciones",
    activa: false
  }
  selectedDatos=[];
  
  resaltadoDatosGenerales: boolean=false;
  activacionTarjeta: boolean = false;
  openFicha: boolean = false;
  cols;
  buscadores = [];
  rowsPerPage: any = [];
  selectedItem: number = 10;
  datos;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  selectAll;
  bodySearch: ComunicacionesSearchItem = new ComunicacionesSearchItem();
  body: EJGItem;
  item: EJGItem;
  comunicaciones: ComunicacionesSearchItem;
  progressSpinner: boolean = false;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  nuevo: boolean;
  estado: any;
  // @ViewChild("table")
  // table: DataTable;
  constructor(private persistenceService: PersistenceService,
    private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService) { }

  ngOnInit() {
    // this.getCols();

    // this.datos=this.comunicaciones; 
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
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
    if (
      key == "comunicaciones" &&
      !this.activacionTarjeta
    ) {
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

  // openTab(evento){
  //   if (this.persistenceService.getPermisos() != undefined) {
  //     this.permisoEscritura = this.persistenceService.getPermisos();
  //   }
  //   if (!this.selectAll && !this.selectMultiple) {
  //   } else {
  //     if (evento.data.fechabaja == undefined && this.historico) {
  //       this.selectedDatos.pop();
  //     }
  //   }
  // }
  getCols() {
    this.cols = [
      { field: "claseComunicacion", header: "informesycomunicaciones.comunicaciones.busqueda.claseComunicacion" },
      { field: "destinatario", header: "informesycomunicaciones.comunicaciones.busqueda.destinatario" },
      { field: "fechaCreacion", header: "informesycomunicaciones.enviosMasivos.fechaCreacion" },
      { field: "fechaProgramacion", header: "informesycomunicaciones.comunicaciones.busqueda.fechaProgramada" },
      { field: "tipoEnvio", header: "informesycomunicaciones.comunicaciones.busqueda.tipoEnvio" },
      { field: "estado", header: "censo.nuevaSolicitud.estado" }
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
  onChangeSelectAll(){}
  onChangeRowsPerPages(event){
    // this.selectedItem = event.value;
    // this.changeDetectorRef.detectChanges();
    // this.table.reset();
  }
  actualizaSeleccionados(){}

  navigateTo(dato) {
    this.estado = dato[0].idEstado;
    if (this.estado != 5) {
      // this.body.estado = dato[0].estado;
      this.router.navigate(["/fichaRegistroComunicacion"]);
      sessionStorage.setItem("comunicacionesSearch", JSON.stringify(dato[0]));
      sessionStorage.setItem("filtrosCom", JSON.stringify(this.bodySearch));
    } else if (this.estado == 5) {
      //this.showInfo("La comunicación está en proceso, no puede editarse");
      this.showMessage("error",this.translateService.instant("general.message.incorrect"),this.translateService.instant("informesycomunicaciones.comunicaciones.envioProcess"));
      this.selectedDatos = [];
    }
 
  }

  searchComunicaciones() {
    this.progressSpinner = true;
    let data = [];

    data.push(this.body.annio);
    data.push(this.body.numero);
    data.push(this.body.tipoEJG);

    this.sigaServices.post("gestionejg_getComunicaciones", data).subscribe(
      n => {
        this.comunicaciones = JSON.parse(n.body).comunicacionesItem;

        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;
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
