import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ConfirmationService } from 'primeng/api';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { DataTable, Dialog } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { saveAs } from "file-saver/FileSaver";
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { EjgService } from '../services/ejg.service';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';

@Component({
  selector: 'app-unidad-familiar',
  templateUrl: './unidad-familiar.component.html',
  styleUrls: ['./unidad-familiar.component.scss']
})
export class UnidadFamiliarComponent implements OnInit {

  @ViewChild("table") table: DataTable;

  solicitanteP: UnidadFamiliarEJGItem = new UnidadFamiliarEJGItem();

  rowsPerPage: any = [];
  selectedDatos = [];
  buscadores = [];
  nExpedientes;

  nuevo: boolean;
  body: EJGItem = new EJGItem();
  selectAll;
  cols;
  msgs;
  datosFamiliares;
  datosFamiliaresActivos;
  apellidosCabecera: string = "";
  estadoEEJG: string = "No solicitado";

  selectionMode;
  editMode;
  progressSpinner: boolean = false;
  selectDatos;

  numSelected: number = 0;
  selectedItem: number = 10;
  volverSolicitarEejg: boolean = false;
  solicitarEEJG: boolean = false;
  descargarEEJG: boolean = false;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  openFicha: boolean = false;
  historico: boolean = false;
  isRepresentante: boolean = false;
  resaltadoDatosGenerales: boolean = false;
  activacionTarjeta: boolean = false;

  @Input() modoEdicion;
  @Input() tarjetaUnidadFamiliar: string;
  permisoEscritura: boolean = false;
  @Input() openTarjetaUnidadFamiliar;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() opened = new EventEmitter<boolean>();
  @Output() idOpened = new EventEmitter<boolean>();
  @Output() updateRes = new EventEmitter<boolean>();

  @ViewChild("cdDelete") cdDelete: Dialog;

  idClasesComunicacionArray: string[] = [];
	idClaseComunicacion: String;
	keys: any[] = [];


  fichaPosible = {
    key: "unidadFamiliar",
    activa: false
  }

  comboEstadosExpEco = [
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.inicial'), value: "10" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.inicialEsperando'), value: "15" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.espera'), value: "20" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.esperaEsperando'), value: "25" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.pendienteInfo'), value: "23" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.finalizado'), value: "30" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.errorSolicitud'), value: "40" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.errorConsultaInfo'), value: "50" },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.caducado'), value: "60" }
  ];

  constructor(private changeDetectorRef: ChangeDetectorRef, private confirmationService: ConfirmationService,
    private persistenceService: PersistenceService, private router: Router,
    private datepipe: DatePipe,
    private commonsService: CommonsService, private translateService: TranslateService,
    private sigaServices: SigaServices,
    private ejgService: EjgService) { }

  ngOnInit() {
    this.progressSpinner = false;
    this.getCols();
    if (this.persistenceService.getDatosEJG()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatosEJG();
      //this.datosFamiliares = this.persistenceService.getBodyAux();

      this.consultaUnidadFamiliar(this.body);

    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      // this.body = new EJGItem();
    }

    if (sessionStorage.getItem('tarjeta') == 'unidadFamiliar') {
      this.abreCierraFicha('unidadFamiliar');
      let top = document.getElementById("unidadFamiliar");
      if (top) {
        top.scrollIntoView();
        top = null;
      }
      sessionStorage.removeItem('tarjeta');
    }
    // this.commonsService.checkAcceso(procesos_ejg.unidadFamiliar)
    this.commonsService.checkAcceso(procesos_ejg.detalleUF)
      .then(respuesta => {
        this.permisoEscritura = respuesta;
      }
      ).catch(error => console.error(error));
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaUnidadFamiliar == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  consultaUnidadFamiliar(selected) {
    // this.progressSpinner = true;

    let nombresol = this.body.nombreApeSolicitante;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        this.datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
        //this.persistenceService.setBodyAux(this.datosFamiliares);
        // this.progressSpinner = false;
        this.datosFamiliares.forEach(element => {
          element.nombreApeSolicitante = nombresol;
          //Introducir entrada en la base de datos
          const estadoExp = this.comboEstadosExpEco.find(c => c.value == element.estado);
          if (estadoExp && estadoExp.label && estadoExp.label.length != 0) {
            element.estadoDes = estadoExp.label;
          }

          if (element.estadoDes != undefined && element.fechaSolicitud != undefined) {
            element.expedienteEconom = element.estadoDes + " * " + this.datepipe.transform(element.fechaSolicitud, 'dd/MM/yyyy');
          } else if (element.estadoDes != undefined && element.fechaSolicitud == undefined) {
            element.expedienteEconom = element.estadoDes + " * ";
          } else if (element.estadoDes == undefined && element.fechaSolicitud != undefined) {
            element.expedienteEconom = " * " + this.datepipe.transform(element.fechaSolicitud, 'dd/MM/yyyy');
          } else if (element.estadoDes == undefined && element.fechaSolicitud == undefined) {
            element.expedienteEconom = "  ";
          }

          //Se traduce el valor del back a su idioma y rol correspondientes
          //Si se selecciona el valor "Unidad Familiar" en el desplegable "Rol/Solicitante"
          if (element.uf_solicitante == "0") {
            element.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.unidadFamiliar');
          }
          //Si se selecciona el valor "Solicitante" en el desplegable "Rol/Solicitante"
          if (element.uf_solicitante == "1") {
            element.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.solicitante');
          }
          //Si se selecciona el valor "Solicitante principal" en el desplegable "Rol/Solicitante"
          if (element.uf_idPersona == element.solicitantePpal) {
            element.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.unidadFamiliar.solicitantePrincipal');
            this.solicitanteP = element;
            if (element.expedienteEconom != null && element.expedienteEconom != undefined) {
              this.estadoEEJG = element.expedienteEconom;
            }
          }
        });
        if (this.datosFamiliares != undefined) {
          //Se buscan los familiares activos
          this.datosFamiliaresActivos = this.datosFamiliares.filter(
            (dato) => /*dato.fechaBaja != undefined && */ dato.fechaBaja == null);
          //Obtenemos el solicitante principal
          //this.solicitanteP = this.datosFamiliaresActivos.filter(
          //  (dato) => dato.uf_enCalidad == "3")[0];
          this.nExpedientes = this.datosFamiliaresActivos.length;

          if (this.solicitanteP != undefined) {
            this.datosFamiliaresActivos.forEach(familiar => {
              if (familiar.uf_enCalidad != "3") familiar.relacionadoCon = this.solicitanteP.pjg_nombrecompleto;
            })
          }
          let representantes = [];
          //Introducimos las entradas de los representantes de los familiares introducidos
          this.datosFamiliaresActivos.forEach(element => {
            if (element.representante != undefined && element.representante != null) {
              let representante = new UnidadFamiliarEJGItem();

              representante.pjg_nombrecompleto = element.representante;
              representante.pjg_direccion = element.direccionRepresentante;
              representante.pjg_nif = element.nifRepresentante;
              representante.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.representante');
              representante.relacionadoCon = element.pjg_nombrecompleto;
              representante.fechaBaja = null;
              representante.isRepresentante = true;

              representantes.push(representante);
            }
          });
          //Hacemos esto para no introducir los representantes en mitad de la lectura del array DatosFamiliaresActivos
          if (representantes.length > 0) representantes.forEach(element => {
            this.datosFamiliaresActivos.push(element);
          }
          );
        }
        if (this.solicitanteP == undefined) this.solicitanteP = new UnidadFamiliarEJGItem();
        if (this.solicitanteP.pjg_nombrecompleto != undefined) this.apellidosCabecera = this.solicitanteP.pjg_nombrecompleto.split(",")[0];
        else this.apellidosCabecera = "";
        // this.progressSpinner = false;
      },
      err => {
        // this.progressSpinner = false;
      }
    );
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "unidadFamiliar" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  isEliminado(dato) {
    if (dato.fechaBaja == null) return false;
    else return true;
  }
  openTab(evento) {
    //Asignamos los objetos itemEJG y EJGItem para la edicion
    if(sessionStorage.getItem("itemEJG") == null || sessionStorage.getItem("itemEJG") == undefined) {
      sessionStorage.setItem("itemEJG", JSON.stringify(true));
    }

    if(sessionStorage.getItem("EJGItem") == null || sessionStorage.getItem("EJGItem") == undefined){
      sessionStorage.setItem("EJGItem", JSON.stringify(this.persistenceService.getDatosEJG()));
    }
    sessionStorage.setItem("origin", "UnidadFamiliar");
    sessionStorage.setItem("Familiar", JSON.stringify(evento));
    this.router.navigate(["/gestionJusticiables"]);
  }

  getCols() {
    this.cols = [
      { field: "pjg_nif", header: "administracion.usuarios.literal.NIF", width: "10%" },
      { field: "pjg_nombrecompleto", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
      { field: "pjg_direccion", header: "censo.consultaDirecciones.literal.direccion", width: "15%" },
      { field: "labelEnCalidad", header: "administracion.usuarios.literal.rol", width: "10%" },
      { field: "relacionadoCon", header: "justiciaGratuita.ejg.datosGenerales.RelacionadoCon", width: "20%" },
      { field: "pd_descripcion", header: "informes.solicitudAsistencia.parentesco", width: "15%" },
      { field: "expedienteEconom", header: "justiciaGratuita.ejg.datosGenerales.ExpedienteEcon", width: "20%" },
    ];
    this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  isSelectMultiple() {
    this.selectAll = false;
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  expedienteEconomDisponible(dato): boolean {
    return dato.expedienteEconom != undefined && dato.expedienteEconom.trim() != "";
  }

  isVolverSolicitarEEJG(datos) {
    if (datos.length != 1) {
      this.volverSolicitarEejg = false
    } else {
      const dato = datos[0];
      this.volverSolicitarEejg = this.expedienteEconomDisponible(dato)
        && dato.estado != undefined && dato.estado.length != 0 && +dato.estado >= 30;
    }
  }

  isSolicitarEEJG(datos) {
    if (datos.length != 1) {
      this.solicitarEEJG = false
    } else {
      const dato = datos[0];
      this.solicitarEEJG = !this.expedienteEconomDisponible(dato)
        && (dato.estado == undefined || dato.estado.length == 0);
    }
  }

  isDescargarEEJG(datos) {
    if (datos.length != 1) {
      this.descargarEEJG = false
    } else {
      const dato = datos[0];
      this.descargarEEJG = this.expedienteEconomDisponible(dato)
        && dato.estado != undefined && dato.estado.length != 0 && +dato.estado == 30;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.isVolverSolicitarEEJG(selectedDatos);
    this.isSolicitarEEJG(selectedDatos);
    this.isDescargarEEJG(selectedDatos);
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
    let repre = this.selectedDatos.find(
      item => item.isRepresentante == true
    );
    if (repre != undefined)
      this.isRepresentante = true;
    else this.isRepresentante = false;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  confirmDelete() {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.message.eliminarFamiliar"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "cdDelete",
      message: mess,
      icon: icon,
      accept: () => {
        this.cdDelete.hide();
        this.delete()

      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
        this.cdDelete.hide();
      }
    });
  }

  delete() {
    this.progressSpinner = true;

    let data = [];
    let ejg: EJGItem;

    for (let i = 0; this.selectedDatos.length > i; i++) {
      ejg = this.selectedDatos[i];
      /* ejg.fechaEstadoNew=this.fechaEstado;
      ejg.estadoNew=this.valueComboEstado; */

      data.push(ejg);
    }

    this.sigaServices.post("gestionejg_borrarFamiliar", data).subscribe(
      n => {
        this.progressSpinner = false;
        this.selectedDatos = [];

        if (n.statusText == 'OK') {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.historico = false;
          //Si uno de los datos que hemos eliminado es el solicitante principal,
          //se actualiza la tarjeta resumen para reflejarlo.
          let solP = data.find(
            item => item.uf_enCalidad == "3"
          )
          if (solP != undefined) {
            this.body.idPersonajg = null;
            this.body.nombreApeSolicitante = null;
            this.persistenceService.setDatosEJG(this.body);
            this.updateRes.emit();
          }
          this.consultaUnidadFamiliar(this.body);
        } else {
          this.showMessage('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
        }

      },
      err => {
        this.progressSpinner = false;
        this.selectedDatos = [];
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  activate() {

  }

  searchHistorical() {
    //this.datosFamiliares.historico = !this.datosFamiliares.historico;
    this.historico = !this.historico;
    this.selectedDatos = [];
    if (this.historico) {
      this.editMode = false;
      this.nuevo = false;
      this.selectAll = false;
      this.numSelected = 0;
      this.datosFamiliaresActivos = JSON.parse(JSON.stringify(this.datosFamiliares));
    } else {
      this.datosFamiliaresActivos = this.datosFamiliares.filter(
        (dato) =>  /*dato.fechaBaja != undefined && */dato.fechaBaja == null);
    }
    let representantes = [];

    //Introducimos las entradas de los representantes de los familiares introducidos
    this.datosFamiliaresActivos.forEach(element => {
      if (element.representante != undefined && element.representante != null) {
        let representante = new UnidadFamiliarEJGItem();

        representante.pjg_nombrecompleto = element.representante;
        representante.pjg_direccion = element.direccionRepresentante;
        representante.pjg_nif = element.nifRepresentante;
        representante.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.representante');
        representante.relacionadoCon = element.pjg_nombrecompleto;
        representante.fechaBaja = null;
        representante.isRepresentante = true;

        representantes.push(representante);
      }
    });

    //Hacemos esto para no introducir los representantes en mitad de la lectura del array DatosFamiliaresActivos
    if (representantes.length > 0) representantes.forEach(element => {
      this.datosFamiliaresActivos.push(element);
    });

    this.selectMultiple = false;
    this.selectionMode = "single";
    this.persistenceService.setHistorico(this.historico);

  }

  downloadEEJ() {
    this.progressSpinner = true;

    let datosToCall = [];

    this.selectedDatos.forEach(element => {
      let ejgData: EJGItem = new EJGItem();

      ejgData.annio = this.body.annio;
      ejgData.idInstitucion = this.body.idInstitucion;
      ejgData.numEjg = this.body.numEjg;
      ejgData.tipoEJG = this.body.tipoEJG;
      ejgData.nif = element.pjg_nif;

      datosToCall.push(ejgData);
    });

    this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", datosToCall).subscribe(
      data => {
        this.progressSpinner = false;
        
        // if (data.size == 0 || data.size <= 22) {
        //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        // } else {
          let blob = null;

          let now = new Date();
          let month = now.getMonth() + 1;
          let nombreFichero = "eejg_" + now.getFullYear();

          if (month < 10) {
            nombreFichero = nombreFichero + "0" + month;
          } else {
            nombreFichero += month;
          }

          nombreFichero += now.getDate() + "_" + now.getHours() + "" + now.getMinutes();

          let mime = data.type;
          blob = new Blob([data], { type: mime });
          saveAs(blob, nombreFichero);
        //}
      },
      err => {
        this.progressSpinner = false;
        if(err.status == 404){
          this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant("administracion.parametro.eejg.messageNoExistenArchivos"));
        }else{
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
        // console.log(err);
      }
    );
  }

  checkPermisosSolicitarEEJ() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.solicitarEEJ();
    }
  }

  solicitarEEJ() {
    this.sigaServices.post("gestionejg_solicitarEEJG", this.selectedDatos[0]).subscribe(
      n => {
        this.progressSpinner = false;
        this.selectDatos = [];
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.ejgService.emitirEvento();
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.selectDatos = [];
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  checkPermisosComunicar(datos) {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.comunicar(datos);
    }
  }

  comunicar(datos) {
    sessionStorage.setItem("rutaComunicacion", "/unidadFamiliar");
		//IDMODULO de SJCS es 10
		sessionStorage.setItem("idModulo", '10');
	
    let datosSeleccionados = [];
		let rutaClaseComunicacion = "/unidadFamiliar";

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
              if (key.nombre == "idPersona" && this.selectedDatos[0] != undefined) {
                keysValues.push(this.selectedDatos[0].solicitantePpal);
              } else if (this.body[key.nombre] != undefined) {
                keysValues.push(this.body[key.nombre]);
              } else if (key.nombre == "num" && this.body["numero"] != undefined) {
                keysValues.push(this.body["numero"]);
              } else if (key.nombre == "anio" && this.body["annio"] != undefined) {
                keysValues.push(this.body["annio"]);
              } else if (key.nombre == "idtipoejg" && this.body["tipoEJG"] != undefined) {
                keysValues.push(this.body["tipoEJG"]);
              } else if(key.nombre == "identificador"){
                keysValues.push(this.body["numAnnioProcedimiento"]);
              }
            });
            datosSeleccionados.push(keysValues);
					sessionStorage.setItem(
						"datosComunicar",
						JSON.stringify(datosSeleccionados)
						);
					//datosSeleccionados.push(keysValues);
					
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
	
  checkPermisosConfirmDelete() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmDelete();
    }
  }

  checkPermisosActivate() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.activate();
    }
  }

  checkPermisosAsociar() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociar();
    }
  }

  asociar() {
    sessionStorage.setItem("origin", "UnidadFamiliar");
    sessionStorage.setItem("datosFamiliares", JSON.stringify(this.datosFamiliares));
    // Controlar Justiciable vienen de EJG.
    sessionStorage.setItem("itemEJG", JSON.stringify(true));
    sessionStorage.setItem("EJGItem", JSON.stringify(this.persistenceService.getDatosEJG()));
    //this.searchContrarios.emit(true);
    this.router.navigate(["/justiciables"]);
  }
}
