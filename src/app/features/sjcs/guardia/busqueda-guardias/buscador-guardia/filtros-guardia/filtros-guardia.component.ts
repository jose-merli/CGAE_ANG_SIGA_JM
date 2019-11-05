import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';

@Component({
  selector: 'app-filtros-guardia',
  templateUrl: './filtros-guardia.component.html',
  styleUrls: ['./filtros-guardia.component.scss']
})
export class FiltrosGuardiaComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros = new GuardiaItem();
  filtroAux = new GuardiaItem();
  historico: boolean = false;

  isDisabledZona: boolean = true;
  isDisabledMateria: boolean = true;
  resultadosZonas: any;
  resultadosAreas: any;
  @Input() permisoEscritura;
  @Output() isOpen = new EventEmitter<boolean>();


  comboGrupoZona = [];
  comboZona = [];
  comboJurisdicciones = [];
  comboPartidasPresupuestarias = [];
  comboGrupoFacturacion = [];
  comboArea = [];
  comboMateria = [];
  comboTipoTurno = [];
  comboTurno = [];
  comboTipoGuardia = [];
  KEY_CODE = {
    ENTER: 13
  }
  constructor(private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getComboGrupoFacturacion();
    this.getComboJurisdiccion();
    this.getComboPartidaPresupuestaria();
    this.getComboTurno();
    this.getComboArea();
    this.getComboTipoGuardia();
    this.getComboTipoTurno();
    this.getComboArea();
    this.getComboGrupoZona();

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new GuardiaItem();
    }
  }


  getComboGrupoZona() {
    this.sigaServices.get("busquedaGuardia_grupoZona").subscribe(
      n => {
        this.comboGrupoZona = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboGrupoZona);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboJurisdiccion() {
    this.sigaServices.get("busquedaGuardia_jurisdicciones").subscribe(
      n => {
        this.comboJurisdicciones = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboJurisdicciones);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGrupoFacturacion() {
    this.sigaServices.get("busquedaGuardia_gruposFacturacion").subscribe(
      n => {
        this.comboGrupoFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboGrupoFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPartidaPresupuestaria() {
    this.sigaServices.get("busquedaGuardia_partidaspresupuestarias").subscribe(
      n => {
        this.comboPartidasPresupuestarias = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboPartidasPresupuestarias);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTurno() {
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboArea() {
    this.sigaServices.get("busquedaGuardia_area").subscribe(
      n => {
        this.comboArea = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboArea);

      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoGuardia() {
    this.sigaServices.get("busquedaGuardia_tiposGuardia").subscribe(
      n => {
        this.comboTipoGuardia = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoGuardia);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoTurno() {
    this.sigaServices.get("busquedaGuardia_tipoTurno").subscribe(
      n => {
        this.comboTipoTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoTurno);
      },
      err => {
        console.log(err);
      }
    );
  }


  onChangeZona() {

    this.filtros.zona = "";
    this.comboZona = [];

    if (this.filtros.grupoZona != undefined && this.filtros.grupoZona != "") {
      this.isDisabledZona = false;
      this.getSubZona();
    } else {
      this.isDisabledZona = true;
    }

  }
  getSubZona() {

    this.sigaServices.getParam(
      "fichaZonas_searchSubzones",
      "?idZona=" + this.filtros.grupoZona + "&idSubZona=" + this.filtros.zona
    ).subscribe(
      data => {
        data.zonasItems.forEach(it => {
          this.comboZona.push({
            label: it.descripcionsubzona,
            value: it.idsubzona,
            partido: it.nombrePartidosJudiciales
          })
        })
        this.commonServices.arregloTildesCombo(this.comboZona);

      },
      err => {
        console.log(err);

      }
    )

  }
  onChangeSubZona() {
    this.filtros.partidoJudicial = this.comboZona.find(it => it.value == this.filtros.zona).partido;
  }


  buscarZona(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboZona(e.target.value);
        this.resultadosZonas = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboZona = [];
        this.resultadosZonas = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
      }
    } else {
      this.comboZona = [];
      this.resultadosZonas = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  getComboZona(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaGuardia_zonas",
        "?zona=" + this.filtros.grupoZona
      )
      .subscribe(
        n => {
          this.isDisabledZona = false;
          this.comboZona = n.combooItems;
          this.comboZona.map(e => {
            let accents =
              "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
            let accentsOut =
              "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
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
        error => { },
        () => { }
      );
  }

  onChangeArea() {

    this.filtros.materia = "";
    this.comboMateria = [];
    if (this.filtros.area != undefined && this.filtros.area != "") {
      this.isDisabledMateria = false;
      this.getComboMateria("");

    } else {
      this.isDisabledMateria = true;
    }

  }

  buscarMateria(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboMateria(e.target.value);
        this.resultadosAreas = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboMateria = [];
        this.resultadosAreas = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
      }
    } else {
      this.comboMateria = [];
      this.resultadosAreas = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  getComboMateria(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaGuardia_materia",
        "?area=" + this.filtros.area + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledMateria = false;
          this.comboMateria = n.combooItems;
          this.comboMateria.map(e => {
            let accents =
              "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
            let accentsOut =
              "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
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
        error => { },
        () => { }
      );
  }


  search() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.isOpen.emit(false)
    }

  }



  nuevo() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionGuardias"]);
  }

  checkFilters() {

    if ((this.filtros.area == null || this.filtros.area == undefined) &&
      (this.filtros.jurisdiccion == null || this.filtros.jurisdiccion == undefined) &&
      (this.filtros.grupoFacturacion == null || this.filtros.grupoFacturacion == undefined) &&
      (this.filtros.grupoZona == null || this.filtros.grupoZona == undefined) &&
      (this.filtros.zona == null || this.filtros.zona == undefined) &&
      (this.filtros.materia == null || this.filtros.materia == undefined) &&
      (this.filtros.partidaPresupuestaria == null || this.filtros.partidaPresupuestaria == undefined) &&
      (this.filtros.tipoTurno == null || this.filtros.tipoTurno == undefined) &&
      (this.filtros.idTurno == null || this.filtros.idTurno == undefined) &&
      (this.filtros.tipoGuardia == null || this.filtros.tipoGuardia == undefined) &&
      (this.filtros.nombre == null || this.filtros.nombre == undefined || this.filtros.nombre.trim() == "" || this.filtros.nombre.trim().length < 3)) {

      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

      return true;
    }
  }

  clearFilters() {
    this.filtros = new GuardiaItem();
    this.persistenceService.clearFiltros();
    this.isDisabledZona = true;
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

  rest() {
    this.filtros = new GuardiaItem();
  }




  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === this.KEY_CODE.ENTER) {
      this.search();
    }
  }

}
