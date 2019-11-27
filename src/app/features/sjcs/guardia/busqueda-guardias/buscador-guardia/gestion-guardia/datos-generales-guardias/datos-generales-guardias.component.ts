import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales-guardias',
  templateUrl: './datos-generales-guardias.component.html',
  styleUrls: ['./datos-generales-guardias.component.scss']
})
export class DatosGeneralesGuardiasComponent implements OnInit {

  body: GuardiaItem = new GuardiaItem()
  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  datos;
  cols;
  comboTipoGuardia = [];
  comboGuardia = [];
  comboTurno = [];
  bodyInicial;
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.getCols();
    this.historico = this.persistenceService.getHistorico()
    this.getComboTipoGuardia();
    this.getComboTurno();

    if (this.persistenceService.getDatos())
      this.sigaService.datosRedy$.subscribe(
        data => {
          this.body = data
          this.bodyInicial = data
          if (data.idGuardia) {
            this.getComboGuardia()
          }
        });

  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }


  disabledSave() {
    if (!this.historico && (this.body.nombre && this.body.nombre.trim())
      && (this.body.descripcion && this.body.descripcion.trim())
      && (this.body.idTurno) && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else return true;

  }

  getCols() {
    if (!this.modoEdicion)
      this.cols = [
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
    else
      this.cols = [
        { field: "vinculacion", header: "justiciaGratuita.guardia.gestion.vinculacion" },
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
  }


  getComboTipoGuardia() {
    this.sigaService.get("busquedaGuardia_tiposGuardia").subscribe(
      n => {
        this.comboTipoGuardia = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoGuardia);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTurno() {
    this.sigaService.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.body.idGuardia = "";
    this.comboTipoGuardia = [];

    if (this.body.idTurno != undefined && this.body.idTurno != "") {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {

    this.sigaService.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.body.idTurno).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardia = data.combooItems
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      )

  }

  rest() {
    this.body = this.bodyInicial

  }
  save() {
    this.modoEdicion = true;
    this.getCols();
  }
}
