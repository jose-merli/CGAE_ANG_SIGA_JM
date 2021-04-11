import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent implements OnInit {

  resaltadoDatos: boolean = false;
  msgs: Message[] = [];
  nuevaDesigna: any;
  checkArt: boolean;
  @Input() campos;
  anio = {
    value: "",
    disable: false
  };
  numero = {
    value: "",
    disable: false
  };
  fechaGenerales:any;

  selectores = [
    {
      nombre: "Turno",
      opciones: [],
      value: "",
      disable: false
    },
    {
      nombre: "Tipo",
      opciones: [],
      value: "",
      disable: false
    }
  ];

  inputs = [{
    nombre: 'Número de colegiado',
    value:"",
    disable: false
  },
  {
    nombre:'Apellidos',
    value:"",
    disable: false
  },
  {
    nombre:'Nombre',
    value:"",
    disable: false
  }];

  constructor(private sigaServices: SigaServices,  private commonsService: CommonsService) {
   }

  ngOnInit() {
    console.log(this.campos);
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    if(!this.nuevaDesigna){
      //EDICION
      this.checkArt = true;
    this.selectores[0].opciones = [{label: this.campos.nombreTurno, value: this.campos.idTurno}];
    this.selectores[0].value =  this.campos.idTurno;
    this.selectores[0].disable =  true;
    this.selectores[1].opciones = [{label: this.campos.descripcionTipoDesigna, value: this.campos.idTipoDesignaColegio}];
    this.selectores[1].value =  this.campos.idTipoDesignaColegio;
    this.selectores[1].disable =  true;
    var anioAnterior = this.campos.ano.split("/");
    this.anio.value=  anioAnterior[0].slice(1);
    this.anio.disable=  true;
    this.numero.value = this.campos.codigo;
    this.numero.disable = false;
    this.fechaGenerales = this.campos.fechaAlta;
    let colegiado = new ColegiadoItem();
    colegiado.numColegiado = this.campos.numColegiado;
    colegiado.idInstitucion = this.campos.idInstitucion;
    this.inputs[0].disable = true;
    this.inputs[1].disable = true;
    this.inputs[2].disable = true;
    this.sigaServices
    .post("busquedaColegiados_searchColegiado", colegiado)
    .subscribe(
      data => {
        let colegiadoItem = JSON.parse(data.body);
        this.inputs[0].value=colegiadoItem.colegiadoItem[0].numColegiado;
        var apellidosNombre = colegiadoItem.colegiadoItem[0].nombre.split(",");
        this.inputs[1].value=apellidosNombre[0];
        this.inputs[2].value=apellidosNombre[1];
      },
      err => {
        console.log(err);
      },

    );
    }else{
      this.checkArt = false;
      this.anio.value= "";
      this.anio.disable=  true;
      this.numero.value = "";
      this.numero.disable = true;
      this.fechaGenerales = new Date();
      this.selectores[0].disable =  false;
      this.selectores[1].disable =  false;
      this.getComboTurno();
      this.getComboTipoDesignas();
    }
  
    //SE COMPRUEBAN LOS PERMISOS PARA EL BOTON GUARDAR
// export constprocesos_guardia:any= {​​​​​​​​
//     guardias: "916",
 
// // ----------- Tarjetas ----------
//     resumen: "92E",
//     turno: "92F",
//     datos_generales: "91Y",
//     conf_cola: "92G",
//     conf_calendario: "92H",
//     cola_guardia: "91L",
//     inscripciones: "92I",
//     baremos: "92J",
//     incompatibilidades: "919",
//     calendario: "92K",
//     saltos_compensaciones: "76S",
 
// }​​​​​​​​
    // this.commonsService.checkAcceso(procesos_guardia.saltos_compensaciones)
    //   .then(respuesta => {
 
    //     this.permisoEscritura = respuesta;
 
    //     this.persistenceService.setPermisos(this.permisoEscritura);
 
    //     if (this.permisoEscritura == undefined) {
    //       sessionStorage.setItem("codError", "403");
    //       sessionStorage.setItem(
    //         "descError",
    //         this.translateService.instant("generico.error.permiso.denegado")
    //       );
    //       this.router.navigate(["/errorAcceso"]);
    //     }
    //   }).catch(error => console.error(error));
    //EDICION
  }

  getComboTipoDesignas() {

    this.sigaServices.get("designas_tipoDesignas").subscribe(
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


  getComboTurno() {

    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.selectores[0].opciones = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.selectores[0].opciones);
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
  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }

  onChangeArt(){
    
  }
}
