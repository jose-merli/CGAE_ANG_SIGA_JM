import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';

@Component({
  selector: 'app-datos-representante',
  templateUrl: './datos-representante.component.html',
  styleUrls: ['./datos-representante.component.scss']
})
export class DatosRepresentanteComponent implements OnInit, OnChanges, OnDestroy {

  generalBody: JusticiableItem = new JusticiableItem();

  tipoIdentificacion;
  progressSpinner: boolean = false;
  msgs = [];

  @Input() modoEdicion;
  @Input() showTarjeta;
  @Input() body: JusticiableItem;
  @Input() checkedViewRepresentante;

  searchRepresentanteGeneral: boolean = false;
  navigateToJusticiable: boolean = false;
  esMenorEdad: boolean = false;
  idPersona;
  permisoEscritura;
  showTarjetaPermiso: boolean = false;

  @Output() newRepresentante = new EventEmitter<JusticiableItem>();
  @Output() viewRepresentante = new EventEmitter<JusticiableItem>();

  constructor(private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {

    this.progressSpinner = true;

    this.commonsService.checkAcceso(procesos_justiciables.tarjetaDatosRepresentante)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        if (this.permisoEscritura == undefined) {
          this.showTarjetaPermiso = false;
          this.progressSpinner = false;
        } else {
          this.showTarjetaPermiso = true;
          this.getTiposIdentificacion();
          this.persistenceService.clearFiltrosAux();

        }
      }
      ).catch(error => console.error(error));


  }

  ngOnChanges(changes: SimpleChanges) {

    //Comprobamos si se ha seleccionado de la tabla el justiciable 
    if (this.persistenceService.getBody() != undefined) {
      this.generalBody = this.persistenceService.getBody();

      if (this.persistenceService.getBody().nombreSolo != undefined && this.persistenceService.getBody().nombreSolo != null) {
        this.generalBody.nombre = this.persistenceService.getBody().nombreSolo;
      }

      if (this.persistenceService.getBody().apellido1 != undefined && this.persistenceService.getBody().apellido1 != null) {
        this.generalBody.apellidos = this.persistenceService.getBody().apellido1;
      }

      if (this.persistenceService.getBody().apellido2 != undefined && this.persistenceService.getBody().apellido2 != null) {
        this.generalBody.apellidos += " " + this.persistenceService.getBody().apellido2;
      }


      this.compruebaDNI();
      this.showTarjeta = true;
      this.searchRepresentanteGeneral = true;
    } else {
      this.generalBody = new JusticiableItem();
    }

    //Se comprueba si proviene del enlace de navegacion del representante, si es ese caso
    if (this.navigateToJusticiable) {

      //Se comprueba si ese representante tiene representante asignado, comprobamos que que el cambio de informacion se haya realizado para ver la ficha del representante
      if (this.body != undefined && this.body.idrepresentantejg != undefined && (this.generalBody.idpersona == undefined || this.generalBody.idpersona == null)
        && this.idPersona != undefined && this.idPersona != null && this.idPersona == this.body.idpersona) {
        this.showTarjeta = true;
        this.searchJusticiable();
      } else if (this.idPersona != undefined && this.idPersona != null && this.idPersona == this.body.idpersona) {
        this.showTarjeta = false;
        this.generalBody = new JusticiableItem();
        this.navigateToJusticiable = false;

      }

    } else {
      //En caso de venir de un punto de la app, comprobamos que el justiciable tenga representante
      if (this.body != undefined && this.body.idrepresentantejg != undefined && (this.generalBody.idpersona == undefined || this.generalBody.idpersona == null)) {
        this.searchJusticiable();
      } else {
        if (this.generalBody != undefined && this.generalBody.idpersona != undefined && this.generalBody.idpersona != null) {
          this.showTarjeta = true;

        } else {
          this.showTarjeta = false;

        }
      }
    }

    this.sigaServices.guardarDatosGeneralesJusticiable$.subscribe((data) => {
      this.body = data;
      this.modoEdicion = true;

    })

  }

  onHideTarjeta() {
    if (this.modoEdicion && !this.checkedViewRepresentante) {
      this.showTarjeta = !this.showTarjeta;
    }
  }

  searchJusticiable() {
    this.progressSpinner = true;
    let bodyBusqueda = new JusticiableBusquedaItem();
    bodyBusqueda.idpersona = this.body.idrepresentantejg;
    bodyBusqueda.idInstitucion = this.body.idinstitucion;

    this.sigaServices.post("gestionJusticiables_searchJusticiable", bodyBusqueda).subscribe(
      n => {

        this.generalBody = JSON.parse(n.body).justiciable;
        this.persistenceService.clearBody();
        this.progressSpinner = false;
        this.navigateToJusticiable = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  getTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.tipoIdentificacion = n.combooItems;
        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  search() {
    this.persistenceService.clearBody();
    this.router.navigate(["/justiciables"], { queryParams: { rp: "1" } });
  }

  searchRepresentanteByNif() {

    if (this.generalBody.nif.trim() != undefined && this.generalBody.nif.trim() != "") {
      this.progressSpinner = true;
      let bodyBusqueda = new JusticiableBusquedaItem();
      bodyBusqueda.nif = this.generalBody.nif;

      this.sigaServices.post("gestionJusticiables_getJusticiableByNif", bodyBusqueda).subscribe(
        n => {

          this.generalBody = JSON.parse(n.body).justiciable;
          this.progressSpinner = false;

          if (this.generalBody.idpersona == null || this.generalBody.idpersona == undefined) {
            this.callServiceConfirmationCreateRepresentante();
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        });
    }

  }

  disabledSave() {
    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != "") {
      return false;
    } else {
      return true;
    }
  }

  disabledDisassociate() {
    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != "") {
      return false;
    } else {
      return true;
    }
  }

  callServiceConfirmationCreateRepresentante() {

    this.confirmationService.confirm({
      message: "No existe registrado ese NIF en el sistema, ¿desea crear un nuevo representante con el NIF introducido?",
      icon: "fa fa-search ",
      accept: () => {
        this.showTarjeta = false;
        let generalBodySend = JSON.parse(JSON.stringify(this.generalBody));
        this.generalBody = new JusticiableItem();
        this.newRepresentante.emit(generalBodySend);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });

  }

  compruebaDNI() {

    if (this.generalBody.nif != undefined && this.generalBody.nif != "" && this.generalBody.nif != null) {
      let idTipoIdentificacion = this.commonsService.compruebaDNI(this.generalBody.idtipoidentificacion, this.generalBody.nif);
      this.generalBody.idtipoidentificacion = idTipoIdentificacion;
    }

  }

  associate() {

    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != null && this.generalBody.idpersona.trim() != "") {

      if (this.generalBody.nif != undefined && this.generalBody.nif != "" &&
        this.generalBody.nif != null && this.body != undefined && this.generalBody.nif == this.body.nif) {

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El representante no puede ser el propio justiciable");

      } else {

        this.progressSpinner = true;
        this.body.idrepresentantejg = this.generalBody.idpersona;

        this.sigaServices.post("gestionJusticiables_associateRepresentante", this.body).subscribe(
          n => {

            this.progressSpinner = false;
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.persistenceService.setBody(this.generalBody);
          },
          err => {
            this.progressSpinner = false;
            this.translateService.instant("general.message.error.realiza.accion")
          });

      }
    }

  }

  disassociate() {
    //En el back se el idrepresentante se pone a null y esa es la forma de disasociar al representante

    if (this.body.edad == undefined || (this.body.edad != undefined && JSON.parse(this.body.edad) > SigaConstants.EDAD_ADULTA)) {
      this.progressSpinner = true;
      this.sigaServices.post("gestionJusticiables_disassociateRepresentante", this.body).subscribe(
        n => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.generalBody = new JusticiableItem();
          this.persistenceService.setBody(this.generalBody);
          this.body.idrepresentantejg = undefined;
          this.progressSpinner = false;

        },
        err => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion")
        });
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El justiciable es menor. Es obligatorio introducir su representante legal. Si no dispone del dato no introduzca fecha de nacimiento hasta que disponga de esa información");

    }

  }

  navigateToRepresentante() {

    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != null && this.generalBody.idpersona != "") {
      this.commonsService.scrollTop();
      this.idPersona = this.generalBody.idpersona;
      this.navigateToJusticiable = true;
      this.viewRepresentante.emit(this.generalBody);
    }

  }

  rest() {

    if (this.body.idrepresentantejg != undefined) {
      this.searchJusticiable();
    } else {
      this.generalBody = new JusticiableItem();
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

  clear() {
    this.msgs = [];
  }

  ngOnDestroy(): void {
    this.generalBody = new JusticiableItem();
  }
}
