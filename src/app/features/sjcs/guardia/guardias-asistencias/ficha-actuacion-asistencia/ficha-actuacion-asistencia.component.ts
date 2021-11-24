import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { ActuacionAsistenciaItem } from '../../../../../models/guardia/ActuacionAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { FichaActuacionAsistenciaTarjetaHistoricoComponent } from './ficha-actuacion-asistencia-tarjeta-historico/ficha-actuacion-asistencia-tarjeta-historico.component';

@Component({
  selector: 'app-ficha-actuacion-asistencia',
  templateUrl: './ficha-actuacion-asistencia.component.html',
  styleUrls: ['./ficha-actuacion-asistencia.component.scss']
})
export class FichaActuacionAsistenciaComponent implements OnInit {

  rutas: string[] = [];
  progressSpinner : boolean = false;
  asistencia : TarjetaAsistenciaItem;
  actuacion : ActuacionAsistenciaItem;
  editable : boolean = true;
  nuevaActuacion : boolean ;
  tarjetaFija = {
    nombre: "Resumen Actuación",
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigActuaDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaJusti',
      nombre: "Justificación",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaHidtoAct',
      nombre: "Histórico de la Actuación",
      imagen: "",
      icono: 'fa fa-user',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaDoc',
      nombre: "Documentación",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    }
  ];
  @ViewChild(FichaActuacionAsistenciaTarjetaHistoricoComponent) historicoComponent : FichaActuacionAsistenciaTarjetaHistoricoComponent;
  constructor(private translateService : TranslateService,
    private router : Router,
    private sigaServices : SigaServices,
    private datepipe : DatePipe) { }

  ngOnInit() {
    this.rutas = ['SJCS',this.translateService.instant("menu.justiciaGratuita.asistencia"), 'Actuaciones'];

    this.asistencia = JSON.parse(sessionStorage.getItem('asistenciaToFichaActuacion'));
    sessionStorage.removeItem('asistenciaToFichaActuacion');
    if(sessionStorage.getItem('nuevaActuacionAsistencia') == "true"){
      this.nuevaActuacion = true;
      sessionStorage.removeItem('nuevaActuacionAsistencia');
      this.initTarjetas();
    }else if(this.asistencia && sessionStorage.getItem('actuacionAsistencia')){
      this.actuacion = JSON.parse(sessionStorage.getItem('actuacionAsistencia'));
      sessionStorage.removeItem('actuacionAsistencia');
      this.getActuacionData();
    }


  }

  initTarjetas(){

    if(this.nuevaActuacion){
      this.tarjetaFija.campos=[
        {
          "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.annioNum") + ' asistencia',
          "value": ''
        },
        {
          "key": this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.fecha") + ' Asistencia',
          "value": ""
        },
        {
          "key": this.translateService.instant("dato.jgr.guardia.guardias.turno"),
          "value": ""
        },
        {
          "key": this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),
          "value": ""
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.fichaactuacion.numeroactuacion"),
          "value": ""
        },
        {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.actuaciones.fechaActuacion'),
          "value": ""
        },
        {
          "key": this.translateService.instant("dato.jgr.guardia.inscripciones.letrado"),
          "value": ""
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.asistido"),
          "value": ""
        }
      ]

      //CAMPOS TARJETA DATOS GENERALES
      this.listaTarjetas[0].opened = true;
      this.listaTarjetas[0].campos = [
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaActuacion"),
          "value": ""
        },
        {
          "key": this.translateService.instant("justiciaGratuita.maestros.gestionCostesFijos.tipoActuacion"),
          "value": ""
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.coste"),
          "value": ""
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.comisaria")+'/'+this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Juzgado"),
          "value": ""
        }
      ];

      //CAMPOS TARJETA JUSTIFICACION
      this.listaTarjetas[1].campos = [
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaJustificacion"),
          "value": ""
        },
        {
          "key": this.translateService.instant("censo.fichaIntegrantes.literal.estado"),
          "value": ""
        }
      ];

      this.listaTarjetas[2].campos = [
        {
          "key": this.translateService.instant("dato.jgr.guardia.saltcomp.fecha"),
          "value": ""
        },
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.inscripciones.accion"),
          "value": ""
        },
        {
          "key": this.translateService.instant("general.boton.usuario"),
          "value": ""
        }
      ];

      this.listaTarjetas.forEach(tarj => {
        if(tarj.nombre != 'Datos Generales'){
          tarj.detalle = false;
        }
      });
    }else{
      //Si la actuacion esta anulada o validada, no se podrá editar de ninguna forma
      if(this.actuacion.anulada == '1' || this.actuacion.validada == 'SÍ'){
        this.editable = false;
      }else{
        this.editable = true;
      }
      this.tarjetaFija.campos=[
        {
          "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.annioNum") + ' asistencia',
          "value": this.asistencia.anioNumero
        },
        {
          "key": this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.fecha") + ' Asistencia',
          "value": this.asistencia.fechaAsistencia
        },
        {
          "key": this.translateService.instant("dato.jgr.guardia.guardias.turno"),
          "value": this.asistencia.descripcionTurno
        },
        {
          "key": this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),
          "value": this.asistencia.descripcionGuardia
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.fichaactuacion.numeroactuacion"),
          "value": this.actuacion.idActuacion
        },
        {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.actuaciones.fechaActuacion'),
          "value": this.actuacion.fechaActuacion
        },
        {
          "key": this.translateService.instant("dato.jgr.guardia.inscripciones.letrado"),
          "value": this.asistencia.numeroColegiado + " - " + this.asistencia.nombreColegiado
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.asistido"),
          "value": this.asistencia.asistido
        }
      ];

      //CAMPOS TARJETA DATOS GENERALES
      this.listaTarjetas[0].campos = [
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaActuacion"),
          "value": this.actuacion.fechaActuacion
        },
        {
          "key": this.translateService.instant("justiciaGratuita.maestros.gestionCostesFijos.tipoActuacion"),
          "value": this.actuacion.tipoActuacionDesc
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.coste"),
          "value": this.actuacion.costeDesc
        },
        {
          "key": 'Comisaría/'+this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Juzgado"),
          "value": this.actuacion.comisariaJuzgado
        }
      ];

      //CAMPOS TARJETA JUSTIFICACION
      this.listaTarjetas[1].campos = [
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaJustificacion"),
          "value": this.actuacion.fechaJustificacion
        },
        {
          "key": this.translateService.instant("censo.fichaIntegrantes.literal.estado"),
          "value": this.actuacion.estado
        }
      ];

      this.listaTarjetas[2].campos = [
        {
          "key": this.translateService.instant("dato.jgr.guardia.saltcomp.fecha"),
          "value": this.datepipe.transform(this.actuacion.ultimaModificacion.fecha, "dd/MM/yyyy")
        },
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.inscripciones.accion"),
          "value": this.actuacion.ultimaModificacion.accion
        },
        {
          "key": this.translateService.instant("general.boton.usuario"),
          "value": this.actuacion.ultimaModificacion.usuario
        }
      ];

      if(this.actuacion.numDocumentos){
          this.listaTarjetas[3].campos = [
            {
              "key": this.translateService.instant("enviosMasivos.literal.numDocumentos"),
              "value": this.actuacion.numDocumentos
            }
          ];
      }else{
        this.listaTarjetas[3].campos = [
          {
            "key": null,
            "value": this.translateService.instant("justiciaGratuita.guardia.fichaactuacion.nodocumentacion")
          }
        ];
      }

      this.listaTarjetas.forEach(tarj => {
        if(tarj.nombre != 'Datos Generales'){
          tarj.detalle = true;
        }
      });
    }

  }

  ngAfterViewInit() {
    this.goTop();

    this.listaTarjetas.forEach(tarj => {
      let tarjTmp = {
        id: tarj.id,
        ref: document.getElementById(tarj.id),
        nombre: tarj.nombre
      };

      this.tarjetaFija.enlaces.push(tarjTmp);
    });

  }

  refreshTarjetas(event){
    if(!this.actuacion){
      this.actuacion = new ActuacionAsistenciaItem();
    }
    if(this.nuevaActuacion){
      this.nuevaActuacion = false;
    }
    this.actuacion.idActuacion = event;
    this.getActuacionData();
  }
  refreshHistorico(event){
    if(event && this.historicoComponent){//Si esta desplegada la tarjeta historico la refrescamos
      this.historicoComponent.getHistorico();
    }
  }
  getActuacionData(){

    if(this.asistencia && this.actuacion){

      this.progressSpinner = true;
      this.sigaServices.getParam("actuaciones_searchTarjetaActuacion","?anioNumero="+this.asistencia.anioNumero+"&idActuacion="+this.actuacion.idActuacion).subscribe(
        n => {
          this.actuacion = n.actuacionAsistenciaItems[0];
          this.initTarjetas();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );

    }

  }

  isOpenReceive(event) {
    let tarjTemp = this.listaTarjetas.find(tarj => tarj.id == event);

    if (tarjTemp.detalle) {
      tarjTemp.opened = true;
    }

  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo(){
    if(this.asistencia){
      sessionStorage.setItem('idAsistencia',this.asistencia.anioNumero);
    }
    this.router.navigate(['/fichaAsistencia']);
  }

}
