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

  msgs: Message[] = [];
  nuevaDesigna: any;
  valorParametro: any;
  valorParametroNProcedimiento: any;
  searchParametros: ParametroDto = new ParametroDto();
  searchParametrosFormatoNProcedimiento: ParametroDto = new ParametroDto();
  datosBuscar: any[];
  estado: any;
  @Input() campos;
  inputs = [
    {nombre:'NIG', value: ""},
    {nombre:'Nº Procedimiento', value:""}
  ];

  datePickers = [
    {
    nombre:'Fecha estado',
    value: ""},
   {
     nombre:'Fecha cierre',
     value:""
    }
  ];

  selectores = [
    {
      nombre: 'Estado',
      opciones: [
        {label:'Activo', value:'V'},
        {label:'Finalizada', value:'F'},
        {label:'Anulada', value:'A'}
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

  constructor(private sigaServices: SigaServices) { }

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
            if(element.parametro == "CONFIGURAR_COMBO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)){
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
            if(element.parametro == "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)){
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
    if(!this.nuevaDesigna){
      this.inputs[0].value = this.campos.nig;
      this.inputs[1].value = this.campos.numProcedimiento;
      // this.estado = this.campos.art27;
      this.selectores[0].opciones =[ {label: this.campos.art27, value: this.campos.sufijo} ]; 
      this.selectores[1].opciones=[{label: this.campos.nombreJuzgado, value: ''}];
      this.selectores[2].opciones=[{label: this.campos.nombreProcedimiento, value: ''}];
      this.getComboModulos();
      this.datePickers[0].value =  this.campos.fechaEstado;
      this.datePickers[1].value =  this.campos.fechaFin;
    }else{
      this.selectores[0].opciones =[ 
      {label:'Activo', value:'V'},
      {label:'Finalizada', value:'F'},
      {label:'Anulada', value:'A'}];
      this.getComboJuzgados();
      
    }
    
  }

  busquedaCombos(event) {
    let arrayJuzgado = JSON.parse(sessionStorage.getItem("juzgadoSeleccioadno"));
    if(JSON.parse(sessionStorage.getItem("juzgadoSeleccioadno"))){
      if(this.valorParametro == 1){
        this.getComboProcedimientosConJuzgado(arrayJuzgado[0]);
      }
      if(this.valorParametro == 2){
        this.getComboModulosConJuzgado(arrayJuzgado[0]);
      }
      if(this.valorParametro == 3){
        this.getComboModulosConJuzgado(arrayJuzgado[0]);
        this.getComboProcedimientos();
      }
      if(this.valorParametro == 4){
        this.getComboProcedimientosConJuzgado(arrayJuzgado[0]);
        this.getComboModulos();
      }
      if(this.valorParametro == 5){
        this.getComboProcedimientos();
        this.getComboModulos();
      }
      sessionStorage.removeItem("juzgadoSeleccioadno");
    }
  }

  busquedaCombosModulo(event){
    let arrayModulo = JSON.parse(sessionStorage.getItem("moduloSeleccionado"));
    if(JSON.parse(sessionStorage.getItem("moduloSeleccionado"))){
      if(this.valorParametro == 2){
        this.getComboProcedimientosConModulo(arrayModulo[0]);
      }
      sessionStorage.removeItem("moduloSeleccionado");
   }
  }

  busquedaCombosProcedimiento(event){
    let arrayProcedimiento = JSON.parse(sessionStorage.getItem("procedimientoSeleccionado"));
    if(JSON.parse(sessionStorage.getItem("procedimientoSeleccionado"))){
      if(this.valorParametro == 1){
        this.getcCmboModulosConProcedimientos(arrayProcedimiento[0]);
      }
      sessionStorage.removeItem("procedimientoSeleccionado");
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
        this.arregloTildesCombo( this.selectores[3].opciones);
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
        this.arregloTildesCombo( this.selectores[4].opciones);
      }
    );
  }

  getComboProcedimientosConJuzgado(idJuzgado) {
    this.sigaServices.post("combo_comboProcedimientosConJuzgado",idJuzgado).subscribe(
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

   getComboProcedimientosConModulo(idProcedimiento) {

    this.sigaServices.post("combo_comboProcedimientosConModulo",idProcedimiento).subscribe(
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

  getComboModulosConJuzgado(idJuzgado) {

    this.sigaServices.post("combo_comboModulosConJuzgado",idJuzgado).subscribe(
      n => {
        this.selectores[3].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo( this.selectores[3].opciones);
      }
    );
  }

  getcCmboModulosConProcedimientos(idPretension) {

    this.sigaServices.post("combo_comboModulosConProcedimientos",idPretension).subscribe(
      n => {
        this.selectores[3].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo( this.selectores[3].opciones);
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

  changeNProcedimiento(inputTitle){
    if(inputTitle.nombre == "Nº Procedimiento" && this.valorParametroNProcedimiento != null && this.valorParametroNProcedimiento != ""){
      if(this.validaFormatoNrocedimiento(inputTitle.value)){
        this.showMsg('error', 'El formato del Nº Procedimiento no es correcto', '');
      }
    }
  }

  validaFormatoNrocedimiento(inputTitle){
    return false;
  }

}
