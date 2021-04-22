import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tarjeta-datos-gen-ficha-act',
  templateUrl: './tarjeta-datos-gen-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-gen-ficha-act.component.scss']
})
export class TarjetaDatosGenFichaActComponent implements OnInit {

  comboJuzgados: any[] = [];
  comboProcedimientos: any[] = [];
  comboModulos: any[] = [];
  comboAcreditaciones: any[] = [];
  comboPrisiones: any[] = [];

  msgs: Message[] = [];

  inputs1 = [
    {
      label: 'Número Actuación',
      value: null
    },
    {
      label: 'Nº Colegiado',
      value: null
    },
    {
      label: 'Letrado',
      value: null
    },
    {
      label: 'Talonario',
      value: null
    },
    {
      label: 'Talón',
      value: null
    }
  ];

  inputNig = {
    label: 'NIG',
    value: null
  }

  inputNumPro = {
    label: 'Nº Procedimiento',
    value: null
  }

  textarea = {
    label: 'Observaciones',
    value: null
  }

  selectores = [
    {
      nombre: "Juzgado (*)",
      opciones: [],
      value: null
    },
    {
      nombre: "Procedimiento",
      opciones: [],
      value: null
    },
    {
      nombre: "Motivo del cambio",
      opciones: [],
      value: null
    },
    {
      nombre: "Módulo (*)",
      opciones: [],
      value: null
    },
    {
      nombre: "Acreditación (*)",
      opciones: [],
      value: null
    },
    {
      nombre: "Prisión",
      opciones: [],
      value: null
    },
  ];

  datePicker = {
    label: 'Fecha actuación (*)',
    value: null
  };

  @Input() actuacionDesigna: Actuacion;
  progressSpinner: boolean = false;

  constructor(private commonsService: CommonsService, private sigaServices: SigaServices, private datePipe: DatePipe) { }

  ngOnInit() {

    this.getComboJuzgados();
    this.getComboProcedimientos();
    this.getComboModulos();
    this.getComboAcreditaciones();
    this.getComboPrisiones();

    if (this.actuacionDesigna.isNew) {
      this.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
      this.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '');
      this.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
      this.inputNig.value = this.actuacionDesigna.designaItem.nig;
      // this.datePicker.value = this.actuacionDesigna.actuacion.fechaActuacion;
      this.datePicker.value = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.inputNumPro.value = this.actuacionDesigna.designaItem.numProcedimiento;
      this.selectores[0].value = this.actuacionDesigna.designaItem.idJuzgado;
      this.selectores[1].value = this.actuacionDesigna.designaItem.idPretension;
      this.selectores[3].value = this.actuacionDesigna.designaItem.idProcedimiento;
    } else {
      this.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
      this.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '').replace('/', '');
      this.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
      // this.datePicker.value = this.actuacionDesigna.actuacion.fechaActuacion;
      this.datePicker.value = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.inputs1[1].value = this.actuacionDesigna.actuacion.numColegiado;
      this.inputs1[2].value = this.actuacionDesigna.actuacion.letrado;
      this.inputNig.value = this.actuacionDesigna.actuacion.nig;
      this.inputNumPro.value = this.actuacionDesigna.actuacion.numProcedimiento;
      this.selectores[0].value = this.actuacionDesigna.actuacion.idJuzgado;
      this.selectores[1].value = this.actuacionDesigna.actuacion.idPretension;
      this.selectores[3].value = this.actuacionDesigna.actuacion.idProcedimiento;
      this.selectores[4].value = this.actuacionDesigna.actuacion.idAcreditacion;
      this.selectores[5].value = this.actuacionDesigna.actuacion.idPrision;
      this.textarea.value = this.actuacionDesigna.actuacion.observaciones;
    }
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  getComboJuzgados() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboJuzgados);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.selectores[0].opciones = this.comboJuzgados;
      }
    );
  }

  getComboProcedimientos() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProcedimientos);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.selectores[1].opciones = this.comboProcedimientos;
      }
    );
  }

  getComboModulos() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboModulosDesignaciones").subscribe(
      n => {
        this.comboModulos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.selectores[3].opciones = this.comboJuzgados;
      }
    );
  }

  getComboAcreditaciones() {
    this.progressSpinner = true;

    this.sigaServices.get("modulosybasesdecompensacion_comboAcreditaciones").subscribe(
      n => {
        this.comboAcreditaciones = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboAcreditaciones);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.selectores[4].opciones = this.comboAcreditaciones;
      }
    );
  }

  getComboPrisiones() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_prisiones").subscribe(
      n => {
        this.comboPrisiones = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPrisiones);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.selectores[5].opciones = this.comboPrisiones;
      }
    );
  }

}
