import { Component, OnInit, Input } from '@angular/core';
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaServices } from "../../../../_services/siga.service";

@Component({
  selector: 'app-busqueda-facturacion',
  templateUrl: './busqueda-facturacion.component.html',
  styleUrls: ['./busqueda-facturacion.component.scss']
})
export class BusquedaFacturacionComponent implements OnInit {
  
  constructor(private sigaServices: SigaServices) { }
  
  ngOnInit() { }
}
