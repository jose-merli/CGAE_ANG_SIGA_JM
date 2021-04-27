import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../../../../../../commons/translate';

@Component({
  selector: 'app-tarjeta-datos-gen-ficha-act',
  templateUrl: './tarjeta-datos-gen-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-gen-ficha-act.component.scss']
})
export class TarjetaDatosGenFichaActComponent implements OnInit, OnDestroy {

  comboJuzgados: any[] = [];
  comboProcedimientos: any[] = [];
  comboModulos: any[] = [];
  comboAcreditaciones: any[] = [];
  comboPrisiones: any[] = [];
  comboMotivosCambio: any[] = [];
  institucionActual: string = '';

  @Input() isAnulada: boolean;
  @Input() permisoEscritura;
  @Input() usuarioLogado;

  msgs: Message[] = [];
  resaltadoDatos: boolean = false;

  datos = {
    inputs1: [
      {
        label: 'Número Actuación',
        value: null
      },
      {
        label: 'Nº Colegiado',
        value: null
      },
      {
        label: 'Letrado (*)',
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
    ],
    inputNig: {
      label: 'NIG',
      value: null
    },
    inputNumPro: {
      label: 'Nº Procedimiento',
      value: null
    },
    textarea: {
      label: 'Observaciones',
      value: null
    },
    selectores: [
      {
        nombre: "Juzgado (*)",
        opciones: [],
        value: null,
        obligatorio: true
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
        value: null,
        obligatorio: true
      },
      {
        nombre: "Acreditación (*)",
        opciones: [],
        value: null,
        obligatorio: true
      },
      {
        nombre: "Prisión",
        opciones: [],
        value: null
      },
    ],
    datePicker: {
      label: 'Fecha actuación (*)',
      value: null,
      obligatorio: true
    }
  };

  @Input() actuacionDesigna: Actuacion;
  progressSpinner: boolean = false;
  fechaEntradaInicioDate: Date;

  constructor(private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private datePipe: DatePipe,
    private translateService: TranslateService) { }

  ngOnInit() {

    this.getInstitucionActual();
    this.getComboJuzgados();
    this.getComboProcedimientos();
    this.getComboModulos();
    this.getComboAcreditaciones();
    this.getComboPrisiones();
    this.getComboMotivosCambio();

    this.fechaEntradaInicioDate = new Date(this.actuacionDesigna.designaItem.fechaEntradaInicio.split('/').reverse().join('-'));

    if (this.actuacionDesigna.isNew) {
      this.establecerDatosInicialesNuevaAct();
    } else {
      this.establecerDatosInicialesEditAct();
    }
    this.getLetradoActuacion();
    sessionStorage.setItem("datosIniActuDesignaDatosGen", JSON.stringify(this.actuacionDesigna));
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
        this.datos.selectores[0].opciones = this.comboJuzgados;
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
        this.datos.selectores[1].opciones = this.comboProcedimientos;
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
        this.datos.selectores[3].opciones = this.comboModulos;
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
        this.datos.selectores[4].opciones = this.comboAcreditaciones;
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
        this.datos.selectores[5].opciones = this.comboPrisiones;
      }
    );
  }

  getComboMotivosCambio() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_motivosCambio_actuDesigna").subscribe(
      n => {
        this.comboMotivosCambio = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboMotivosCambio);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[2].opciones = this.comboMotivosCambio;
      }
    );
  }

  fillFecha(event) {
    this.datos.datePicker.value = event;
    this.getLetradoActuacion();
  }

  establecerDatosInicialesNuevaAct() {
    this.datos.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '');
    this.datos.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputNig.value = this.actuacionDesigna.designaItem.nig;
    this.datos.datePicker.value = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.datos.inputNumPro.value = this.actuacionDesigna.designaItem.numProcedimiento;
    this.datos.selectores[0].value = this.actuacionDesigna.designaItem.idJuzgado;
    this.datos.selectores[1].value = this.actuacionDesigna.designaItem.idPretension;
    this.datos.selectores[3].value = this.actuacionDesigna.designaItem.idProcedimiento;
  }

  establecerDatosInicialesEditAct() {
    this.datos.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '').replace('/', '');
    this.datos.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.datePicker.value = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.datos.inputs1[1].value = this.actuacionDesigna.actuacion.numColegiado;
    this.datos.inputs1[2].value = this.actuacionDesigna.actuacion.letrado;
    this.datos.inputNig.value = this.actuacionDesigna.actuacion.nig;
    this.datos.inputNumPro.value = this.actuacionDesigna.actuacion.numProcedimiento;
    this.datos.selectores[0].value = this.actuacionDesigna.actuacion.idJuzgado;
    this.datos.selectores[1].value = this.actuacionDesigna.actuacion.idPretension;
    this.datos.selectores[2].value = this.actuacionDesigna.actuacion.idMotivoCambio;
    this.datos.selectores[3].value = this.actuacionDesigna.actuacion.idProcedimiento;
    this.datos.selectores[4].value = this.actuacionDesigna.actuacion.idAcreditacion;
    this.datos.selectores[5].value = this.actuacionDesigna.actuacion.idPrision;
    this.datos.textarea.value = this.actuacionDesigna.actuacion.observaciones;
  }

  guardarAction() {

    if (this.actuacionDesigna.isNew) {
      this.guardarEvent();
    } else {
      this.editarEvent();
    }

  }

  guardarEvent() {
    if (!this.compruebaCamposObligatorios()) {
      console.log("HA IDO BIEN");

      // this.sigaServices.post("actuaciones_designacion_guardar", this.actuacionDesigna).subscribe(
      //   data => {
      //     console.log("🚀 ~ file: tarjeta-datos-gen-ficha-act.component.ts ~ line 280 ~ TarjetaDatosGenFichaActComponent ~ guardarEvent ~ data", data)
      //   },
      //   err => {

      //   }
      // );

    }
  }

  editarEvent() {
    if (!this.compruebaCamposObligatorios()) {

    }
  }

  compruebaCamposObligatorios() {

    let error = false;

    if (!this.validarNig(this.datos.inputNig.value)) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), 'Formato del campo NIG inválido');
      error = true;
    }

    if (!error && !this.validarNProcedimiento(this.datos.inputNumPro.value)) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), 'Formato del campo Nº Procedimiento inválido');
      error = true;
    }

    if (!error && (this.datos.datePicker.value == undefined || this.datos.datePicker.value == null || this.datos.datePicker.value.trim() == '')) {

      error = true;
    }

    return error;

  }

  restablecer() {

    if (sessionStorage.getItem("datosIniActuDesignaDatosGen")) {
      this.actuacionDesigna = JSON.parse(sessionStorage.getItem("datosIniActuDesignaDatosGen"));

      if (this.actuacionDesigna.isNew) {
        this.establecerDatosInicialesNuevaAct();
      } else {
        this.establecerDatosInicialesEditAct();
      }

      this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));

    }
  }

  validarNig(nig) {
    //Esto es para la validacion de CADECA

    let response;

    if (this.institucionActual == "2008" || this.institucionActual == "2015" || this.institucionActual == "2029" || this.institucionActual == "2033" || this.institucionActual == "2036" ||
      this.institucionActual == "2043" || this.institucionActual == "2006" || this.institucionActual == "2021" || this.institucionActual == "2035" || this.institucionActual == "2046" || this.institucionActual == "2066") {
      if (nig != '') {
        var objRegExp = /^[0-9]{7}[S,C,P,O,I,V,M,6,8,1,2,3,4]{1}(19|20)\d{2}[0-9]{7}$/;
        var ret = objRegExp.test(nig);
        response = ret;
      }
      else
        response = true;
    } else {
      if (nig.length == 19) {
        var objRegExp = /^([a-zA-Z0-9]{19})?$/;
        var ret = objRegExp.test(nig);
        response = ret;
      } else {
        response = true;
      }
    }


    return response;

  }

  validarNProcedimiento(nProcedimiento) {
    //Esto es para la validacion de CADECA

    let response;

    if (this.institucionActual == "2008" || this.institucionActual == "2015" || this.institucionActual == "2029" || this.institucionActual == "2033" || this.institucionActual == "2036" ||
      this.institucionActual == "2043" || this.institucionActual == "2006" || this.institucionActual == "2021" || this.institucionActual == "2035" || this.institucionActual == "2046" || this.institucionActual == "2066") {
      if (nProcedimiento != '') {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        var ret = objRegExp.test(nProcedimiento);
        response = ret;
      }
      else
        response = true;
    } else {
      if (nProcedimiento.length == 19) {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}[/]$/;
        var ret = objRegExp.test(nProcedimiento);
        response = ret;
      } else {
        response = true;
      }
    }


    return response;

  }

  styleObligatorio(resaltado, evento) {

    if (evento == true && resaltado == "selector") {
      if (this.datos.selectores[0].obligatorio == true && this.datos.selectores[0].nombre == "Juzgado (*)"
        && (this.datos.selectores[0].value == "" || this.datos.selectores[0].value == undefined)
        && this.datos.selectores[3].obligatorio == true && this.datos.selectores[3].nombre == "Módulo (*)"
        && (this.datos.selectores[3].value == "" || this.datos.selectores[3].value == undefined)
        && this.datos.selectores[4].obligatorio == true && this.datos.selectores[4].nombre == "Acreditación (*)"
        && (this.datos.selectores[4].value == "" || this.datos.selectores[4].value == undefined)
      ) {
        return "camposObligatorios";
      }
    }

    // if (this.resaltadoDatos && (evento == "fechaGenerales") && resaltado == "fecha") {
    //   return this.commonsService.styleObligatorio(evento);
    // }


  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => { this.institucionActual = n.value });
  }

  getLetradoActuacion() {
    this.progressSpinner = true;

    let params = {
      anio: this.actuacionDesigna.designaItem.ano.split('/')[0].replace('D', ''),
      numero: this.actuacionDesigna.designaItem.numero,
      clave: this.actuacionDesigna.designaItem.idTurno,
      fechaDesigna: this.datePipe.transform(this.datos.datePicker.value, 'dd/MM/yyyy')
    };

    this.sigaServices.post("actuaciones_designacion_getLetradoDesigna", params).subscribe(
      data => {
        let resp = JSON.parse(data.body);

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        } else {
          if (resp.listaLetradosDesignaItem.length) {
            this.datos.inputs1[1].value = resp.listaLetradosDesignaItem[0].numeroColegiado;
            this.datos.inputs1[2].value = resp.listaLetradosDesignaItem[0].colegiado;
          } else {
            this.datos.inputs1[1].value = '';
            this.datos.inputs1[2].value = '';
          }
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("datosIniActuDesignaDatosGen");
  }


}
