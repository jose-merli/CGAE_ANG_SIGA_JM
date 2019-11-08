import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener, SimpleChanges } from '@angular/core';
import { ProcuradoresItem } from '../../../models/sjcs/ProcuradoresItem';
import { Router } from '../../../../../node_modules/@angular/router';
import { TranslateService } from '../../translate';
import { SigaServices } from '../../../_services/siga.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { CommonsService } from '../../../_services/commons.service';


export enum KEY_CODE {
  ENTER = 13
}
@Component({
  selector: 'app-filtro-buscador-procurador',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroBuscadorProcuradorComponent implements OnInit {
  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: ProcuradoresItem = new ProcuradoresItem();
  filtroAux //: PrisionItem = new PrisionItem();
  historico: boolean = false;
  textFilter = "Elegir colegio";
  textSelected: String = "{0} perfiles seleccionados";


  @Input() institucionActual;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;
  institucionGeneral: boolean = false;
  @Input() permisoEscritura;
  @ViewChild("prueba") prueba;

  @Input() comboColegios = [];

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }


    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    }
  }


  search() {
    if (this.institucionGeneral && this.filtros != null && this.filtros.inst != null)
      this.filtros.idInstitucion = this.filtros.inst.map(it => {
        return it.value;
      }).join();
    this.persistenceService.setFiltros(this.filtros);
    this.persistenceService.setFiltrosAux(this.filtros);
    this.filtroAux = this.persistenceService.getFiltrosAux()
    this.isOpen.emit(false)

  }

  // checkFilters() {
  //   if (
  //     (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.trim().length < 3) &&
  //     (this.filtros.apellido1 == null || this.filtros.apellido1.trim() == "" || this.filtros.apellido1.trim().length < 3) &&
  //     (this.filtros.apellido2 == null || this.filtros.apellido2.trim() == "" || this.filtros.apellido2.trim().length < 3) &&
  //     (this.filtros.nColegiado == null || this.filtros.nColegiado == "")) {
  //     this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  clearFilters() {
    this.filtros.nColegiado = null;
    this.filtros.nombre = null;
    this.filtros.apellido1 = null;
    this.filtros.apellido2 = null;
    if (this.institucionGeneral) {
      this.filtros.inst = null;
      this.filtros.idInstitucion = null;
    }
    this.persistenceService.clearFiltros();
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

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

}
