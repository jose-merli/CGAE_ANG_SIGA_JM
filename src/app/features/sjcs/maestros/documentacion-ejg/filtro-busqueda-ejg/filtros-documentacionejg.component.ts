import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
// import { TablaBusquedadocumentacionejgComponent } from '../tabla-busqueda-documentacionejg/tabla-busqueda-documentacionejg.component';
import { DocumentacionEJGComponent } from '../documentacion-ejg.component';
import { TranslateService } from '../../../../../commons/translate';
import { DocumentacionEjgItem } from '../../../../../models/sjcs/DocumentacionEjgItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-filtros-documentacionejg',
  templateUrl: './filtros-documentacionejg.component.html',
  styleUrls: ['./filtros-documentacionejg.component.scss']
})
export class FiltrosdocumentacionejgComponent implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  historico: boolean = false;
  msgs: any[] = [];
  filtros: DocumentacionEjgItem = new DocumentacionEjgItem();
  filtroAux: DocumentacionEjgItem = new DocumentacionEjgItem();
  jurisdicciones: any[] = [];
  @Input() permisoEscritura;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.busqueda.emit(this.historico)

    } else {
      this.filtros = new DocumentacionEjgItem();
    }
  }

  checkPermisosNewDoc() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.newDoc();
    }
  }

  newDoc() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestiondocumentacionejg"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    // if ((this.filtros.abreviaturaDoc == undefined || this.filtros.abreviaturaDoc == "" || this.filtros.abreviaturaDoc.trim().length < 3)
    //   && (this.filtros.abreviaturaTipoDoc == undefined || this.filtros.abreviaturaTipoDoc == "" || this.filtros.abreviaturaTipoDoc.trim().length < 3)
    //   && (this.filtros.descripcionDoc == undefined || this.filtros.descripcionDoc == "" || this.filtros.descripcionDoc.trim().length < 3)
    //   && (this.filtros.descripcionTipoDoc == undefined || this.filtros.descripcionTipoDoc == "" || this.filtros.descripcionTipoDoc.trim().length < 3)
    // ) {
    //   this.showSearchIncorrect();
    // } else {
    this.buscar = true;
    this.filtros.historico = false;
    if (this.filtros.abreviaturaDoc != undefined && this.filtros.abreviaturaDoc != null) {
      this.filtros.abreviaturaDoc = this.filtros.abreviaturaDoc.trim();
    }
    if (this.filtros.abreviaturaTipoDoc != undefined && this.filtros.abreviaturaTipoDoc != null) {
      this.filtros.abreviaturaTipoDoc = this.filtros.abreviaturaTipoDoc.trim();
    }
    if (this.filtros.descripcionDoc != undefined && this.filtros.descripcionDoc != null) {
      this.filtros.descripcionDoc = this.filtros.descripcionDoc.trim();
    }
    if (this.filtros.descripcionTipoDoc != undefined && this.filtros.descripcionTipoDoc != null) {
      this.filtros.descripcionTipoDoc = this.filtros.descripcionTipoDoc.trim();
    }
    this.persistenceService.setFiltros(this.filtros);
    this.persistenceService.setFiltrosAux(this.filtros);
    this.filtroAux = this.persistenceService.getFiltrosAux();
    this.busqueda.emit(false);
    // }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  clearFilters() {
    this.filtros = new DocumentacionEjgItem();
    this.persistenceService.clearFiltros();
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }

}
