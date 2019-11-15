import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { THIS_EXPR } from '../../../../../../../node_modules/@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-datos-representante',
  templateUrl: './datos-representante.component.html',
  styleUrls: ['./datos-representante.component.scss']
})
export class DatosRepresentanteComponent implements OnInit, OnChanges {

  generalBody: JusticiableItem = new JusticiableItem();
  generalBodyInicial;
  existeImagen: boolean = false;

  tipoIdentificacion;
  progressSpinner: boolean = false;
  msgs = [];

  idPersona;

  @Input() modoEdicion;
  @Input() showTarjeta;
  @Input() body: JusticiableItem;
  @Input() checkedViewRepresentante;

  searchRepresentanteGeneral: boolean = false;

  @Output() newRepresentante = new EventEmitter<JusticiableItem>();
  @Output() viewRepresentante = new EventEmitter<JusticiableItem>();

  constructor(private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {

    this.getTiposIdentificacion();
    this.persistenceService.clearFiltrosAux();

    if (this.persistenceService.getBody() != undefined) {
      this.generalBody = this.persistenceService.getBody();
      this.idPersona = this.persistenceService.getBody().idPersona;
      this.generalBody.nombre = this.persistenceService.getBody().nombreSolo;
      this.compruebaDNI();
      this.showTarjeta = true;
      this.searchRepresentanteGeneral = true;
    } else {
      this.showTarjeta = false;
      this.generalBody = new JusticiableItem();

    }

  }

  ngOnChanges(changes: SimpleChanges) {

    if (!this.searchRepresentanteGeneral) {
      if (this.body != undefined && this.body.idrepresentantejg != undefined && !this.checkedViewRepresentante) {
        this.showTarjeta = true;
        this.searchJusticiable();
      } else {
        this.showTarjeta = false;
        this.generalBody = new JusticiableItem();
        this.generalBodyInicial = JSON.parse(JSON.stringify(this.generalBody));

      }
    }

  }

  onHideTarjeta() {
    if (this.modoEdicion && !this.checkedViewRepresentante) {
      this.showTarjeta = !this.showTarjeta;
    }
  }

  searchJusticiable() {
    this.progressSpinner = true;
    let bodyBusqueda = new JusticiableBusquedaItem();
    bodyBusqueda.idPersona = this.body.idrepresentantejg;
    bodyBusqueda.idInstitucion = this.body.idinstitucion;

    this.sigaServices.post("gestionJusticiables_searchJusticiable", bodyBusqueda).subscribe(
      n => {

        this.generalBody = JSON.parse(n.body).justiciable;
        this.generalBodyInicial = JSON.parse(JSON.stringify(this.generalBody));
        this.progressSpinner = false;

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

      },
      err => {
        console.log(err);
      }
    );
  }

  search() {
    this.persistenceService.clearBody() //--> ESTO HACE Q NO SE RESTABLEZCA EL REPREENTANTE CUANDO SE CREA UNO DESDE EL BOTON BUSCAR TENGO Q MIRAR COMO HACERLO
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
          this.idPersona = this.generalBody.idpersona;
          this.progressSpinner = false;

          if (this.generalBody.idpersona == null || this.generalBody.idpersona == undefined) {
            this.callServiceConfirmationCreateRepresentante();
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        });
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

    if (this.generalBody.nif != undefined && this.generalBody.nif != "" &&
      this.generalBody.nif != null && this.generalBody.nif != this.body.nif) {

      this.progressSpinner = true;
      this.body.idrepresentantejg = this.idPersona;
      this.generalBodyInicial = JSON.parse(JSON.stringify(this.generalBody));

      this.sigaServices.post("gestionJusticiables_associateRepresentante", this.body).subscribe(
        n => {

          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        },
        err => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion")
        });

    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El representante no puede ser el propio justiciable");
    }

  }

  disassociate() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionJusticiables_disassociateRepresentante", this.body).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.generalBody = new JusticiableItem();
        this.generalBodyInicial = JSON.parse(JSON.stringify(this.generalBody));
        this.body.idrepresentantejg = undefined;
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        this.translateService.instant("general.message.error.realiza.accion")
      });
  }

  navigateToRepresentante() {

    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != null && this.generalBody.idpersona != "") {
      this.commonsService.scrollTop();
      this.viewRepresentante.emit(this.generalBody);
    }

  }

  rest() {

    if (this.generalBodyInicial != undefined && this.generalBodyInicial.idpersona != undefined) {
      this.generalBody = JSON.parse(JSON.stringify(this.generalBodyInicial));
    } else if (this.generalBodyInicial != undefined && this.generalBodyInicial.idpersona == undefined && this.body.idrepresentantejg != undefined) {
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
}
