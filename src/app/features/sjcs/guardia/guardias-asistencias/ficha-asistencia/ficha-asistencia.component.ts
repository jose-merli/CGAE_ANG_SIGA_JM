import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { DatePipe, Location } from '@angular/common';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import { FichaAsistenciaTarjetaDatosGeneralesComponent } from './ficha-asistencia-tarjeta-datos-generales/ficha-asistencia-tarjeta-datos-generales.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ficha-asistencia',
  templateUrl: './ficha-asistencia.component.html',
  styleUrls: ['./ficha-asistencia.component.scss']
})
export class FichaAsistenciaComponent implements OnInit, AfterViewInit {

  msgs: Message[] = [];
  rutas: string[] = [];
  progressSpinner : boolean = false;
  preasistencia : PreAsistenciaItem;
  asistencia : TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
  listaTarjetas = [];
  tarjetaFija = {
    nombre: 'Resumen Asistencia',
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };
  @ViewChild(FichaAsistenciaTarjetaDatosGeneralesComponent) datosGenerales : FichaAsistenciaTarjetaDatosGeneralesComponent;
  constructor(private location : Location,
    private translateService : TranslateService,
    private sigaServices : SigaServices,
    private router : Router) { }

  ngOnInit() {

    this.preasistencia = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia")];


    //TARJETA FIJA RESUMEN
    let camposResumen = [
        {
          "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.annioNum"),
          "value": ''
        },
        {
          "key": this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.fecha"),
          "value": ''
        },
        {
          "key": this.translateService.instant("dato.jgr.guardia.inscripciones.letrado"),
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.asistido"),
          "value": ''
        },
        {
          "key": this.translateService.instant("censo.fichaIntegrantes.literal.estado"),
          "value": ''
        },
        {
          "key": 'Número de Actuaciones',
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.validada"),
          "value": ''
        }
    ]

    this.tarjetaFija.campos = camposResumen;

    //TARJETA DATOS GENERALES
    let tarjetaDatosGenerales = {
      nombre: 'Datos Generales',
      icono: 'fa fa-user',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [],
      enlaces: []
    };

    let camposDatosGenerales = [
      {
        "key": this.translateService.instant("dato.jgr.guardia.guardias.turno"),
        "value": ''
      },
      {
        "key": this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),
        "value": ''
      },
      {
        "key": this.translateService.instant("sjcs.guardia.asistencia.tipoasistenciacolegio"),
        "value": ''
      },
      {
        "key": this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.fecha") + ' ' + this.translateService.instant("agenda.fichaEventos.datosAsistencia.asistencia"),
        "value": ''
      }
    ]
    tarjetaDatosGenerales.campos = camposDatosGenerales;
    this.listaTarjetas.push (tarjetaDatosGenerales);

    //TARJETA ASISTIDO
    let tarjetaAsistido = {
      nombre: 'Asistido',
      icono: 'fa fa-user',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [],
      enlaces: [],
      enlaceCardOpen: { href: '/gestionJusticiables', title: this.translateService.instant("justiciaGratuita.justiciables.fichaJusticiable") }
    };

    let camposAsistido = [];
    if(this.preasistencia){

      camposAsistido = [
        {
          "key": null,
          "value": 'No existen asistidos asociados a la asistencia'
        }
      ]

    }else{
      camposAsistido = [
        {
          "key": this.translateService.instant("censo.fichaCliente.literal.identificacion"),
          "value": ''
        },
        {
          "key": this.translateService.instant("gratuita.mantenimientoTablasMaestra.literal.apellidos"),
          "value": ''
        },
        {
          "key": this.translateService.instant("administracion.parametrosGenerales.literal.nombre"),
          "value": ''
        }
      ]
    }
    tarjetaAsistido.campos = camposAsistido;
    this.listaTarjetas.push (tarjetaAsistido);

    //TARJETA CONTRARIOS
    let tarjetaContrarios = {
      nombre: 'Contrarios',
      icono: 'fa fa-users',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [],
      enlaces: [],
    };


    let camposContrarios = [];
    if(this.preasistencia){

      camposContrarios = [
        {
          "key": null,
          "value": 'No existen contrarios asociados a la asistencia'
        }
      ]

    }else{
      camposContrarios = [
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.identificadorprimero"),
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.apellidosnombreprimero"),
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.ncontrarios"),
          "value": ''
        }
      ]
    }
    tarjetaContrarios.campos = camposContrarios;
    this.listaTarjetas.push (tarjetaContrarios);

    //TARJETA DEFENSA JURIDICA
    let tarjetaDefensaJuridica = {
      nombre: "Defensa Jurídica",
      imagen: "",
      icono: "fa fa-university",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    }
    this.listaTarjetas.push(tarjetaDefensaJuridica);

    //TARJETA OBSERVACIONES
    let tarjetaObservaciones = {
      nombre: "Observaciones",
      imagen: "",
      icono: "fa fa-university",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    }
    this.listaTarjetas.push(tarjetaObservaciones);

    //TARJETA Relaciones
    let tarjetaRelaciones = {
      nombre: "Relaciones",
      imagen: "",
      icono: "fas fa-link icon-ficha",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    }
    if(this.preasistencia){
      tarjetaRelaciones.campos = [
        {
          "key": null,
          "value": 'No existen relaciones asociadas a la asistencia'
        }
      ]
    }else{
      tarjetaRelaciones.campos = [
        {
          "key": this.translateService.instant("justiciaGratuita.oficio.designas.interesados.identificador"),
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Dictamen"),
          "value": ''
        },
        {
          "key": this.translateService.instant("dato.jgr.guardia.saltcomp.fecha") + " " + this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Dictamen"),
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.maestros.fundamentosResolucion.resolucion"),
          "value": ''
        },
        {
          "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.FechaResolucion"),
          "value": ''
        }
      ]
  }
    this.listaTarjetas.push(tarjetaRelaciones);
  }

  ngAfterViewInit(){

    if(sessionStorage.getItem("idAsistencia")){
      let idAsistencia = sessionStorage.getItem("idAsistencia");
      this.searchTarjetaAsistencia(idAsistencia);
    }else if(sessionStorage.getItem("asistenciaAsistido")){
      let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
      this.searchTarjetaAsistencia(idAsistencia);
    }

  }
  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  refreshDatosGenerales(event){

    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_buscarTarjetaAsistencia", "?anioNumero="+event).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{
          let newAsistenciaData : TarjetaAsistenciaItem = n.tarjetaAsistenciaItems[0];

          this.tarjetaFija.campos[0]["value"] = newAsistenciaData.anioNumero;
          this.tarjetaFija.campos[1]["value"] = newAsistenciaData.fechaAsistencia.substr(0,11);
          this.tarjetaFija.campos[2]["value"] = newAsistenciaData.numeroColegiado + " - " + newAsistenciaData.nombreColegiado;
          this.tarjetaFija.campos[3]["value"] = newAsistenciaData.asistido;
          this.tarjetaFija.campos[4]["value"] = newAsistenciaData.descripcionEstado.toUpperCase();
          this.tarjetaFija.campos[5]["value"] = newAsistenciaData.numeroActuaciones;
          this.tarjetaFija.campos[6]["value"] = newAsistenciaData.validada;

          this.listaTarjetas[0].campos[0]["value"] = newAsistenciaData.descripcionTurno;
          this.listaTarjetas[0].campos[1]["value"] = newAsistenciaData.descripcionGuardia;
          this.listaTarjetas[0].campos[2]["value"] = newAsistenciaData.descripcionTipoAsistenciaColegio;
          this.listaTarjetas[0].campos[3]["value"] = newAsistenciaData.fechaAsistencia;

          let camposAsistido = [];
          if(!newAsistenciaData.nif){
              camposAsistido = [
                {
                  "key": null,
                  "value": 'No existen asistidos asociados a la asistencia'
                }
              ]
          }else{
            camposAsistido = [
              {
                "key": this.translateService.instant("censo.fichaCliente.literal.identificacion"),
                "value": newAsistenciaData.nif
              },
              {
                "key": this.translateService.instant("gratuita.mantenimientoTablasMaestra.literal.apellidos"),
                "value": newAsistenciaData.apellido1 + " " + newAsistenciaData.apellido2 
              },
              {
                "key": this.translateService.instant("administracion.parametrosGenerales.literal.nombre"),
                "value": newAsistenciaData.nombre
              }
            ]
          }
          this.listaTarjetas[1].campos = camposAsistido;

          let camposContrarios = [];
          if( !newAsistenciaData.numContrarios //Si esta vacio
            || (newAsistenciaData.numContrarios && newAsistenciaData.numContrarios == '0')){ //O si viene relleno y vale 0

            camposContrarios = [
              {
                "key": null,
                "value": 'No existen contrarios asociados a la asistencia'
              }
            ]

          }else{
            camposContrarios = [
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.identificadorprimero"),
                "value": newAsistenciaData.primerContrario.nif
              },
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.apellidosnombreprimero"),
                "value": newAsistenciaData.primerContrario.apellidosnombre
              },
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.ncontrarios"),
                "value": newAsistenciaData.numContrarios
              }
            ]
          }
          this.listaTarjetas[2].campos = camposContrarios;

          let camposRelaciones = [];
          if(!newAsistenciaData.primeraRelacion){
            camposRelaciones = [
              {
                "key": null,
                "value": 'No existen relaciones asociadas a la asistencia'
              }
            ]
          }else{
            camposRelaciones =[
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.interesados.identificador"),
                "value": newAsistenciaData.primeraRelacion.sjcs
              },
              {
                "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Dictamen"),
                "value": newAsistenciaData.primeraRelacion.dictamen
              },
              {
                "key": this.translateService.instant("dato.jgr.guardia.saltcomp.fecha") + " " + this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Dictamen"),
                "value": newAsistenciaData.primeraRelacion.fechaDictamen
              },
              {
                "key": this.translateService.instant("justiciaGratuita.maestros.fundamentosResolucion.resolucion"),
                "value": newAsistenciaData.primeraRelacion.resolucion
              },
              {
                "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.FechaResolucion"),
                "value": newAsistenciaData.primeraRelacion.fechaResolucion
              }
            ]
          }
          this.listaTarjetas[5].campos = camposRelaciones;

        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () =>{
        this.progressSpinner = false;
      }
    );

  }

  searchTarjetaAsistencia(idAsistencia){

    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_buscarTarjetaAsistencia", "?anioNumero="+idAsistencia).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{
          let newAsistenciaData : TarjetaAsistenciaItem = n.tarjetaAsistenciaItems[0];

          this.tarjetaFija.campos[0]["value"] = newAsistenciaData.anioNumero;
          this.tarjetaFija.campos[1]["value"] = newAsistenciaData.fechaAsistencia.substr(0,11);
          this.tarjetaFija.campos[2]["value"] = newAsistenciaData.numeroColegiado + " - " + newAsistenciaData.nombreColegiado;
          this.tarjetaFija.campos[3]["value"] = newAsistenciaData.asistido;
          this.tarjetaFija.campos[4]["value"] = newAsistenciaData.descripcionEstado.toUpperCase();
          this.tarjetaFija.campos[5]["value"] = newAsistenciaData.numeroActuaciones;
          this.tarjetaFija.campos[6]["value"] = newAsistenciaData.validada;

          this.listaTarjetas[0].campos[0]["value"] = newAsistenciaData.descripcionTurno;
          this.listaTarjetas[0].campos[1]["value"] = newAsistenciaData.descripcionGuardia;
          this.listaTarjetas[0].campos[2]["value"] = newAsistenciaData.descripcionTipoAsistenciaColegio;
          this.listaTarjetas[0].campos[3]["value"] = newAsistenciaData.fechaAsistencia;

          let camposAsistido = [];
          if(!newAsistenciaData.nif){
              camposAsistido = [
                {
                  "key": null,
                  "value": 'No existen asistidos asociados a la asistencia'
                }
              ]
          }else{
            camposAsistido = [
              {
                "key": this.translateService.instant("censo.fichaCliente.literal.identificacion"),
                "value": newAsistenciaData.nif
              },
              {
                "key": this.translateService.instant("gratuita.mantenimientoTablasMaestra.literal.apellidos"),
                "value": newAsistenciaData.apellido1 + " " + newAsistenciaData.apellido2 
              },
              {
                "key": this.translateService.instant("administracion.parametrosGenerales.literal.nombre"),
                "value": newAsistenciaData.nombre
              }
            ]
          }
          this.listaTarjetas[1].campos = camposAsistido;

          let camposContrarios = [];
          if( !newAsistenciaData.numContrarios //Si esta vacio
            || (newAsistenciaData.numContrarios && newAsistenciaData.numContrarios == '0')){ //O si viene relleno y vale 0

            camposContrarios = [
              {
                "key": null,
                "value": 'No existen contrarios asociados a la asistencia'
              }
            ]

          }else{
            camposContrarios = [
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.identificadorprimero"),
                "value": newAsistenciaData.primerContrario.nif
              },
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.apellidosnombreprimero"),
                "value": newAsistenciaData.primerContrario.apellidosnombre
              },
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.ncontrarios"),
                "value": newAsistenciaData.numContrarios
              }
            ]
          }
          this.listaTarjetas[2].campos = camposContrarios;

          let camposRelaciones = [];
          if(!newAsistenciaData.primeraRelacion){
            camposRelaciones = [
              {
                "key": null,
                "value": 'No existen relaciones asociadas a la asistencia'
              }
            ]
          }else{
            camposRelaciones =[
              {
                "key": this.translateService.instant("justiciaGratuita.oficio.designas.interesados.identificador"),
                "value": newAsistenciaData.primeraRelacion.sjcs
              },
              {
                "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Dictamen"),
                "value": newAsistenciaData.primeraRelacion.dictamen
              },
              {
                "key": this.translateService.instant("dato.jgr.guardia.saltcomp.fecha") + " " + this.translateService.instant("justiciaGratuita.ejg.datosGenerales.Dictamen"),
                "value": newAsistenciaData.primeraRelacion.fechaDictamen
              },
              {
                "key": this.translateService.instant("justiciaGratuita.maestros.fundamentosResolucion.resolucion"),
                "value": newAsistenciaData.primeraRelacion.resolucion
              },
              {
                "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.FechaResolucion"),
                "value": newAsistenciaData.primeraRelacion.fechaResolucion
              }
            ]
          }
          this.listaTarjetas[5].campos = camposRelaciones;

          this.asistencia = newAsistenciaData;
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () =>{
        this.progressSpinner = false;
        sessionStorage.removeItem("idAsistencia");
        sessionStorage.removeItem("asistenciaAsistido");
      }
    );


  }

  backTo(){
    if(this.preasistencia){
      this.router.navigate(['/fichaPreasistencia']);
    }else{
      this.router.navigate(['/guardiasAsistencias']);
    }
  }
}
