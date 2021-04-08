import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent implements OnInit {

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
    value:""
  },
  {
    nombre:'Apellidos',
    value:""
  },
  {
    nombre:'Nombre',
    value:""
  }];

  constructor(private sigaServices: SigaServices) {
   }

  ngOnInit() {
    console.log(this.campos);
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    if(!this.nuevaDesigna){
      this.checkArt = true;
    }else{
      this.checkArt = false;
    }
    //EDICION
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

}
