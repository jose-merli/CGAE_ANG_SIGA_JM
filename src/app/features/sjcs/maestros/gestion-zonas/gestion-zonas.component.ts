import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { procesos_maestros } from "../../../../permisos/procesos_maestros";
import { FiltroGestionZonasComponent } from "./filtro-gestion-zonas/filtro-gestion-zonas.component";
import { TablaGestionZonasComponent } from "./tabla-gestion-zonas/tabla-gestion-zonas.component";

@Component({
  selector: "app-gestion-zonas",
  templateUrl: "./gestion-zonas.component.html",
  styleUrls: ["./gestion-zonas.component.scss"],
})
export class GestionZonasComponent implements OnInit {
  buscar: boolean = false;
  messageShow: string;
  historico: boolean = false;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltroGestionZonasComponent) filtros;
  @ViewChild(TablaGestionZonasComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;
  permisoEscritura: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private router: Router) {}

  ngOnInit() {
    this.commonsService
      .checkAcceso(procesos_maestros.zonasYSubzonas)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      })
      .catch((error) => console.error(error));
  }

  isOpenReceive(event) {
    this.filtros.filtros.historico = event;
    this.searchZonas(event);
  }

  searchZonas(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux();
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("gestionZonas_searchZones", this.filtros.filtroAux).subscribe(
      (n) => {
        this.datos = JSON.parse(n.body).zonasItems;
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        this.resetSelect();
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
      if (this.tabla && this.tabla.table) {
        this.tabla.table.sortOrder = 0;
        this.tabla.table.sortField = "";
        this.tabla.table.reset();
        this.tabla.buscadores = this.tabla.buscadores.map((it) => (it = ""));
      }
    }
  }

  searchZonasSend(event) {
    this.filtros.filtros.historico = event;

    this.searchZonas(event);
  }
}
