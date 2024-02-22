import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ConfirmationService } from 'primeng/api';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { DatePipe } from '@angular/common';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-unidad-familiar',
  templateUrl: './unidad-familiar.component.html',
  styleUrls: ['./unidad-familiar.component.scss']
})
export class UnidadFamiliarComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() openTarjetaUnidadFamiliar;
  @Input() permisoEscritura: boolean = false;
  @Output() guardadoSend = new EventEmitter<any>();

  progressSpinner: boolean = false;
  historico: boolean = false;
  selectAll: boolean = false;

  msgs;
  cols;
  countRep = 0;
  countSoli = 0;
  countVolverSoli = 0;
  countDescargar = 0;
  rowsPerPage: any = [];
  selectedDatos = [];
  selectedItem: number = 10;
  buscadores = [];
  datosUnidadFamiliar = [];
  resumen: any = {
    pjg_nif: "",
    apellidosCabecera: "",
    pjg_nombre: "",
    estadoEEJG: "No solicitado",
    nExpedientes: 0
  };
  estados = new Map();
  datosFamiliares = null;
  unidadFamiliarPrincipal = null;

  constructor(private sigaServices: SigaServices, private datepipe: DatePipe, private translateService: TranslateService,
    private persistenceService: PersistenceService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.progressSpinner = true;
    this.getCols();
    this.getEstados();
    this.consultaUnidadFamiliar();
  }

  //Eventos
  abreCierraFicha() {
    this.openTarjetaUnidadFamiliar = !this.openTarjetaUnidadFamiliar;
  }

  clear() {
    this.msgs = [];
  }

  actualizaSeleccionados() {
    this.countRep = 0;
    this.countDescargar = 0;
    this.countVolverSoli = 0;
    this.countSoli = 0;
    this.selectedDatos.forEach(data => {
      if(data.isRepresentante){
        this.countRep++;
      } else if(this.expedienteEconomDisponible(data)) {
        if(data.estado != undefined && data.estado.length != 0){
          if(data.estado == "30"){
            this.countDescargar++;
          }else if(data.estado >= 30){
            this.countVolverSoli++;
          }
        }
      } else if(data.estado == undefined || data.estado.length == 0){
        this.countSoli++;
      }
    });
  }

  onChangeSelectAll() {
    if (this.selectAll) {
      this.selectedDatos = [...this.datosUnidadFamiliar];
    } else {
      this.selectedDatos = [];
    }
    this.actualizaSeleccionados();
  }

  onChangeRowsPerPages() {
    //ARR: Terminar
  }

  searchHistorical() {
    this.selectedDatos = [];
    this.historico = !this.historico;
    this.consultaUnidadFamiliar();
  }

  openTab(evento) {
    this.persistenceService.setDatosEJG(this.datos);
    sessionStorage.setItem("EJGItem", JSON.stringify(this.datos));
    sessionStorage.setItem("origin", "UnidadFamiliar");
    sessionStorage.setItem("Familiar", JSON.stringify(evento));
    this.router.navigate(["/gestionJusticiables"]);
  }

  downloadEEJ() {
    this.progressSpinner = true;

    let datosToCall = [];

    this.selectedDatos.forEach(element => {
      let ejgData: EJGItem = new EJGItem();
      ejgData.annio = this.datos.annio;
      ejgData.idInstitucion = this.datos.idInstitucion;
      ejgData.numEjg = this.datos.numEjg;
      ejgData.tipoEJG = this.datos.tipoEJG;
      ejgData.nif = element.pjg_nif;
      datosToCall.push(ejgData);
    });

    this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", datosToCall).subscribe(
      data => {
        this.progressSpinner = false;
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
      },
      err => {
        this.progressSpinner = false;
        if(err.status == 404){
          this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant("administracion.parametro.eejg.messageNoExistenArchivos"));
        }else{
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      }
    );
  }

  solicitarEEJ() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.sigaServices.post("gestionejg_solicitarEEJG", this.selectedDatos[0]).subscribe(
        n => {
          this.selectedDatos = [];
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.consultaUnidadFamiliar();
        },
        err => {
          this.selectedDatos = [];
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  }

  comunicar() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("rutaComunicacion", "/unidadFamiliar");
      //IDMODULO de SJCS es 10
      sessionStorage.setItem("idModulo", '10');
    
      let datosSeleccionados = [];
      let rutaClaseComunicacion = "/unidadFamiliar";
  
      this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
        data => {
          let idClaseComunicacion = JSON.parse(data["body"]).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices.post("dialogo_keys", idClaseComunicacion).subscribe(
            data => {
              let keys = JSON.parse(data["body"]).keysItem;
              let keysValues = [];
              keys.forEach(key => {
                if (key.nombre == "idPersona" && this.selectedDatos[0] != undefined) {
                  keysValues.push(this.selectedDatos[0].solicitantePpal);
                } else if (this.datos[key.nombre] != undefined) {
                  keysValues.push(this.datos[key.nombre]);
                } else if (key.nombre == "num" && this.datos["numero"] != undefined) {
                  keysValues.push(this.datos["numero"]);
                } else if (key.nombre == "anio" && this.datos["annio"] != undefined) {
                  keysValues.push(this.datos["annio"]);
                } else if (key.nombre == "idtipoejg" && this.datos["tipoEJG"] != undefined) {
                  keysValues.push(this.datos["tipoEJG"]);
                } else if(key.nombre == "identificador"){
                  keysValues.push(this.datos["numAnnioProcedimiento"]);
                }
              });
              datosSeleccionados.push(keysValues);

              this.persistenceService.setDatosEJG(this.datos);
              sessionStorage.setItem("datosComunicar", JSON.stringify(datosSeleccionados));
              this.router.navigate(["/dialogoComunicaciones"]);
            }
          );
        }
      );   
    }
  }

  confirmDelete(activar: Boolean) {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.confirmationService.confirm({
        key: "cdDelete",
        message: activar ? this.translateService.instant("facturacion.maestros.tiposproductosservicios.reactivarconfirm") : this.translateService.instant("justiciaGratuita.ejg.message.eliminarFamiliar"),
        icon: "fa fa-edit",
        accept: () => {
          this.delete();
        },
        reject: () => {
          this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
        }
      });
    }
  }

  asociar() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("origin", "UnidadFamiliar");
      sessionStorage.setItem("datosFamiliares", JSON.stringify(this.datosFamiliares));
      sessionStorage.setItem("EJGItem", JSON.stringify(this.datos));
      this.router.navigate(["/justiciables"]);
    }
  }

  private delete() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_borrarFamiliar", this.selectedDatos).subscribe(
      n => {
        if (n.statusText == 'OK') {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.consultaUnidadFamiliar();
        } else {
          this.showMessage('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
        }
        this.progressSpinner = false;
        this.selectedDatos = [];
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.selectedDatos = [];
      }
    );
  }

  private getCols() {
    this.cols = [
      { field: "pjg_nif", header: "administracion.usuarios.literal.NIF", width: "10%" },
      { field: "pjg_nombrecompleto", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
      { field: "pjg_direccion", header: "censo.consultaDirecciones.literal.direccion", width: "15%" },
      { field: "labelEnCalidad", header: "administracion.usuarios.literal.rol", width: "10%" },
      { field: "relacionadoCon", header: "justiciaGratuita.ejg.datosGenerales.RelacionadoCon", width: "20%" },
      { field: "pd_descripcion", header: "informes.solicitudAsistencia.parentesco", width: "15%" },
      { field: "expedienteEconom", header: "justiciaGratuita.ejg.datosGenerales.ExpedienteEcon", width: "20%" },
    ];

    //this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  private consultaUnidadFamiliar() {
    
    this.datosUnidadFamiliar = [];
    let nombresol = this.datos.nombreApeSolicitante;
    let countFamiliares = 0;
    
    this.sigaServices.post("gestionejg_unidadFamiliarEJG", this.datos).subscribe(
      n => {
        this.datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
        for(let i = 0; i < this.datosFamiliares.length; i++){
          let element = this.datosFamiliares[i];
          element.nombreApeSolicitante = nombresol;
          //Introducir entrada en la base de datos
          element.estadoDes = this.estados.get(element.estado);

          if (element.estadoDes != undefined && element.fechaSolicitud != undefined) {
            element.expedienteEconom = element.estadoDes + " * " + this.datepipe.transform(element.fechaSolicitud, 'dd/MM/yyyy');
          } else if (element.estadoDes != undefined && element.fechaSolicitud == undefined) {
            element.expedienteEconom = element.estadoDes + " * ";
          } else if (element.estadoDes == undefined && element.fechaSolicitud != undefined) {
            element.expedienteEconom = " * " + this.datepipe.transform(element.fechaSolicitud, 'dd/MM/yyyy');
          } else if (element.estadoDes == undefined && element.fechaSolicitud == undefined) {
            element.expedienteEconom = "";
          }

          //Se traduce el valor del back a su idioma y rol correspondientes
          if (element.uf_solicitante == "0") {
            //Si se selecciona el valor "Unidad Familiar" en el desplegable "Rol/Solicitante"
            element.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.unidadFamiliar');
          }else if (element.uf_solicitante == "1") {
            //Si se selecciona el valor "Solicitante" en el desplegable "Rol/Solicitante"
            element.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.solicitante');
          }
          //Si se selecciona el valor "Solicitante principal" en el desplegable "Rol/Solicitante"
          if (element.uf_idPersona == element.solicitantePpal) {
            element.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.unidadFamiliar.solicitantePrincipal');
            this.unidadFamiliarPrincipal = {...element};
          }

          let addUnidad = true;
          if(!this.historico && element.fechaBaja != null){
            addUnidad = false;
          }

          if(addUnidad){
            this.datosUnidadFamiliar.push(element);
            countFamiliares++;
            if (element.representante != undefined && element.representante != null) {
              let representante = new UnidadFamiliarEJGItem();
              representante.pjg_nombrecompleto = element.representante;
              representante.pjg_direccion = element.direccionRepresentante;
              representante.pjg_nif = element.nifRepresentante;
              representante.labelEnCalidad = this.translateService.instant('justiciaGratuita.justiciables.rol.representante');
              representante.relacionadoCon = element.pjg_nombrecompleto;
              representante.fechaBaja = null;
              representante.isRepresentante = true;
              this.datosUnidadFamiliar.push(representante);
            }
          }
        }
        this.progressSpinner = false;
        this.updateResumen(countFamiliares);
      }, err => {
        this.progressSpinner = false;
      }
    );
  }

  private getEstados(){
    this.estados.set('10', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.inicial'));
    this.estados.set('15', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.inicialEsperando'));
    this.estados.set('20', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.espera'));
    this.estados.set('23', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.pendienteInfo'));
    this.estados.set('25', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.esperaEsperando'));
    this.estados.set('30', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.finalizado'));
    this.estados.set('40', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.errorSolicitud'));
    this.estados.set('50', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.errorConsultaInfo'));
    this.estados.set('60', this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.caducado'));
  }

  private updateResumen(count: Number){
    if(this.unidadFamiliarPrincipal != null){
      this.resumen.pjg_nif = this.unidadFamiliarPrincipal.pjg_nif;
      this.resumen.pjg_nombre = this.unidadFamiliarPrincipal.pjg_nombre;
      if (this.unidadFamiliarPrincipal.pjg_nombrecompleto != undefined){
        this.resumen.apellidosCabecera = this.unidadFamiliarPrincipal.pjg_nombrecompleto.split(",")[0];
      }
      if (this.unidadFamiliarPrincipal.expedienteEconom != null && this.unidadFamiliarPrincipal.expedienteEconom != undefined) {
        this.resumen.estadoEEJG = this.unidadFamiliarPrincipal.expedienteEconom;
      }
      this.resumen.nExpedientes = count;
    }
  }

  private expedienteEconomDisponible(dato): boolean {
    return dato.expedienteEconom != undefined && dato.expedienteEconom.trim() != "";
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
