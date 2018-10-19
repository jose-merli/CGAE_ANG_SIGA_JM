import { Component, OnInit } from "@angular/core";
import { SolicitudesModificacionItem } from "../../../../models/SolicitudesModificacionItem";
import { SelectItem } from "primeng/components/common/api";
import { Location } from "@angular/common";

@Component({
  selector: "app-nueva-solicitudes-modificacion",
  templateUrl: "./nueva-solicitudes-modificacion.component.html",
  styleUrls: ["./nueva-solicitudes-modificacion.component.scss"]
})
export class NuevaSolicitudesModificacionComponent implements OnInit {
  body: SolicitudesModificacionItem = new SolicitudesModificacionItem();

  isNewMode: boolean;
  esColegiado: boolean;
  showCard: boolean = true;

  tipo: SelectItem[];
  selectedTipo: any;

  estado: SelectItem[];
  selectedEstado: any;

  constructor(private location: Location) {}

  ngOnInit() {
    if (sessionStorage.getItem("isNewMode") != null) {
      this.isNewMode = JSON.parse(sessionStorage.getItem("isNewMode"));
      this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));

      // MODO CONSULTAR
      if (!this.isNewMode) {
        if (sessionStorage.getItem("rowData") != null) {
          this.body = JSON.parse(sessionStorage.getItem("rowData"));
          console.log("HOLA", this.body);
        }
      }
    }
  }

  onHideCard() {
    this.showCard = !this.showCard;
  }

  // OnChange para el combo tipo de solicitud
  onChange(event) {}

  return() {
    this.location.back();
  }

  // Métodos filtro
  processRequest() {}

  refuseRequest() {}

  accept() {}
}
