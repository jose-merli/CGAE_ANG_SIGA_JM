import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TablaBusquedaAreasComponent } from '../tabla-busqueda-areas/tabla-busqueda-areas.component';
import { BusquedaAreasComponent } from '../busqueda-areas.component';
import { TranslateService } from '../../../../../commons/translate';
import { AreasItem } from '../../../../../models/sjcs/AreasItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-filtro-busqueda-areas',
  templateUrl: './filtro-busqueda-areas.component.html',
  styleUrls: ['./filtro-busqueda-areas.component.scss']
})
export class FiltroBusquedaAreasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  msgs: any[] = [];
  filtros: AreasItem = new AreasItem();
  jurisdicciones: any[] = [];
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  @Input() permisos;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      this.isBuscar();
    }
    this.sigaServices.get("fichaAreas_getJurisdicciones").subscribe(
      n => {
        this.jurisdicciones = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.jurisdicciones.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }
    );
  }

  newArea() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/fichaGrupoAreas"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    this.persistenceService.setFiltros(this.filtros);
    if ((this.filtros.nombreArea == undefined || this.filtros.nombreArea == "" || this.filtros.nombreArea.trim().length < 3) && (this.filtros.nombreMateria == undefined || this.filtros.nombreMateria == "" || this.filtros.nombreMateria.trim().length < 3) && (this.filtros.jurisdiccion == undefined || this.filtros.jurisdiccion == "")) {
      this.showSearchIncorrect();
    } else {
      this.buscar = true;
      this.filtros.historico = false;
      if (this.filtros.nombreArea != undefined && this.filtros.nombreArea != null) {
        this.filtros.nombreArea = this.filtros.nombreArea.trim();
      }

      if (this.filtros.nombreMateria != undefined && this.filtros.nombreMateria != null) {
        this.filtros.nombreMateria = this.filtros.nombreMateria.trim();
      }

      this.busqueda.emit(false);
    }
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
    this.filtros = new AreasItem();
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
