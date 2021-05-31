import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-datos-unidad-familiar',
  templateUrl: './datos-unidad-familiar.component.html',
  styleUrls: ['./datos-unidad-familiar.component.scss']
})
export class DatosUnidadFamiliarComponent implements OnInit {

  solicitanteCabecera: String = "";
  parentescoCabecera: String = "";

  solicitanteBox: boolean = false;
  incapacitadoBox: boolean = false;
  cirExcepBox: boolean = false;
  selectedGrupoL: String = null;
  selectedParentesco: String = null;
  selectedTipoIng: String = null;

  comboGrupoLaboral: any = [];
  comboParentesco: any = [];
  comboTipoIng: any = [];

  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  msgs: Message[] = [];
  generalBody: UnidadFamiliarEJGItem;
  initialBody: UnidadFamiliarEJGItem;

  showTarjeta: boolean = false;

  @Input() modoEdicion;
  @Input() showTarjetaPermiso;
  @Input() body: JusticiableItem;
  @Input() checkedViewRepresentante;
  @Input() navigateToJusticiable: boolean = false;
  @Input() fromUniFamiliar: boolean = false;


  constructor(private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboGruposLaborales();
    this.getComboParentesco();
    this.getComboTiposIngresos();

    /* Proviene de un EJG */
    if (this.fromUniFamiliar) {
      this.showTarjetaPermiso = true;
      this.permisoEscritura = true;
    }

    //Familiar que se ha seleccionado en el EJG
    if (sessionStorage.getItem("Familiar")) {
      let data = JSON.parse(sessionStorage.getItem("Familiar"));
      sessionStorage.removeItem("Familiar");
      this.generalBody = data;
      //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores
      //igual que la variable generalBody.
      this.initialBody = JSON.parse(JSON.stringify(data));

      //Le asignamos valores a las cajas (checks).
      this.fillBoxes();

      this.permisoEscritura = true;
      //this.contrario.emit(true);
    }
    this.progressSpinner = false;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  save() {
    this.progressSpinner = true;

    //Introducimos los valores que tienen los checkbox al objeto.
    if (this.solicitanteBox) this.generalBody.uf_solicitante = "1";
    else this.generalBody.uf_solicitante = "0";

    if (this.incapacitadoBox) this.generalBody.incapacitado = 1;
    else this.generalBody.incapacitado = 0;

    if (this.cirExcepBox) this.generalBody.circunsExcep = 1;
    else this.generalBody.circunsExcep = 0;

    this.sigaServices.post("gestionJusticiables_updateUnidadFamiliar", this.generalBody).subscribe(
      n => {

        this.progressSpinner = false;

        if (JSON.parse(n.body).error.code == 200) {
          this.showMessage("success", this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.initialBody = this.generalBody;
          //Se comprueba si se debe cambiar el valor de parentesco de la cabecera 
          if (this.generalBody.idParentesco != null && this.generalBody.idParentesco != undefined) {
            this.comboParentesco.forEach(element => {
              if (element.value == this.generalBody.idParentesco) this.parentescoCabecera = element.label;
            });
          }
          else this.parentescoCabecera = "";
          //Se comprueba si se debe cambiar el valor de solicitante de la cabecera
          this.fillBoxes();
        } else {
          this.showMessage("error", this.translateService.instant('general.message.incorrect'),
            this.translateService.instant('general.message.error.realiza.accion'));
        }


      },
      err => {
        if (JSON.parse(err.error).error.description != '') {
          this.showMessage(
            'error',
            this.translateService.instant('general.message.incorrect'),
            this.translateService.instant(JSON.parse(err.error).error.description)
          );
        } else {
          this.showMessage(
            'error',
            this.translateService.instant('general.message.incorrect'),
            this.translateService.instant('general.message.error.realiza.accion')
          );
        }
        this.progressSpinner = false;
      }
    )
  }

  rest() {
    //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores
    //igual que la variable generalBody.
    this.generalBody = JSON.parse(JSON.stringify(this.initialBody));
    this.fillBoxes();

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 44 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }

  }

  fillBoxes() {
    if (this.generalBody.uf_solicitante == "1") {
      this.solicitanteCabecera = "SI";
      this.solicitanteBox = true;
    }
    else {
      this.solicitanteCabecera = "NO";
      this.solicitanteBox = false;
    }

    if (this.generalBody.circunsExcep == 1) {
      this.cirExcepBox = true;
    }
    else this.cirExcepBox = false;

    if (this.generalBody.incapacitado == 1) {
      this.incapacitadoBox = true;
    }
    else this.incapacitadoBox = false;
  }

  getComboGruposLaborales() {
    this.progressSpinner = true;
    this.sigaServices.get("gestionJusticiables_comboGruposLaborales").subscribe(
      n => {
        this.comboGrupoLaboral = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboGrupoLaboral);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  getComboParentesco() {
    this.progressSpinner = true;
    this.sigaServices.get("gestionJusticiables_comboParentesco").subscribe(
      n => {
        this.comboParentesco = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboParentesco);
        this.progressSpinner = false;

        //Se asigna el valor de parentesco de la cabecera cuando se incia la tarjeta
        if (this.generalBody.idParentesco != null && this.generalBody.idParentesco != undefined) {
          this.comboParentesco.forEach(element => {
            if (element.value == this.generalBody.idParentesco) this.parentescoCabecera = element.label;
          });
        }
        //Si no tiene idParentesco, se le asigna el valor por defecto "No informado". 
        //Actualmente, el combo no devuelve ningún elemento con esa etiqueta.
        //else this.generalBody.idParentesco = 
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  getComboTiposIngresos() {
    this.progressSpinner = false;
    this.sigaServices.get("gestionJusticiables_comboTiposIngresos").subscribe(
      n => {
        this.comboTipoIng = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoIng);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

}
