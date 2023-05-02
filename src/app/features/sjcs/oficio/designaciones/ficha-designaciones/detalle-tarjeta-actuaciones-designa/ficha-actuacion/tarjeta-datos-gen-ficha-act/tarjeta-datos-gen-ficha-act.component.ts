import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Message, SelectItem } from 'primeng/components/common/api';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../../../../../../commons/translate';
import { ActuacionDesignaItem } from '../../../../../../../../models/sjcs/ActuacionDesignaItem';
import { ParametroItem } from '../../../../../../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../../../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../../../../../siga-storage.service';
import { UsuarioLogado } from '../ficha-actuacion.component';
import { DesignaItem } from '../../../../../../../../models/sjcs/DesignaItem';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

export interface ComboItemAcreditacion {
  label: string;
  value: any;
  obligaNigNumPro: boolean;
}

@Component({
  selector: 'app-tarjeta-datos-gen-ficha-act',
  templateUrl: './tarjeta-datos-gen-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-gen-ficha-act.component.scss']
})
export class TarjetaDatosGenFichaActComponent implements OnInit, OnChanges, OnDestroy {

  comboJuzgados: SelectItem[] = [];
  comboProcedimientos: SelectItem[] = [];
  comboModulos: SelectItem[] = [];
  comboAcreditaciones: ComboItemAcreditacion[] = [];
  comboPrisiones: SelectItem[] = [];
  comboMotivosCambio: SelectItem[] = [];

  parametroConfigCombos: any;

  valorFormatoProc: string;

  @Input() institucionActual;
  @Input() isAnulada: boolean;
  @Input() usuarioLogado: UsuarioLogado;
  @Input() isColegiado: boolean;
  // Este modo lectura se produce cuando:
  // - Es colegiado y la actuación está validada y el turno no permite la modificación o la actuación no pertenece al colegiado
  // - La actuación está facturada
  @Input() modoLectura2: boolean = false;

  @Output() buscarActEvent = new EventEmitter<string>();

  idPersonaColegiado: string;

  msgs: Message[] = [];
  resaltadoDatos: boolean = false;

  modoLectura: boolean;

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
      value: '',
      obligatorio: false
    },
    inputNumPro: {
      label: 'Nº Procedimiento',
      value: '',
      obligatorio: false
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
        value: '',
        disabled: false,
        obligatorio: true
      },
      {
        id: 'procedimiento',
        nombre: "Procedimiento",
        opciones: [],
        value: '',
        disabled: false,
        obligatorio: false
      },
      {
        id: 'motivoCambio',
        nombre: "Motivo del cambio",
        opciones: [],
        value: '',
        disabled: false,
        obligatorio: false
      },
      {
        id: 'modulo',
        nombre: "Módulo (*)",
        opciones: [],
        value: '',
        disabled: false,
        obligatorio: true
      },
      {
        id: 'acreditacion',
        nombre: "Acreditación (*)",
        opciones: [],
        value: '',
        disabled: false,
        obligatorio: true
      },
      {
        id: 'prision',
        nombre: "Prisión",
        opciones: [],
        value: '',
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
  designaItem: DesignaItem;
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];
  datosBuscar: any;
  parametroNIG: any;
  parametroNProc: any;

  constructor(private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private sigaStorageService: SigaStorageService,
    private router: Router) { }

  ngOnInit() {
    this.getNigValidador();
    this.getNprocValidador();
    this.currentRoute = this.router.url;
    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesDatosGenerales)
      .then(respuesta => {
        let permisoEscritura = respuesta;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

        if (!permisoEscritura) {
          this.modoLectura = true;
        }

        this.getParametro();
        this.designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));

      })
      .catch(err => console.log(err));
  }

  cargaInicial() {
    this.fechaEntradaInicioDate = new Date(this.actuacionDesigna.designaItem.fechaEntradaInicio.split('/').reverse().join('-'));

    if (this.actuacionDesigna.isNew) {
      this.establecerDatosInicialesNuevaAct();
    } else {
      this.establecerDatosInicialesEditAct();
    }

    if (this.sigaStorageService.isLetrado) {
      this.fechaMaxima = new Date();
    }

    this.formatoProc();
    this.getLetradoActuacion();
    this.getComboJuzgados();
    this.getComboPrisiones();
    this.getComboMotivosCambio();

    // La selección de Juzgado carga el combo de Procedimientos, y la selección de procedimientos carga el combo de módulos.
    if (this.parametroConfigCombos != null) {
      if (this.parametroConfigCombos == '1') {
        if (this.datos.selectores[0].value != undefined && this.datos.selectores[0].value != null && this.datos.selectores[0].value != '') {
          this.getComboProcedimientosConJuzgado(this.datos.selectores[0].value);
          if (this.datos.selectores[1].value != undefined && this.datos.selectores[1].value != null && this.datos.selectores[1].value != '') {
            this.getComboModulosConProcedimientos(this.datos.selectores[1].value);
          } else {
            this.datos.selectores[3].value = '';
          }
        } else {
          this.datos.selectores[1].value = '';
        }
      }

      // La selección de Juzgado carga el combo de módulos y la selección de módulo carga el combo de procedimientos.
      if (this.parametroConfigCombos== '2') {
        if (this.datos.selectores[0].value != undefined && this.datos.selectores[0].value != null && this.datos.selectores[0].value != '') {
          this.getComboModulosPorJuzgado(this.datos.selectores[0].value);

          if (this.datos.selectores[3].value != undefined && this.datos.selectores[3].value != null && this.datos.selectores[3].value != '') {
            this.getComboProcedimientosConModulo(this.datos.selectores[3].value);
          } else {
            this.datos.selectores[1].value = '';
          }
        } else {
          this.datos.selectores[3].value = '';
        }
      }

      // La selección de Juzgado carga el combo de módulos y la carga del combo de procedimientos es independiente, se cargan todos los existentes para el colegio.
      if (this.parametroConfigCombos== '3') {
        if (this.datos.selectores[0].value != undefined && this.datos.selectores[0].value != null && this.datos.selectores[0].value != '') {
          this.getComboModulosPorJuzgado(this.datos.selectores[0].value);
        } else {
          this.datos.selectores[3].value = '';
        }

        this.getComboProcedimientos();
      }

      // La selección de Juzgado carga el combo de procedimientos y la carga del combo de módulos es independiente, se cargan todos los existentes para el colegio.
      if (this.parametroConfigCombos== '4') {
        if (this.datos.selectores[0].value != undefined && this.datos.selectores[0].value != null && this.datos.selectores[0].value != '') {
          this.getComboProcedimientosConJuzgado(this.datos.selectores[0].value);
        } else {
          this.datos.selectores[1].value = '';
        }

        this.getComboModulos();
      }

      // Todos los combos se cargan de forma independiente, con todos sus posibles valores de los existentes para el colegio.
      if (this.parametroConfigCombos= '5') {
        this.getComboProcedimientos();
        this.getComboModulos();
      }
    }
    if (this.datos.selectores[3].value != undefined && this.datos.selectores[3].value != null && this.datos.selectores[3].value != '') {
      this.getComboAcreditacionesPorModulo(this.datos.selectores[3].value);
    }

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

  // Inicio combos Juzgado
  getComboJuzgados() {
    this.progressSpinner = true;
    if (this.designaItem.idJuzgado == null || this.designaItem.idJuzgado == undefined) {
      this.designaItem.idJuzgado = 0;
    }
    this.sigaServices.post("combo_comboJuzgadoDesignaciones", this.designaItem.idJuzgado).subscribe(
      n => {
        this.comboJuzgados = JSON.parse(n.body).combooItems;
        if (this.comboJuzgados) {
          this.commonsService.arregloTildesCombo(this.comboJuzgados);
          //Valor de la cabecera para juzagado
          this.comboJuzgados.sort( (a, b) => {
            return a.label.localeCompare(b.label);
          });
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[0].opciones = this.comboJuzgados;
        if (this.comboJuzgados != undefined && this.comboJuzgados != null && this.comboJuzgados.find(el => el.value == this.datos.selectores.find(el => el.id == 'juzgado').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'juzgado').value = '';
        }
      }
    );
  }
  // Fin combos Juzgado

  // Inicio combos Modulo
  getComboModulos() {
    this.progressSpinner = true;
    let fecha = null;
    if (this.datos.datePicker != null && this.datos.datePicker.value != undefined && this.datos.datePicker.value != null) {
      fecha = this.datePipe.transform(new Date(this.datos.datePicker.value), 'dd/MM/yyyy')
    }
    //console.log(this.actuacionDesigna)
    this.sigaServices.getParam("combo_comboModulosDesignaciones", this.buildParams({
      "numero": this.actuacionDesigna.actuacion.numero,
      "anio": this.actuacionDesigna.actuacion.anio, "idTurno": this.actuacionDesigna.actuacion.idTurno, "numeroAsunto": this.actuacionDesigna.actuacion.numeroAsunto
    })).subscribe(
      n => {
        this.comboModulos = n.combooItems;

        if (this.actuacionDesigna.isNew) {
          if (this.actuacionDesigna.designaItem.idProcedimiento != "" && this.actuacionDesigna.designaItem.idProcedimiento != null && this.actuacionDesigna.designaItem.idProcedimiento != undefined) {
            this.comboModulos.push({ label: this.actuacionDesigna.designaItem.modulo, value: this.actuacionDesigna.designaItem.idProcedimiento });
          }
        } else {
          if (this.actuacionDesigna.actuacion.idProcedimiento != "" && this.actuacionDesigna.actuacion.idProcedimiento != null && this.actuacionDesigna.actuacion.idProcedimiento != undefined) {
            this.comboModulos.push({ label: this.actuacionDesigna.actuacion.modulo, value: this.actuacionDesigna.actuacion.idProcedimiento });
          }
        }

        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.comboModulos.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.comboModulos = uniqueArray;
        if (this.comboModulos) {
          this.commonsService.arregloTildesCombo(this.comboModulos);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[3].opciones = this.comboModulos;
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

  getComboModulosPorJuzgado($event) {
    this.progressSpinner = true;
    let fecha = null;
    if (this.datos.datePicker != null && this.datos.datePicker.value != undefined && this.datos.datePicker.value != null) {
      fecha = this.datePipe.transform(new Date(this.datos.datePicker.value), 'dd/MM/yyyy')
    }
    this.sigaServices.getParam("combo_comboModulosConJuzgado", "?idJuzgado=" + $event + "&fecha=" + fecha).subscribe(
      n => {
        this.comboModulos = n.combooItems;

        if (this.actuacionDesigna.isNew) {
          if (this.actuacionDesigna.designaItem.idProcedimiento != "" && this.actuacionDesigna.designaItem.idProcedimiento != null && this.actuacionDesigna.designaItem.idProcedimiento != undefined) {
            this.comboModulos.push({ label: this.actuacionDesigna.designaItem.modulo, value: this.actuacionDesigna.designaItem.idProcedimiento });
          }
        } else {
          if (this.actuacionDesigna.actuacion.idProcedimiento != "" && this.actuacionDesigna.actuacion.idProcedimiento != null && this.actuacionDesigna.actuacion.idProcedimiento != undefined) {
            this.comboModulos.push({ label: this.actuacionDesigna.actuacion.modulo, value: this.actuacionDesigna.actuacion.idProcedimiento });
          }
        }

        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.comboModulos.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.comboModulos = uniqueArray;
        if (this.comboModulos) {
          this.commonsService.arregloTildesCombo(this.comboModulos);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.datos.selectores[3].opciones = this.comboModulos;
      }
    );
  }

  getComboModulosConProcedimientos(idPretension) {
    this.progressSpinner = true;
    let fecha = null;
    if (this.datos.datePicker != null && this.datos.datePicker.value != undefined && this.datos.datePicker.value != null) {
      fecha = this.datePipe.transform(new Date(this.datos.datePicker.value), 'dd/MM/yyyy')
    }
    this.sigaServices.getParam("combo_comboModulosConProcedimientos", "?idPretension=" + idPretension + "&fecha=" + fecha).subscribe(
      n => {
        this.comboModulos = JSON.parse(n.body).combooItems;

        if (this.actuacionDesigna.isNew) {
          if (this.actuacionDesigna.designaItem.idProcedimiento != "" && this.actuacionDesigna.designaItem.idProcedimiento != null && this.actuacionDesigna.designaItem.idProcedimiento != undefined) {
            this.comboModulos.push({ label: this.actuacionDesigna.designaItem.modulo, value: this.actuacionDesigna.designaItem.idProcedimiento });
          }
        } else {
          if (this.actuacionDesigna.actuacion.idProcedimiento != "" && this.actuacionDesigna.actuacion.idProcedimiento != null && this.actuacionDesigna.actuacion.idProcedimiento != undefined) {
            this.comboModulos.push({ label: this.actuacionDesigna.actuacion.modulo, value: this.actuacionDesigna.actuacion.idProcedimiento });
          }
        }

        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.comboModulos.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.comboModulos = uniqueArray;
        if (this.comboModulos) {
          this.commonsService.arregloTildesCombo(this.comboModulos);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[3].opciones = this.comboModulos;
      }
    );
  }
  // Fin combos Modulo

  // Inicio combos Procedimiento
  getComboProcedimientos() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;

        if (this.actuacionDesigna.isNew) {
          if (this.actuacionDesigna.designaItem.idPretension != "" && this.actuacionDesigna.designaItem.idPretension != null && this.actuacionDesigna.designaItem.idPretension != undefined) {
            this.comboProcedimientos.push({ label: this.actuacionDesigna.designaItem.nombreProcedimiento, value: this.actuacionDesigna.designaItem.idPretension });
          }
        } else {
          if (this.actuacionDesigna.actuacion.nombreProcedimiento != null && this.actuacionDesigna.actuacion.nombreProcedimiento != undefined && this.actuacionDesigna.actuacion.idPretension != undefined && this.actuacionDesigna.actuacion.idPretension != "" && this.actuacionDesigna.actuacion.idPretension != null) {
            this.comboProcedimientos.push({ label: this.actuacionDesigna.actuacion.nombreProcedimiento, value: this.actuacionDesigna.actuacion.idPretension });
          }
        }

        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.comboProcedimientos.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.comboProcedimientos = uniqueArray;
        if (this.comboProcedimientos) {
          this.commonsService.arregloTildesCombo(this.comboProcedimientos);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[1].opciones = this.comboProcedimientos;
      }
    );
  }

  getComboProcedimientosConJuzgado(idJuzgado) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboProcedimientosConJuzgado", idJuzgado).subscribe(
      n => {
        this.comboProcedimientos = JSON.parse(n.body).combooItems;

        if (this.actuacionDesigna.isNew) {
          if (this.actuacionDesigna.designaItem.idPretension != "" && this.actuacionDesigna.designaItem.idPretension != null && this.actuacionDesigna.designaItem.idPretension != undefined) {
            this.comboProcedimientos.push({ label: this.actuacionDesigna.designaItem.nombreProcedimiento, value: this.actuacionDesigna.designaItem.idPretension });
          }
        } else {
          if (this.actuacionDesigna.actuacion.nombreProcedimiento != null && this.actuacionDesigna.actuacion.nombreProcedimiento != undefined && this.actuacionDesigna.actuacion.idPretension != undefined && this.actuacionDesigna.actuacion.idPretension != "" && this.actuacionDesigna.actuacion.idPretension != null) {
            this.comboProcedimientos.push({ label: this.actuacionDesigna.actuacion.nombreProcedimiento, value: this.actuacionDesigna.actuacion.idPretension });
          }
        }

        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.comboProcedimientos.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.comboProcedimientos = uniqueArray;
        if (this.comboProcedimientos) {
          this.commonsService.arregloTildesCombo(this.comboProcedimientos);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[1].opciones = this.comboProcedimientos;
      }
    );
  }

  getComboProcedimientosConModulo(idProcedimiento) {
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboProcedimientosConModulo", idProcedimiento).subscribe(
      n => {
        this.comboProcedimientos = JSON.parse(n.body).combooItems;

        if (this.actuacionDesigna.isNew) {
          if (this.actuacionDesigna.designaItem.idPretension != "" && this.actuacionDesigna.designaItem.idPretension != null && this.actuacionDesigna.designaItem.idPretension != undefined) {
            this.comboProcedimientos.push({ label: this.actuacionDesigna.designaItem.nombreProcedimiento, value: this.actuacionDesigna.designaItem.idPretension });
          }
        } else {
          if (this.actuacionDesigna.actuacion.nombreProcedimiento != null && this.actuacionDesigna.actuacion.nombreProcedimiento != undefined && this.actuacionDesigna.actuacion.idPretension != undefined && this.actuacionDesigna.actuacion.idPretension != "" && this.actuacionDesigna.actuacion.idPretension != null) {
            this.comboProcedimientos.push({ label: this.actuacionDesigna.actuacion.nombreProcedimiento, value: this.actuacionDesigna.actuacion.idPretension });
          }
        }

        let uniqueArrayValue = [];
        let uniqueArray = [];
        this.comboProcedimientos.forEach((c) => {
          if (!uniqueArrayValue.includes(c.value)) {
            uniqueArrayValue.push(c.value);
            uniqueArray.push(c);
          }
        });
        this.comboProcedimientos = uniqueArray;
        if (this.comboProcedimientos) {
          this.commonsService.arregloTildesCombo(this.comboProcedimientos);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[1].opciones = this.comboProcedimientos;
      }
    );
  }
  // Fin combos Procedimiento

  // Inicio combos Acreditaciones
  getComboAcreditacionesPorModulo(idModulo) {
    this.progressSpinner = true;
    let idTurno = this.actuacionDesigna.designaItem.idTurno;

    this.sigaServices.getParam("combo_comboAcreditacionesPorModulo", `?idModulo=${idModulo}&idTurno=${idTurno}`).subscribe(
      n => {
        this.comboAcreditaciones = n.combooItems;
        if (this.comboAcreditaciones) {
          this.commonsService.arregloTildesCombo(this.comboAcreditaciones);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.comboAcreditaciones.forEach(el => {
          el.obligaNigNumPro = el.value.split(',')[1] == '0' ? false : true;
          el.value = el.value.split(',')[0];
        });
        this.datos.selectores[4].opciones = this.comboAcreditaciones;
        if (this.comboAcreditaciones != undefined && this.comboAcreditaciones != null && this.comboAcreditaciones.find(el => el.value == this.datos.selectores.find(el => el.id == 'acreditacion').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'acreditacion').value = '';
        }

        let comboAcre = this.datos.selectores.find(el => el.id == 'acreditacion');

        if (comboAcre.value != undefined && comboAcre.value != null && comboAcre.value != '') {

          let obligar = this.datos.selectores.find(el => el.id == 'acreditacion').opciones.find(el => el.value == this.datos.selectores.find(el => el.id == 'acreditacion').value).obligaNigNumPro;

          if (obligar) {
            this.datos.inputNig.obligatorio = true;
            this.datos.inputNumPro.obligatorio = true;
          } else {
            this.datos.inputNig.obligatorio = false;
            this.datos.inputNumPro.obligatorio = false;
          }

        }

      }
    );
  }
  // Fin combos Acreditaciones

  // Inicio combos Prisiones
  getComboPrisiones() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_prisiones").subscribe(
      n => {
        this.comboPrisiones = n.combooItems;
        if (this.comboPrisiones) {
          this.commonsService.arregloTildesCombo(this.comboPrisiones);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[5].opciones = this.comboPrisiones;
        if (this.comboPrisiones != undefined && this.comboPrisiones != null && this.comboPrisiones.find(el => el.value == this.datos.selectores.find(el => el.id == 'prision').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'prision').value = '';
        }
      }
    );
  }
  // Fin combos Prisiones

  // Inicio combos Motivos Cambio
  getComboMotivosCambio() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_motivosCambio_actuDesigna").subscribe(
      n => {
        this.comboMotivosCambio = n.combooItems;
        if (this.comboMotivosCambio) {
          this.commonsService.arregloTildesCombo(this.comboMotivosCambio);
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        this.datos.selectores[2].opciones = this.comboMotivosCambio;
        if (this.comboMotivosCambio != undefined && this.comboMotivosCambio != null && this.comboMotivosCambio.find(el => el.value == this.datos.selectores.find(el => el.id == 'motivoCambio').value) == undefined) {
          this.datos.selectores.find(el => el.id == 'motivoCambio').value = '';
        }
      }
    );
  }
  // Fin combos Motivos Cambio

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
    if (this.actuacionDesigna.designaItem.idJuzgado != null && this.actuacionDesigna.designaItem.idJuzgado != "") {
      this.datos.selectores[0].value = this.actuacionDesigna.designaItem.idJuzgado.toString();
    }
    if (this.actuacionDesigna.designaItem.idPretension != null && this.actuacionDesigna.designaItem.idPretension != "") {
      this.datos.selectores[1].value = this.actuacionDesigna.designaItem.idPretension.toString();
    }
    if (this.actuacionDesigna.designaItem.idProcedimiento != null && this.actuacionDesigna.designaItem.idProcedimiento != "") {
      this.datos.selectores[3].value = this.actuacionDesigna.designaItem.idProcedimiento.toString();
    }
  }

  establecerDatosInicialesEditAct() {
    this.datos.inputs1[0].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.inputs1[3].value = this.actuacionDesigna.designaItem.ano.replace('D', '').replace('/', '');
    this.datos.inputs1[4].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.datos.datePicker.value = new Date(this.actuacionDesigna.actuacion.fechaActuacion.split('/').reverse().join('-'));
    this.datos.inputs1[1].value = this.actuacionDesigna.actuacion.numColegiado;
    this.datos.inputs1[2].value = `${this.actuacionDesigna.actuacion.numColegiado} - ${this.actuacionDesigna.actuacion.letrado}`;
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
      params.idPartidaPresupuestaria = this.actuacionDesigna.designaItem.idPartidaPresupuestaria;

      if (params.idJuzgado != undefined && params.idJuzgado != null && params.idJuzgado !== '') {
        params.nombreJuzgado = this.datos.selectores[0].opciones.find(el => el.value == params.idJuzgado).label;
      }
      if (params.idPretension != undefined && params.idPretension != null && params.idPretension !== '') {
        params.nombreProcedimiento = this.datos.selectores[1].opciones.find(el => el.value == params.idPretension).label;
      }
      if (params.idProcedimiento != undefined && params.idProcedimiento != null && params.idProcedimiento !== '') {
        params.nombreModulo = this.datos.selectores[3].opciones.find(el => el.value == params.idProcedimiento).label;
      }

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
          //console.log(err);
          this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
        },
        () => {
          this.progressSpinner = false;
        }
      );

    }
  }

  
  formatoProc(){
    this.sigaServices.get('actuaciones_designacion_numProcedimiento').subscribe(
      (data) => {
        // console.log("FORMATO PROC")
        // console.log(data)
       this.valorFormatoProc = data.valor;
        // console.log(this.valorFormatoProc)
      },
      (err) => {
        console.log(err);
      }
    );
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

      if (params.idJuzgado != undefined && params.idJuzgado != null && params.idJuzgado !== '') {
        params.nombreJuzgado = this.datos.selectores[0].opciones.find(el => el.value == params.idJuzgado).label;
      }
      if (params.idPretension != undefined && params.idPretension != null && params.idPretension !== '') {
        params.nombreProcedimiento = this.datos.selectores[1].opciones.find(el => el.value == params.idPretension).label;
      }
      if (params.idProcedimiento != undefined && params.idProcedimiento != null && params.idProcedimiento !== '') {
        params.nombreModulo = this.datos.selectores[3].opciones.find(el => el.value == params.idProcedimiento).label;
      }

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
          //console.log(err);
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

    if ((this.datos.inputNig.obligatorio && this.datos.inputNig.value == null) || (this.datos.inputNig.value != null && !error && !this.validarNig(this.datos.inputNig.value))) {
      this.showMsg('error', this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido"), '');
      error = true;
    }

    if ((this.datos.inputNumPro.obligatorio && this.datos.inputNumPro.value == null) || (this.datos.inputNumPro.value != null && !error && !this.validarNProcedimiento(this.datos.inputNumPro.value))) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido"));
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

  //Codigo copiado de la tarjeta detalles de la ficha de designaciones
  validarNig(nig) {
    let ret = false;
    
    if (nig != null && nig != '' && this.parametroNIG != undefined) {
      if (this.parametroNIG != null && this.parametroNIG.parametro != "") {
          let valorParametroNIG: RegExp = new RegExp(this.parametroNIG.parametro);
          if (nig != '') {
            ret = valorParametroNIG.test(nig);
          }
        }
      //this.progressSpinner = false;
    } else if (!this.datos.inputNig.obligatorio && (nig == null || nig == ''))  {
      ret = true;
    }

    return ret;
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
  validarNProcedimiento(nProcedimiento:string) {
    //Esto es para la validacion de CADECA

    let response:boolean = false;


    if (this.institucionActual == "2008" || this.institucionActual == "2015" || this.institucionActual == "2029" || this.institucionActual == "2033" || this.institucionActual == "2036" ||
      this.institucionActual == "2043" || this.institucionActual == "2006" || this.institucionActual == "2021" || this.institucionActual == "2035" || this.institucionActual == "2046" || this.institucionActual == "2066") {
      if (nProcedimiento != '' && nProcedimiento != null) {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        let ret = objRegExp.test(nProcedimiento);
        response = ret;
      }
    } else {
      if (nProcedimiento != '' && nProcedimiento != null && nProcedimiento.length == 12) {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}$/;
        let ret = objRegExp.test(nProcedimiento);
        response = ret;
      } 
    }
    return response;

  }
  */

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
          //console.log(err);
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
      this.changeSelectorJuzgado(selector);
    } else if (selector.id == 'modulo') {
      this.changeSelectorModulo(selector);
    } else if (selector.id == 'procedimiento') {
      this.changeSelectorProcedimiento(selector);
    } else if (selector.id == 'acreditacion') {
      this.changeSelectorAcreditacion(selector);
    }
  }

  changeSelectorJuzgado(selector) {

    let procedimiento = this.datos.selectores.find(el => el.id == 'procedimiento');
    let modulo = this.datos.selectores.find(el => el.id == 'modulo');

    if (this.parametroConfigCombos== '1') {

      procedimiento.opciones = [];
      procedimiento.opciones = [{ label: this.actuacionDesigna.actuacion.nombreProcedimiento, value: this.actuacionDesigna.actuacion.idPretension }];

      if (selector.value != undefined && selector.value != null && selector.value != '') {
        this.getComboProcedimientosConJuzgado(selector.value);
      }
    }

    if (this.parametroConfigCombos== '2') {

      modulo.opciones = [];
      modulo.opciones = [{ label: this.actuacionDesigna.actuacion.modulo, value: this.actuacionDesigna.actuacion.idProcedimiento }];

      if (selector.value != undefined && selector.value != null && selector.value != '') {
        this.getComboModulosPorJuzgado(selector.value);
      }
    }

    if (this.parametroConfigCombos== '3') {

      modulo.opciones = [];
      modulo.opciones = [{ label: this.actuacionDesigna.actuacion.modulo, value: this.actuacionDesigna.actuacion.idProcedimiento }];

      if (selector.value != undefined && selector.value != null && selector.value != '') {
        this.getComboModulosPorJuzgado(selector.value);
      }
    }

    if (this.parametroConfigCombos== '4') {

      procedimiento.opciones = [];
      procedimiento.opciones = [{ label: this.actuacionDesigna.actuacion.nombreProcedimiento, value: this.actuacionDesigna.actuacion.idPretension }];

      if (selector.value != undefined && selector.value != null && selector.value != '') {
        this.getComboProcedimientosConJuzgado(selector.value);
      }
    }

  }

  changeSelectorModulo(selector) {

    let procedimiento = this.datos.selectores.find(el => el.id == 'procedimiento');
    let acreditacion = this.datos.selectores.find(el => el.id == 'acreditacion');
    let modulo = this.datos.selectores.find(el => el.id == 'modulo');

    if (this.parametroConfigCombos== '2') {

      procedimiento.opciones = [];
      procedimiento.opciones = [{ label: this.actuacionDesigna.actuacion.nombreProcedimiento, value: this.actuacionDesigna.actuacion.idPretension }];

      if (selector.value != undefined && selector.value != null && selector.value != '') {
        this.getComboProcedimientosConModulo(selector.value);
      }
    }

    acreditacion.opciones = [];
    acreditacion.value = '';

    if (modulo.value != undefined && modulo.value != null && modulo.value != '') {
      this.getComboAcreditacionesPorModulo(modulo.value);
    }
  }

  changeSelectorProcedimiento(selector) {

    let modulo = this.datos.selectores.find(el => el.id == 'modulo');

    if (this.parametroConfigCombos== '1') {

      modulo.opciones = [];
      modulo.opciones = [{ label: this.actuacionDesigna.actuacion.modulo, value: this.actuacionDesigna.actuacion.idProcedimiento }];
      // modulo.value = this.actuacionDesigna.actuacion.idProcedimiento;
 
      if (selector.value != undefined && selector.value != null && selector.value != '') {
        this.getComboModulosConProcedimientos(selector.value);
      }
    }

  }

  changeSelectorAcreditacion(selector) {

    if (selector.value != undefined && selector.value != null && selector.value != '') {
      let obligar = this.datos.selectores.find(el => el.id == 'acreditacion').opciones.find(el => el.value == selector.value).obligaNigNumPro;

      if (obligar) {
        this.datos.inputNig.obligatorio = true;
        this.datos.inputNumPro.obligatorio = true;
      } else {
        this.datos.inputNig.obligatorio = false;
        this.datos.inputNumPro.obligatorio = false;
      }

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

  getParametro() {
    this.progressSpinner = true;
    
    let parametro = {
      valor: "CONFIGURAR_COMBO_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroConfigCombos = JSON.parse(data.body).parametro;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.cargaInicial();
      }
    );
  }


  navigateComunicar() {
    sessionStorage.setItem("rutaComunicacion", "/actuacionesDesignacion");
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');

    
    let datosSeleccionados = [];
    let rutaClaseComunicacion = "/actuacionesDesignacion";

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                //    this.actuacionesSeleccionadas.forEach(element => {
                let keysValues = [];
                this.keys.forEach(key => {
                  if (this.actuacionDesigna.actuacion[key.nombre] != undefined) {
                    keysValues.push(this.actuacionDesigna.actuacion[key.nombre]);
                  } else if (key.nombre == "num" && this.actuacionDesigna.actuacion["numero"] != undefined) {
                    keysValues.push(this.actuacionDesigna.actuacion["numero"]);
                  }
                });
                datosSeleccionados.push(keysValues);
                //   });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                //console.log(err);
              }
            );
        },
        err => {
          //console.log(err);
        }
      );
  }

}
