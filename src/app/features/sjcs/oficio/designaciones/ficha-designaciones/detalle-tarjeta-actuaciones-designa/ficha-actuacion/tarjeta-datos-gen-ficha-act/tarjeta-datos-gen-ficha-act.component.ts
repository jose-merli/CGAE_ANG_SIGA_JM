import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Message, SelectItem } from 'primeng/components/common/api';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../../../../../../commons/translate';
import { ActuacionDesignaItem } from '../../../../../../../../models/sjcs/ActuacionDesignaItem';

@Component({
  selector: 'app-tarjeta-datos-gen-ficha-act',
  templateUrl: './tarjeta-datos-gen-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-gen-ficha-act.component.scss']
})
export class TarjetaDatosGenFichaActComponent implements OnInit, OnChanges, OnDestroy {

  comboJuzgados: SelectItem[] = [];
  comboProcedimientos: SelectItem[] = [];
  comboModulos: SelectItem[] = [];
  comboAcreditaciones: SelectItem[] = [];
  comboPrisiones: SelectItem[] = [];
  comboMotivosCambio: SelectItem[] = [];

  @Input() institucionActual;
  @Input() isAnulada: boolean;
  @Input() usuarioLogado;
  @Input() isColegiado: boolean;

  @Output() buscarActEvent = new EventEmitter<string>();

  idPersonaColegiado: string;

  msgs: Message[] = [];
  resaltadoDatos: boolean = false;

  datos = {
    inputs1: [
      {
        label: 'Número Actuación',
        value: '',
        obligatorio: false
      },
      {
        label: 'Nº Colegiado',
        value: '',
        obligatorio: true
      },
      {
        label: 'Letrado (*)',
        value: '',
        obligatorio: true
      },
      {
        label: 'Talonario',
        value: '',
        obligatorio: false
      },
      {
        label: 'Talón',
        value: '',
        obligatorio: false
      }
    ],
    inputNig: {
      label: 'NIG',
      value: ''
    },
    inputNumPro: {
      label: 'Nº Procedimiento',
      value: ''
    },
    textarea: {
      label: 'Observaciones',
      value: ''
    },
    selectores: [
      {
        id: 'juzgado',
        nombre: "Juzgado (*)",
        opciones: [],
        value: null,
        disabled: false,
        obligatorio: true
      },
      {
        id: 'procedimiento',
        nombre: "Procedimiento",
        opciones: [],
        value: null,
        disabled: false,
        obligatorio: false
      },
      {
        id: 'motivoCambio',
        nombre: "Motivo del cambio",
        opciones: [],
        value: null,
        disabled: false,
        obligatorio: false
      },
      {
        id: 'modulo',
        nombre: "Módulo (*)",
        opciones: [],
        value: null,
        disabled: false,
        obligatorio: true
      },
      {
        id: 'acreditacion',
        nombre: "Acreditación (*)",
        opciones: [],
        value: null,
        disabled: false,
        obligatorio: true
      },
      {
        id: 'prision',
        nombre: "Prisión",
        opciones: [],
        value: null,
        disabled: false,
        obligatorio: false
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
  fechaMaxima: Date;

  constructor(private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private datePipe: DatePipe,
    private translateService: TranslateService) { }

  ngOnInit() {

    this.fechaEntradaInicioDate = new Date(this.actuacionDesigna.designaItem.fechaEntradaInicio.split('/').reverse().join('-'));

    if (this.actuacionDesigna.isNew) {
      this.establecerDatosInicialesNuevaAct();
    } else {
      this.establecerDatosInicialesEditAct();
    }

    if (sessionStorage.getItem('isLetrado') == 'true') {
      this.fechaMaxima = new Date();
    }

    this.getLetradoActuacion();
    this.getComboJuzgados();
    this.getComboProcedimientos();

    if (this.datos.selectores[0].value != undefined && this.datos.selectores[0].value != null || (typeof this.datos.selectores[0].value == 'string' && this.datos.selectores[0].value != '')) {
      this.cargaModulosPorJuzgado(this.datos.selectores[0].value);
    } else {
      this.datos.selectores[3].disabled = true;
    }

    if (this.datos.selectores[3].value != undefined && this.datos.selectores[3].value != null || (typeof this.datos.selectores[3].value == 'string' && this.datos.selectores[3].value != '')) {
      this.cargaAcreditacionesPorModulo(this.datos.selectores[3].value);
    } else {
      this.datos.selectores[4].disabled = true;
    }

    this.getComboPrisiones();
    this.getComboMotivosCambio();
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
        if (this.comboJuzgados.find(el => el.value == this.datos.selectores.find(el => el.id == 'juzgado').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'juzgado').value = '';
        }
      }
    );
  }

  cargaModulosPorJuzgado($event) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboModulosConJuzgado", $event).subscribe(
      n => {
        this.comboModulos = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.datos.selectores[3].opciones = this.comboModulos;
        if (this.comboModulos.find(el => el.value == this.datos.selectores.find(el => el.id == 'modulo').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'modulo').value = '';
          this.datos.selectores.find(el => el.id == 'acreditacion').disabled = true;
        }
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
        if (this.comboProcedimientos.find(el => el.value == this.datos.selectores.find(el => el.id == 'procedimiento').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'procedimiento').value = '';
        }
      }
    );
  }

  cargaAcreditacionesPorModulo($event) {
    this.progressSpinner = true;
    let idTurno = this.actuacionDesigna.designaItem.idTurno;

    this.sigaServices.getParam("combo_comboAcreditacionesPorModulo", `?idModulo=${$event}&idTurno=${idTurno}`).subscribe(
      n => {
        this.comboAcreditaciones = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboAcreditaciones);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.datos.selectores[4].opciones = this.comboAcreditaciones;
        if (this.comboAcreditaciones.find(el => el.value == this.datos.selectores.find(el => el.id == 'acreditacion').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'acreditacion').value = '';
        }
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
        if (this.comboPrisiones.find(el => el.value == this.datos.selectores.find(el => el.id == 'prision').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'prision').value = '';
        }
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
        if (this.comboMotivosCambio.find(el => el.value == this.datos.selectores.find(el => el.id == 'motivoCambio').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'motivoCambio').value = '';
        }
      }
    );
  }

  fillFecha(event) {

    this.datos.datePicker.value = event;

    if (event == undefined || event == null || event == '') {
      this.datos.inputs1[1].value = '';
      this.datos.inputs1[2].value = '';
    } else {
      this.getLetradoActuacion();
    }
  }

  establecerDatosInicialesNuevaAct() {
    this.datos.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '').replace('/', '');
    this.datos.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputNig.value = this.actuacionDesigna.designaItem.nig;
    this.datos.datePicker.value = new Date();
    this.datos.inputNumPro.value = this.actuacionDesigna.designaItem.numProcedimiento;
    this.datos.selectores[0].value = this.actuacionDesigna.designaItem.idJuzgado;
    this.datos.selectores[1].value = this.actuacionDesigna.designaItem.idPretension;
    this.datos.selectores[3].value = this.actuacionDesigna.designaItem.idProcedimiento;
    this.comprobacionesCombos();
  }

  establecerDatosInicialesEditAct() {
    this.datos.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '').replace('/', '');
    this.datos.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.datePicker.value = new Date(this.actuacionDesigna.actuacion.fechaActuacion.split('/').reverse().join('-'));
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
    this.comprobacionesCombos();
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

      this.progressSpinner = true;

      let params = new ActuacionDesignaItem();

      params.idTurno = this.actuacionDesigna.designaItem.idTurno;
      params.anio = this.actuacionDesigna.designaItem.ano.split('/')[0].replace('D', '');
      params.numero = this.actuacionDesigna.designaItem.numero;
      params.fechaActuacion = this.datePipe.transform(new Date(this.datos.datePicker.value), 'dd/MM/yyyy');
      params.idJuzgado = this.datos.selectores.find(el => el.id == 'juzgado').value;
      params.idProcedimiento = this.datos.selectores.find(el => el.id == 'modulo').value;
      params.observaciones = this.datos.textarea.value;
      params.talonario = this.datos.inputs1[3].value;
      params.talon = this.datos.inputs1[4].value;
      params.nig = this.datos.inputNig.value;
      params.numProcedimiento = this.datos.inputNumPro.value;
      params.idPretension = this.datos.selectores.find(el => el.id == 'procedimiento').value;
      params.idMotivoCambio = this.datos.selectores.find(el => el.id == 'motivoCambio').value;
      params.idAcreditacion = this.datos.selectores.find(el => el.id == 'acreditacion').value;
      params.idPrision = this.datos.selectores.find(el => el.id == 'prision').value;
      params.idPersonaColegiado = this.idPersonaColegiado;

      this.sigaServices.post("actuaciones_designacion_guardar", params).subscribe(
        data => {
          let resp = JSON.parse(data.body);

          if (resp.status == 'OK' || (resp.status == 'KO' && resp.error != null && resp.error.code == 400)) {
            this.buscarActEvent.emit(resp.id);
            sessionStorage.setItem("refreshDataAct", JSON.stringify(params));
          }

          if (resp.status == 'KO' && resp.error != null && resp.error.description != null) {
            this.showMsg('error', 'Error', this.translateService.instant(resp.error.description.toString()));
          } else {
            this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
        },
        () => {
          this.progressSpinner = false;
        }
      );

    }
  }

  editarEvent() {
    if (!this.compruebaCamposObligatorios()) {

      this.progressSpinner = true;

      let params = new ActuacionDesignaItem();

      params.idTurno = this.actuacionDesigna.designaItem.idTurno;
      params.anio = this.actuacionDesigna.designaItem.ano.split('/')[0].replace('D', '');
      params.numero = this.actuacionDesigna.designaItem.numero;
      params.fechaActuacion = this.datePipe.transform(new Date(this.datos.datePicker.value), 'dd/MM/yyyy');
      params.idJuzgado = this.datos.selectores.find(el => el.id == 'juzgado').value;
      params.idProcedimiento = this.datos.selectores.find(el => el.id == 'modulo').value;
      params.observaciones = this.datos.textarea.value;
      params.talonario = this.datos.inputs1[3].value;
      params.talon = this.datos.inputs1[4].value;
      params.nig = this.datos.inputNig.value;
      params.numProcedimiento = this.datos.inputNumPro.value;
      params.idPretension = this.datos.selectores.find(el => el.id == 'procedimiento').value;
      params.idMotivoCambio = this.datos.selectores.find(el => el.id == 'motivoCambio').value;
      params.idAcreditacion = this.datos.selectores.find(el => el.id == 'acreditacion').value;
      params.idPrision = this.datos.selectores.find(el => el.id == 'prision').value;
      params.idPersonaColegiado = this.idPersonaColegiado;
      params.numeroAsunto = this.actuacionDesigna.actuacion.numeroAsunto;

      this.sigaServices.post("actuaciones_designacion_editar", params).subscribe(
        data => {
          let resp = JSON.parse(data.body);

          if (resp.status == 'OK' || (resp.status == 'KO' && resp.error != null && resp.error.code == 400)) {
            this.buscarActEvent.emit(resp.id);
            sessionStorage.setItem("refreshDataAct", JSON.stringify(params));
          }

          if (resp.status == 'KO' && resp.error != null && resp.error.description != null) {
            this.showMsg('error', 'Error', this.translateService.instant(resp.error.description.toString()));
          } else {
            this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
        },
        () => {
          this.progressSpinner = false;
        }
      );

    }
  }

  compruebaCamposObligatorios() {

    let error = false;

    let juzgado = this.datos.selectores.find(el => el.id == 'juzgado');
    let modulo = this.datos.selectores.find(el => el.id == 'modulo');
    let acreditacion = this.datos.selectores.find(el => el.id == 'acreditacion');

    if (!this.validarNig(this.datos.inputNig.value)) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), 'Formato del campo NIG inválido');
      error = true;
    }

    if (!error && !this.validarNProcedimiento(this.datos.inputNumPro.value)) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), 'Formato del campo Nº Procedimiento inválido');
      error = true;
    }

    if (!error && (this.datos.datePicker.value == undefined || this.datos.datePicker.value == null)) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
      error = true;
    }

    if (!error && (juzgado.value == undefined || juzgado.value == null || (typeof juzgado.value == 'string' && juzgado.value == ''))) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
      error = true;
    }

    if (!error && (modulo.value == undefined || modulo.value == null || (typeof modulo.value == 'string' && modulo.value == ''))) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
      error = true;
    }

    if (!error && (acreditacion.value == undefined || acreditacion.value == null || (typeof acreditacion.value == 'string' && acreditacion.value == ''))) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
      error = true;
    }

    if (!error && (this.datos.inputs1[1].value == undefined || this.datos.inputs1[1].value == null || this.datos.inputs1[1].value == '')) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.camposObligatorios'));
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
      if (nig != '' && nig != null) {
        var objRegExp = /^[0-9]{7}[S,C,P,O,I,V,M,6,8,1,2,3,4]{1}(19|20)\d{2}[0-9]{7}$/;
        var ret = objRegExp.test(nig);
        response = ret;
      }
      else
        response = true;
    } else {
      if (nig != '' && nig != null && nig.length == 19) {
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
      if (nProcedimiento != '' && nProcedimiento != null) {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        var ret = objRegExp.test(nProcedimiento);
        response = ret;
      }
      else
        response = true;
    } else {
      if (nProcedimiento != '' && nProcedimiento != null && nProcedimiento.length == 19) {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}[/]$/;
        var ret = objRegExp.test(nProcedimiento);
        response = ret;
      } else {
        response = true;
      }
    }


    return response;

  }

  getLetradoActuacion() {

    if (this.datos.datePicker.value != undefined && this.datos.datePicker.value != null && this.datos.datePicker.value != '') {

      this.progressSpinner = true;

      let params = {
        anio: this.actuacionDesigna.designaItem.ano.split('/')[0].replace('D', ''),
        numero: this.actuacionDesigna.designaItem.numero,
        clave: this.actuacionDesigna.designaItem.idTurno,
        fechaActuacion: this.datePipe.transform(new Date(this.datos.datePicker.value), 'dd/MM/yyyy')
      };

      this.sigaServices.post("actuaciones_designacion_getLetradoDesigna", params).subscribe(
        data => {
          let resp = JSON.parse(data.body);

          if (resp.error != null && resp.error.descripcion != null) {
            this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
          } else {
            if (resp.listaLetradosDesignaItem.length > 0) {

              if ((this.isColegiado && resp.listaLetradosDesignaItem[0].numeroColegiado == this.usuarioLogado.numColegiado) || !this.isColegiado) {
                this.datos.inputs1[1].value = resp.listaLetradosDesignaItem[0].numeroColegiado;
                this.datos.inputs1[2].value = resp.listaLetradosDesignaItem[0].colegiado;
                this.idPersonaColegiado = resp.listaLetradosDesignaItem[0].idPersona;
              } else {
                this.datos.inputs1[1].value = '';
                this.datos.inputs1[2].value = '';
                this.datos.datePicker.value = '';
                this.idPersonaColegiado = '';
                this.showMsg('error', 'Error', 'Debe seleccionar un fecha en la que sea letrado');
              }

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
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("datosIniActuDesignaDatosGen");
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => { this.institucionActual = n.value });
  }

  onChangeSelector(selector) {

    if (selector.id == 'juzgado') {
      if (selector.value == undefined || selector.value == null || (typeof selector.value == 'string' && selector.value == '')) {
        this.datos.selectores.find(el => el.id == 'modulo').disabled = true;
        this.datos.selectores.find(el => el.id == 'acreditacion').disabled = true;
      } else {
        this.datos.selectores.find(el => el.id == 'modulo').disabled = false;
        this.cargaModulosPorJuzgado(this.datos.selectores.find(el => el.id == 'juzgado').value);
      }
      this.datos.selectores.find(el => el.id == 'modulo').value = '';
      this.datos.selectores.find(el => el.id == 'acreditacion').value = '';
    } else if (selector.id == 'modulo') {
      if (selector.value == undefined || selector.value == null || (typeof selector.value == 'string' && selector.value == '')) {
        this.datos.selectores.find(el => el.id == 'acreditacion').disabled = true;
      } else {
        this.datos.selectores.find(el => el.id == 'acreditacion').disabled = false;
        this.cargaAcreditacionesPorModulo(this.datos.selectores.find(el => el.id == 'modulo').value);
      }
      this.datos.selectores.find(el => el.id == 'acreditacion').value = '';
    }
  }

  comprobacionesCombos() {

    let juzgado = this.datos.selectores.find(el => el.id == 'juzgado');
    let modulo = this.datos.selectores.find(el => el.id == 'modulo');
    let acreditacion = this.datos.selectores.find(el => el.id == 'acreditacion');

    if (juzgado.value == undefined || juzgado.value == null || (typeof juzgado.value == 'string' && juzgado.value == '')) {
      modulo.disabled = true;
      acreditacion.disabled = true;
    } else if (modulo.value == undefined || modulo.value == null || (typeof modulo.value == 'string' && modulo.value == '')) {
      acreditacion.disabled = true;
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.actuacionDesigna != undefined && changes.actuacionDesigna.currentValue) {

      sessionStorage.setItem("datosIniActuDesignaDatosGen", JSON.stringify(this.actuacionDesigna));

      if (!this.actuacionDesigna.isNew) {
        this.establecerDatosInicialesEditAct();
      }

    }

  }

  marcaObligatorio(selector) {

    let resp = false;

    if (selector.obligatorio && (selector.value == undefined || selector.value == null || (typeof selector.value == 'string' && selector.value == ''))) {
      resp = true;
    }

    return resp;
  }

}
