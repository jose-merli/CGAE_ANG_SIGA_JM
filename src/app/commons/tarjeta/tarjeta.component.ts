import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosColegiadosItem } from '../../models/DatosColegiadosItem';
import { SigaServices } from '../../_services/siga.service';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss']
})
export class TarjetaComponent implements OnInit {

  @Input() cardTitle: string;
  @Input() cardOpenState: boolean;
  @Input() icon: string;
  @Input() image: string;
  @Input() campos;
  @Input() enlaces;
  @Input() fixed: boolean;
  @Input() enlaceCardOpen;
  @Input() enlaceCardClosed;
  @Input() datosLetrado;
  @Output() isOpen = new EventEmitter<any>();

  progressSpinner: boolean = false;


  constructor(private sigaServices: SigaServices, private router: Router) { }

  ngOnInit() {
  }

  goToCard(enlace) {
    enlace.ref.scrollIntoView({ block: "center", behavior: 'smooth', inline: "start" });
    this.isOpen.emit(enlace.id);
  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  goDown() {
    let down = document.getElementById("down");
    if (down) {
      down.scrollIntoView();
      down = null;
    }
  }

  //Meter los datos del letrado en session
  irFichaColegial(){
    //console.log("DATOS LETRADO", this.datosLetrado);
    let bodyColegiado: DatosColegiadosItem = new DatosColegiadosItem();
    bodyColegiado.nif = this.datosLetrado.nif;
    bodyColegiado.idInstitucion = this.datosLetrado.numeroInstitucion;

    this.sigaServices
      .postPaginado(
        'busquedaCensoGeneral_searchColegiado',
        '?numPagina=1',
        bodyColegiado
      )
            .subscribe((data) => {
        let colegiadoSearch = JSON.parse(data['body']);
        let datosColegiados = colegiadoSearch.colegiadoItem;

        if (datosColegiados == null || datosColegiados == undefined ||
          datosColegiados.length == 0) {
          this.getNoColegiado();
        } else {
          sessionStorage.setItem(
            'personaBody',
            JSON.stringify(datosColegiados[0])
          );
          sessionStorage.setItem(
            'esColegiado',
            JSON.stringify(true)
          );
          this.router.navigate(['/fichaColegial']);
        }
      },
                (err) => {
          this.progressSpinner = false;

        });
  }

  getNoColegiado() {
    let bodyNoColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyNoColegiado.nif = this.datosLetrado.nif;
      bodyNoColegiado.idInstitucion = this.datosLetrado.numeroInstitucion;

    this.sigaServices
      .postPaginado(
        'busquedaNoColegiados_searchNoColegiado',
        '?numPagina=1',
        bodyNoColegiado
      )
            .subscribe((data) => {
        this.progressSpinner = false;
        let noColegiadoSearch = JSON.parse(data['body']);
        let datosNoColegiados = noColegiadoSearch.noColegiadoItem;

          if (datosNoColegiados[0].fechaNacimiento != null) {
            datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
              datosNoColegiados[0].fechaNacimiento
            );
          }

          sessionStorage.setItem(
            'esColegiado',
            JSON.stringify(false)
          );

          sessionStorage.setItem(
            'personaBody',
            JSON.stringify(datosNoColegiados[0])
          );

          this.router.navigate(['/fichaColegial']);
      },
                 (err) => {
          this.progressSpinner = false;

        });
  }

  personaBodyFecha(fecha) {
    let f = fecha.substring(0, 10);
    let year = f.substring(0, 4);
    let month = f.substring(5, 7);
    let day = f.substring(8, 10);

    return day + '/' + month + '/' + year;
  }

}
