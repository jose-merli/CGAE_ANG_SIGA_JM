import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';

@Component({
  selector: 'app-alter-mutua-ficha-colegial',
  templateUrl: './alter-mutua-ficha-colegial.component.html',
  styleUrls: ['./alter-mutua-ficha-colegial.component.scss']
})
export class AlterMutuaFichaColegialComponent implements OnInit, OnChanges {

  @Input() tarjetaAlterMutua;
  solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  tratamientoDesc: String;

  datosDirecciones: DatosDireccionesItem[] = [];

  @Input() datosTratamientos;

  generalTratamiento: any[] = [];
  progressSpinner: boolean = false;
  viernes = false
  constructor(private sigaServices: SigaServices,
    private router: Router) { }

  ngOnInit() {
    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
    }
  }

  ngOnChanges() {
    if ((this.tarjetaAlterMutua == "2" || this.tarjetaAlterMutua == "3") && !this.viernes) {

        this.viernes = true;
        this.generalTratamiento = this.datosTratamientos;
        let tratamiento = this.generalTratamiento.find(
          item => item.value === this.generalBody.idTratamiento
        );
        if (tratamiento != undefined && tratamiento.label != undefined) {
          this.tratamientoDesc = tratamiento.label;
        }
    }
  }
  irAlterMutuaReta() {
    if (sessionStorage.getItem("datosDireccionesAlterMutua")) {
      this.datosDirecciones = JSON.parse(sessionStorage.getItem("datosDireccionesAlterMutua"));
    }

    let direccion = this.buscaDireccionPorPrioridad(this.datosDirecciones);

    this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
    this.solicitudEditar.idPais = "191";
    this.solicitudEditar.identificador = this.generalBody.nif;
    this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
    this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
    this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
    this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
    this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
    this.solicitudEditar.tratamiento = this.tratamientoDesc;

    if (direccion != null) {
      this.solicitudEditar.codigoPostal = direccion.codigoPostal;
      this.solicitudEditar.domicilio = direccion.domicilio;
      this.solicitudEditar.fax1 = direccion.fax;
      this.solicitudEditar.correoElectronico = direccion.correoElectronico;
      this.solicitudEditar.telefono1 = direccion.telefono;
      this.solicitudEditar.telefono2 = direccion.telefono2;
      this.solicitudEditar.tipoDireccion = direccion.tipoDireccion;
      this.solicitudEditar.idProvincia = direccion.idProvincia;
      this.solicitudEditar.idPoblacion = direccion.idPoblacion;
      this.solicitudEditar.nombrePoblacion = direccion.nombrePoblacion;
      this.solicitudEditar.movil = direccion.movil;
    }
    
    this.solicitudEditar.iban = sessionStorage.getItem("ibanAlterMutua");
    this.solicitudEditar.idiomaPref = sessionStorage.getItem("idiomaPrefAlterMutua");

    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          let tipos = result.combooItems;
          this.progressSpinner = false;
          let identificacion = tipos.find(
            item => item.value === this.solicitudEditar.idTipoIdentificacion
          );
          this.solicitudEditar.tipoIdentificacion = identificacion.label;
          sessionStorage.setItem("datosSolicitud", JSON.stringify(this.solicitudEditar));
          sessionStorage.setItem("tipoPropuesta", "RETA");
          this.router.navigate(["/alterMutuaReta"]);
        },
        error => {
          //console.log(error);
        }
      );
  }


  irOfertas() {
    if (sessionStorage.getItem("datosDireccionesAlterMutua")) {
      this.datosDirecciones = JSON.parse(sessionStorage.getItem("datosDireccionesAlterMutua"));
    }

    let direccion = this.buscaDireccionPorPrioridad(this.datosDirecciones);

    this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
    this.solicitudEditar.idPais = "191";
    this.solicitudEditar.identificador = this.generalBody.nif;
    this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
    this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
    this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
    this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
    this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.fechaNacimiento = this.arreglarFecha(this.generalBody.fechaNacimiento);
    this.solicitudEditar.tratamiento = this.tratamientoDesc;
    
    if (direccion != null) {
      this.solicitudEditar.codigoPostal = direccion.codigoPostal;
      this.solicitudEditar.domicilio = direccion.domicilio;
      this.solicitudEditar.fax1 = direccion.fax;
      this.solicitudEditar.correoElectronico = direccion.correoElectronico;
      this.solicitudEditar.telefono1 = direccion.telefono;
      this.solicitudEditar.telefono2 = direccion.telefono2;
      this.solicitudEditar.tipoDireccion = direccion.tipoDireccion;
      this.solicitudEditar.idProvincia = direccion.idProvincia;
      this.solicitudEditar.idPoblacion = direccion.idPoblacion;
      this.solicitudEditar.nombrePoblacion = direccion.nombrePoblacion;
      this.solicitudEditar.movil = direccion.movil;
    }
    
    this.solicitudEditar.iban = sessionStorage.getItem("ibanAlterMutua");
    this.solicitudEditar.idiomaPref = sessionStorage.getItem("idiomaPrefAlterMutua");

    this.sigaServices
      .get("solicitudIncorporacion_tipoIdentificacion")
      .subscribe(
        result => {
          let tipos = result.combooItems;
          this.progressSpinner = false;
          let identificacion = tipos.find(
            item => item.value === this.solicitudEditar.idTipoIdentificacion
          );
          this.solicitudEditar.tipoIdentificacion = identificacion.label;
          sessionStorage.setItem("datosSolicitud", JSON.stringify(this.solicitudEditar));
          sessionStorage.setItem("tipoPropuesta", "Ofertas");
          this.router.navigate(["/alterMutuaOfertas"]);
        },
        error => {
          //console.log(error);
        }
      );
  }

  arreglarFecha(fecha) {

    if (fecha != undefined && fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(rawDate);
      }
    }
    return fecha;
  }

  buscaDireccionPorPrioridad(direcciones) {
    let direccion = null;
    let encontradaPrioridad = false;
    
    if (direcciones.length != 0) {
      direcciones.forEach(element => {

        if (encontradaPrioridad == false) {
          if (element.tipoDireccion.includes("Despacho")) {
            element.tipoDireccion = "Despacho";
            direccion = element;
            encontradaPrioridad = true;
          }
        }
      });
  
      if (encontradaPrioridad == false) {
        direccion = direcciones[0];
        if (direccion.tipoDireccion.includes("Residencia")) {
          direccion.tipoDireccion = "Residencia";
        } else {
          direccion.tipoDireccion = "";
        }
      } 
    }

    return direccion;
  }
}
