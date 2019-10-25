
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AreasItem } from '../../../../../models/sjcs/AreasItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  body: AreasItem = new AreasItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  generalBody: any;
  comboTipoIdentificacion;
  comboSexo;
  comboTipoPersona;
  comboEstadoCivil;
  comboIdiomas;
  comboProfesion;
  comboRegimenConyugal;
  comboMinusvalia;
  comboPais;

  @Output() modoEdicionSend = new EventEmitter<any>();

  @Input() showTarjeta;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit() {

    this.getCombos();
  }

  getCombos() {
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboTipoPersona();
    this.getComboIdiomas();
    this.getComboTiposIdentificacion();
    this.getComboProfesion();
    this.getComboRegimenConyugal();
    this.getComboMinusvalia();
    this.getComboPais();
  }

  getComboMinusvalia() {

    this.progressSpinner = true;

    this.sigaServices.get("gestionJusticiables_comboMinusvalias").subscribe(
      n => {
        this.comboMinusvalia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboMinusvalia);
        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPais);

      },
      error => { }
    );
  }

  getComboProfesion() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionJusticiables_comboProfesiones").subscribe(
      n => {
        this.comboProfesion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProfesion);


        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboRegimenConyugal() {
    this.comboRegimenConyugal = [
      { label: "Indetermninado", value: "I" },
      { label: "Gananciales", value: "G" },
      { label: "Separación de bienes", value: "S" }
    ];
  }

  getComboTipoPersona() {
    this.comboTipoPersona = [
      { label: "Física", value: "F" },
      { label: "Jurídica", value: "J" }
    ];

    this.commonsService.arregloTildesCombo(this.comboTipoPersona);

  }

  getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" },
      { label: "No Consta", value: "N" }
    ];
  }

  getComboTiposIdentificacion() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.comboTipoIdentificacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoIdentificacion);

        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboEstadoCivil() {
    this.progressSpinner = true;
    this.sigaServices.get("fichaColegialGenerales_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadoCivil);

        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );

  }

  getComboIdiomas() {
    this.progressSpinner = true;
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.comboIdiomas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboIdiomas);

        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  rest() {
    // if (this.modoEdicion) {
    //   if (this.bodyInicial != undefined) this.areasItem = JSON.parse(JSON.stringify(this.bodyInicial));
    // } else {
    //   this.areasItem = new AreasItem();
    // }
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  disabledSave() {
    // if (this.areasItem.nombreArea != undefined) this.areasItem.nombreArea = this.areasItem.nombreArea.trim();
    // if (this.areasItem.nombreArea != "" && (JSON.stringify(this.areasItem) != JSON.stringify(this.bodyInicial))) {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

}
