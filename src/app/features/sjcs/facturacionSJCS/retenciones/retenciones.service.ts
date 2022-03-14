import { Injectable, OnDestroy } from '@angular/core';
import { RetencionesItem } from '../../../../models/sjcs/RetencionesItem';
import { SigaServices } from '../../../../_services/siga.service';
import { Subscription } from 'rxjs';
import { RetencionesRequestDto } from '../../../../models/sjcs/RetencionesRequestDTO';

@Injectable()
export class RetencionesService implements OnDestroy {

  modoEdicion: boolean = false;
  retencion: RetencionesItem = new RetencionesItem();
  filtrosRetenciones: RetencionesRequestDto = new RetencionesRequestDto();
  rutaMenu: Subscription;
  permisoEscrituraDatosRetencion: boolean;

  constructor(private sigaServices: SigaServices) {
    this.rutaMenu = this.sigaServices.rutaMenu$.subscribe(
      ruta => {
        if (ruta && ruta.length > 0) {
          this.retencion = new RetencionesItem();
          this.filtrosRetenciones = null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.rutaMenu.unsubscribe();
  }

}
