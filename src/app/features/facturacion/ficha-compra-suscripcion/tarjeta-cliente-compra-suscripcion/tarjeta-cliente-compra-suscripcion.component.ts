import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { DatosColegiadosItem } from '../../../../models/DatosColegiadosItem';
import { JusticiableBusquedaItem } from '../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../models/sjcs/JusticiableItem';
import { procesos_facturacion } from '../../../../permisos/procesos_facturacion';
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

  body: JusticiableItem = new JusticiableItem();
  @Input("ficha") ficha;

  tipoIdentificacion;

  permisoBuscar;
  showSearch: boolean = false;
  showTarjeta: boolean = false;
  showEnlaceCliente: boolean = false;
  progressSpinner: boolean = false;
  
  constructor(private persistenceService: PersistenceService, 
    private sigaServices: SigaServices, private translateService: TranslateService, private router: Router, private commonsService: CommonsService) { }

  ngOnInit() {

    this.getTiposIdentificacion();


    //Se rellena la tarjeta automaticamente si el usuario que accede es un colegiado
    if(sessionStorage.esColegiado=='true' && sessionStorage.personaBody){
      let personalBody = JSON.parse(sessionStorage.personaBody);
      this.body.apellidos = personalBody.apellidos1+ " " +personalBody.apellidos2;
      this.body.nif = personalBody.nif;
      this.body.idtipoidentificacion = personalBody.idTipoIdentificacion;
      this.body.nombre = personalBody.soloNombre;
      this.body.idpersona = personalBody.idPersona;
      this.body.idinstitucion = personalBody.idInstitucion;
    }
    //Se comprueba si se ha realizado una busqueda y se rellena la tarjeta con los datos extraidos
    else if(sessionStorage.getItem("abogado")){
      let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
			sessionStorage.removeItem("abogado");
			this.body.nombre = data.nombre;
			this.body.nif = data.nif;
			this.body.idpersona = data.idPersona;
      this.body.apellidos = data.apellidos;
      this.body.idinstitucion = data.numeroInstitucion;
      
      this.compruebaDNIInput();
    }
    //Si se vuelve de la ficha colegial como colegiado conectador
    //Esto es debido a que el personalBody se borra en distintas pantallas de censo.
    else if(sessionStorage.getItem("Colegiado")){
      let colegiado = JSON.parse(sessionStorage.personaBody);
      this.body.apellidos = colegiado.apellidos1+ " " +colegiado.apellidos2;
      this.body.nif = colegiado.nif;
      this.body.idtipoidentificacion = colegiado.idTipoIdentificacion;
      this.body.nombre = colegiado.soloNombre;
      this.body.idpersona = colegiado.idPersona;
      this.body.idinstitucion = colegiado.idInstitucion;
    }
    //Si se vuelve de la ficha colegial como no colegiado
    else if(sessionStorage.getItem("Cliente")){
      this.body = JSON.parse(sessionStorage.getItem("Cliente"));
    }

    if(sessionStorage.esColegiado=='true')this.showSearch = false;
    else this.showSearch = true;

    //Linea temporal para testear
    this.showSearch = true;
    
    if(this.body.idpersona != null) this.showEnlaceCliente = true;

    this.getPermisoBuscar();
  }

  getPermisoBuscar(){
    this.commonsService
			.checkAcceso(procesos_facturacion.fichaCompraSuscripcion)
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
      sessionStorage.setItem("Cliente", JSON.stringify(this.body));
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
				console.log(err);
				this.progressSpinner = false;
			}
		);
	}

  compruebaDNIInput() {
		if (this.body.nif != undefined && this.body.nif.trim() != '' && this.body.nif != null) {
			let idTipoIdentificacion = this.commonsService.compruebaDNI(
				this.body.idtipoidentificacion,
				this.body.nif
			);
			this.body.idtipoidentificacion = idTipoIdentificacion;
    }
	}

  irFichaColegial(){

    this.progressSpinner = true;

    let bodyColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyColegiado.nif = this.body.nif;
      bodyColegiado.idInstitucion = this.body.idinstitucion;
  
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
            if(sessionStorage.personaBody)sessionStorage.setItem("Cliente", sessionStorage.personaBody);
            else sessionStorage.setItem("Cliente", JSON.stringify(this.body));
            this.router.navigate(['/fichaColegial']);
          }
        },
                  (err) => {
            this.progressSpinner = false;
  
          });
  }

  getNoColegiado() {
    let bodyNoColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyNoColegiado.nif = this.body.nif;
      bodyNoColegiado.idInstitucion = this.body.idinstitucion;

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
          if(sessionStorage.personaBody)sessionStorage.setItem("Cliente", sessionStorage.personaBody);
          else sessionStorage.setItem("Cliente", JSON.stringify(this.body));
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

  onHideTarjeta(){
    this.showTarjeta = !this.showTarjeta;
  }
}
