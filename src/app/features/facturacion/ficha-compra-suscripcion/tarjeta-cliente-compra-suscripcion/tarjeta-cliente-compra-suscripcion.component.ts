import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { DatosColegiadosItem } from '../../../../models/DatosColegiadosItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { JusticiableBusquedaItem } from '../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../models/sjcs/JusticiableItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-cliente-compra-suscripcion',
  templateUrl: './tarjeta-cliente-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-cliente-compra-suscripcion.component.scss']
})
export class TarjetaClienteCompraSuscripcionComponent implements OnInit {

  msgs : Message[];

  @Input("ficha") ficha: FichaCompraSuscripcionItem;
  @Input("resaltadoDatos") resaltadoDatos: boolean;
  @Input("esColegiado") esColegiado: boolean;

  tipoIdentificacion;

  permisoBuscar;
  showSearch: boolean = false;
  showTarjeta: boolean = false;
  showEnlaceCliente: boolean = false;
  progressSpinner: boolean = false;
  
  constructor(private persistenceService: PersistenceService, 
    private sigaServices: SigaServices, private translateService: TranslateService, 
    private router: Router, private commonsService: CommonsService, 
    private localStorageService: SigaStorageService) { }

  ngOnInit() {

    this.getTiposIdentificacion();
    //Se comprueba si se ha realizado una busqueda y se rellena la tarjeta con los datos extraidos
    if(sessionStorage.getItem("abogado")){
      let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
			sessionStorage.removeItem("abogado");
			this.ficha.nombre = data.nombre;
			this.ficha.nif = data.nif;
			this.ficha.idPersona = data.idPersona;
      this.ficha.apellidos = data.apellidos;
      this.ficha.idInstitucion = data.numeroInstitucion;
      
      this.compruebaDNIInput();
    }
    
    if(this.ficha.idPersona != null) this.showEnlaceCliente = true;

    this.getPermisoBuscar();
  }


  getPermisoBuscar(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoBuscar = respuesta;
			})
			.catch((error) => console.error(error));
  }

  checkSearch(){
    let msg = this.commonsService.checkPermisos(this.permisoBuscar, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    }  else {
			sessionStorage.setItem("origin", "newCliente");
      sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
			this.router.navigate(['/busquedaGeneral']);
		}
  }

  getTiposIdentificacion() {
		this.sigaServices.get('fichaPersona_tipoIdentificacionCombo').subscribe(
			(n) => {
				this.tipoIdentificacion = n.combooItems;
				this.progressSpinner = false;
			},
			(err) => {
				//console.log(err);
				this.progressSpinner = false;
			}
		);
	}

  compruebaDNIInput() {
		if (this.ficha.nif != undefined && this.ficha.nif.trim() != '' && this.ficha.nif != null) {
			let idTipoIdentificacion = this.commonsService.compruebaDNI(
				this.ficha.idtipoidentificacion,
				this.ficha.nif
			);
			this.ficha.idtipoidentificacion = idTipoIdentificacion;
    }
	}

  irFichaColegial(){

    this.progressSpinner = true;

    let bodyColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyColegiado.nif = this.ficha.nif;
      bodyColegiado.idInstitucion = this.ficha.idInstitucion;
  
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
            this.progressSpinner = false;
            sessionStorage.setItem("origin", "Cliente"); 
            sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
            this.router.navigate(['/fichaColegial']);
          }
        },
                  (err) => {
            this.progressSpinner = false;
  
          });
  }

  getNoColegiado() {
    let bodyNoColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyNoColegiado.nif = this.ficha.nif;
      bodyNoColegiado.idInstitucion = this.ficha.idInstitucion;

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
          this.progressSpinner = false;
          sessionStorage.setItem("origin", "Cliente");
          sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
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

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }
  
  onHideTarjeta(){
    this.showTarjeta = !this.showTarjeta;
  }
}
