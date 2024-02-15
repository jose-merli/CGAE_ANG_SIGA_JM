import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-contrarios-pre-designacion',
  templateUrl: './contrarios-pre-designacion.component.html',
  styleUrls: ['./contrarios-pre-designacion.component.scss']
})
export class ContrariosPreDesignacionComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaContrariosPreDesigna;

  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
  historicoContrario: boolean = false;

  msgs: Message[];
  cols;
  selectedItem: number = 10;
  rowsPerPage;
  selectedDatos: any = null;
  selectionMode: string = "single";
  contrarios = [];

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private router: Router) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.searchContrariosEJG();
  }

  onChangeRowsPerPages(){

  }

  abreCierraFicha() {
    this.openTarjetaContrariosPreDesigna = !this.openTarjetaContrariosPreDesigna;
  }
  
  clear() {
    this.msgs = [];
  }

  searchHistorical(){
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.historicoContrario = !this.historicoContrario;
      this.searchContrariosEJG();
    }
  }

  eliminar() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.progressSpinner = true;
      let request = [this.selectedDatos.idPersona, this.selectedDatos.anio, this.selectedDatos.numero, this.selectedDatos.idtipoejg]
      this.sigaServices.post("gestionejg_deleteContrarioEJG", request).subscribe(
        data => {
          this.selectedDatos = [];
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.searchContrariosEJG();
        },
        err => {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.progressSpinner = false;
        }
      );
    }
  }

  newContrario() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("origin", "newContrarioEJG");
      sessionStorage.setItem("contrariosEJG", JSON.stringify(this.contrarios));
      sessionStorage.setItem("itemEJG", JSON.stringify(true));
      sessionStorage.setItem("EJGItem", JSON.stringify(this.datos));
      this.router.navigate(["/justiciables"]);
    }
  }

  editContrario(evento) {
    this.progressSpinner = true;
    let contrario = new JusticiableBusquedaItem();
    contrario.idpersona = evento.idPersona;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", contrario).subscribe(
      n => {
        let justiciable = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

        sessionStorage.setItem("EJGItem", JSON.stringify(this.datos));
        sessionStorage.setItem("itemEJG", JSON.stringify(true));
        sessionStorage.setItem("itemJusticiable", JSON.stringify(justiciable[0]));
        sessionStorage.setItem("origin", "ContrarioEJG");
        sessionStorage.setItem("contrarioEJG", JSON.stringify(evento));
        if (evento.abogado != "" && evento.abogado != null) {
          sessionStorage.setItem("idabogadoFicha", evento.idabogadocontrario);
        }

        if (evento.representante != "" && evento.representante != null) {
          let representante = new JusticiableBusquedaItem();
          representante.idpersona = evento.representante;
          this.sigaServices.post("busquedaJusticiables_searchJusticiables", representante).subscribe(
            justi => {
              this.persistenceService.setBody(JSON.parse(justi.body).justiciableBusquedaItems[0]);
              this.progressSpinner = false;
              this.router.navigate(["/gestionJusticiables"]);
            })
        } else {
          this.progressSpinner = false;
          this.router.navigate(["/gestionJusticiables"]);
        }

      }, err => {
        this.progressSpinner = false;
      }
    )
  }

  actualizaSeleccionados() {
    this.selectedDatos = null;
  }

  private getCols() {

    this.cols = [
      { field: "nif", header: "justiciaGratuita.oficio.designas.contrarios.identificador" },
      { field: "apellidosnombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "direccion", header: "censo.consultaDirecciones.literal.direccion" },
      { field: "rol", header: "administracion.usuarios.literal.rol" }
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  private searchContrariosEJG() {
    this.progressSpinner = true;

    let item = [this.datos.numero.toString(), this.datos.annio, this.datos.tipoEJG, this.historicoContrario];
    this.sigaServices.post("gestionejg_busquedaListaContrariosEJG", item).subscribe(n => {
      let error = JSON.parse(n.body).error;
      if (error != null && error.description != null) {
        this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
      } else {
        this.contrarios = JSON.parse(n.body);
      }
      this.progressSpinner = false;
    }, err => {
        this.progressSpinner = false;
    });
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
