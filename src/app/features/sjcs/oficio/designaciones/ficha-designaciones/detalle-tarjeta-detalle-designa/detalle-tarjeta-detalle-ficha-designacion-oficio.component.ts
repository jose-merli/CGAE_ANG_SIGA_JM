import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { ControlAccesoDto } from '../../../../../../models/ControlAccesoDto';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
import { ParametroDto } from '../../../../../../models/ParametroDto';
import { ParametroRequestDto } from '../../../../../../models/ParametroRequestDto';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../../../models/sjcs/ActuacionDesignaObject';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { MultiSelect } from 'primeng/primeng';

@Component({
  selector: 'app-detalle-tarjeta-detalle-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-detalle-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-detalle-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDetalleFichaDesignacionOficioComponent implements OnInit {
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  nuevaDesigna: any;
  valorParametro: any;
  valorParametroNIG: any;
  searchParametros: ParametroDto = new ParametroDto();
  searchParametrosFormatoNProcedimiento: ParametroDto = new ParametroDto();
  datosBuscar: any[];
  estado: any;
  tieneLetradoAsignado: boolean = false;
  actuacionesNoFacturada: ActuacionDesignaItem[] = [];
  actuacionDesigna: ActuacionDesignaItem[] = [];
  disableFinalizar: boolean = false;
  disableAnular: boolean = false;
  disableReactivar: boolean = false;
  disableRestablecer: boolean = false;
  disableGuardar: boolean = false;
  estadoAnterior: any;
  initDelitos: any;
  delitosValue: string[] = [];
  delitosOpciones: any;
  estadoValue: any;
  estadosOpciones: any;
  juzgadoValue: any;
  juzgadoOpciones: any;
  procedimientoValue: any;
  procedimientoOpciones: any[] = [];
  parametroNIG: any;
  moduloValue: any;
  moduloOpciones: any[] = [];parametroNProc: any;
;
  disableEstado: boolean = false;
  institucionActual: String;
  isLetrado: boolean;
  @Input() campos;
  @Output() refreshData = new EventEmitter<DesignaItem>();
  datosInicial: any;
  esColegiado: boolean = false;
  anio: any;
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} delitos seleccionados";
  asuntoValue:string;

  inputs = [
    { nombre: this.translateService.instant('justiciaGratuita.sjcs.designas.DatosIden.NIG'), value: "" },
    { nombre: this.translateService.instant('gratuita.busquedaDesignas.literal.numProcedimiento'), value: "" }
  ];

  datePickers = [
    {
      nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado'),
      value: ""
    },
    {
      nombre:  this.translateService.instant('justiciaGratuita.guardia.fichaasistencia.fechacierre'),
      value: ""
    }
  ];


  constructor(private sigaServices: SigaServices, private datepipe: DatePipe, private commonsService: CommonsService, private confirmationService: ConfirmationService, private translateService: TranslateService) { }

  ngOnInit() {
    this.getNigValidador();
    this.getNprocValidador();
    this.datosInicial = this.campos;
    this.initDelitos = this.delitosValue;
    this.estadosOpciones = [
      { label: 'Activo', value: 'V' },
      { label: 'Finalizado', value: 'F' },
      { label: 'Anulada', value: 'A' }];
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    this.getComboJuzgados();

    let parametroCombo = {
      valor: "CONFIGURAR_COMBO_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametroCombo)
      .subscribe(
        data => {
          this.valorParametro = JSON.parse(data.body).parametro;

          if (!this.nuevaDesigna) {
            this.inputs[0].value = this.campos.nig;
            this.inputs[1].value = this.campos.numProcedimiento;
            this.asuntoValue = this.campos.resumenAsunto;
            this.estadoValue = this.campos.sufijo;
            this.disableEstado = true;
            this.juzgadoValue = this.campos.idJuzgado;
            // if (this.campos.delitos && this.campos.delitos != null) {
            //   this.delitosValue = this.campos.delitos.split(',');
            // } else {
            //   this.delitosValue = this.campos.delitos;
            // }
            this.procedimientoValue = this.campos.idProcedimiento;
            this.moduloValue = this.campos.idModulo;
            this.datePickers[0].value = this.formatDate(this.campos.fechaEstado);
            this.datePickers[1].value = this.formatDate(this.campos.fechaFin);
            if (this.valorParametro == 1) {
              this.getComboProcedimientosConJuzgado(this.juzgadoValue);
              if (this.procedimientoValue != null && this.procedimientoValue != "" && this.procedimientoValue != undefined) {
                this.getcCmboModulosConProcedimientos(this.procedimientoValue, this.datosInicial.fechaEntradaInicio);
              }
            }
            if (this.valorParametro == 2) {
              this.getComboModulosConJuzgado(this.juzgadoValue, this.datosInicial.fechaEntradaInicio);
              if (this.moduloValue != null && this.moduloValue != "" && this.moduloValue != undefined) {
                this.getComboProcedimientosConModulo(this.moduloValue);
              }
            }
            if (this.valorParametro == 3) {
              this.getComboModulosConJuzgado(this.juzgadoValue, this.datosInicial.fechaEntradaInicio);
              this.getComboProcedimientos();
            }
            if (this.valorParametro == 4) {
              this.getComboProcedimientosConJuzgado(this.juzgadoValue);
              this.getComboModulos();
            }
            if (this.valorParametro == 5) {
              this.getComboProcedimientos();
              this.getComboModulos();
            }


            // Añadir el Procedimiento y Modulo en caso que vengan con datos al buscar designaciones_busquedaProcedimiento.
            if (this.campos.nombreProcedimiento != "" && this.campos.nombreProcedimiento != null && this.campos.nombreProcedimiento != undefined) {
              this.procedimientoOpciones.push({ label: this.campos.nombreProcedimiento, value: this.campos.idPretension });
            }
            if (this.campos.modulo != "" && this.campos.modulo != null && this.campos.modulo != undefined) {
              this.moduloOpciones.push({ label: this.campos.modulo, value: this.campos.idModulo });
            }





            // this.moduloOpciones.forEach(element => {
            //   if(element.valu)
            // });


            // this.procedimientoOpciones.value includes();
           

            this.checkAcceso();
            if (this.campos.estado == 'Activo') {
              if (this.esColegiado) {
                this.disableAnular = true;
                this.disableFinalizar = true;
              } else {
                this.disableFinalizar = false;
                if (this.ningunaActuacionesFacturada(this.campos)) {
                  this.disableAnular = false;
                } else {
                  this.disableAnular = true;
                }
              }
              this.disableReactivar = true;
            } else if (this.campos.estado == 'Finalizado') {
              if (this.esColegiado) {
                this.disableReactivar = true;
              } else {
                this.disableReactivar = false;
              }
              this.disableFinalizar = true;
              //this.disableAnular = true;
            } else if (this.campos.estado == 'Anulada') {
              this.disableAnular = true;
              this.disableFinalizar = true;
              if (this.esColegiado) {
                this.disableReactivar = true;
              } else {
                this.disableReactivar = false;
              }
            }
            this.disableRestablecer = false;
          } else {
            this.datePickers[0].value = this.formatDate(new Date());

            this.getComboJuzgados();

            this.disableAnular = true;
            this.disableFinalizar = true;
            this.disableReactivar = true;
            this.disableRestablecer = false;
          }
          let designaUpdate = new DesignaItem();
          designaUpdate.ano = this.campos.anio;
          designaUpdate.idTurno = this.campos.idTurno;
          designaUpdate.numero = this.campos.numero;
          this.getComboDelitos(designaUpdate);

        },
        err => {
          //console.log(err);
        },
        () => {
        }
      );

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });


    this.sigaServices.get('getLetrado').subscribe(
      (data) => {
        if (data.value == 'S') {
          this.isLetrado = true;
        } else {
          this.isLetrado = false;
        }
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  formatDate(date) {
    if (date != undefined && (!this.isString(date) || this.isString(date) && !date.includes("/"))) {
      const pattern = 'dd/MM/yyyy';
      return this.datepipe.transform(date, pattern);
    } else {
      return date;
    }
  }

  isString(value): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  changeJuzgado() {
    if (this.valorParametro == 1) {
      this.getComboProcedimientosConJuzgado(this.juzgadoValue);
      if (this.procedimientoValue != null && this.procedimientoValue != "" && this.procedimientoValue != undefined) {
        this.getcCmboModulosConProcedimientos(this.procedimientoValue, this.datosInicial.fechaEntradaInicio);
      }

    }
    if (this.valorParametro == 2) {
      this.getComboModulosConJuzgado(this.juzgadoValue, this.datosInicial.fechaEntradaInicio);
      if (this.moduloValue != null && this.moduloValue != "" && this.moduloValue != undefined) {
        this.getComboProcedimientosConModulo(this.moduloValue);
      }
    }
    if (this.valorParametro == 3) {
      this.getComboModulosConJuzgado(this.juzgadoValue, this.datosInicial.fechaEntradaInicio);
      this.getComboProcedimientos();
    }
    if (this.valorParametro == 4) {
      this.getComboProcedimientosConJuzgado(this.juzgadoValue);
      this.getComboModulos();
    }
    if (this.valorParametro == 5) {
      this.getComboProcedimientos();
      this.getComboModulos();
    }
  }

  changeModulo() {
    if (this.valorParametro == 2) {
      this.getComboProcedimientosConModulo(this.moduloValue);
    }
  }

  changeProcedimiento() {
    if (this.valorParametro == 1) {
      this.getcCmboModulosConProcedimientos(this.procedimientoValue, this.datosInicial.fechaEntradaInicio);
    }
  }

  showMsg(severity, summary, detail) {
    this.progressSpinner = true;
    this.msgs = [];
    let designaUpdate = new DesignaItem();
    let anio = this.campos.ano.split("/");
    designaUpdate.ano = Number(anio[0].substring(1, 5));
    designaUpdate.numero = this.campos.numero;
    designaUpdate.idTurno = this.campos.idTurno;
    designaUpdate.nombreInteresado = this.campos.nombreInteresado;
    designaUpdate.numColegiado = this.campos.numColegiado;
    designaUpdate.validada = this.campos.validada;
    //Guardar
    if (detail == "Guardar") {
      designaUpdate.estado = "";
      let validaProcedimiento = true;
      let validaNig = true;
      designaUpdate.nig = this.inputs[0].value;
      designaUpdate.numProcedimiento = this.inputs[1].value;
      designaUpdate.resumenAsunto = this.asuntoValue
      designaUpdate.idJuzgado = this.juzgadoValue;
      // designaUpdate.idPretension = this.procedimientoValue;
      designaUpdate.idPretension = this.campos.idPretension;
      designaUpdate.idProcedimiento = this.moduloValue;

      if (this.delitosValue == undefined || this.delitosValue == null || this.delitosValue.length == 0) {
        designaUpdate.delitos = null;
      } else if (this.delitosValue.length == 1) {
        designaUpdate.delitos = this.delitosValue.toString() + ",";
      }
      else {
        designaUpdate.delitos = this.delitosValue.toString();
      }

      if (this.datePickers[0].value == null) {
        designaUpdate.fechaEstado = null;
      } else {

        designaUpdate.fechaEstado = new Date(this.datePickers[0].value.split('/').reverse().join('-'));
      }
      if (this.datePickers[1].value == null) {
        designaUpdate.fechaFin = null;
      } else {
        designaUpdate.fechaFin = new Date(this.datePickers[1].value);
      }

      if (this.estadoValue == "Finalizada") {
        designaUpdate.estado = "F";
      } else if (this.estadoValue == "Activo") {
        designaUpdate.estado = "V";
      } else if (this.estadoValue == "Anulada") {
        designaUpdate.estado = "A";
      } else if (this.estadoValue) {
        designaUpdate.estado = this.estadoValue[0];
      }
      if(designaUpdate.nig != "" && designaUpdate.nig!= undefined){
        if(!this.validarNig(designaUpdate.nig)){
          validaNig = false;
        }
      }
      if (designaUpdate.numProcedimiento != "" && designaUpdate.numProcedimiento != undefined) {
        if(!this.validarNProcedimiento(designaUpdate.numProcedimiento)){
          validaProcedimiento = false;
          
          let severity = "error";
          let summary = this.translateService.instant('justiciaGratuita.oficio.designa.numProcedimientoNoValido');;
          let detail = "";
          this.msgs.push({
            severity,
            summary,
            detail
          });
        }
      }

      if (validaProcedimiento && validaNig) {
        designaUpdate.fechaAnulacion = new Date();
        this.checkDesignaJuzgadoProcedimiento(designaUpdate);
      }
      this.progressSpinner = false;
    }
    //ANULAR
    if (detail == "Anular") {
      this.progressSpinner = false;
      designaUpdate.estado = "A";
      designaUpdate.fechaAnulacion = null;
      designaUpdate.fechaEstado = new Date();
      let mess = "Está seguro de querer Anular la designación. Las actuaciones asociadas también serán anuladas de forma automática.¿Desea continuar?";
      let icon = "fa fa-question-circle";
      let keyConfirmation = "confirmAnular";
      this.confirmationService.confirm({
        key: keyConfirmation,
        message: mess,
        icon: icon,
        accept: () => {
          this.progressSpinner = true;
          this.tieneLetrado(this.campos, designaUpdate);
        },
        reject: () => {
          this.progressSpinner = false;
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }
    //FINALIZAR
    if (detail == "Finalizar") {
      designaUpdate.estado = "F";
      designaUpdate.fechaAnulacion = null;
      designaUpdate.fechaEstado = new Date();
      this.updateDetalle(designaUpdate);
    }
    //REACTIVAR
    if (detail == "Reactivar") {
      this.estadoAnterior = this.estadoValue;
      designaUpdate.estado = "V";
      designaUpdate.fechaEstado = new Date();
      designaUpdate.fechaAnulacion = null;
      this.ningunaActuacionesFacturada(this.campos);
      this.updateDetalle(designaUpdate);
    }
    //RESTABLECER
    if (detail == "Restablecer") {
      if (!this.nuevaDesigna) {
        this.procedimientoOpciones = [];
        this.moduloOpciones = [];
        this.inputs[0].value = this.datosInicial.nig;
        this.inputs[1].value = this.datosInicial.numProcedimiento;
        this.asuntoValue = this.datosInicial.observaciones;
        this.datePickers[0].value = this.formatDate(this.datosInicial.fechaEstado);
        this.delitosValue = this.initDelitos;
        let designaUpdate = new DesignaItem();
        designaUpdate.ano = this.datosInicial.anio;
        designaUpdate.idTurno = this.datosInicial.idTurno;
        designaUpdate.numero = this.datosInicial.numero;
        this.getComboDelitos(designaUpdate);
        if (this.datosInicial.fechaFin == 0) {
          this.datePickers[1].value = null;
        } else {
          this.datePickers[1].value = this.datosInicial.fechaFin;
        }
        this.getComboJuzgados();
        this.estadoValue = this.datosInicial.sufijo;
        this.disableEstado = true;
        this.juzgadoValue = this.datosInicial.idJuzgado;
        this.procedimientoValue = this.datosInicial.idProcedimiento;
        this.moduloValue = this.datosInicial.idModulo;
      } else {
        this.procedimientoOpciones = [];
        this.moduloOpciones = [];
        this.inputs[0].value = "";
        this.inputs[1].value = "";
        this.asuntoValue = "";
        this.estadoValue = "";
        this.disableEstado = true;
        this.juzgadoValue = "";
        this.procedimientoValue = "";
        this.moduloValue = "";
        this.disableAnular = true;
        this.disableFinalizar = true;
        this.disableReactivar = true;
        this.disableRestablecer = false;
        this.getComboJuzgados();
        let designaUpdate = new DesignaItem();
        designaUpdate.ano = this.datosInicial.anio;
        designaUpdate.idTurno = this.datosInicial.idTurno;
        designaUpdate.numero = this.datosInicial.numero;
        this.getComboDelitos(designaUpdate);
        this.delitosValue = [];
        this.estadosOpciones = [
          { label: 'Activo', value: 'V' },
          { label: 'Finalizado', value: 'F' },
          { label: 'Anulada', value: 'A' }];
      }

    }
  }

  clear() {
    this.msgs = [];
  }

  fillFechaHastaCalendar(event, nombre) {
    if (nombre == "Fecha estado") {
      this.datePickers[0].value = event;
    } else if (nombre = "Fecha cierre") {
      this.datePickers[1].value = event;
    }
  }

  getComboJuzgados() {
    this.progressSpinner = true;
    
    this.sigaServices.post("combo_comboJuzgadoDesignaciones","0").subscribe(
      n => {
        this.juzgadoOpciones = JSON.parse(n.body).combooItems;
        //this.progressSpinner = false;
        // Añadir el Juzgado al buscar designaciones_busquedaProcedimiento.
        if (this.campos.nombreJuzgado != "" && this.campos.nombreJuzgado != null && this.campos.nombreJuzgado != undefined) {
          this.juzgadoOpciones.push({ label: this.campos.nombreJuzgado, value: this.campos.idJuzgado });
        }
        
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.juzgadoOpciones);
        this.juzgadoOpciones.sort( (a, b) => {
          return a.label.localeCompare(b.label);
        });
        this.progressSpinner = false;
      }
    );
  }

  getComboProcedimientos() {
    this.progressSpinner = true;
    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.procedimientoOpciones = n.combooItems;
        if (this.campos.nombreProcedimiento != "") {
          this.procedimientoOpciones.push({ label: this.campos.nombreProcedimiento, value: String(this.campos.idPretension) });
        }
        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.procedimientoOpciones.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.procedimientoOpciones = uniqueArray;
        //this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        if (!this.procedimientoOpciones != null) {
          this.arregloTildesCombo(this.procedimientoOpciones);
        }
        this.progressSpinner = false;
      }
    );
  }

  getComboModulos() {
    this.progressSpinner = true;
    //console.log(this.datosInicial)

    this.sigaServices.getParam("combo_comboModulosDesignaciones", this.buildParams({
      "numero": this.datosInicial.numero,
      "anio": this.datosInicial.anio, "idTurno": this.datosInicial.idTurno
    })).subscribe(
      n => {
        this.moduloOpciones = n.combooItems;
        if (this.campos.modulo != "") {
          this.moduloOpciones.push({ label: this.campos.modulo, value: this.campos.idModulo });
        }
        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.moduloOpciones.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.moduloOpciones = uniqueArray;
        //this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        if (!this.moduloOpciones != null) {
          this.arregloTildesCombo(this.moduloOpciones);
        }
        this.progressSpinner = false;
      }
    );
  }

  getComboDelitos(designaItem) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboDelitos", designaItem).subscribe(
      n => {
        this.delitosOpciones = JSON.parse(n.body).combooItems;
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.delitosOpciones);
        //this.progressSpinner = false;
        this.getDelitosSeleccionados(designaItem);
        
      }
    );
  }

  getComboProcedimientosConJuzgado(idJuzgado) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboProcedimientosConJuzgado", idJuzgado).subscribe(
      n => {
        this.procedimientoOpciones = JSON.parse(n.body).combooItems;
        if (this.campos.nombreProcedimiento != "") {
          this.procedimientoOpciones.push({ label: this.campos.nombreProcedimiento, value: String(this.campos.idPretension) });
        }
        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.procedimientoOpciones.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.procedimientoOpciones = uniqueArray;
        //this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        if (!this.procedimientoOpciones != null) {
          this.arregloTildesCombo(this.procedimientoOpciones);
        }
        this.progressSpinner = false;
      }
    );
  }

  getComboProcedimientosConModulo(idProcedimiento) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboProcedimientosConModulo", idProcedimiento).subscribe(
      n => {
        this.procedimientoOpciones = JSON.parse(n.body).combooItems;
        if (this.campos.nombreProcedimiento != "") {
          this.procedimientoOpciones.push({ label: this.campos.nombreProcedimiento, value: this.campos.idPretension });
        }
        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.procedimientoOpciones.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.procedimientoOpciones = uniqueArray;
        //this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        if (!this.procedimientoOpciones != null) {
          this.arregloTildesCombo(this.procedimientoOpciones);
        }
        this.progressSpinner = false;
      }
    );
  }

  getComboModulosConJuzgado(idJuzgado, fecha) {
    this.progressSpinner = true;
    this.sigaServices.getParam("combo_comboModulosConJuzgado", "?idJuzgado=" + idJuzgado + "&fecha=" + fecha).subscribe(
      n => {
        this.moduloOpciones = n.combooItems;
        if (this.campos.modulo != "") {
          this.moduloOpciones.push({ label: this.campos.modulo, value: this.campos.idModulo });
        }
        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.moduloOpciones.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.moduloOpciones = uniqueArray;
        //this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        if (!this.moduloOpciones != null) {
          this.arregloTildesCombo(this.moduloOpciones);
        }
        this.progressSpinner = false;
      }
    );
  }

  buildParams(params: {}) {
    let result = "?";
    for (const item in params) {
      if (params[item] != undefined) {
        if (result.length > 1) {
          result += `&${item}=${params[item]}`;
        } else {
          result += `${item}=${params[item]}`;
        }
      }
    }

    return result.length > 1 ? result : "";
  }

  getcCmboModulosConProcedimientos(idPretension, fecha) {
    this.progressSpinner = true;
    this.sigaServices.getParam("combo_comboModulosConProcedimientos", "?idPretension=" + idPretension + "&fecha=" + fecha).subscribe(
      n => {
        this.moduloOpciones = JSON.parse(n.body).combooItems;
        if (this.campos.modulo != "") {
          this.moduloOpciones.push({ label: this.campos.modulo, value: this.campos.idModulo });
        }
        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.moduloOpciones.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.moduloOpciones = uniqueArray;
        //this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        if (!this.moduloOpciones != null) {
          this.arregloTildesCombo(this.moduloOpciones);
        }
        this.progressSpinner = false;
      }
    );
  }
  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; e.label != undefined && i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }

  validarNig(nig) {
    let ret = false;
    if (nig != null && nig != '' && this.parametroNIG != undefined) {
      if (this.parametroNIG != null && this.parametroNIG.parametro != "") {
          let valorParametroNIG: RegExp = new RegExp(this.parametroNIG.parametro);
          if (nig != '') {
            if(valorParametroNIG.test(nig)){
              ret = true;
            }else{
              let severity = "error";
                      let summary = this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido");
                      let detail = "";
                      this.msgs.push({
                        severity,
                        summary,
                        detail
                      });

              ret = false
            }
          }
        }
    }
    return ret;
  }

  getNigValidador(){
    let parametro = {
      valor: "NIG_VALIDADOR"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroNIG = JSON.parse(data.body);
        //this.progressSpinner = false;
      });
  }

  getNprocValidador(){
    let parametro = {
      valor: "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroNProc = JSON.parse(data.body);
        //this.progressSpinner = false;
      });
  }

  validarNProcedimiento(nProcedimiento) {
    let ret = false;
    
    if (nProcedimiento != null && nProcedimiento != '' && this.parametroNProc != undefined) {
      if (this.parametroNProc != null && this.parametroNProc.parametro != "") {
          let valorParametroNProc: RegExp = new RegExp(this.parametroNProc.parametro);
          if (nProcedimiento != '') {
            if(valorParametroNProc.test(nProcedimiento)){
              ret = true;
            }else{
              let severity = "error";
                      let summary = this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido");
                      let detail = "";
                      this.msgs.push({
                        severity,
                        summary,
                        detail
                      });

              ret = false
            }
          }
        }
    }

    return ret;
  }

/*
  validarNProcedimiento(nProcedimiento) {
    //Esto es para la validacion de CADENA

    if (this.institucionActual == "2008" || this.institucionActual == "2015" || this.institucionActual == "2029" || this.institucionActual == "2033" || this.institucionActual == "2036" ||
      this.institucionActual == "2043" || this.institucionActual == "2006" || this.institucionActual == "2021" || this.institucionActual == "2035" || this.institucionActual == "2046" || this.institucionActual == "2066") {
      if (nProcedimiento != '') {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        return objRegExp.test(nProcedimiento);
      }
      else
        return true;
    } else {
      let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}$/;
      return objRegExp.test(nProcedimiento);
    }

  }
  */

  updateDetalle(updateDetalle) {
    this.progressSpinner = true;
    if (updateDetalle.idPretension == 0) {
      updateDetalle.idPretension = null;
    }
    updateDetalle.nig =
      this.sigaServices.post("designaciones_updateDetalleDesignacion", updateDetalle).subscribe(
        n => {
          let severity = "success";
          let summary = "Modificado correctamente";
          let detail = ""
          this.msgs.push({
            severity,
            summary,
            detail
          });
          updateDetalle.ano = this.campos.ano;
          updateDetalle.fechaEntradaInicio = this.campos.fechaEntradaInicio;
          this.estadoValue = [updateDetalle.estado];
          this.datePickers[0].value = this.formatDate(updateDetalle.fechaEstado);
          updateDetalle.nig = this.inputs[0].value;
          updateDetalle.numProcedimiento = this.inputs[1].value;
          updateDetalle.asuntoResumen = this.asuntoValue
          let aux = this.juzgadoValue;
          if (aux != null && aux != undefined && aux != "") {
            this.juzgadoOpciones.forEach(el => {
              if (el.value == aux) {
                updateDetalle.nombreJuzgado = el.label;
              }
            });
          }
          aux = this.procedimientoValue;
          if (aux != null && aux != undefined && aux != "") {
            this.procedimientoOpciones.forEach(el => {
              if (el.value == aux) {
                updateDetalle.nombreProcedimiento = el.label;
              }
            });
          }
          aux = this.moduloValue;
          if (aux != null && aux != undefined && aux != "") {
            this.moduloOpciones.forEach(el => {
              if (el.value == aux) {
                updateDetalle.modulo = el.label;
              }
            });
          }
          if (this.estadoValue == 'V') {
            if (this.esColegiado) {
              this.disableAnular = true;
              this.disableFinalizar = true;
            } else {
              this.disableFinalizar = false;
              if (this.ningunaActuacionesFacturada(this.campos)) {
                this.disableAnular = false;
              } else {
                this.disableAnular = true;
              }
            }
            this.disableReactivar = true;
          } else if (this.estadoValue == 'F') {
            if (this.esColegiado) {
              this.disableReactivar = true;
            } else {
              this.disableReactivar = false;
            }
            this.disableFinalizar = true;
            //this.disableAnular = true;
          } else if (this.estadoValue == 'A') {
            this.disableAnular = true;
            this.disableFinalizar = true;
            if (this.esColegiado) {
              this.disableReactivar = true;
            } else {
              this.disableReactivar = false;
            }
          }
          this.disableRestablecer = false;
          updateDetalle.rol = [this.estadoAnterior];

          this.disableRestablecer = false;
          this.refreshData.emit(updateDetalle);
        },
        err => {
          this.progressSpinner = false;
          let severity = "error";
          let summary;
          if (err.status == 400) {
            summary = this.translateService.instant('general.mensaje.error.bbdd');
          } else {
            summary = "No se ha podido modificar correctamente";
          }
          let detail = "";
          this.msgs.push({
            severity,
            summary,
            detail
          });
        }, () => {
          this.progressSpinner = false;
        });;
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.designa;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        this.esColegiado = true;
        if (derechoAcceso == 3) { //es colegio
          this.esColegiado = false;
        } else if (derechoAcceso == 2) {//es colegiado
          this.esColegiado = true;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  checkDesignaJuzgadoProcedimiento(designaItem) {
    this.sigaServices.post("designaciones_existeDesignaJuzgadoProcedimiento", designaItem).subscribe(
      n => {
        this.progressSpinner = false;
        if (JSON.parse(n.body).existeDesignaJuzgadoProcedimiento > 1) {
          let mess = "Atención: Ya existe una designación con el mismo número de procedimiento y juzgado.¿Desea continuar?";
          let icon = "fa fa-question-circle";
          let keyConfirmation = "confirmGuardar";
          this.confirmationService.confirm({
            key: keyConfirmation,
            message: mess,
            icon: icon,
            accept: () => {
              this.progressSpinner = true;
              this.updateDetalle(designaItem);
            },
            reject: () => {
              this.progressSpinner = false;
              this.msgs = [
                {
                  severity: "info",
                  summary: "Cancel",
                  detail: this.translateService.instant(
                    "general.message.accion.cancelada"
                  )
                }
              ];
            }
          });
        } else {
          this.updateDetalle(designaItem);
        }

      },
      err => {
        this.progressSpinner = false;
        let severity = "error";
        let summary = "No se ha podido guardar el detalle de la designación";
        let detail = "";
        this.msgs.push({
          severity,
          summary,
          detail
        });
        //console.log(err);
      }, () => {
        this.progressSpinner = false;
      });;
  }

  async ningunaActuacionesFacturada(element): Promise<boolean> {
    let resultado: boolean = false;
    const params = {
      anio: element.factConvenio,
      idTurno: element.idTurno,
      numero: element.numero,
      historico: false
    };
    this.progressSpinner = false;
    await this.sigaServices.post("actuaciones_designacion", params).toPromise().then(
      data => {
        let object: ActuacionDesignaObject = JSON.parse(data.body);
        let resp = object.actuacionesDesignaItems;
        let facturadas = 0;
        resp.forEach(el => {
          this.actuacionDesigna.push(el);
          if (el.facturado) {
            facturadas += 1;
          } else if (!el.facturado) {
            this.actuacionesNoFacturada.push(el);
          }
        });
        this.activarActuaciones(this.actuacionDesigna);
        if (facturadas == 0) {
          resultado = true;
        } else {
          resultado = false;
        }
      }
    ).catch(error => {
      console.error(error);
      this.progressSpinner = false;
      let severity = "error";
      let summary = "No se ha podido guardar el detalle de la designación";
      let detail = "";
      this.msgs.push({
        severity,
        summary,
        detail
      });
    });
    return resultado;
  }

  tieneLetrado(element, designaUpdate) {
    designaUpdate.estado = "A";
    designaUpdate.fechaEstado = new Date();
    designaUpdate.fechaAnulacion = null;
    //Buscamos los letrados asociados a la designacion
    this.progressSpinner = true;
    let institucionActual;
    let resquestLetrado = [element.ano, element.idTurno, element.numero];
    this.sigaServices.post("designaciones_busquedaLetradosDesignacion", resquestLetrado).subscribe(
      data => {
        this.progressSpinner = false;
        let letrados = JSON.parse(data.body);
        if (letrados.length > 0) {
          if (!element.idPersona) {
            element.idPersona = letrados[0].idPersona;
          }
          this.tieneLetradoAsignado = true;
          let mess = "Si desea introducir una compensación al letrado designado pulse Aceptar, en caso contrario Cancelar";
          let icon = "fa fa-question-circle";
          let keyConfirmation = "confirmGuardarCompensacion";
          this.confirmationService.confirm({
            key: keyConfirmation,
            message: mess,
            icon: icon,
            accept: () => {
              let saltos = [];
              let salto = new SaltoCompItem();
              salto.fecha = this.formatDate(new Date());
              salto.idPersona = element.idPersona;
              salto.idTurno = element.idTurno;
              salto.motivo = "";
              salto.saltoCompensacion = "C";
              saltos.push(salto);
              this.sigaServices.post("saltosCompensacionesOficio_guardar", saltos).subscribe(
                result => {

                  const resp = JSON.parse(result.body);

                  if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
                    this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                  }

                  if (resp.status == 'OK') {
                    if (this.actuacionesNoFacturada.length > 0) {
                      this.eliminarActuacionesNoFacturadas(this.actuacionesNoFacturada, designaUpdate);
                    } else {
                      this.updateDetalle(designaUpdate);
                    }
                  }
                },
                error => {
                  this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                }
              );
            },
            reject: () => {
              if (this.actuacionesNoFacturada.length > 0) {
                this.eliminarActuacionesNoFacturadas(this.actuacionesNoFacturada, designaUpdate);
              } else {
                this.updateDetalle(designaUpdate);
              }
            }
          });

        } else {
          if (this.actuacionesNoFacturada.length > 0) {
            this.eliminarActuacionesNoFacturadas(this.actuacionesNoFacturada, designaUpdate);
          } else {
            this.updateDetalle(designaUpdate);
          }
        }

      },
      err => {
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
        let severity = "error";
        let summary = "No se ha podido modificar correctamente";
        let detail = ""
        this.msgs.push({
          severity,
          summary,
          detail
        });
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  eliminarActuacionesNoFacturadas(actuacionesRequest, designaUpdate) {
    this.sigaServices.post("actuaciones_designacion_eliminar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.updateDetalle(designaUpdate);
        }

        if (resp.error != null && resp.error.descripcion != null) {

          if (resp.error.code == '500') this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));

        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }
  activarActuaciones(actuacionesRequest) {
    this.sigaServices.post("actuaciones_designacion_reactivar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  focusInputField(someDropdown: MultiSelect) {
    someDropdown.filterInputChild.nativeElement.focus();
  }

  getDelitosSeleccionados(designaItem) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_delitosDesigna", designaItem).subscribe(
      n => {
        let resp = JSON.parse(n.body);
        this.progressSpinner = false;

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        } else {
          let opcioneSeleccionadas = resp.lista;
          this.delitosValue = opcioneSeleccionadas;
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

}
