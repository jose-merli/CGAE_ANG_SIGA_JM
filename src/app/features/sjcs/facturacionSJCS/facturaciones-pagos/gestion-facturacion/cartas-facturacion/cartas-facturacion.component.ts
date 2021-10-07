import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-cartas-facturacion',
  templateUrl: './cartas-facturacion.component.html',
  styleUrls: ['./cartas-facturacion.component.scss']
})
export class CartasFacturacionComponent implements OnInit {
  progressSpinnerCartas: boolean = false;
  numApuntes = 0;

  @Input() idFacturacion;
  @Input() idEstadoFacturacion;

  constructor(private router: Router, private sigaService: SigaServices) { }

  ngOnInit() {
    this.progressSpinnerCartas = false;

    if (undefined != this.idFacturacion) {
      this.serviceNumApuntes();
    }
  }

  serviceNumApuntes() {
    if (undefined != this.idFacturacion) {
      this.progressSpinnerCartas = true;

      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_numApuntes", "?idFacturacion=" + this.idFacturacion).subscribe(
        data => {
          this.numApuntes = data.valor;
          this.progressSpinnerCartas = false;
        },
        err => {
          console.log(err);
          this.progressSpinnerCartas = false;
        }
      );
    }
  }

  disableEnlaceCartas() {
    if (this.idEstadoFacturacion == '30' || this.idEstadoFacturacion == '20') {
      return false;
    } else {
      return true;
    }
  }

  linkCartasFacturacion() {

    if (undefined != this.idFacturacion && null != this.idFacturacion && undefined != this.idEstadoFacturacion && null != this.idEstadoFacturacion && (this.idEstadoFacturacion == '30' || this.idEstadoFacturacion == '20')) {

      const datosCartasFacturacion = {
        idFacturacion: [this.idFacturacion],
        idEstadoFacturacion: this.idEstadoFacturacion,
        modoBusqueda: 'f'
      };

      sessionStorage.setItem("datosCartasFacturacion", JSON.stringify(datosCartasFacturacion));

      this.router.navigate(["/cartaFacturacionPago"]);
    }
  }
}
