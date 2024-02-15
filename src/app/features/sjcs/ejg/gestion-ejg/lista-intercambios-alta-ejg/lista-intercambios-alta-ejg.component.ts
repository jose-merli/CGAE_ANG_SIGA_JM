import { Component, Input, OnInit } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { ListaIntercambiosEjgItem } from '../../../../../models/sjcs/ListaIntercambiosEjgItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lista-intercambios-alta-ejg',
  templateUrl: './lista-intercambios-alta-ejg.component.html',
  styleUrls: ['./lista-intercambios-alta-ejg.component.scss']
})
export class ListaIntercambiosAltaEjgComponent implements OnInit {

  @Input() body: EJGItem;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaListaIntercambiosAltaEjg: Boolean;

  progressSpinner: boolean = false;

  msgs = [];
  cols;
  selectedItem: number = 10;
  rowsPerPage: any = [];
  datos: ListaIntercambiosEjgItem[] = [];

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.getListaIntercambios();
  }

  onChangeRowsPerPages() {
    //ARR: Terminar
  }

  abreCierraFicha() {
    this.openTarjetaListaIntercambiosAltaEjg = !this.openTarjetaListaIntercambiosAltaEjg;
  }

  clear() {
    this.msgs = [];
  }

  private getListaIntercambios() {
    const request = { idInstitucion: this.body.idInstitucion, annio: this.body.annio, tipoEJG: this.body.tipoEJG, numero: this.body.numero };
    return this.sigaServices.post("gestionejg_getListaIntercambiosAltaEjg", request).subscribe(
      n => {
        this.progressSpinner = false;
        const body = JSON.parse(n.body);
        this.datos = body.ejgListaIntercambiosItems;
      },
      err => {
        this.progressSpinner = false;
        this.datos = [];
      }
    );
  }

  private getCols() {
    this.cols = [
      { field: "descripcion", header: "justiciaGratuita.ejg.listaIntercambios.intercambio", width: "20%" },
      { field: "fechaEnvio", header: "justiciaGratuita.ejg.listaIntercambios.fechaEnvio", width: "10%" },
      { field: "estadoRespuesta", header: "enviosMasivos.literal.estado", width: "10%" },
      { field: "fechaRespuesta", header: "justiciaGratuita.ejg.listaIntercambios.fechaRespuesta", width: "10%" },
      { field: "respuesta", header: "justiciaGratuita.ejg.listaIntercambios.respuesta", width: "50%" }
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }
}