import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { DatePipe, Location } from '@angular/common';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import { FichaAsistenciaTarjetaDatosGeneralesComponent } from './ficha-asistencia-tarjeta-datos-generales/ficha-asistencia-tarjeta-datos-generales.component';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';

@Component({
  selector: 'app-ficha-asistencia',
  templateUrl: './ficha-asistencia.component.html',
  styleUrls: ['./ficha-asistencia.component.scss']
})
export class FichaAsistenciaComponent implements OnInit, AfterViewInit, OnDestroy {

  msgs: Message[] = [];
  rutas: string[] = [];
  progressSpinner: boolean = false;
  preasistencia: PreAsistenciaItem;
  asistencia: TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
  visibleTarjetaCaract: boolean = false;
  editable: boolean = true;
  nuevaAsistencia: boolean = false;
  tarjetaFija = {
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.resumen.asistencias'),
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };
  listaTarjetas = [{
    id: 'datosgenerales',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.datos.generales'),
    icono: 'fa fa-user',
    detalle: true,
    fixed: false,
    opened: false,
    campos: [],
    enlaces: [],
    visible: true,
  },
  {
    id: 'asistido',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.aistencias.asistido'),
    icono: 'fa fa-user',
    detalle: true,
    fixed: false,
    opened: false,
    campos: [],
    enlaces: [],
    visible: true,
    enlaceCardOpen: { href: '/gestionJusticiables', title: this.translateService.instant("justiciaGratuita.justiciables.fichaJusticiable") }
  },
  {
    id: 'contrarios',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.aistencias.contrarios'),
    icono: 'fa fa-users',
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: [],
    enlaces: [],
  },
  {
    id: 'defensajuridica',
    nombre: "Defensa Jurídica",
    imagen: "",
    icono: "fa fa-university",
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: []
  },
  {
    id: 'observaciones',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.aistencias.observaciones'),
    imagen: "",
    icono: "fa fa-university",
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: []
  },
  {
    id: 'relaciones',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.aistencias.relaciones'),
    imagen: "",
    icono: "fas fa-link icon-ficha",
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: []
  },
  {
    id: 'documentacion',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.aistencias.documentacion'),
    imagen: "",
    icono: "fa fa-briefcase",
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: []
  },
  {
    id: 'caracteristicas',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.aistencias.caracteristicas'),
    imagen: "",
    icono: 'fa fa-briefcase',
    detalle: true,
    fixed: false,
    opened: false,
    visible: this.visibleTarjetaCaract,
    campos: []
  },
  {
    id: 'actuaciones',
    nombre: this.translateService.instant('justiciaGratuita.oficio.designas.actuaciones.actuaciones'),
    imagen: "",
    icono: 'fa fa-map-marker',
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: []
  }];
  datosTarjetaFacGenerica: string;
  openTarjetaFac: Boolean = false;
  modoLectura: Boolean = false;
  datosJusticiables: JusticiableItem;

  @ViewChild(FichaAsistenciaTarjetaDatosGeneralesComponent) datosGenerales: FichaAsistenciaTarjetaDatosGeneralesComponent;
  constructor(private location: Location,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router,
    private datePipe: DatePipe,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.nuevaAsistencia = true;
    this.preasistencia = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia")];
    if (sessionStorage.getItem("nuevaAsistencia")) {
      this.nuevaAsistencia = true;
      this.msgs = [];
      sessionStorage.removeItem("nuevaAsistencia");
    }
    // Recargar las tarjetas por defectos.
    this.commonServices.checkAcceso(procesos_guardia.tarjeta_caracteristicas_asistencias)
      .then(respuesta => {
        this.visibleTarjetaCaract = respuesta; //Si es undefined se oculta, si es false la mostramos pero ineditable
        this.listaTarjetas.find(tarj => tarj.id == 'caracteristicas').visible = this.visibleTarjetaCaract;
        this.initTarjetas();
      }).catch(error => console.error(error));

    // Cargar datos para las tarjetas de Asistencias.
    if (sessionStorage.getItem("idAsistencia")) {
      // Controlar el MSG de error pasando TRUE la asistencia
      this.nuevaAsistencia = false;
      let idAsistencia = sessionStorage.getItem("idAsistencia");
      this.datosTarjetaFacGenerica = sessionStorage.getItem("idAsistencia");
      this.searchTarjetaAsistencia(idAsistencia);
    } else if (sessionStorage.getItem("asistenciaAsistido")) {
      this.nuevaAsistencia = false;
      let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
      this.searchTarjetaAsistencia(idAsistencia);
    }

    // Datos Justiciables
    if (sessionStorage.getItem("justiciable")) {
      this.datosJusticiables = JSON.parse(sessionStorage.getItem("justiciable"));
    }

  }

  ngAfterViewInit() {
    this.goTop();
  }

  ngOnDestroy() {
    if (sessionStorage.getItem("vieneDeFichaDesigna")) sessionStorage.removeItem("vieneDeFichaDesigna");
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  initTarjetas() {
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
        "key": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.numeroactuaciones"),
        "value": ''
      },
      {
        "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.validada"),
        "value": ''
      }
    ]

    this.tarjetaFija.campos = camposResumen;

    if (sessionStorage.getItem("justiciable")) {
      this.tarjetaFija.campos[3].value = this.datosJusticiables.apellidos + ", " + this.datosJusticiables.nombre;
    }

    //TARJETA DATOS GENERALES
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
    
    let tarjDatosGen =  this.listaTarjetas.find(tarjDatosGen => tarjDatosGen.id === 'datosgenerales');
    if(tarjDatosGen != undefined){
      tarjDatosGen.campos  = camposDatosGenerales
      if (this.preasistencia || this.nuevaAsistencia) {
        tarjDatosGen.opened = true;
      }
    }

   

    //TARJETA ASISTIDO
    let camposAsistido = [];
    if (this.preasistencia || this.nuevaAsistencia) {
      // Crear ASISTENCIA y asociar Justiciable
      if (sessionStorage.getItem("justiciable")) {
        camposAsistido = [
          {
            "key": null,
            "value": this.datosJusticiables.apellidos + ", " + this.datosJusticiables.nombre
          }
        ]
      } else {
        camposAsistido = [
          {
            "key": null,
            "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noasistidos")
          }
        ]
      }
    } else {
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

    let tarjAsistido =  this.listaTarjetas.find(tarjAsistido => tarjAsistido.id === 'asistido');
    if(tarjAsistido != undefined){
      tarjAsistido.campos  = camposAsistido
    }
    //TARJETA CONTRARIOS
    let camposContrarios = [];
    if (this.preasistencia || this.nuevaAsistencia) {

      camposContrarios = [
        {
          "key": null,
          "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.nocontrarios")
        }
      ]

    } else {
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
    let tarjContra =  this.listaTarjetas.find(tarjContra => tarjContra.id === 'contrarios');
    if(tarjContra != undefined){
      tarjContra.campos  = camposContrarios
    }

    //Observaciones - no tiene campos
    //Defensa juridica - no tiene campos

    //TARJETA Relaciones[5]
    if (this.preasistencia || this.nuevaAsistencia) {
      let tarjRelaciones =  this.listaTarjetas.find(tarjRelaciones => tarjRelaciones.id === 'relaciones');
            if(tarjRelaciones != undefined){
              tarjRelaciones.campos  = [
                {
                  "key": null,
                  "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.norelaciones")
                }
              ]
            }
    } else {
      let tarjRelaciones =  this.listaTarjetas.find(tarjRelaciones => tarjRelaciones.id === 'relaciones');
      if(tarjRelaciones != undefined){
        tarjRelaciones.campos  = [
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

    }

    //TARJETA Documentacion
    if (this.preasistencia || this.nuevaAsistencia) {
      let tarjDocu =  this.listaTarjetas.find(tarjDocu => tarjDocu.id === 'documentacion');
            if(tarjDocu != undefined){
              tarjDocu.campos  = [
                {
                  "key": null,
                  "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.nodocumentacion")
                }
              ]
            }

    } else {
      let tarjDocu =  this.listaTarjetas.find(tarjDocu => tarjDocu.id === 'documentacion');
      if(tarjDocu != undefined){
        tarjDocu.campos  = [
          {
            "key": this.translateService.instant("enviosMasivos.literal.numDocumentos"),
            "value": ''
          }
        ]
      }
    }

    //TARJETA CARACTERISTICAS - no tiene campos

    //TARJETA ACTUACIONES
    if (this.preasistencia || (this.asistencia && !this.asistencia.numeroActuaciones) || this.nuevaAsistencia) {

      let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
      if(tarjActuaciones != undefined){
        tarjActuaciones.campos  = [
          {
            "key": null,
            "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noactuaciones")
          }
        ]
      }

    } else if (this.asistencia.numeroActuaciones == "1" && this.asistencia.actuaciones && this.asistencia.actuaciones.length > 0) {

      let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
      if(tarjActuaciones != undefined){
        tarjActuaciones.campos  =  [
          {
            "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaActuacion"),
            "value": ''
          },
          {
            "key": this.translateService.instant("justiciaGratuita.maestros.gestionCostesFijos.tipoActuacion"),
            "value": ''
          },
          {
            "key": this.translateService.instant("gratuita.busquedaAsistencias.literal.numero") + " " + this.translateService.instant("enviosMasivos.literal.asunto"),
            "value": ''
          }
        ]
      }

    } else if (Number(this.asistencia.numeroActuaciones) > 1) {
      let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
      if(tarjActuaciones != undefined){
        tarjActuaciones.campos  = [
          {
            "key": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.justificadas"),
            "value": ''
          },
          {
            "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.validada") + 's',
            "value": ''
          },
          {
            "key": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.facturadas"),
            "value": ''
          },
          {
            "key": this.translateService.instant("gratuita.busquedaAsistencias.literal.numero") + " Actuaciones",
            "value": ''
          }
        ]
      }

    }

    this.listaTarjetas.forEach(tarj => {
      if (tarj.visible !== undefined) {
        let tarjTmp = {
          id: tarj.id,
          ref: document.getElementById(tarj.id),
          nombre: tarj.nombre
        };

        this.tarjetaFija.enlaces.push(tarjTmp);
      }

      if (tarj.nombre != 'Datos Generales') { //Durante la creacion, deshabilitamos las tarjetas que no sean la de datos generales
        tarj.detalle = false;
      }
    });
    let tarjTmp = {
      id: 'facSJCSTarjFacGene',
      ref: document.getElementById('facSJCSTarjFacGene'),
      nombre: this.translateService.instant("facturacionSJCS.tarjGenFac.facturaciones")
    };

    this.tarjetaFija.enlaces.push(tarjTmp);
  }

  refreshDatosGenerales(event) {

    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_buscarTarjetaAsistencia", "?anioNumero=" + event).subscribe(
      n => {
        this.clear();
        if (n.error !== null
          && n.error.code === 500) {
          this.showMsg("error", "Error", n.error.description.toString());
        } else {
          var newAsistenciaData: TarjetaAsistenciaItem = n.tarjetaAsistenciaItems[0];
          this.editable = newAsistenciaData.estado == '1';
          this.tarjetaFija.campos[0]["value"] = newAsistenciaData.anioNumero;
          this.tarjetaFija.campos[1]["value"] = newAsistenciaData.fechaAsistencia.substr(0, 11);
          this.tarjetaFija.campos[2]["value"] = newAsistenciaData.numeroColegiado + " - " + newAsistenciaData.nombreColegiado;
          this.tarjetaFija.campos[3]["value"] = newAsistenciaData.asistido;
          this.tarjetaFija.campos[4]["value"] = newAsistenciaData.descripcionEstado ? newAsistenciaData.descripcionEstado.toUpperCase() : "";
          this.tarjetaFija.campos[5]["value"] = newAsistenciaData.numeroActuaciones;
          this.tarjetaFija.campos[6]["value"] = newAsistenciaData.validada;

          let tarjDatosGen =  this.listaTarjetas.find(tarjDatosGen => tarjDatosGen.id === 'datosgenerales');
          if(tarjDatosGen != undefined){
            tarjDatosGen.campos[0]["value"] = newAsistenciaData.descripcionTurno;
            tarjDatosGen.campos[1]["value"] = newAsistenciaData.descripcionGuardia;
            tarjDatosGen.campos[2]["value"] = newAsistenciaData.descripcionTipoAsistenciaColegio;
            tarjDatosGen.campos[3]["value"] = newAsistenciaData.fechaAsistencia;
          }


          let camposAsistido = [];
          let asistenciaDuplicada = sessionStorage.getItem("asistenciaCopy");
          if (asistenciaDuplicada == undefined || asistenciaDuplicada == null) {
            if (!newAsistenciaData.idPersonaJg) {
              camposAsistido = [
                {
                  "key": null,
                  "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noasistidos")
                }
              ]
            } else {
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
          } else {
            sessionStorage.removeItem("asistenciaCopy");
          }
          let tarjAsistido =  this.listaTarjetas.find(tarjAsistido => tarjAsistido.id === 'asistido');
          if(tarjAsistido != undefined){
            tarjAsistido.campos  = camposAsistido
          }

          let camposContrarios = [];
          if (!newAsistenciaData.numContrarios //Si esta vacio
            || (newAsistenciaData.numContrarios && newAsistenciaData.numContrarios == '0')) { //O si viene relleno y vale 0

            camposContrarios = [
              {
                "key": null,
                "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noactuaciones")
              }
            ]

          } else {
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
          let tarjContra =  this.listaTarjetas.find(tarjContra => tarjContra.id === 'contrarios');
          if(tarjContra != undefined){
            tarjContra.campos  = camposContrarios
          }

          let camposRelaciones = [];
          if (!newAsistenciaData.primeraRelacion) {
            camposRelaciones = [
              {
                "key": null,
                "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.norelaciones")
              }
            ]
          } else {
            let fechaDictamen: string = '';
            let fechaResolucion: string = '';
            if (newAsistenciaData.primeraRelacion.fechadictamen) {
              fechaDictamen = this.datePipe.transform(newAsistenciaData.primeraRelacion.fechadictamen, 'dd/MM/yyyy');
            }
            if (newAsistenciaData.primeraRelacion.fecharesolucion) {
              fechaResolucion = this.datePipe.transform(newAsistenciaData.primeraRelacion.fecharesolucion, 'dd/MM/yyyy');
            }

            if (newAsistenciaData.primeraRelacion.sjcs.startsWith("E")) {

              camposRelaciones = [
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
                  "value": fechaDictamen
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.maestros.fundamentosResolucion.resolucion"),
                  "value": newAsistenciaData.primeraRelacion.resolucion
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.FechaResolucion"),
                  "value": fechaResolucion
                }
              ]
            } else if (newAsistenciaData.primeraRelacion.sjcs.startsWith("D")) {
              camposRelaciones = [
                {
                  "key": this.translateService.instant("justiciaGratuita.oficio.designas.interesados.identificador"),
                  "value": newAsistenciaData.primeraRelacion.sjcs
                },
                {
                  "key": this.translateService.instant("dato.jgr.guardia.guardias.turno"),
                  "value": newAsistenciaData.primeraRelacion.descturno
                },
                {
                  "key": this.translateService.instant("dato.jgr.guardia.inscripciones.letrado"),
                  "value": newAsistenciaData.primeraRelacion.letrado
                }
              ]
            }
          }
          let tarjRelaciones =  this.listaTarjetas.find(tarjRelaciones => tarjRelaciones.id === 'relaciones');
          if(tarjRelaciones != undefined){
            tarjRelaciones.campos  =  camposRelaciones
          }

          let camposDocumentacion = [];
          if (!newAsistenciaData.numDocumentos) {
            camposDocumentacion = [
              {
                "key": null,
                "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.nodocumentacion")
              }
            ]
          } else {
            camposDocumentacion = [
              {
                "key": this.translateService.instant("enviosMasivos.literal.numDocumentos"),
                "value": newAsistenciaData.numDocumentos
              }
            ]
          }

          let tarjDocu =  this.listaTarjetas.find(tarjDocu => tarjDocu.id === 'documentacion');
          if(tarjDocu != undefined){
            tarjDocu.campos  = camposDocumentacion
          }

          if (!newAsistenciaData.numeroActuaciones || newAsistenciaData.numeroActuaciones == "0") {
          let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
              if(tarjActuaciones != undefined){
                tarjActuaciones.campos  = [
                  {
                    "key": null,
                    "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noactuaciones")
                  }
                ]
              }


          } else if (newAsistenciaData.numeroActuaciones == "1" && newAsistenciaData.actuaciones && newAsistenciaData.actuaciones.length > 0) {
            let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
            if(tarjActuaciones != undefined){
              tarjActuaciones.campos  = [
                {
                  "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaActuacion"),
                  "value": newAsistenciaData.actuaciones[0].fechaActuacion
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.maestros.gestionCostesFijos.tipoActuacion"),
                  "value": newAsistenciaData.actuaciones[0].tipoActuacionDesc
                },
                {
                  "key": this.translateService.instant("gratuita.busquedaAsistencias.literal.numero") + " " + this.translateService.instant("enviosMasivos.literal.asunto"),
                  "value": newAsistenciaData.actuaciones[0].numeroAsunto
                }
              ]
            }

          } else if (Number(newAsistenciaData.numeroActuaciones) > 1) {
            let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
              if(tarjActuaciones != undefined){
                tarjActuaciones.campos  = [
                  {
                    "key": 'Justificadas',
                    "value": newAsistenciaData.numJustificadas
                  },
                  {
                    "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.validada") + 's',
                    "value": newAsistenciaData.numValidadas
                  },
                  {
                    "key": 'Facturadas',
                    "value": newAsistenciaData.numFacturadas
                  },
                  {
                    "key": this.translateService.instant("gratuita.busquedaAsistencias.literal.numero") + " Actuaciones",
                    "value": newAsistenciaData.numeroActuaciones
                  }
                ]
              }

          }

          this.listaTarjetas.forEach(tarj => {
            if (tarj.id != 'datosgenerales' && tarj.id != 'caracteristicas') { //Una vez creada la asistencia, dejamos abrir las demas tarjetas
              tarj.detalle = true;
            }
          });

          this.asistencia = newAsistenciaData;
          this.progressSpinner = false;
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  searchTarjetaAsistencia(idAsistencia) {

    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_buscarTarjetaAsistencia", "?anioNumero=" + idAsistencia).subscribe(
      n => {
        this.clear();
        if (n.error !== null
          && n.error.code === 500) {
          this.showMsg("error", "Error", n.error.description.toString());
        } else {
          var newAsistenciaData: TarjetaAsistenciaItem = n.tarjetaAsistenciaItems[0];
          //console.log('newAsistenciaData.estado: ', newAsistenciaData.estado)
          //console.log('newAsistenciaData.estado: ', newAsistenciaData.estado)
          if (newAsistenciaData.estado == '2') {
            //anulada
            this.modoLectura = true;
          }
          this.editable = newAsistenciaData.estado == '1';
          this.tarjetaFija.campos[0]["value"] = newAsistenciaData.anioNumero;
          this.tarjetaFija.campos[1]["value"] = newAsistenciaData.fechaAsistencia.substr(0, 11);
          this.tarjetaFija.campos[2]["value"] = newAsistenciaData.numeroColegiado + " - " + newAsistenciaData.nombreColegiado;
          this.tarjetaFija.campos[3]["value"] = newAsistenciaData.asistido;
          this.tarjetaFija.campos[4]["value"] = newAsistenciaData.descripcionEstado ? newAsistenciaData.descripcionEstado.toUpperCase() : "";
          this.tarjetaFija.campos[5]["value"] = newAsistenciaData.numeroActuaciones;
          this.tarjetaFija.campos[6]["value"] = newAsistenciaData.validada;


          let tarjDatosGen =  this.listaTarjetas.find(tarjDatosGen => tarjDatosGen.id === 'datosgenerales');
          if(tarjDatosGen != undefined){
            tarjDatosGen.campos[0]["value"] = newAsistenciaData.descripcionTurno;
            tarjDatosGen.campos[1]["value"] = newAsistenciaData.descripcionGuardia;
            tarjDatosGen.campos[2]["value"] = newAsistenciaData.descripcionTipoAsistenciaColegio;
            tarjDatosGen.campos[3]["value"] = newAsistenciaData.fechaAsistencia;
  
          }

          let camposAsistido = [];
          if (!newAsistenciaData.idPersonaJg) {
            camposAsistido = [
              {
                "key": null,
                "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noasistidos")
              }
            ]
          } else {
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

          let tarjAsistido =  this.listaTarjetas.find(tarjAsistido => tarjAsistido.id === 'asistido');
          if(tarjAsistido != undefined){
            tarjAsistido.campos  = camposAsistido
          }

          let camposContrarios = [];
          if (!newAsistenciaData.numContrarios //Si esta vacio
            || (newAsistenciaData.numContrarios && newAsistenciaData.numContrarios == '0')) { //O si viene relleno y vale 0

            camposContrarios = [
              {
                "key": null,
                "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.nocontrarios")
              }
            ]

          } else {
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
          let tarjContra =  this.listaTarjetas.find(tarjContra => tarjContra.id === 'contrarios');
          if(tarjContra != undefined){
            tarjContra.campos  = camposContrarios
          }

          let camposRelaciones = [];
          if (!newAsistenciaData.primeraRelacion) {
            camposRelaciones = [
              {
                "key": null,
                "value": this.translateService.instant('justiciaGratuita.guardia.fichaasistencia.norelaciones')
              }
            ]
          } else {
            let fechaDictamen: string = '';
            let fechaResolucion: string = '';
            if (newAsistenciaData.primeraRelacion.fechadictamen) {
              fechaDictamen = this.datePipe.transform(newAsistenciaData.primeraRelacion.fechadictamen, 'dd/MM/yyyy');
            }
            if (newAsistenciaData.primeraRelacion.fecharesolucion) {
              fechaResolucion = this.datePipe.transform(newAsistenciaData.primeraRelacion.fecharesolucion, 'dd/MM/yyyy');
            }
            if (newAsistenciaData.primeraRelacion.sjcs.startsWith("E")) {

              camposRelaciones = [
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
                  "value": fechaDictamen
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.maestros.fundamentosResolucion.resolucion"),
                  "value": newAsistenciaData.primeraRelacion.resolucion
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.FechaResolucion"),
                  "value": fechaResolucion
                }
              ]
            } else if (newAsistenciaData.primeraRelacion.sjcs.startsWith("D")) {
              camposRelaciones = [
                {
                  "key": this.translateService.instant("justiciaGratuita.oficio.designas.interesados.identificador"),
                  "value": newAsistenciaData.primeraRelacion.sjcs
                },
                {
                  "key": this.translateService.instant("dato.jgr.guardia.guardias.turno"),
                  "value": newAsistenciaData.primeraRelacion.descturno
                },
                {
                  "key": this.translateService.instant("dato.jgr.guardia.inscripciones.letrado"),
                  "value": newAsistenciaData.primeraRelacion.letrado
                }
              ]
            }
          }
          let tarjRelaciones =  this.listaTarjetas.find(tarjRelaciones => tarjRelaciones.id === 'relaciones');
          if(tarjRelaciones != undefined){
            tarjRelaciones.campos  = camposRelaciones
          }

          let camposDocumentacion = [];
          if (!newAsistenciaData.numDocumentos) {
            camposDocumentacion = [
              {
                "key": null,
                "value": this.translateService.instant('justiciaGratuita.guardia.fichaasistencia.nodocumentacion')
              }
            ]
          } else {
            camposDocumentacion = [
              {
                "key": this.translateService.instant("enviosMasivos.literal.numDocumentos"),
                "value": newAsistenciaData.numDocumentos
              }
            ]
          }
          let tarjDocu =  this.listaTarjetas.find(tarjDocu => tarjDocu.id === 'documentacion');
          if(tarjDocu != undefined){
            tarjDocu.campos  = camposDocumentacion
          }

          if (!newAsistenciaData.numeroActuaciones || newAsistenciaData.numeroActuaciones == "0") {
            let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
            if(tarjActuaciones != undefined){
              tarjActuaciones.campos  = [
                {
                  "key": null,
                  "value": this.translateService.instant("justiciaGratuita.guardia.fichaasistencia.noactuaciones")
                }
              ]
            }

          } else if (newAsistenciaData.numeroActuaciones == "1" && newAsistenciaData.actuaciones && newAsistenciaData.actuaciones.length > 0) {
            let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
            if(tarjActuaciones != undefined){
              tarjActuaciones.campos  = [
                {
                  "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaActuacion"),
                  "value": newAsistenciaData.actuaciones[0].fechaActuacion
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.maestros.gestionCostesFijos.tipoActuacion"),
                  "value": newAsistenciaData.actuaciones[0].tipoActuacionDesc
                },
                {
                  "key": this.translateService.instant("gratuita.busquedaAsistencias.literal.numero") + " " + this.translateService.instant("enviosMasivos.literal.asunto"),
                  "value": newAsistenciaData.actuaciones[0].numeroAsunto
                }
              ]
            }

          } else if (Number(newAsistenciaData.numeroActuaciones) > 1) {
            let tarjActuaciones =  this.listaTarjetas.find(tarjActuaciones => tarjActuaciones.id === 'actuaciones');
            if(tarjActuaciones != undefined){
              tarjActuaciones.campos  = [
                {
                  "key": 'Justificadas',
                  "value": newAsistenciaData.numJustificadas
                },
                {
                  "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.validada") + 's',
                  "value": newAsistenciaData.numValidadas
                },
                {
                  "key": 'Facturadas',
                  "value": newAsistenciaData.numFacturadas
                },
                {
                  "key": this.translateService.instant("gratuita.busquedaAsistencias.literal.numero") + " Actuaciones",
                  "value": newAsistenciaData.numeroActuaciones
                }
              ]
            }

          }

          this.asistencia = newAsistenciaData;

          this.listaTarjetas.forEach(tarj => {
            if (tarj.nombre != 'Datos Generales') { //Una vez creada la asistencia, dejamos abrir las demas tarjetas
              tarj.detalle = true;
            }
          });

        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        sessionStorage.removeItem("idAsistencia");
        sessionStorage.removeItem("asistenciaAsistido");
      }
    );


  }

  isOpenReceive(event) {
    let tarjTemp = this.listaTarjetas.find(tarj => tarj.id == event);

    if (tarjTemp.detalle) {
      tarjTemp.opened = true;
    }

    if (event && event == 'facSJCSTarjFacGene') {
      this.openTarjetaFac = true;
    }

  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo() {
    if (sessionStorage.getItem("vieneDeFichaDesigna")) this.location.back();

    if (this.preasistencia) {
      this.router.navigate(['/fichaPreasistencia']);
    } else {
      sessionStorage.setItem("volver", "true");
      this.location.back();
    }
  }

  guardarDatos() {
    sessionStorage.setItem("idAsistencia", this.datosTarjetaFacGenerica);
  }

  eventoAnular(anular) {
    this.modoLectura = anular;
    //to do: pasarselo a el resto de tarjetas para anular botones
  }
}
