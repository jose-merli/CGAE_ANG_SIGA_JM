import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TablaGestionZonasComponent } from '../tabla-gestion-zonas/tabla-gestion-zonas.component';
import { GestionZonasComponent } from '../gestion-zonas.component';
import { TranslateService } from '../../../../../commons/translate';
import { ZonasItem } from '../../../../../models/sjcs/ZonasItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-filtro-gestion-zonas',
  templateUrl: './filtro-gestion-zonas.component.html',
  styleUrls: ['./filtro-gestion-zonas.component.scss']
})
export class FiltroGestionZonasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;

  filtros: ZonasItem = new ZonasItem();

  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    this.buscar = true;

    if (this.filtros.descripcionzona != undefined && this.filtros.descripcionzona != null) {
      this.filtros.descripcionzona = this.filtros.descripcionzona.trim();
    }

    if (this.filtros.descripcionsubzona != undefined && this.filtros.descripcionsubzona != null) {
      this.filtros.descripcionsubzona = this.filtros.descripcionsubzona.trim();
    }

    if (this.filtros.descripcionpartido != undefined && this.filtros.descripcionpartido != null) {
      this.filtros.descripcionpartido = this.filtros.descripcionpartido.trim();
    }

    this.isOpen.emit(this.buscar)

  }

  newZoneGroup() {
    this.router.navigate(["/fichaGrupoZonas"]);

  }

  clearFilters() {
    this.filtros = new ZonasItem();
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }



}
