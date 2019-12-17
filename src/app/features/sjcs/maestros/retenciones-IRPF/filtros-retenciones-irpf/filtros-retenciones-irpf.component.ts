import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { RetencionIrpfItem } from '../../../../../models/sjcs/RetencionIrpfItem';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { KEY_CODE } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';

@Component({
  selector: 'app-filtros-retenciones-irpf',
  templateUrl: './filtros-retenciones-irpf.component.html',
  styleUrls: ['./filtros-retenciones-irpf.component.scss']
})
export class FiltrosRetencionesIrpfComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: RetencionIrpfItem = new RetencionIrpfItem();
  filtroAux: RetencionIrpfItem = new RetencionIrpfItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @ViewChild("prueba") prueba;

  comboSociedades = [];

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    this.getComboTipoSociedad();

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new RetencionIrpfItem();
    }

  }


  getComboTipoSociedad() {
    this.sigaServices
      .get("busquedaRetencionesIRPF_sociedades")
      .subscribe(
        n => {
          this.comboSociedades = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {

    if (this.checkFilters()) {
      if (this.filtros.retencion != null && this.filtros.retencion != undefined && this.filtros.retencion != "")
        this.filtros.retencion = this.filtros.retencion.replace(",", ".")
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.isOpen.emit(false)
    }

  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
      if (charCode == 188) {
      }
      return true;
    }
    else {
      return false;

    }
  }

  checkFilters() {
    // if (
    //   (this.filtros.descripcion == null || this.filtros.descripcion.trim() == "" || this.filtros.descripcion.length < 3) &&
    //   (this.filtros.retencion == null || this.filtros.retencion == "") &&
    //   (this.filtros.tipoSociedad == null || this.filtros.tipoSociedad == "" || this.filtros.tipoSociedad == undefined)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.descripcion != undefined && this.filtros.descripcion != null) {
      this.filtros.descripcion = this.filtros.descripcion.trim();
    }
    return true;
    // }
  }

  clearFilters() {
    this.filtros = new RetencionIrpfItem();
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
