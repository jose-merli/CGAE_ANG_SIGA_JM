import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/primeng";
import { NotificationService } from "../../../../../_services/notification.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { ZonasObject } from "../../../../../models/sjcs/ZonasObject";

@Component({
  selector: "app-tabla-gestion-zonas",
  templateUrl: "./tabla-gestion-zonas.component.html",
  styleUrls: ["./tabla-gestion-zonas.component.scss"],
})
export class TablaGestionZonasComponent implements OnInit {
  rowsPerPage: any = [];
  cols;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;

  message;
  buscadores = [];
  initDatos;
  filteredDatos;
  nuevo: boolean = false;
  permisoEscritura: boolean = false;
  progressSpinner: boolean = false;
  permisos: boolean = false;

  //Resultados de la busqueda
  @Input() datos;
  //Combo partidos judiciales
  @Input() comboPJ;
  @Output() searchZonasSend = new EventEmitter<boolean>();

  @ViewChild("table") table;

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.getCols();
    this.historico = this.persistenceService.getHistorico();
    this.initDatos = [...this.datos];
    this.filteredDatos = [...this.datos]; 
    if (this.persistenceService.getPermisos()) {
      this.permisos = true;
    } else {
      this.permisos = false;
    }

    }

    normalizeString(str: string | null | undefined): string {
      return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
  
    filterTable(value: string, field: string) {
      const normalizedValue = this.normalizeString(value);
      this.filteredDatos = this.initDatos.filter(d => this.normalizeString(d[field]).includes(normalizedValue));
    }

  openZonegroupTab(evento) {
    if (!this.selectAll && !this.selectMultiple) {
      this.persistenceService.setHistorico(this.historico);
      this.router.navigate(["/fichaGrupoZonas"], { queryParams: { idZona: this.selectedDatos[0].idzona } });
    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }

  confirmDelete(selectedDatos) {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
      } else {
        this.confirmationService.confirm({
          message: this.translateService.instant("messages.deleteConfirmation"),
          icon: "fa fa-edit",
          accept: () => {
            this.delete(selectedDatos);
          },
          reject: () => {
            this.notificationService.showInfo("Cancel", this.translateService.instant("general.message.accion.cancelada"));
          },
        });
      }
    }
  }

  delete(selectedDatos) {
    let zonasDelete = new ZonasObject();
    zonasDelete.zonasItems = this.selectedDatos;
    this.sigaServices.post("fichaZonas_deleteGroupZones", zonasDelete).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.selectedDatos = [];
        this.searchZonasSend.emit(false);
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  activate() {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
      } else {
        this.activate();
      }

    }
  }

  activate() {
    let zonasActivate = new ZonasObject();
    zonasActivate.zonasItems = this.selectedDatos;
    this.sigaServices.post("fichaZonas_activateGroupZones", zonasActivate).subscribe(
      data => {
        this.historico = false;
        this.persistenceService.setHistorico(this.historico);
        this.selectedDatos = [];
        this.searchZonasSend.emit(true);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    }
  }

  searchZonas() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchZonasSend.emit(this.historico);
  }

  setItalic(dato) {
    return dato.fechabaja != null;
  }

  getCols() {
    this.cols = [
      { field: "descripcionzona", header: "justiciaGratuita.maestros.zonasYSubzonas.grupoZona.cabecera" },
      { field: "descripcionsubzona", header: "justiciaGratuita.maestros.zonasYSubzonas.zona" },
      { field: "descripcionpartido", header: "agenda.fichaEvento.tarjetaGenerales.partidoJudicial" },
    ];
    this.cols.forEach((element) => this.buscadores.push(""));
    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 },
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll) {
      if (this.historico) {
        this.selectedDatos = this.datos.filter((dato) => dato.fechabaja != undefined && dato.fechabaja != null);
      } else {
        this.selectedDatos = this.datos;
      }
      if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
        this.selectMultiple = true;
        this.numSelected = this.selectedDatos.length;
      }
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectAll = false;
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }
}
