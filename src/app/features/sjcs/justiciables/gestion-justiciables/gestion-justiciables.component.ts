import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../_services/commons.service";
import { NotificationService } from "../../../../_services/notification.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { EJGItem } from "../../../../models/sjcs/EJGItem";
import { JusticiableBusquedaItem } from "../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../models/sjcs/JusticiableItem";
import { UnidadFamiliarEJGItem } from "../../../../models/sjcs/UnidadFamiliarEJGItem";
import { procesos_ejg } from "../../../../permisos/procesos_ejg";
import { procesos_justiciables } from "../../../../permisos/procesos_justiciables";
import { DatosGeneralesComponent } from "./datos-generales/datos-generales.component";
import { DatosRepresentanteComponent } from "./datos-representante/datos-representante.component";
import { DatosSolicitudComponent } from "./datos-solicitud/datos-solicitud.component";

@Component({
  selector: "app-gestion-justiciables",
  templateUrl: "./gestion-justiciables.component.html",
  styleUrls: ["./gestion-justiciables.component.scss"],
})
export class GestionJusticiablesComponent implements OnInit {
  body: JusticiableItem = new JusticiableItem();
  bodyInicial: JusticiableItem = new JusticiableItem();
  unidadFamiliar: UnidadFamiliarEJGItem = new UnidadFamiliarEJGItem();
  justiciable: any;
  tarjetas = new Map();
  datosResumen = [];
  enlacesResumen = [];
  origen: string = "";
  contrario: any;
  dialogOpcion: String = "";
  dialogTarjeta: String = "";

  direccionPostal: String = "";

  modoEdicion: boolean = false;
  progressSpinner: boolean = false;
  newRepresentante: boolean = false;
  showDialog: boolean = false;
  isDisabledPoblacion: boolean = true;

  comboTipoVia;
  comboPais;
  comboProvincia;
  comboPoblacion;

  @ViewChild(DatosGeneralesComponent) datosGenerales;
  @ViewChild(DatosSolicitudComponent) datosSolicitud;
  @ViewChild(DatosRepresentanteComponent) datosRepresentante;

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices, private commonsService: CommonsService, private persistenceService: PersistenceService, private notificationService: NotificationService) {}

  async ngOnInit() {
    this.getCombos();
    this.progressSpinner = true;
    this.getTarjetas();
    if (sessionStorage.getItem("origin")) {
      this.origen = sessionStorage.getItem("origin");
      sessionStorage.removeItem("origin");
    }

    if (sessionStorage.getItem("justiciable")) {
      this.justiciable = JSON.parse(sessionStorage.getItem("justiciable"));
      sessionStorage.removeItem("justiciable");
    }

    if (this.persistenceService.getDatos() != undefined) {
      let justiciable = this.persistenceService.getDatos();
      this.persistenceService.clearDatos();
      if (sessionStorage.getItem("asociado")) {
        this.notificationService.showSuccess(this.translateService.instant("general.message.accion.realizada"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.correctAsociar"));
        sessionStorage.removeItem("asociado");
      }
      await this.searchRepresentanteById(justiciable.idpersona, justiciable.idinstitucion);
    } else if (sessionStorage.getItem("familiar")) {
      this.unidadFamiliar = JSON.parse(sessionStorage.getItem("familiar"));
      sessionStorage.removeItem("familiar");
      await this.searchRepresentanteById(this.unidadFamiliar.uf_idPersona, this.unidadFamiliar.uf_idInstitucion);
    } else {
      this.body = new JusticiableItem();
      if (sessionStorage.getItem("representante")) {
        let representante = JSON.parse(sessionStorage.getItem("representante"));
        sessionStorage.removeItem("representante");
        this.body.nif = representante.nif;
        this.newRepresentante = true;
      }
      this.checkAccesoTarjetas();
      this.updateTarjResumen();
    }
  }

  updateBody(justiciable: JusticiableItem) {
    this.body = justiciable;
    if (this.body.idpersona != null) {
      if (!this.modoEdicion) {
        this.modoEdicion = true;
        this.checkAccesoTarjetas();
      }
    }
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    this.updateTarjResumen();
  }

  isOpenTarjeta(idTarjeta: string) {
    return this.tarjetas.get(idTarjeta).visibility;
  }

  isPermisoTarjeta(idTarjeta: string) {
    return this.tarjetas.get(idTarjeta).permission;
  }

  backTo() {
    if (this.origen == "representante" || this.newRepresentante) {
      this.persistenceService.setDatos(this.justiciable);
      this.router.navigate(["/gestionJusticiables"]);
    } else if (this.origen == "UnidadFamiliar" || this.origen == "ContrarioEJG" || this.origen == "newUnidadFamiliar" || this.origen == "newContrarioEJG") {
      this.router.navigate(["/gestionEjg"]);
    } else if (this.origen == "Interesado" || this.origen == "Contrario" || this.origen == "newInteresado" || this.origen == "newContrario") {
      this.router.navigate(["/fichaDesignaciones"]);
    } else if (this.origen == "Asistencia" || this.origen == "ContrarioAsistencia" || this.origen == "newAsistido" || this.origen == "newContrarioAsistencia") {
      this.router.navigate(["/fichaAsistencia"]);
    } else if (this.origen == "Soj" || this.origen == "newSoj") {
      this.router.navigate(["/detalle-soj"]);
    } else {
      if (this.justiciable != null) {
        sessionStorage.setItem("justiciable", JSON.stringify(this.justiciable));
      }
      sessionStorage.setItem("origin", this.origen);
      this.router.navigate(["/justiciables"]);
    }
  }

  openTarjeta(event: string) {
    let data = this.tarjetas.get(event);
    data.visibility = true;
    this.tarjetas.set(event, data);
  }

  abrirDialog(event: string) {
    this.showDialog = true;
    this.dialogOpcion = "";
    this.dialogTarjeta = event;
  }

  cerrarDialog() {
    this.showDialog = false;
  }

  guardarDialog() {
    if (this.dialogOpcion == undefined || this.dialogOpcion == "") {
      this.notificationService.showInfo("info", "Debes seleccionar una opción");
    } else {
      if (this.dialogOpcion == "s") {
        if (this.dialogTarjeta == "tarjetaGenerales") {
          this.datosGenerales.guardarDialog(false);
        } else if (this.dialogTarjeta == "tarjetaSolicitud") {
          this.datosSolicitud.guardarDialog(false);
        } else if (this.dialogTarjeta == "tarjetaRepresentante") {
          this.datosRepresentante.guardarDialog(false);
        }
      } else if (this.dialogOpcion == "n") {
        if (this.dialogTarjeta == "tarjetaGenerales") {
          this.datosGenerales.guardarDialog(true);
        } else if (this.dialogTarjeta == "tarjetaSolicitud") {
          this.datosSolicitud.guardarDialog(true);
          this.datosGenerales.guardarDialog(true);
        } else if (this.dialogTarjeta == "tarjetaRepresentante") {
          this.datosRepresentante.guardarDialog(true);
          this.datosGenerales.guardarDialog(true);
        }
      }
      this.cerrarDialog();
    }
  }

  private getTarjetas() {
    this.tarjetas.set("tarjetaGenerales", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaPersonales", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaSolicitud", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaRepresentante", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaAsunto", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaUnidadFamiliar", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaAbogado", { visibility: false, permission: false });
    this.tarjetas.set("tarjetaProcurador", { visibility: false, permission: false });
  }

  private updateTarjResumen() {
    if (this.body) {
      const movil = this.body.telefonos && this.body.telefonos.length > 0 ? this.body.telefonos[0].numeroTelefono : "";
      const nombre = `${this.body.apellido1}${this.body.apellido2 ? " " + this.body.apellido2 : ""}, ${this.body.nombre}`;
  
      let direccion = "No Informada"; // Por defecto si no se ha informado
      if (!this.body.direccionNoInformada && this.body.direccion) {
        const tipoVia = this.comboTipoVia?.find(v => v.value === this.body.idtipovia)?.label || 'Desconocido';
        const poblacion = this.comboPoblacion?.find(p => p.value === this.body.idpoblacion)?.label || 'Desconocida';
        console.log("Combo Poblacion (pre-búsqueda):", this.comboPoblacion);
        const provincia = this.comboProvincia?.find(p => p.value === this.body.idprovincia)?.label || 'Desconocida';
        console.log("Combo Provincia (pre-búsqueda):", this.comboProvincia);

        direccion = `${tipoVia} ${this.body.direccion}, ${this.body.codigopostal}, ${poblacion} - ${provincia}`;
      }
  
      this.datosResumen = [
        { label: this.translateService.instant("censo.usuario.DNI"), value: this.body.nif },
        { label: this.translateService.instant("facturacionSJCS.retenciones.nombre"), value: nombre },
        { label: this.translateService.instant("censo.datosDireccion.literal.correo"), value: this.body.correoelectronico || 'No disponible' },
        { label: this.translateService.instant("censo.datosDireccion.literal.telefonoMovil"), value: movil },
        { label: this.translateService.instant("censo.consultaDirecciones.literal.direccion"), value: direccion }
      ];
    }
    this.progressSpinner = false;
  }
  
  
  async getCombos() {
    await this.getComboTipoVia();
    await this.getComboProvincia();  // Asegura que provincia esté cargada completamente antes de continuar
    await this.getComboPoblacion("-1"); // Ahora seguramente las provincias están disponibles para las dependencias
    this.updateTarjResumen(); // Llamar después de cargar todos los combos
  }

  getComboTipoVia() {
    return new Promise((resolve, reject) => {
      this.sigaServices.getParam("gestionJusticiables_comboTipoVias2", "?idTipoViaJusticiable=" + this.body.idtipovia).subscribe((n) => {
        this.comboTipoVia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoVia);
        resolve(n);
      }, error => reject(error));
    });
  }
  
  getComboProvincia() {
    return new Promise((resolve, reject) => {
      this.sigaServices.get("integrantes_provincias").subscribe((n) => {
        this.comboProvincia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincia);
        resolve(n);
      }, error => reject(error));
    });
  }
  
  getComboPoblacion(filtro: string) {
    if (!this.body.idprovincia) {
      console.log("No se puede cargar poblaciones porque idprovincia es undefined o null.");
      return Promise.resolve(); // Salir si no hay provincia seleccionada
    }
    return new Promise((resolve, reject) => {
      this.sigaServices.getParam("direcciones_comboPoblacion", "?idProvincia=" + this.body.idprovincia + "&filtro=" + filtro).subscribe((n) => {
        this.comboPoblacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPoblacion);
        this.rellenarDireccionPostal(); // Opción para procesar después de carga si es necesario
        this.progressSpinner = false;
        resolve(n);
      }, error => {
        console.log("Error al cargar poblaciones:", error);
        reject(error);
      });
    });
  }

  private getPermiso(permiso: string) {
    return this.commonsService.checkAcceso(permiso).then(
      (respuesta) => {
        return respuesta;
      },
      (err) => {
        return false;
      },
    );
  }

  rellenarDireccionPostal() {
    if (this.body.direccion != undefined && this.body.direccion != null) {
      this.comboTipoVia.forEach((element) => {
        if (element.value == this.body.idtipovia) this.direccionPostal = element.label;
      });
      this.direccionPostal = this.direccionPostal + " " + this.body.direccion;

      if (this.body.codigopostal) {
        this.direccionPostal += ", " + this.body.codigopostal;
      }

      if (this.comboPoblacion != undefined) {
        this.comboPoblacion.forEach((element) => {
          if (element.value == this.body.idpoblacion) this.direccionPostal = this.direccionPostal + ", " + element.label;
        });
      }
      this.comboProvincia.forEach((element) => {
        if (element.value == this.body.idprovincia) this.direccionPostal = this.direccionPostal + ", " + element.label;
      });
      this.progressSpinner = false;
    }
  }

  private checkAccesoTarjetas() {
    if (!this.modoEdicion) {
      if (this.getPermiso(procesos_justiciables.tarjetaDatosGenerales)) {
        this.enlacesResumen.push({ label: "general.message.datos.generales", value: document.getElementById("tarjetaGenerales"), nombre: "tarjetaGenerales" });
        this.tarjetas.set("tarjetaGenerales", { visibility: true, permission: true });
      }
    } else {
      //Consultamos si se debe abrir alguna tarjeta
      let abrirTarjeta = "";
      if (sessionStorage.getItem("abrirTarjetaJusticiable")) {
        abrirTarjeta = sessionStorage.getItem("abrirTarjetaJusticiable");
        sessionStorage.removeItem("abrirTarjetaJusticiable");
      }

      if (this.origen == "UnidadFamiliar") {
        if (this.getPermiso(procesos_justiciables.detalleUF)) {
          if (this.getPermiso(procesos_ejg.datosGeneralesUF)) {
            this.enlacesResumen.push({ label: "general.message.datos.generales", value: document.getElementById("tarjetaGenerales"), nombre: "tarjetaGenerales" });
            this.tarjetas.set("tarjetaGenerales", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosDireccionContactoUF)) {
            this.enlacesResumen.push({ label: "formacion.fichaInscripcion.datosPersonales.cabecera", value: document.getElementById("tarjetaPersonales"), nombre: "tarjetaPersonales" });
            this.tarjetas.set("tarjetaPersonales", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosSolicitudesUF)) {
            this.enlacesResumen.push({ label: "censo.nuevaSolicitud.headerSolicitud", value: document.getElementById("tarjetaSolicitud"), nombre: "tarjetaSolicitud" });
            this.tarjetas.set("tarjetaSolicitud", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosRepresentanteLegalUF)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.interesados.abogado", value: document.getElementById("tarjetaRepresentante"), nombre: "tarjetaRepresentante" });
            this.tarjetas.set("tarjetaRepresentante", { visibility: abrirTarjeta == "tarjetaRepresentante", permission: true });
          }
          if (this.getPermiso(procesos_ejg.asuntosUF)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.literal.asuntos", value: document.getElementById("tarjetaAsunto"), nombre: "tarjetaAsunto" });
            this.tarjetas.set("tarjetaAsunto", { visibility: abrirTarjeta == "tarjetaAsunto", permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosAdicionalesUF)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.rol.unidadFamiliar", value: document.getElementById("tarjetaUnidadFamiliar"), nombre: "tarjetaUnidadFamiliar" });
            this.tarjetas.set("tarjetaUnidadFamiliar", { visibility: false, permission: true });
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      } else if (this.origen == "ContrarioEJG" || this.origen == "Contrario") {
        if (this.getPermiso(procesos_justiciables.detalleContrarios)) {
          if (this.getPermiso(procesos_ejg.datosGeneralesContrarios)) {
            this.enlacesResumen.push({ label: "general.message.datos.generales", value: document.getElementById("tarjetaGenerales"), nombre: "tarjetaGenerales" });
            this.tarjetas.set("tarjetaGenerales", { visibility: abrirTarjeta == "tarjetaGenerales", permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosDireccionContactoContrarios)) {
            this.enlacesResumen.push({ label: "formacion.fichaInscripcion.datosPersonales.cabecera", value: document.getElementById("tarjetaPersonales"), nombre: "tarjetaPersonales" });
            this.tarjetas.set("tarjetaPersonales", { visibility: abrirTarjeta == "tarjetaPersonales", permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosSolicitudesContrarios)) {
            this.enlacesResumen.push({ label: "censo.nuevaSolicitud.headerSolicitud", value: document.getElementById("tarjetaSolicitud"), nombre: "tarjetaSolicitud" });
            this.tarjetas.set("tarjetaSolicitud", { visibility: abrirTarjeta == "tarjetaSolicitud", permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosRepresentantesLegal)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.interesados.abogado", value: document.getElementById("tarjetaRepresentante"), nombre: "tarjetaRepresentante" });
            this.tarjetas.set("tarjetaRepresentante", { visibility: abrirTarjeta == "tarjetaRepresentante", permission: true });
          }
          if (this.getPermiso(procesos_ejg.asuntosContrarios)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.literal.asuntos", value: document.getElementById("tarjetaAsunto"), nombre: "tarjetaAsunto" });
            this.tarjetas.set("tarjetaAsunto", { visibility: abrirTarjeta == "tarjetaAsunto", permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosAbogadoContrario)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.contrarios.abogado", value: document.getElementById("tarjetaAbogado"), nombre: "tarjetaAbogado" });
            this.tarjetas.set("tarjetaAbogado", { visibility: abrirTarjeta == "tarjetaAbogado", permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosProcuradorContrario)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.contrarios.procurador", value: document.getElementById("tarjetaProcurador"), nombre: "tarjetaProcurador" });
            this.tarjetas.set("tarjetaProcurador", { visibility: abrirTarjeta == "tarjetaProcurador", permission: true });
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      } else {
        if (this.getPermiso(procesos_justiciables.gestionJusticiables)) {
          if (this.getPermiso(procesos_justiciables.tarjetaDatosGenerales)) {
            this.enlacesResumen.push({ label: "general.message.datos.generales", value: document.getElementById("tarjetaGenerales"), nombre: "tarjetaGenerales" });
            this.enlacesResumen.push({ label: "formacion.fichaInscripcion.datosPersonales.cabecera", value: document.getElementById("tarjetaPersonales"), nombre: "tarjetaPersonales" });
            this.tarjetas.set("tarjetaGenerales", { visibility: abrirTarjeta == "tarjetaGenerales", permission: true });
            this.tarjetas.set("tarjetaPersonales", { visibility: abrirTarjeta == "tarjetaPersonales", permission: true });
          }
          if (this.getPermiso(procesos_justiciables.tarjetaDatosSolicitud)) {
            this.enlacesResumen.push({ label: "censo.nuevaSolicitud.headerSolicitud", value: document.getElementById("tarjetaSolicitud"), nombre: "tarjetaSolicitud" });
            this.tarjetas.set("tarjetaSolicitud", { visibility: abrirTarjeta == "tarjetaSolicitud", permission: true });
          }
          if (this.getPermiso(procesos_justiciables.tarjetaDatosRepresentante)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.interesados.abogado", value: document.getElementById("tarjetaRepresentante"), nombre: "tarjetaRepresentante" });
            this.tarjetas.set("tarjetaRepresentante", { visibility: abrirTarjeta == "tarjetaRepresentante", permission: true });
          }
          if (this.getPermiso(procesos_justiciables.tarjetaAsuntos)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.literal.asuntos", value: document.getElementById("tarjetaAsunto"), nombre: "tarjetaAsunto" });
            this.tarjetas.set("tarjetaAsunto", { visibility: abrirTarjeta == "tarjetaAsunto", permission: true });
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      }
    }
  }

  private async searchRepresentanteById(idpersona: string, idinstitucion: string) {
    let bodyBusqueda = new JusticiableBusquedaItem();
    bodyBusqueda.idpersona = idpersona;
    bodyBusqueda.idinstitucion = idinstitucion;
    await this.sigaServices.post("gestionJusticiables_searchJusticiable", bodyBusqueda).subscribe(
      (n) => {
        this.body = JSON.parse(n.body).justiciable;
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.modoEdicion = true;
        this.searchContrarios();
        this.checkAccesoTarjetas();
        this.updateTarjResumen();
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  private searchContrarios() {
    if (this.origen == "ContrarioEJG") {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let item = [ejg.numero.toString(), ejg.annio, ejg.tipoEJG, false, this.body.idpersona];
      this.sigaServices.post("gestionejg_busquedaListaContrariosEJG", item).subscribe((n) => {
        if (n.ok) {
          this.contrario = JSON.parse(n.body)[0];
        }
      });
    } else if (this.origen == "Contrario") {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let item = [designa.idTurno.toString(), designa.nombreTurno, designa.numero.toString(), designa.ano, false, this.body.idpersona];
      this.sigaServices.post("designaciones_listaContrarios", item).subscribe((n) => {
        if (n.ok) {
          this.contrario = JSON.parse(n.body)[0];
        }
      });
    }
  }
}
