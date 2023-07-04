import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { SigaServices } from "./siga.service";
@Injectable()
export class HeaderGestionEntidadService {
  // Servicio para comunicar gestion-entidad.component con header.component

  private url = new BehaviorSubject<any>("");
  url$ = this.url.asObservable();

  constructor(sigaServices: SigaServices) {
    this.url.next(
      sigaServices.getNewSigaUrl() +
      sigaServices.getServucePath("header_logo") +
      "?random=" +
      new Date().getTime()
    );
  }

  // Funcion para cambiar la url de la imagen del logotipo de header.component
  changeUrl(nuevaUrl: any) {
    this.url.next(nuevaUrl);
  }
}
