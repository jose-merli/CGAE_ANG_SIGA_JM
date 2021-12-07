import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { RemesasBusquedaItem } from '../../../../models/sjcs/RemesasBusquedaItem';

@Component({
  selector: 'app-filtro-remesas',
  templateUrl: './filtro-remesas.component.html',
  styleUrls: ['./filtro-remesas.component.scss']
})
export class FiltroRemesasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: RemesasBusquedaItem = new RemesasBusquedaItem();
  filtroAux: RemesasBusquedaItem = new RemesasBusquedaItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @ViewChild("prueba") prueba;

  @Input() remesaInformacionEconomica;

  comboEstados = [];

  @Output() filtrosValues = new EventEmitter<RemesasBusquedaItem>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    this.getComboEstados();

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if(localStorage.getItem("filtrosRemesa")){
      this.filtros = JSON.parse(localStorage.getItem("filtrosRemesa"));
      localStorage.removeItem("filtrosRemesa");
      this.filtrosValues.emit(this.filtros);

      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }

    } else {
      this.filtros = new RemesasBusquedaItem();
    }

  }

  getComboEstados() {
    console.log("Dentro del comboEstado");
    this.sigaServices
      .get("filtrosremesas_comboEstadoRemesa")
      .subscribe(
        n => {
          console.log("Dentro de la respuesta");
          this.comboEstados = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  fillFechaGeneracionDesde(event) {
      this.filtros.fechaGeneracionDesde = event;
  }

  fillFechaGeneracionHasta(event) {
      this.filtros.fechaGeneracionHasta = event;
  }

  fillFechaEnvioDesde(event) {
      this.filtros.fechaEnvioDesde = event;
  }

  fillFechaEnvioHasta(event) {
      this.filtros.fechaEnvioHasta = event;
  }

  fillFechaRecepcionDesde(event) {
      this.filtros.fechaRecepcionDesde = event;
  }

  fillFechaRecepcionHasta(event) {
      this.filtros.fechaRecepcionHasta = event;
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
    this.router.navigate(["/fichaRemesasEnvio"]);
    localStorage.setItem('ficha', "nuevo");

    if(this.remesaInformacionEconomica){
      localStorage.setItem('remesaInformacionEconomica', "true");
    }else{
      localStorage.setItem('remesaInformacionEconomica', "false");
    }
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


}
