import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, SimpleChanges, ViewChild, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JusticiableBusquedaItem } from '../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../models/sjcs/JusticiableItem';
import { PersistenceService } from '../../../../_services/persistence.service';
// import { TablaMateriasComponent } from "./gestion-materias/tabla-materias.component";
import { TranslateService } from './../../../../commons/translate';
import { SigaServices } from './../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { DatosRepresentanteComponent } from './datos-representante/datos-representante.component';

@Component({
  selector: 'app-gestion-justiciables',
  templateUrl: './gestion-justiciables.component.html',
  styleUrls: ['./gestion-justiciables.component.scss']
})
export class GestionJusticiablesComponent implements OnInit, OnChanges {

  fichasPosibles;
  modoEdicion: boolean;
  idProcedimiento;
  messageShow: string;
  acreditacionesItem;
  modulosItem;
  body: JusticiableItem;
  justiciableBusquedaItem: JusticiableBusquedaItem;
  representanteBusquedaItem: JusticiableBusquedaItem;
  progressSpinner: boolean = false;
  msgs = [];

  @ViewChild("topScroll") outlet;
  @ViewChild(DatosRepresentanteComponent) datosRepresentante;

  fromJusticiable;
  modoRepresentante: boolean = false;
  checkedViewRepresentante: boolean = false;

  bodySend;
  idRepresentantejg;

  constructor(private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commnosService: CommonsService) { }

  ngOnInit() {

    this.progressSpinner = true;

    this.activatedRoute.queryParams.subscribe(params => {

      if (params.rp == "1") {
        this.modoRepresentante = true;
        this.body = new JusticiableItem();
        this.nuevo();
      }


    });

    this.commnosService.scrollTop();
    if (this.persistenceService.getFichasPosibles() != null && this.persistenceService.getFichasPosibles() != undefined) {
      this.fichasPosibles = this.persistenceService.getFichasPosibles();
      this.fromJusticiable = this.fichasPosibles[0].activa;
    }

    if (this.persistenceService.getDatos() != null && !this.modoRepresentante) {
      this.justiciableBusquedaItem = this.persistenceService.getDatos();

      this.search();
      this.modoEdicion = true;

    } else {
      this.modoEdicion = false;
      this.progressSpinner = false;
    }

    this.sigaServices.guardarDatosGeneralesJusticiable$.subscribe((data) => {

      this.progressSpinner = true;
      this.commnosService.scrollTop();
      this.persistenceService.setBody(data);
      this.justiciableBusquedaItem = this.persistenceService.getDatos();
      this.checkedViewRepresentante = false;
      this.modoRepresentante = false;
      this.modoEdicion = true;
      this.progressSpinner = false;
      this.search();

    });

  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  search() {
    this.progressSpinner = true;

    if (!this.checkedViewRepresentante) {
      let justiciableBusqueda = this.justiciableBusquedaItem;
      this.callServiceSearch(justiciableBusqueda);
    } else {
      let representanteBusqueda = this.representanteBusquedaItem;
      this.callServiceSearch(representanteBusqueda);
      this.modoRepresentante = true;
    }

  }

  callServiceSearch(justiciableBusqueda) {

    this.sigaServices.post("gestionJusticiables_searchJusticiable", justiciableBusqueda).subscribe(
      n => {

        this.body = JSON.parse(n.body).justiciable;

        if (!this.modoRepresentante) {
          this.body.numeroAsuntos = this.justiciableBusquedaItem.numeroAsuntos;
          this.body.ultimoAsunto = this.justiciableBusquedaItem.ultimoAsunto;
        } else {
          this.body.numeroAsuntos = undefined;
          this.body.ultimoAsunto = undefined;
          this.getAsuntos();
        }


        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  getAsuntos() {

    let busquedaJusticiable = new JusticiableBusquedaItem();
    busquedaJusticiable.idpersona = this.body.idpersona;

    this.sigaServices.post("busquedaJusticiables_searchJusticiables", busquedaJusticiable).subscribe(
      n => {

        let justiciableBusquedaItem = JSON.parse(n.body).justiciableBusquedaItems;

        if (justiciableBusquedaItem != undefined && justiciableBusquedaItem != null) {
          this.body.numeroAsuntos = justiciableBusquedaItem[0].numeroAsuntos;
          this.body.ultimoAsunto = justiciableBusquedaItem[0].ultimoAsunto;
        }


        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  newRepresentante(event) {
    this.commnosService.scrollTop();
    this.body = new JusticiableItem();
    this.body.nif = event.nif;
    this.nuevo();


  }

  nuevo() {
    this.modoEdicion = false;
    this.modoRepresentante = true;
  }

  viewRepresentante(event) {
    this.commnosService.scrollTop();
    this.checkedViewRepresentante = true;
    this.representanteBusquedaItem = new JusticiableBusquedaItem();
    this.representanteBusquedaItem.idpersona = event.idpersona;
    this.representanteBusquedaItem.idInstitucion = event.idinstitucion;
    this.representanteBusquedaItem.nif = event.nif;
    this.search();

  }

  searchJusticiableByNif(bodyBusqueda) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionJusticiables_getJusticiableByNif", bodyBusqueda).subscribe(
      n => {

        let justiciable = JSON.parse(n.body).justiciable

        this.progressSpinner = false;

        if (justiciable != undefined && (justiciable.idpersona == null || justiciable.idpersona == undefined)) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), "No existe registrado ese NIF en el sistema");
        } else {

          if (justiciable != undefined && this.body != undefined && justiciable.idpersona != this.body.idpersona) {
            this.body = JSON.parse(n.body).justiciable;
            this.body.numeroAsuntos = undefined;
            this.body.ultimoAsunto = undefined;
            this.getAsuntos();

          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), "Es la misma persona");
          }
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
  }

  backTo() {
    this.persistenceService.clearFiltrosAux();
    if (this.checkedViewRepresentante) {
      this.checkedViewRepresentante = false;
      this.search();
    } else {
      this.router.navigate(["/justiciables"]);
    }

  }
}
