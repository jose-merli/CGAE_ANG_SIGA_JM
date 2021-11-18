import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { RemesasBusquedaItem } from '../../../../../models/sjcs/RemesasBusquedaItem';
import { RemesasResolucionItem } from '../../../../../models/sjcs/RemesasResolucionItem';

@Component({
  selector: 'app-filtro-carga-designa-procurador',
  templateUrl: './filtro-carga-designa-procurador.component.html',
  styleUrls: ['./filtro-carga-designa-procurador.component.scss']
})
export class FiltroCargaDesignaProcuradorComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: RemesasResolucionItem = new RemesasResolucionItem();
  filtroAux: RemesasResolucionItem = new RemesasResolucionItem();
  historico: boolean = false;
  numOperacion ;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  buttonNew : boolean = true;

  @Input() permisoEscritura;

  comboEstados = [];

  @Output() filtrosValues = new EventEmitter<RemesasBusquedaItem>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }

    } else {
      this.filtros = new RemesasBusquedaItem();
    }


  }


  fillFechaResolucionDesde(event) {
      this.filtros.fechaResolucionDesde = event;
  }

  fillFechaResolucionHasta(event) {
      this.filtros.fechaResolucionHasta = event;
  }

  fillFechaCargaDesde(event) {
      this.filtros.fechaCargaDesde = event;
  }

  fillFechaCargaHasta(event) {
      this.filtros.fechaCargaHasta = event;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {
      this.filtrosValues.emit(this.filtros);
  }

  clearFilters() {
    this.filtros = new RemesasBusquedaItem();
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  
  openTab() {
    this.router.navigate(["/cargaDesignaProcuradorFicha"]);
    localStorage.setItem('fichaCargaDesignaProcurador', "nuevo");
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }



  obtenerDesignaProcurador(){}
  

obtenerOperacionTipoAccion(){

  this.sigaServices
  .get("remesasResoluciones_obtenerOperacionTipoAccion")
  .subscribe(
    data => {
      console.log(data);
      if(data.error.description == "Empty" && data.error.code == 404) {
        this.buttonNew = true;
      }else if(data.ecomOperacionTipoaccion[0].idoperacion != null &&  data.error.code == 200) {
        this.buttonNew = false;
        //this.numOperacion = data.ecomOperacionTipoaccion[0].idoperacion;
      }
    },
    error => { },
    () => { }
  );

}

}
