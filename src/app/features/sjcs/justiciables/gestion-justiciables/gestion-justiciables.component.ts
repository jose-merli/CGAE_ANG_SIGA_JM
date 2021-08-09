import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, SimpleChanges, ViewChild, OnChanges, Input, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JusticiableBusquedaItem } from '../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../models/sjcs/JusticiableItem';
import { PersistenceService } from '../../../../_services/persistence.service';
// import { TablaMateriasComponent } from "./gestion-materias/tabla-materias.component";
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { DatosRepresentanteComponent } from './datos-representante/datos-representante.component';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { procesos_justiciables } from "../../../../permisos/procesos_justiciables";

@Component({
  selector: 'app-gestion-justiciables',
  templateUrl: './gestion-justiciables.component.html',
  styleUrls: ['./gestion-justiciables.component.scss']
})
export class GestionJusticiablesComponent implements OnInit {

  fichasPosibles;
  modoEdicion: boolean;
  body: JusticiableItem;
  justiciableBusquedaItem: JusticiableBusquedaItem;
  representanteBusquedaItem: JusticiableBusquedaItem;
  progressSpinner: boolean = false;
  msgs = [];
  navigateToJusticiable: boolean = false;

  @ViewChild("topScroll") outlet;
  @ViewChild(DatosRepresentanteComponent) datosRepresentante;

  fromJusticiable;
  modoRepresentante: boolean = false;
  checkedViewRepresentante: boolean = false;
  nuevoRepresentante: boolean = false;
  justiciableOverwritten: boolean = false;
  justiciableCreateByUpdate: boolean = false;
  permisoEscritura;
  fromInteresado : boolean = false;
  fromContrario : boolean = false;
  fromAsistencia : boolean = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commnosService: CommonsService,
    private authenticationService: AuthenticationService, 
    private location: Location) { }

  ngOnInit() {

    this.progressSpinner = true;

    this.commnosService.checkAcceso(procesos_justiciables.gestionJusticiables)
      .then(respuesta => {
        this.permisoEscritura = respuesta;

        if(sessionStorage.getItem("origin")=="Interesado"){
          sessionStorage.removeItem('origin');
          this.fromInteresado=true;
        }
        if(sessionStorage.getItem("origin")=="Contrario"){
          sessionStorage.removeItem('origin');
          this.fromContrario=true;
        }
        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.progressSpinner = false;
          this.router.navigate(["/errorAcceso"]);
        } else {
          //El padre de todas las tarjetas se encarga de enviar a sus hijos el objeto nuevo del justiciable que se quiere mostrar

          //Para indicar que estamos en modo de creacion de representante
          this.activatedRoute.queryParams.subscribe(params => {

            if (params.rp == "1") {
              this.modoRepresentante = true;
              this.body = new JusticiableItem();
              this.nuevo();
            }


          });

          this.commnosService.scrollTop();
          //Carga configuracion de las tarjetas
          if (this.persistenceService.getFichasPosibles() != null && this.persistenceService.getFichasPosibles() != undefined) {
            this.fichasPosibles = this.persistenceService.getFichasPosibles();
            this.fromJusticiable = this.fichasPosibles[0].activa;
        

          }

          //Carga de la persistencia 
          if (this.persistenceService.getDatos() != null && !this.modoRepresentante) {
            this.justiciableBusquedaItem = this.persistenceService.getDatos();

            this.search();
            this.modoEdicion = true;

          } else {
            this.modoEdicion = false;
            this.progressSpinner = false;
          }

          //Indicar que se han guardado los datos generales de un Representante y hay que mostrar de nuevo al justiciable que tiene asociado el representante creado
          this.sigaServices.guardarDatosGeneralesRepresentante$.subscribe((data) => {

            this.progressSpinner = true;
            this.commnosService.scrollTop();
            this.persistenceService.setBody(data);
            this.modoRepresentante = false;
            this.modoEdicion = true;
            this.progressSpinner = false;

            if (!this.navigateToJusticiable) {
              this.checkedViewRepresentante = false;
              this.justiciableBusquedaItem = this.persistenceService.getDatos();
              this.search();
            }

          });

          this.progressSpinner = false;

        }
      }
      ).catch(error => console.error(error));
  }

  newJusticiable(event) {
    if (!this.modoRepresentante) {
      this.justiciableBusquedaItem = new JusticiableBusquedaItem();
      this.justiciableBusquedaItem.idpersona = event.idpersona;
      this.justiciableBusquedaItem.idinstitucion = this.authenticationService.getInstitucionSession();
      this.persistenceService.setDatos(this.justiciableBusquedaItem);
      this.body = event;
      this.modoEdicion = true;
    }
  }

  //BUSQUEDA JUSTICIABLE 
  search() {
    this.progressSpinner = true;

    //VISTA JUSTICIABLE
    if (!this.checkedViewRepresentante) {
      let justiciableBusqueda = this.justiciableBusquedaItem;
      this.callServiceSearch(justiciableBusqueda);
      //VISTA REPRESENTANTE
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

        if (!this.modoRepresentante && !this.justiciableOverwritten && !this.justiciableCreateByUpdate) {
          this.body.numeroAsuntos = this.justiciableBusquedaItem.numeroAsuntos;
          this.body.ultimoAsunto = this.justiciableBusquedaItem.ultimoAsunto;
        } else if (this.justiciableOverwritten) {
          this.justiciableOverwritten = false;
          this.modoEdicion = true;
          this.getAsuntos();
        } if (this.justiciableCreateByUpdate) {
          this.justiciableCreateByUpdate = false;
          this.modoEdicion = true;
          //Al crearse uno nuevo desde justiciables no se le asocia ningun asunto por eso se resetean los valores
          this.body.numeroAsuntos = "0";
          this.body.ultimoAsunto = undefined;
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

        if (justiciableBusquedaItem != undefined && justiciableBusquedaItem != null && justiciableBusquedaItem.length > 0) {
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
    this.nuevoRepresentante = true;
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
    this.representanteBusquedaItem.idinstitucion = event.idinstitucion;
    this.representanteBusquedaItem.nif = event.nif;
    this.navigateToJusticiable = true;
    this.search();

  }

  //BUSQUEDA POR NIF DESDE LA TARJETA DATOS GENERALES
  searchJusticiableByNif(bodyBusqueda) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionJusticiables_getJusticiableByNif", bodyBusqueda).subscribe(
      n => {

        let justiciable = JSON.parse(n.body).justiciable

        this.progressSpinner = false;

        if (justiciable != undefined && (justiciable.idpersona == null || justiciable.idpersona == undefined)) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.noExisteNifSistema"));
        } else {

          if (justiciable != undefined && this.body != undefined && justiciable.idpersona != this.body.idpersona) {
            this.body = JSON.parse(n.body).justiciable;
            this.body.numeroAsuntos = undefined;
            this.body.ultimoAsunto = undefined;
            this.getAsuntos();

          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("gratuita.personaJG.literal.esMismaPersona"));
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

  backTo() {
    this.persistenceService.clearFiltrosAux();
    //Si estamos en vista representante o en la creacion de nuevo representante, al volver buscamos el justiciable asociado a ese representante
    if (this.navigateToJusticiable || this.checkedViewRepresentante || this.nuevoRepresentante) {
      this.checkedViewRepresentante = false;
      this.nuevoRepresentante = false;
      this.modoEdicion = true;
      this.commnosService.scrollTop();
      this.navigateToJusticiable = false;
      this.search();
    } else if(this.fromContrario || this.fromInteresado) {
      this.router.navigate(['/fichaDesignaciones']);
    }  else if(this.fromAsistencia){
      this.router.navigate(['/fichaAsistencia']);
    }
    else {
      //this.router.navigate(["/justiciables"]);
      this.location.back();
    }

  }

  searchJusticiableOverwritten(justiciable) {
    this.justiciableOverwritten = true;
    let justiciableBusqueda = new JusticiableBusquedaItem();
    justiciableBusqueda.idpersona = justiciable.idpersona;
    justiciableBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
    this.callServiceSearch(justiciableBusqueda);
  }

  createJusticiableByUpdateSolicitud(justiciable) {
    this.justiciableCreateByUpdate = true;
    let justiciableBusqueda = new JusticiableBusquedaItem();
    justiciableBusqueda.idpersona = justiciable.idpersona;
    justiciableBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
    this.callServiceSearch(justiciableBusqueda);
  }

  createJusticiableByUpdateRepresentante(justiciable) {
    this.justiciableCreateByUpdate = true;
    let justiciableBusqueda = new JusticiableBusquedaItem();
    justiciableBusqueda.idpersona = justiciable.idpersona;
    justiciableBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
    this.callServiceSearch(justiciableBusqueda);
  }
  contrario(event){
    this.fromContrario=true;
  }
}
