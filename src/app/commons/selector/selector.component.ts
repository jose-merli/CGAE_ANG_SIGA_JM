import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParametroRequestDto } from '../../models/ParametroRequestDto';
import { SigaServices } from '../../_services/siga.service';
 
@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
  @Input() selector;
  @Input() i;
  @Input() textoVisible = "Seleccionar";
  @Output() busqueda = new EventEmitter<boolean>();
  @Output() busquedaProcedimiento = new EventEmitter<boolean>();
  @Output() busquedaModulo = new EventEmitter<boolean>();
  opcionSeleccionado: [number]  = [0];
  verSeleccion: [number];
  nuevaDesigna: any;
  disable: boolean;
  constructor(private sigaServices: SigaServices) { }
 
  ngOnInit(): void {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    // if(this.selector.nombre == "Estado" && !this.nuevaDesigna){
    if(this.selector.nombre == "Estado"){
      this.textoVisible = this.selector.opciones[0].label;
      if(this.textoVisible == "Activo"){
        this.selector.opciones =[ 
          {label:this.selector.opciones[0].label, value:'V'},
          {label:'Finalizada', value:'F'},
          {label:'Anulada', value:'A'}];
      }else if(this.textoVisible == "Finalizada"){
        this.selector.opciones =[ 
          {label:'Activo', value:'V'},
          {label:this.selector.opciones[0].label, value:'F'},
          {label:'Anulada', value:'A'}];
      }else if(this.textoVisible == "Anulada"){
        this.selector.opciones =[ 
          {label:'Activo', value:'V'},
          {label:'Finalizada', value:'F'},
          {label:this.selector.opciones[0].label, value:'A'}];
      }
      
      this.disable = false;
    }
    if(this.selector.nombre == "Juzgado" && !this.nuevaDesigna){
      this.getComboJuzgados(this.selector);
      this.textoVisible = this.selector.opciones[0].label;
      this.disable = false;
    }else if(this.selector.nombre == "Juzgado" && this.nuevaDesigna){
      // this.disable = true;
      this.getComboJuzgados(this.selector);
    }
    if(this.selector.nombre == "Procedimiento" && !this.nuevaDesigna){
      this.getComboProcedimientos(this.selector);
      this.textoVisible = this.selector.opciones[0].label;
      this.disable = false;
    }else if(this.selector.nombre == "Procedimiento" && this.nuevaDesigna){
      // this.disable = true;
    }
    if(this.selector.nombre == "Módulo" && !this.nuevaDesigna){
      this.getComboModulos(this.selector);
      this.textoVisible = this.selector.opciones[0].label;
      this.disable = false;
    }else if(this.selector.nombre == "Módulo" && this.nuevaDesigna){
      // this.disable = true;
    }
    if(!this.nuevaDesigna){
      this.cargaCombosDesigna();
    }
  }
  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
    if(this.selector.nombre == "Juzgado"){
      sessionStorage.setItem(
        "juzgadoSeleccioadno",
        JSON.stringify(this.verSeleccion)
      );
      this.busqueda.emit(false);
    }

    if(this.selector.nombre == "Procedimiento"){
      sessionStorage.setItem(
        "procedimientoSeleccionado",
        JSON.stringify(this.verSeleccion)
      );
      this.busquedaProcedimiento.emit(false);
    }
    
    if(this.selector.nombre == "Módulo"){
      sessionStorage.setItem(
        "moduloSeleccionado",
        JSON.stringify(this.verSeleccion)
      );
      this.busquedaModulo.emit(false);
    }
    
  }
  getComboJuzgados(selectorJuzgado) {

    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        selectorJuzgado.opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(selectorJuzgado.opciones);
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

  
  getComboProcedimientos(selectorProcedimiento) {

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        selectorProcedimiento.opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(selectorProcedimiento.opciones);
      }
    );
  }

  getComboModulos(selectorModulo) {

    this.sigaServices.get("combo_comboModulosDesignaciones").subscribe(
      n => {
        selectorModulo.opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(selectorModulo.opciones);
      }
    );
  }
  cargaCombosDesigna(){
    let valorParametro;
    let institucionActual;
    let parametro = new ParametroRequestDto();
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;});
    parametro.idInstitucion = institucionActual;
    parametro.modulo = "SCS";
    parametro.parametrosGenerales = "CONFIGURAR_COMBO_DESIGNA";
    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", parametro)
      .subscribe(
        data => {
           let searchParametros = JSON.parse(data["body"]);
          let datosBuscar = searchParametros.parametrosItems;
          datosBuscar.forEach(element => {
            if (element.parametro == "CONFIGURAR_COMBO_DESIGNA" && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
              valorParametro = element.valor;
            }
          });
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );

    if (this.selector[1].value !=null && this.selector[1].value !=undefined && this.selector[1].value !="") {
      if (valorParametro == 1) {
        this.getComboProcedimientosConJuzgado(this.selector[1].value);
        this.getcCmboModulosConProcedimientos(this.selector[2].value);
      }
      if (valorParametro == 2) {
        this.getComboModulosConJuzgado(this.selector[1].value);
        this.getComboProcedimientosConModulo(this.selector[3]);
      }
      if (valorParametro == 3) {
        this.getComboModulosConJuzgado(this.selector[1].value);
        this.getComboProcedimientos(this.selector[2]);
      }
      if (valorParametro == 4) {
        this.getComboProcedimientosConJuzgado(this.selector[1].value);
        this.getComboModulos(this.selector[3]);
      }
      if (valorParametro == 5) {
        this.getComboProcedimientos(this.selector[2]);
        this.getComboModulos(this.selector[3]);
      }
      sessionStorage.removeItem("juzgadoSeleccioadno");
    }
    }

    getComboProcedimientosConJuzgado(idJuzgado) {
      this.sigaServices.post("combo_comboProcedimientosConJuzgado", idJuzgado).subscribe(
        n => {
          this.selector[2].opciones = JSON.parse(n.body).combooItems;
        },
        err => {
          console.log(err);
        }, () => {
          this.arregloTildesCombo(this.selector[2].opciones);
        }
      );
    }
  
    getComboProcedimientosConModulo(idProcedimiento) {
  
      this.sigaServices.post("combo_comboProcedimientosConModulo", idProcedimiento).subscribe(
        n => {
          this.selector[2].opciones = JSON.parse(n.body).combooItems;
        },
        err => {
          console.log(err);
        }, () => {
          this.arregloTildesCombo(this.selector[2].opciones);
        }
      );
    }
  
    getComboModulosConJuzgado(idJuzgado) {
  
      this.sigaServices.post("combo_comboModulosConJuzgado", idJuzgado).subscribe(
        n => {
          this.selector[3].opciones = JSON.parse(n.body).combooItems;
        },
        err => {
          console.log(err);
        }, () => {
          this.arregloTildesCombo(this.selector[3].opciones);
        }
      );
    }
  
    getcCmboModulosConProcedimientos(idPretension) {
  
      this.sigaServices.post("combo_comboModulosConProcedimientos", idPretension).subscribe(
        n => {
          this.selector[3].opciones = JSON.parse(n.body).combooItems;
        },
        err => {
          console.log(err);
        }, () => {
          this.arregloTildesCombo(this.selector[3].opciones);
        }
      );
    }
}
