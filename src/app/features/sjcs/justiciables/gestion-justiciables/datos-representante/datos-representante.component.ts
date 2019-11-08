import { Component, OnInit, Input } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-representante',
  templateUrl: './datos-representante.component.html',
  styleUrls: ['./datos-representante.component.scss']
})
export class DatosRepresentanteComponent implements OnInit {

  generalBody;
  existeImagen: boolean = false;

  tipoIdentificacion;

  @Input() showTarjeta;

  constructor(private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {

    this.getTiposIdentificacion();
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  navigateToJusticiable() {
    this.router.navigate(["/gestionJusticiables"]);
  }

  searchJusticiable() {
    this.router.navigate(["/justiciables"]);
  }

  getTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.tipoIdentificacion = n.combooItems;
        // 1: {label: "CIF", value: "20"}
        // 2: {label: "NIE", value: "40"}
        // 3: {label: "NIF", value: "10"}
        // 4: {label: "Otro", value: "50"}
        // 5: {label: "Pasaporte", value: "30"}
        // this.tipoIdentificacion[5].label =
        //   this.tipoIdentificacion[5].label +
        //   " / " +
        //   this.tipoIdentificacion[4].label;
      },
      err => {
        console.log(err);
      }
    );
  }

}
