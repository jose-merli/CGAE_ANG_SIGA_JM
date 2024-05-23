import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../../_services/siga.service";
import { TranslateService } from "../../../../../../commons/translate";
import { JusticiableBusquedaItem } from "../../../../../../models/sjcs/JusticiableBusquedaItem";

@Component({
  selector: "app-detalle-tarjeta-contrarios-ficha-designacion-oficio",
  templateUrl: "./detalle-tarjeta-contrarios-ficha-designacion-oficio.component.html",
  styleUrls: ["./detalle-tarjeta-contrarios-ficha-designacion-oficio.component.scss"],
})
export class DetalleTarjetaContrariosFichaDesignacionOficioComponent implements OnInit {
  msgs;

  @Output() searchContrarios = new EventEmitter<boolean>();

  @Input() contrarios;
  historicoContrario: boolean;

  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  @Input() tengoPermiso: boolean;

  selectedDatos: any = [];

  selectAll: boolean = false;
  progressSpinner: boolean = false;

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService, private router: Router, private commonService: CommonsService) {}

  ngOnInit() {
    this.getCols();
    this.datos = this.contrarios;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos = this.contrarios;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  getCols() {
    this.cols = [
      { field: "nif", header: "justiciaGratuita.oficio.designas.contrarios.identificador" },
      { field: "apellidosnombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "abogado", header: "justiciaGratuita.oficio.designas.contrarios.abogado" },
      { field: "procurador", header: "justiciaGratuita.oficio.designas.contrarios.procurador" },
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10,
      },
      {
        label: 20,
        value: 20,
      },
      {
        label: 30,
        value: 30,
      },
      {
        label: 40,
        value: 40,
      },
    ];
  }

  Eliminar() {
    this.progressSpinner = true;
    let request = [this.selectedDatos.idInstitucion, this.selectedDatos.idPersona, this.selectedDatos.anio, this.selectedDatos.idTurno, this.selectedDatos.numero];
    this.sigaServices.post("designaciones_deleteContrario", request).subscribe(
      (data) => {
        this.selectedDatos = [];
        this.searchContrarios.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.historicoContrario = false;
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.selectMultiple = false;
        this.selectAll = false;
      },
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  NewContrario() {
    sessionStorage.setItem("origin", "newContrario");
    sessionStorage.setItem("contrarios", JSON.stringify(this.contrarios));
    sessionStorage.setItem("itemDesignas", JSON.stringify(true));
    //this.searchContrarios.emit(true);
    this.router.navigate(["/justiciables"]);
  }

  openTab(evento) {
    let contrario = new JusticiableBusquedaItem();
    contrario.idpersona = evento.idPersona;
    sessionStorage.setItem("personaDesigna", evento.idPersona);

    //Asignamos los objetos itemDesignas y contrarios para la edicion
    if (sessionStorage.getItem("itemDesignas") == null || sessionStorage.getItem("itemDesignas") == undefined) {
      sessionStorage.setItem("itemDesignas", JSON.stringify(true));
    }

    if (sessionStorage.getItem("contrarios") == null || sessionStorage.getItem("contrarios") == undefined) {
      sessionStorage.setItem("contrarios", JSON.stringify(JSON.stringify(this.contrarios)));
    }

    this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", contrario).subscribe(
      (n) => {
        let justiciable = JSON.parse(n.body).justiciableBusquedaItems[0];
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }
        this.persistenceService.clearBody();
        this.persistenceService.setDatos(justiciable);
        sessionStorage.setItem("origin", "Contrario");
        //if (evento.abogado != "" && evento.abogado != null) {
        //sessionStorage.setItem("idabogadoFicha", evento.idabogadocontrario);
        //}
        this.router.navigate(["/gestionJusticiables"]);
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  searchHistorical() {
    this.historicoContrario = !this.historicoContrario;
    this.searchContrarios.emit(this.historicoContrario);
    this.selectAll = false;
    this.selectedDatos = [];
  }

  isEliminado(dato) {
    return dato.fechaBaja != null;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      /* if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else { */
      this.selectedDatos = this.datos;
      /* this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple"; */
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      /*  if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple"; */
    }
  }
}
