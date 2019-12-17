import { Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
  isDisabledMateria: boolean = true;
  isDisabledSubZona: boolean = true;
  // grupoZona:string;
  // zona:string;
  partidoJudicial: string;
  resultadosPoblaciones: any;
  msgs: any[] = [];
  filtros: TurnosItems = new TurnosItems();
  jurisdicciones: any[] = [];
  areas: any[] = [];
  tiposturno: any[] = [];
  zonas: any[] = [];
  subzonas: any[] = [];
  materias: any[] = [];
  partidas: any[] = [];
  partidasJudiciales: any[] = [];
  grupofacturacion: any[] = [];
  comboPJ;

  @Input() permisos;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    if (this.persistenceService.getHistorico() != undefined) {
      this.busqueda.emit(this.persistenceService.getHistorico());
    }



    this.sigaServices.get("fichaZonas_getPartidosJudiciales").subscribe(
      n => {
        this.comboPJ = n.combooItems;

      },
      err => {
        console.log(err);
      }
    );

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

    this.sigaServices.get("combossjcs_comboAreas").subscribe(
      n => {
        this.areas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("combossjcs_comboTiposTurno").subscribe(
      n => {
        this.tiposturno = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.tiposturno.map(e => {
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

    this.sigaServices.get("combossjcs_comboZonas").subscribe(
      n => {
        this.zonas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.zonas.map(e => {
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

    this.sigaServices.get("combossjcs_comboPartidasPresupuestaria").subscribe(
      n => {
        this.partidas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.partidas.map(e => {
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

    this.sigaServices.get("combossjcs_comboGruposFacturacion").subscribe(
      n => {
        this.grupofacturacion = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.grupofacturacion.map(e => {
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
    this.partidoJudicial = "";
  }



  onChangeArea() {

    this.filtros.idmateria = "";
    this.materias = [];

    if (this.filtros.idarea != undefined && this.filtros.idarea != "") {
      this.isDisabledMateria = false;
      this.getComboMaterias();
    } else {
      this.isDisabledMateria = true;
    }

  }

  onChangeZona() {

    this.filtros.idsubzona = "";
    this.subzonas = [];

    if (this.filtros.idzona != undefined && this.filtros.idzona != "") {
      this.isDisabledSubZona = false;
      this.getComboSubZonas();
      this.partidoJudicial = "";
    } else {
      this.isDisabledSubZona = true;
    }

  }

  // buscarPoblacion(e) {
  //   if (e.target.value && e.target.value !== null && e.target.value !== "") {
  //     if (e.target.value.length >= 3) {
  //       this.getComboMaterias(e.target.value);
  //       this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
  //     } else {
  //       this.materias = [];
  //       this.resultadosPoblaciones = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
  //     }
  //   } else {
  //     this.materias = [];
  //     this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
  //   }
  // }

  getComboMaterias() {
    this.sigaServices
      .getParam(
        "combossjcs_comboMaterias",
        "?idArea=" + this.filtros.idarea)
      .subscribe(
        n => {
          // this.isDisabledPoblacion = false;
          this.materias = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  getComboSubZonas() {
    this.sigaServices
      .getParam(
        "combossjcs_comboSubZonas",
        "?idZona=" + this.filtros.idzona)
      .subscribe(
        n => {
          // this.isDisabledPoblacion = false;
          this.subzonas = n.combooItems;
        },
        error => { },
        () => {

        }
      );
  }

  getPartidosJudiciales() {

    for (let i = 0; i < this.partidasJudiciales.length; i++) {
      this.partidasJudiciales[i].partidosJudiciales = [];
      this.partidasJudiciales[i].jurisdiccion.forEach(partido => {
        this.partidoJudicial = this.partidasJudiciales[i].nombrePartidosJudiciales;

      });
    }
  }

  partidoJudiciales() {
    this.sigaServices
      .getParam(
        "fichaZonas_searchSubzones",
        "?idZona=" + this.filtros.idzona
      )
      .subscribe(
        n => {
          this.partidasJudiciales = n.zonasItems;
        },
        err => {
          console.log(err);

        }, () => {
          this.getPartidosJudiciales();
        }
      );
  }

  newTurno() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/gestionTurnos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  checkFilters() {
    // quita espacios vacios antes de buscar
    if (this.filtros.abreviatura != undefined && this.filtros.abreviatura != null) {
      this.filtros.abreviatura = this.filtros.abreviatura.trim();
    }
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }
    return true;

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
    this.filtros.idarea = undefined;
    this.filtros.idzubzona = undefined
    this.filtros.idmateria = undefined
    this.filtros.idtipoturno = undefined
    this.filtros.idpartidapresupuestaria = undefined
    this.filtros.idzona = undefined
    this.filtros.jurisdiccion = undefined
    this.filtros.grupofacturacion = undefined
    this.partidoJudicial = "";
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
