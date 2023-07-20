import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TablaBusquedaAreasComponent } from '../tabla-busqueda-areas/tabla-busqueda-areas.component';
import { BusquedaAreasComponent } from '../busqueda-areas.component';
import { TranslateService } from '../../../../../commons/translate';
import { AreasItem } from '../../../../../models/sjcs/AreasItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';

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
  filtroAux: AreasItem = new AreasItem();
  jurisdicciones: any[] = [];

  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  @Input() permisos;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }


    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.busqueda.emit(this.persistenceService.getHistorico());
      }
      else {
        this.isBuscar();
      }
    } else {
      this.filtros = new AreasItem();
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
        //console.log(err);
      }
    );
  }

  checkPermisosNewArea() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.newArea();
    }
  }

  newArea() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/fichaGrupoAreas"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  checkFilters() {
    // if (
    //   (this.filtros.nombreArea == null || this.filtros.nombreArea.trim() == "" || this.filtros.nombreArea.trim().length < 3) &&
    //   (this.filtros.nombreMateria == null || this.filtros.nombreMateria.trim() == "" || this.filtros.nombreMateria.trim().length < 3) &&
    //   (this.filtros.jurisdiccion == null || this.filtros.jurisdiccion == "")) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombreArea != undefined && this.filtros.nombreArea != null) {
      this.filtros.nombreArea = this.filtros.nombreArea.trim();
    }

    if (this.filtros.nombreMateria != undefined && this.filtros.nombreMateria != null) {
      this.filtros.nombreMateria = this.filtros.nombreMateria.trim();
    }

    return true;
    // }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  isBuscar() {
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.busqueda.emit(false)
      this.persistenceService.clearFiltros();
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
