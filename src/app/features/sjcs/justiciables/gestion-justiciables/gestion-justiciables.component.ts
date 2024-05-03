import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { JusticiableBusquedaItem } from "../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../models/sjcs/JusticiableItem";
import { UnidadFamiliarEJGItem } from "../../../../models/sjcs/UnidadFamiliarEJGItem";
import { procesos_ejg } from "../../../../permisos/procesos_ejg";
import { procesos_justiciables } from "../../../../permisos/procesos_justiciables";

@Component({
  selector: "app-gestion-justiciables",
  templateUrl: "./gestion-justiciables.component.html",
  styleUrls: ["./gestion-justiciables.component.scss"],
})
export class GestionJusticiablesComponent implements OnInit {
  body: JusticiableItem = new JusticiableItem();
  unidadFamiliar: UnidadFamiliarEJGItem = new UnidadFamiliarEJGItem();
  justiciable: any;
  tarjetas = new Map();
  datosResumen = [];
  enlacesResumen = [];
  origen: string = "";

  modoEdicion: boolean = false;
  progressSpinner: boolean = false;

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices, private commonsService: CommonsService, private persistenceService: PersistenceService) {}

  async ngOnInit() {
    this.progressSpinner = true;
    this.getTarjetas();
    if (sessionStorage.getItem("origin")) {
      this.origen = sessionStorage.getItem("origin");
      sessionStorage.removeItem("origin");
    }
    this.checkAccesoTarjetas();
    if (this.persistenceService.getDatos() != undefined) {
      let justiciable = this.persistenceService.getDatos();
      this.persistenceService.clearDatos();
      if (sessionStorage.getItem("justiciable")) {
        this.justiciable = JSON.parse(sessionStorage.getItem("justiciable"));
        sessionStorage.removeItem("justiciable");
      }
      await this.searchRepresentanteById(justiciable.idpersona, justiciable.idinstitucion);
    } else if (sessionStorage.getItem("familiar")) {
      this.unidadFamiliar = JSON.parse(sessionStorage.getItem("familiar"));
      sessionStorage.removeItem("familiar");
      await this.searchRepresentanteById(this.unidadFamiliar.uf_idPersona, this.unidadFamiliar.uf_idInstitucion);
    } else {
      this.updateTarjResumen();
    }
  }

  updateBody(justiciable: JusticiableItem) {
    this.body = justiciable;
    this.updateTarjResumen();
  }

  isOpenTarjeta(idTarjeta: string) {
    return this.tarjetas.get(idTarjeta).visibility;
  }

  isPermisoTarjeta(idTarjeta: string) {
    return this.tarjetas.get(idTarjeta).permission;
  }

  backTo() {
    if (this.origen == "representante") {
      this.persistenceService.setDatos(this.justiciable);
      this.router.navigate(["/gestionJusticiables"]);
    } else if (this.origen == "UnidadFamiliar" || this.origen == "ContrarioEJG") {
      this.router.navigate(["/gestionEjg"]);
    } else if (this.origen == "Contrario") {
      this.router.navigate(["/fichaDesignaciones"]);
    } else {
      sessionStorage.setItem("origin", this.origen);
      this.router.navigate(["/justiciables"]);
    }
  }

  openTarjeta(event: string) {
    let data = this.tarjetas.get(event);
    data.visibility = true;
    this.tarjetas.set(event, data);
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
    if (this.body != null && this.body != undefined) {
      let movil: string = "";
      if (this.body.telefonos != null && this.body.telefonos.length > 0) {
        movil = this.body.telefonos[0].numeroTelefono;
      }

      this.datosResumen = [
        { label: this.translateService.instant("censo.usuario.DNI"), value: this.body.nif },
        { label: this.translateService.instant("facturacionSJCS.retenciones.nombre"), value: this.body.apellido1 + " " + this.body.apellido2 + ", " + this.body.nombre },
        { label: this.translateService.instant("censo.datosDireccion.literal.correo"), value: this.body.correoelectronico },
        { label: this.translateService.instant("censo.datosDireccion.literal.telefonoMovil"), value: movil },
        { label: this.translateService.instant("censo.consultaDirecciones.literal.direccion"), value: (this.body.direccion != null ? this.body.direccion + ", " : "") + this.body.codigopostal },
      ];
    }
    this.progressSpinner = false;
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

  private checkAccesoTarjetas() {
    if (!this.modoEdicion) {
      if (this.getPermiso(procesos_justiciables.tarjetaDatosGenerales)) {
        this.enlacesResumen.push({ label: "general.message.datos.generales", value: document.getElementById("tarjetaGenerales"), nombre: "tarjetaGenerales" });
        this.tarjetas.set("tarjetaGenerales", { visibility: true, permission: true });
      }
    } else {
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
            this.tarjetas.set("tarjetaRepresentante", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.asuntosUF)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.literal.asuntos", value: document.getElementById("tarjetaAsunto"), nombre: "tarjetaAsunto" });
            this.tarjetas.set("tarjetaAsunto", { visibility: false, permission: true });
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
            this.tarjetas.set("tarjetaGenerales", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosDireccionContactoContrarios)) {
            this.enlacesResumen.push({ label: "formacion.fichaInscripcion.datosPersonales.cabecera", value: document.getElementById("tarjetaPersonales"), nombre: "tarjetaPersonales" });
            this.tarjetas.set("tarjetaPersonales", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosSolicitudesContrarios)) {
            this.enlacesResumen.push({ label: "censo.nuevaSolicitud.headerSolicitud", value: document.getElementById("tarjetaSolicitud"), nombre: "tarjetaSolicitud" });
            this.tarjetas.set("tarjetaSolicitud", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosRepresentantesLegal)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.interesados.abogado", value: document.getElementById("tarjetaRepresentante"), nombre: "tarjetaRepresentante" });
            this.tarjetas.set("tarjetaRepresentante", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.asuntosContrarios)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.literal.asuntos", value: document.getElementById("tarjetaAsunto"), nombre: "tarjetaAsunto" });
            this.tarjetas.set("tarjetaAsunto", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosAbogadoContrario)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.contrarios.abogado", value: document.getElementById("tarjetaAbogado"), nombre: "tarjetaAbogado" });
            this.tarjetas.set("tarjetaAbogado", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_ejg.datosProcuradorContrario)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.contrarios.procurador", value: document.getElementById("tarjetaProcurador"), nombre: "tarjetaProcurador" });
            this.tarjetas.set("tarjetaProcurador", { visibility: false, permission: true });
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
            this.tarjetas.set("tarjetaGenerales", { visibility: false, permission: true });
            this.tarjetas.set("tarjetaPersonales", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_justiciables.tarjetaDatosSolicitud)) {
            this.enlacesResumen.push({ label: "censo.nuevaSolicitud.headerSolicitud", value: document.getElementById("tarjetaSolicitud"), nombre: "tarjetaSolicitud" });
            this.tarjetas.set("tarjetaSolicitud", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_justiciables.tarjetaDatosRepresentante)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.oficio.designas.interesados.abogado", value: document.getElementById("tarjetaRepresentante"), nombre: "tarjetaRepresentante" });
            this.tarjetas.set("tarjetaRepresentante", { visibility: false, permission: true });
          }
          if (this.getPermiso(procesos_justiciables.tarjetaAsuntos)) {
            this.enlacesResumen.push({ label: "justiciaGratuita.justiciables.literal.asuntos", value: document.getElementById("tarjetaAsunto"), nombre: "tarjetaAsunto" });
            this.tarjetas.set("tarjetaAsunto", { visibility: false, permission: true });
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
        this.modoEdicion = true;
        this.updateTarjResumen();
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }
}
