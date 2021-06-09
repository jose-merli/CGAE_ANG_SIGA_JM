import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, SimpleChanges, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-defensa-juridica',
  templateUrl: './defensa-juridica.component.html',
  styleUrls: ['./defensa-juridica.component.scss']
})
export class DefensaJuridicaComponent implements OnInit {

  progressSpinner: boolean = false;
  body: EJGItem = new EJGItem();
  bodyInicial: EJGItem;
  permisoEscritura: boolean = false;

  comboPreceptivo;
  comboRenuncia;
  comboSituacion;
  comboComisaria;
  comboCalidad;

  openDef: boolean = false;

  msgs: Message[] = [];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {

    this.getComboPreceptivo();
    this.getComboRenuncia();
    this.getComboSituaciones();
    this.getComboCDetencion();
    this.getComboCalidad();

    this.body = this.persistenceService.getDatos();

    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
  }

  abreCierra(){
    this.openDef = !this.openDef;
  }

  checkPermisosAsociarDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDes();
    }
  }

  asociarDes() {
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
    this.router.navigate(["/busquedaAsuntos"]);
  }

  checkPermisosCreateDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.createDes();
    }
  }

  createDes() {
    this.progressSpinner = true;
    //Recogemos los datos de nuevo de la capa de persistencia para captar posibles cambios realizados en el resto de tarjetas
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
    sessionStorage.setItem("nuevaDesigna", "true");
    //if (this.art27) sessionStorage.setItem("Art27", "true");
    this.progressSpinner = false;
    this.router.navigate(["/fichaDesignaciones"]);
  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  save() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_updateDatosJuridicos", this.body).subscribe(
      n => {
        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyInicial = this.body;
          this.persistenceService.setDatos(this.body);
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboPreceptivo() {
    this.sigaServices.get("filtrosejg_comboPreceptivo").subscribe(
      n => {
        this.comboPreceptivo = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPreceptivo);
      },
      err => {
      }
    );
  }

  getComboRenuncia() {
    this.sigaServices.get("filtrosejg_comboRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboRenuncia);
      },
      err => {
      }
    );
  }

  getComboSituaciones() {
    this.sigaServices.get("gestionejg_comboSituaciones").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboSituacion);
      },
      err => {
      }
    );
  }

  getComboCDetencion() {
    this.sigaServices.get("gestionejg_comboCDetencion").subscribe(
      n => {
        this.comboComisaria = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboComisaria);
      },
      err => {
      }
    );
  }

  getComboCalidad() {
    this.sigaServices.get("gestionejg_comboTipoencalidad").subscribe(
      n => {
        this.comboCalidad = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboCalidad);
      },
      err => {
      }
    );
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

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

  backTo() {
    this.location.back();
  }
}
