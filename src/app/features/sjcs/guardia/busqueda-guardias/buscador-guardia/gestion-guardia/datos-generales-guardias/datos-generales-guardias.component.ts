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

  @Input() datos = [];
  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();

  body: GuardiaItem = new GuardiaItem();
  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;

  cols;
  comboTipoGuardia = [];
  comboGuardia = [];
  comboTurno = [];
  buscaGuardia: GuardiaItem = new GuardiaItem();

  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.getCols();
    this.getData();
    this.historico = this.persistenceService.getHistorico()
    this.getComboTipoGuardia();
    this.getComboTurno();
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  disabledSave() {
    return false;
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
  getData() {
    if (!this.modoEdicion)
      this.datos = [
        {
          turno: "Turno 1",
          guardia: "Guardia 1"
        },
        {
          turno: "Turno 2",
          guardia: "Guardia 2"
        },
      ]
    else
      this.datos = [
        {
          vinculacion: "Principal",
          turno: "Turno 1",
          guardia: "Guardia1"
        },
        {
          vinculacion: "Vinculada",
          turno: "Turno 2",
          guardia: "Guardia 2"
        },
      ]
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
      this.isDisabledGuardia = false;
      this.buscaGuardia.idTurno = this.body.idTurno;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {

    this.sigaService.post(
      "busquedaGuardias_searchGuardias", this.buscaGuardia
    ).subscribe(
      data => {
        data = JSON.parse(JSON.parse(JSON.stringify(data.body)));
        if (data.guardiaItems != null && data.guardiaItems.length > 0) {
          data.guardiaItems.forEach(it => {
            this.comboGuardia.push({
              label: it.nombre,
              value: it.idGuardia,
            })
          })
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        }
      },
      err => {
        console.log(err);
      }
    )

  }

  save() {
    this.modoEdicion = !this.modoEdicion
  }
}
