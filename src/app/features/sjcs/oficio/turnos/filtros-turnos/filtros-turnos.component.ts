import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';

@Component({
  selector: 'app-filtrosturnos',
  templateUrl: './filtros-turnos.component.html',
  styleUrls: ['./filtros-turnos.component.scss']
})
export class FiltrosTurnos implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  filtroAux: TurnosItems = new TurnosItems();
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  msgs: any[] = [];
  filtros: TurnosItems = new TurnosItems();
  jurisdicciones: any[] = [];
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

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

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/fichaGrupomodulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  checkFilters() {
    if (
      (this.filtros.abreviatura == null || this.filtros.abreviatura.trim() == "" || this.filtros.abreviatura.trim().length < 3) &&
      (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.trim().length < 3)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.abreviatura != undefined && this.filtros.abreviatura != null) {
        this.filtros.abreviatura = this.filtros.abreviatura.trim();
      }

      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

      return true;
    }
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
    this.filtros.nombre = "";
    this.filtros.abreviatura = "";
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
