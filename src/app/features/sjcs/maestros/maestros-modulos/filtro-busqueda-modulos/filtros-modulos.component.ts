import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { ModulosItem } from "../../../../../models/sjcs/ModulosItem";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";

const enum KEY_CODE {
  ENTER = 13,
}

@Component({
  selector: "app-filtros-modulos",
  templateUrl: "./filtros-modulos.component.html",
  styleUrls: ["./filtros-modulos.component.scss"],
})
export class FiltrosModulosComponent implements OnInit {
  showDatosGenerales: boolean = true;
  filtros: ModulosItem = new ModulosItem();
  jurisdicciones: any[] = [];
  vieneDeFichaJuzgado: boolean = false;

  progressSpinner: boolean = false;

  comboJurisdicciones: any[] = [];
  comboProcedimientos: any[] = [];
  comboJuzgados: any[] = [];
  comboComplemento: any[] = [
    {label: this.translateService.instant("messages.si"), value: "1"},
    {label: this.translateService.instant("general.boton.no"), value: "0"}
  ];

  jurisdiccionesSeleccionadas: any[] = [];
  procedimientosSeleccionados: any[] = [];
  juzgadosSeleccionados: any[] = [];

  textSelected: string = "{label}";

  @Input() permisos: boolean = false;
  @Output() searchModulos = new EventEmitter<any>();

  constructor(private router: Router, private persistenceService: PersistenceService, private commonsService: CommonsService, private sigaServices: SigaServices,private translateService: TranslateService) {}

  async ngOnInit() {
    if (sessionStorage.getItem("vieneDeFichaJuzgado")) {
      this.vieneDeFichaJuzgado = true;
    }

    this.progressSpinner = true;
    await this.getCombos();
    this.progressSpinner = false;

    if (this.persistenceService.getFiltros() != undefined) {
      let filtrosAux: ModulosItem = this.persistenceService.getFiltros();
      
      if (filtrosAux.fechadesdevigor != null) {
        filtrosAux.fechadesdevigor = new Date(filtrosAux.fechadesdevigor.toString());
      }

      if (filtrosAux.fechahastavigor != null) {
        filtrosAux.fechahastavigor = new Date(filtrosAux.fechahastavigor.toString());
      }

      if (filtrosAux.idjurisdiccion != null && filtrosAux.idjurisdiccion != "") {
        this.jurisdiccionesSeleccionadas = filtrosAux.idjurisdiccion.split(",");
      }

      if (filtrosAux.idProcedimiento != null && filtrosAux.idProcedimiento != "") {
        this.procedimientosSeleccionados = filtrosAux.idProcedimiento.split(",");
      }

      if (filtrosAux.juzgados != null && filtrosAux.juzgados != "") {
        this.juzgadosSeleccionados = filtrosAux.juzgados.split(",");
      }
      
      this.filtros = filtrosAux;
      this.buscar();
    } else {
      this.filtros.fechadesdevigor = new Date();
    }
  }

  checkPermisosNewModulo() {
    if (this.commonsService.checkPermisosService(this.permisos)) {
      this.newModulo();
    }
  }

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/gestionModulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  checkFilters() {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.codigo != undefined && this.filtros.codigo != null) {
      this.filtros.codigo = this.filtros.codigo.trim();
    }
  }

  buscar() {
    this.filtros.idjurisdiccion = this.jurisdiccionesSeleccionadas.toString();
    this.filtros.idProcedimiento = this.procedimientosSeleccionados.toString();
    this.filtros.juzgados = this.juzgadosSeleccionados.toString();

    this.checkFilters();
    this.searchModulos.emit(null);
  }

  clearFilters() {
    this.jurisdiccionesSeleccionadas = [];
    this.procedimientosSeleccionados = [];
    this.juzgadosSeleccionados = [];

    this.filtros = new ModulosItem();
    this.persistenceService.clearFiltros();
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }

  fillFechaDesdeVigor(fecha) {
    this.filtros.fechadesdevigor = fecha;
  }

  fillFechaHastaVigor(fecha) {
    this.filtros.fechahastavigor = fecha;
  }

  async getCombos() {
    await this.getComboJurisdicciones();
    await this.getComboProdecimientos();
    return await this.getComboJuzgados();
  }

  async getComboJurisdicciones() {
    return this.sigaServices.get("fichaAreas_getJurisdicciones").toPromise().then((n) => {
      this.comboJurisdicciones = n.combooItems;

      /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
      this.comboJurisdicciones.map((e) => {
        let accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
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
    });
  }

  async getComboProdecimientos() {
    return this.sigaServices.getParam("modulosybasesdecompensacion_procedimientos", "?idProcedimiento=").toPromise().then(
      (n) => {
        this.comboProcedimientos = n.combooItems;
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
        para poder filtrar el dato con o sin estos caracteres*/
        this.comboProcedimientos.map((e) => {
          let accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
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
      });
    }

    async getComboJuzgados() {
      return this.sigaServices.post("busquedaJuzgados_searchCourt", this.filtros).toPromise().then(
        (n) => {
          JSON.parse(n.body).juzgadoItems.forEach((juzgados) => {
            this.comboJuzgados.push({ label: juzgados.nombre + " (" + juzgados.codigoExt2 + ")", value: juzgados.idJuzgado });
          });
        }
      );
    }
}
