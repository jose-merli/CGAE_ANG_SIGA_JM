import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '../../../../../../../node_modules/@angular/router';

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

      this.sigaServices.get("fichaColegialGenerales_tratamiento").subscribe(
        n => {
          this.viernes = true;
          this.generalTratamiento = n.combooItems;
          let tratamiento = this.generalTratamiento.find(
            item => item.value === this.generalBody.idTratamiento
          );
          if (tratamiento != undefined && tratamiento.label != undefined) {
            this.tratamientoDesc = tratamiento.label;
          }
        },
        err => {
          //console.log(err);
        }
      );
    }
  }
  irAlterMutuaReta() {
    this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
    this.solicitudEditar.idPais = "191";
    this.solicitudEditar.identificador = this.generalBody.nif;
    this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
    this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
    this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
    this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
    this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
    this.solicitudEditar.tratamiento = this.tratamientoDesc;
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
    this.solicitudEditar = JSON.parse(JSON.stringify(this.generalBody));
    this.solicitudEditar.idPais = "191";
    this.solicitudEditar.identificador = this.generalBody.nif;
    this.solicitudEditar.numeroIdentificacion = this.generalBody.nif;
    this.solicitudEditar.tratamiento = this.generalBody.idTratamiento;
    this.solicitudEditar.apellido1 = this.generalBody.apellidos1;
    this.solicitudEditar.apellido2 = this.generalBody.apellidos2;
    this.solicitudEditar.idEstadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.estadoCivil = this.generalBody.idEstadoCivil;
    this.solicitudEditar.fechaNacimiento = this.generalBody.fechaNacimientoDate;
    this.solicitudEditar.tratamiento = this.tratamientoDesc;
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


}
