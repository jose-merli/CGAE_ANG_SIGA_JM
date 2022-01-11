import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartasFacturacionPagosItem } from '../../../../../../models/sjcs/CartasFacturacionPagosItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Enlace } from '../gestion-facturacion.component'

@Component({
  selector: 'app-cartas-facturacion',
  templateUrl: './cartas-facturacion.component.html',
  styleUrls: ['./cartas-facturacion.component.scss']
})
export class CartasFacturacionComponent implements OnInit, AfterViewInit {
  progressSpinnerCartas: boolean = false;
  numApuntes = 0;

  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Output() addEnlace = new EventEmitter<Enlace>();

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

      const datosCartasFacturacion: CartasFacturacionPagosItem = new CartasFacturacionPagosItem();
      datosCartasFacturacion.idFacturacion = [this.idFacturacion];
      datosCartasFacturacion.idEstado = this.idEstadoFacturacion;
      datosCartasFacturacion.modoBusqueda = 'f';

      sessionStorage.setItem("datosCartasFacturacion", JSON.stringify(datosCartasFacturacion));

      this.router.navigate(["/cartaFacturacionPago"]);
    }
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaFactCartasFac',
      ref: document.getElementById('facSJCSFichaFactCartasFac')
    };

    this.addEnlace.emit(enlace);
  }
}
