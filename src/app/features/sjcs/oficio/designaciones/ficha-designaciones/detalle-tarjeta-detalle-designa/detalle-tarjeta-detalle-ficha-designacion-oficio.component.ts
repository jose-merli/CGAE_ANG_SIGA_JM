import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ParametroDto } from '../../../../../../models/ParametroDto';
import { ParametroRequestDto } from '../../../../../../models/ParametroRequestDto';
import { SigaServices } from '../../../../../../_services/siga.service';

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
  valorParametroNProcedimiento: any;
  searchParametros: ParametroDto = new ParametroDto();
  searchParametrosFormatoNProcedimiento: ParametroDto = new ParametroDto();
  datosBuscar: any[];
  estado: any;
  disableFinalizar: boolean;
  disableAnular: boolean;
  disableReactivar: boolean;
  @Input() campos;
  inputs = [
    { nombre: 'NIG', value: "" },
    { nombre: 'Nº Procedimiento', value: "" }
  ];

  datePickers = [
    {
      nombre: 'Fecha estado',
      value: ""
    },
    {
      nombre: 'Fecha cierre',
      value: ""
    }
  ];

  selectores = [
    {
      nombre: 'Estado',
      opciones: [
        { label: 'Activo', value: 'V' },
        { label: 'Finalizada', value: 'F' },
        { label: 'Anulada', value: 'A' }
      ]
    },
    {
      nombre: 'Juzgado',
      opciones: [

      ]
    },
    {
      nombre: 'Procedimiento',
      opciones: [

      ]
    },
    {
      nombre: 'Módulo',
      opciones: [
      ]
    },
    {
      nombre: 'Delitos',
      opciones: [

      ]
    }
  ];

  constructor(private sigaServices: SigaServices, private datepipe: DatePipe) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.campos.idInstitucion;
    parametro.modulo = "SCS";
    parametro.parametrosGenerales = "CONFIGURAR_COMBO_DESIGNA";
    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", parametro)
      .subscribe(
        data => {
          this.searchParametros = JSON.parse(data["body"]);
          this.datosBuscar = this.searchParametros.parametrosItems;
          this.datosBuscar.forEach(element => {
            if (element.parametro == "CONFIGURAR_COMBO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
              this.valorParametro = element.valor;
            }
          });
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
    parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.campos.idInstitucion;
    parametro.modulo = "SCS";
    parametro.parametrosGenerales = "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA";
    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", parametro)
      .subscribe(
        data => {
          this.searchParametrosFormatoNProcedimiento = JSON.parse(data["body"]);
          this.datosBuscar = this.searchParametros.parametrosItems;
          this.datosBuscar.forEach(element => {
            if (element.parametro == "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
              this.valorParametroNProcedimiento = element.valor;
              console.log("NUEVO PARAMETRO");
              console.log(this.valorParametroNProcedimiento);
            }
          });
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
    if (!this.nuevaDesigna) {
      this.inputs[0].value = this.campos.nig;
      this.inputs[1].value = this.campos.numProcedimiento;
      // this.estado = this.campos.art27;
      this.selectores[0].opciones = [{ label: this.campos.art27, value: this.campos.sufijo }];
      this.selectores[1].opciones = [{ label: this.campos.nombreJuzgado, value: this.campos.idJuzgado }];
      this.selectores[2].opciones = [{ label: this.campos.nombreProcedimiento, value: this.campos.idProcedimiento}];
      this.selectores[3].opciones = [{ label: this.campos.modulo, value: this.campos.idModulo }];
      // this.getComboModulos();
      this.datePickers[0].value = this.campos.fechaEstado;
      this.datePickers[1].value = this.campos.fechaFin;
    } else {
      this.datePickers[0].value = this.formatDate(new Date());
      this.selectores[0].opciones = [
        { label: 'Activo', value: 'V' }
       ];
      this.getComboJuzgados();

    }

    this.getComboDelitos();

  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  busquedaCombos(event) {
    let arrayJuzgado = JSON.parse(sessionStorage.getItem("juzgadoSeleccioadno"));
    if (JSON.parse(sessionStorage.getItem("juzgadoSeleccioadno"))) {
      if (this.valorParametro == 1) {
        this.getComboProcedimientosConJuzgado(arrayJuzgado[0]);
      }
      if (this.valorParametro == 2) {
        this.getComboModulosConJuzgado(arrayJuzgado[0]);
      }
      if (this.valorParametro == 3) {
        this.getComboModulosConJuzgado(arrayJuzgado[0]);
        this.getComboProcedimientos();
      }
      if (this.valorParametro == 4) {
        this.getComboProcedimientosConJuzgado(arrayJuzgado[0]);
        this.getComboModulos();
      }
      if (this.valorParametro == 5) {
        this.getComboProcedimientos();
        this.getComboModulos();
      }
      sessionStorage.removeItem("juzgadoSeleccioadno");
    }
  }

  busquedaCombosModulo(event) {
    let arrayModulo = JSON.parse(sessionStorage.getItem("moduloSeleccionado"));
    if (JSON.parse(sessionStorage.getItem("moduloSeleccionado"))) {
      if (this.valorParametro == 2) {
        this.getComboProcedimientosConModulo(arrayModulo[0]);
      }
      sessionStorage.removeItem("moduloSeleccionado");
    }
  }

  busquedaCombosProcedimiento(event) {
    let arrayProcedimiento = JSON.parse(sessionStorage.getItem("procedimientoSeleccionado"));
    if (JSON.parse(sessionStorage.getItem("procedimientoSeleccionado"))) {
      if (this.valorParametro == 1) {
        this.getcCmboModulosConProcedimientos(arrayProcedimiento[0]);
      }
      sessionStorage.removeItem("procedimientoSeleccionado");
    }
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];

    //Guardar
    if (detail == "Guardar" && this.validarNig(this.inputs[0].value) && this.validarNProcedimiento(this.inputs[1].value)) {

    } else {
      this.showMsg('error', 'El formato del Nº Procedimiento o del NIG no es correcto', '');
    }
    //ANULAR
    if (detail == "Anular" ) {
      // this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
      //   n => {
      //   },
      //   err => {
      //     this.progressSpinner = false;
  
      //     console.log(err);
      //   },() => {
      //     this.progressSpinner = false;
      //   });;
    } else {
      this.showMsg('error', 'No se ha podido anular la designacion', '');
    }
    //FINALIZAR
    if (detail == "Finalizar" ) {
      // this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
      //   n => {
      //   },
      //   err => {
      //     this.progressSpinner = false;
  
      //     console.log(err);
      //   },() => {
      //     this.progressSpinner = false;
      //   });;
    } else {
      this.showMsg('error', 'No se ha podido finalizar la designacion', '');
    }
    //REACTIVAR
    // if (detail == "Reactivar") {
    //   this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
    //     n => {
    //     },
    //     err => {
    //       this.progressSpinner = false;
  
    //       console.log(err);
    //     },() => {
    //       this.progressSpinner = false;
    // //     });;
    // } else {
    //   this.showMsg('error', 'No se ha podido reactivar la designacion', '');
    // }

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

    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.selectores[1].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[1].opciones);
      }
    );
  }

  getComboProcedimientos() {

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.selectores[2].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[2].opciones);
      }
    );
  }

  getComboModulos() {

    this.sigaServices.get("combo_comboModulosDesignaciones").subscribe(
      n => {
        this.selectores[3].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[3].opciones);
      }
    );
  }

  getComboDelitos() {

    this.sigaServices.get("combo_comboDelitos").subscribe(
      n => {
        this.selectores[4].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[4].opciones);
      }
    );
  }

  getComboProcedimientosConJuzgado(idJuzgado) {
    this.sigaServices.post("combo_comboProcedimientosConJuzgado", idJuzgado).subscribe(
      n => {
        this.selectores[2].opciones = JSON.parse(n.body).combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[2].opciones);
      }
    );
  }

  getComboProcedimientosConModulo(idProcedimiento) {

    this.sigaServices.post("combo_comboProcedimientosConModulo", idProcedimiento).subscribe(
      n => {
        this.selectores[2].opciones = JSON.parse(n.body).combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[2].opciones);
      }
    );
  }

  getComboModulosConJuzgado(idJuzgado) {

    this.sigaServices.post("combo_comboModulosConJuzgado", idJuzgado).subscribe(
      n => {
        this.selectores[3].opciones = JSON.parse(n.body).combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[3].opciones);
      }
    );
  }

  getcCmboModulosConProcedimientos(idPretension) {

    this.sigaServices.post("combo_comboModulosConProcedimientos", idPretension).subscribe(
      n => {
        this.selectores[3].opciones = JSON.parse(n.body).combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[3].opciones);
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
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }

  validarNig(nig) {
    //Esto es para la validacion de CADECA
    let ret = false;
    let institucionActual
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;
      if (institucionActual == "2008" || institucionActual == "2015" || institucionActual == "2029" || institucionActual == "2033" || institucionActual == "2036" ||
      institucionActual == "2043" || institucionActual == "2006" || institucionActual == "2021" || institucionActual == "2035" || institucionActual == "2046" || institucionActual == "2066") {
      if (nig != '') {
        var objRegExp = /^[0-9]{7}[S,C,P,O,I,V,M,6,8,1,2,3,4]{1}(19|20)\d{2}[0-9]{7}$/;
        ret = objRegExp.test(nig);
        
      }
      else
        ret = true;
    } else {
      if (nig.length == 19) {
        var objRegExp = /^([a-zA-Z0-9]{19})?$/;
        ret = objRegExp.test(nig);
      } else {
        ret = true;
      }
    }
    });

    return ret;
  }

  validarNProcedimiento(nProcedimiento) {
    //Esto es para la validacion de CADECA
    let institucionActual
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;
    });

    if (institucionActual == "2008" || institucionActual == "2015" || institucionActual == "2029" || institucionActual == "2033" || institucionActual == "2036" ||
      institucionActual == "2043" || institucionActual == "2006" || institucionActual == "2021" || institucionActual == "2035" || institucionActual == "2046" || institucionActual == "2066") {
      if (nProcedimiento != '') {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        var ret = objRegExp.test(nProcedimiento);
        return ret;
      }
      else
        return true;
    } else {
      if (nProcedimiento.length == 19) {
        var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}[/]$/;
        var ret = objRegExp.test(nProcedimiento);
        return ret;
      } else {
        return true;
      }
    }

  }
}
