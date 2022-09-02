import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, SimpleChanges, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';
import { Message } from 'primeng/components/common/api';
import { DatePipe, Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';

@Component({
  selector: 'app-defensa-juridica',
  templateUrl: './defensa-juridica.component.html',
  styleUrls: ['./defensa-juridica.component.scss']
})
export class DefensaJuridicaComponent implements OnInit {

  progressSpinner: boolean = false;
  body: EJGItem = new EJGItem();
  designa = new DesignaItem();
  bodyInicial: EJGItem;
  @Input() permisoEscritura: boolean;
  @Input() permisoDefensaJuridica:boolean;

  isDisabledProcedimiento: boolean = true;

  textFilter: string = "Seleccionar";
  textSelected: String = '{0} opciones seleccionadas';

  comboPreceptivo = [];
  comboRenuncia = [];
  comboSituacion = [];
  comboComisaria = [];
  comboCalidad = [];
  comboJuzgado = [];
  comboProcedimiento = [];
  comboDelitos = [];

  comisariaCabecera;
  calidadCabecera;
  juzgadoCabecera;
  procedimientoCabecera;

  openDef: boolean = false;
  perEscritura: boolean = false;

  delitosValueInicial: any;
  delitosValue: any = [];

  msgs: Message[] = [];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private location: Location) { }

  ngOnInit() {
    this.body = this.persistenceService.getDatos();
    //Valor inicial a reestablecer
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Los valores de la cabecera se actualizan en cada combo y al en el metodo getCabecera()
    //Se asignan al iniciar la tarjeta y al guardar.
    //Se obtiene la designacion si hay una designacion entre las relaciones
    setTimeout(() => {
      this.cargarDatosDefensaJuridica();
      
      this.getEjgItem();

      //Se sobreescribe la informacion de pre designacion (Primera mitad de la tarjeta) 
      //en this.body en el caso de que haya una designacion
      if (this.designa != null) {
        this.body.numAnnioProcedimiento = this.body.procedimiento;
        if(this.designa.nig!=null && this.designa.nig!= undefined){
          this.body.nig = this.designa.nig.toString();
        }
        if(this.designa.observaciones!=null && this.designa.observaciones!= undefined){
          this.body.observaciones = this.designa.observaciones.toString();
        }
        if(this.designa.idCalidad!=null && this.designa.idCalidad!= undefined){
          this.body.calidad = this.designa.idCalidad.toString();
        }
        if(this.designa.idPretension!=null && this.designa.idPretension != undefined){
          this.body.idPretension = this.designa.idPretension;
        }
        if(this.designa.idJuzgado!=null && this.designa.idJuzgado!= undefined){
          this.body.juzgado = this.designa.idJuzgado.toString();
        }

        //Variables de designacion que nos interesa representar
        /* ano: "D2021/42"
          delitos: null
          idCalidad: null
          idJuzgado: 0
          idJuzgados: null
          idPretension: 0
          idProcedimiento: ""
          idProcedimientos: null
          idRol: 0
          nig: null
          nombreJuzgado: ""
          nombreProcedimiento: ""
          observaciones  */
      }

      //this.progressSpinner = true;
      this.getComboPreceptivo();
      this.getComboRenuncia();
      this.getComboSituaciones();
      this.getComboCDetencion();
      this.getComboCalidad();
      this.getComboJuzgado();
      if (this.body.juzgado != null) this.getComboProcedimiento();
      this.getComboDelitos();
      this.progressSpinner = false;
      if (this.body.juzgado != undefined && this.body.juzgado != null) this.isDisabledProcedimiento = false;

      if(this.permisoEscritura){
        this.perEscritura = true;
      }else{
        this.perEscritura = false;
      }
    }, 1000);
  }
  ngOnChanges(changes: SimpleChanges): void {
		if(this.permisoEscritura){
      this.perEscritura = true;
    }else{
      this.perEscritura = false;
    }
	}

  //Codigo copiado de la tarjeta detalles de la ficha de designaciones
   validarNig(nig) {
    let ret = false;
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.body.idInstitucion;
    parametro.modulo = "SCS";
    parametro.parametrosGenerales = "NIG_VALIDADOR";
    if (nig != null && nig != '') {
      //this.progressSpinner = true;
       this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .toPromise().then(
          data => {
            let searchParametros = JSON.parse(data["body"]);
            let datosBuscar = searchParametros.parametrosItems;
            datosBuscar.forEach(element => {
              if (element.parametro == "NIG_VALIDADOR" && (element.idInstitucion == element.idinstitucionActual || element.idInstitucion == '0')) {
                let valorParametroNIG: RegExp = new RegExp(element.valor);
                if (nig != '') {
                  ret = valorParametroNIG.test(nig);
                  if (ret) this.save();
                  else {
                    let severity = "error";
                    let summary = this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido");
                    let detail = "";
                    this.msgs.push({
                      severity,
                      summary,
                      detail
                    });
                  }
                }
                else {
                  this.save();
                }
              }
            });
            //this.progressSpinner = false;
          }).catch(error => {
            let severity = "error";
            let summary = this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido");
            let detail = "";
            this.msgs.push({
              severity,
              summary,
              detail
            });
            ret = false;
          });
          //this.progressSpinner = false;
    }

    if (!ret) this.save();
  }

  validarNProcedimiento(nProcedimiento) {
    //Esto es para la validacion de CADENA

    //Obtenemos la institucion actual
    // let idInstitucion = this.body.idInstitucion;

    //Codigo copiado de la tarjeta detalles de la ficha de designaciones
    // if (idInstitucion == "2008" || idInstitucion == "2015" || idInstitucion == "2029" || idInstitucion == "2033" || idInstitucion == "2036" ||
    //   idInstitucion == "2043" || idInstitucion == "2006" || idInstitucion == "2021" || idInstitucion == "2035" || idInstitucion == "2046" || idInstitucion == "2066") {
    //   if (nProcedimiento != '') {
    //     var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
    //     var ret = objRegExp.test(nProcedimiento);
    //     return ret;
    //   }
    //   else
    //     return true;
    // } else {
      // var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}[/]$/;
      var objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}$/;
      var ret = objRegExp.test(nProcedimiento);
      return ret;
    // }
  }

  getCabecera() {
    //Valor de la cabecera para la comisaria
    this.comboComisaria.forEach(element => {
      if (element.value == this.bodyInicial.comisaria) this.comisariaCabecera = element.label;
    });
    //Valor de la cabecera para en calidad de
    this.comboCalidad.forEach(element => {
      if (element.value == this.bodyInicial.calidad) this.calidadCabecera = element.label;
    });
    //Valor de la cabecera para juzagado
    this.comboJuzgado.forEach(element => {
      if (element.value == this.bodyInicial.juzgado) this.juzgadoCabecera = element.label;
    });
    //Valor de la cabecera para procedimiento
    this.comboProcedimiento.forEach(element => {
      if (element.value == this.bodyInicial.idPretension) this.procedimientoCabecera = element.label;
    });
  }


  abreCierra() {
    this.openDef = !this.openDef;
    // this.opened.emit(this.openDef);
    // this.idOpened.emit(key);
  }

  checkPermisosAsociarDes() {
    if (!this.perEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoDefensaJuridica) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
      this.asociarDes();
    }
  }

  asociarDes() {
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
    this.router.navigate(["/busquedaAsuntos"]);
  }

  checkPermisosCreateDes() {
    if (!this.perEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoDefensaJuridica) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
      this.createDes();
    }
  }

  createDes() {
    this.progressSpinner = true;
    //Recogemos los datos de nuevo de la capa de persistencia para captar posibles cambios realizados en el resto de tarjetas
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
    sessionStorage.setItem("nuevaDesigna", "true");
    //if (this.art27) sessionStorage.setItem("Art27", "true");
    this.progressSpinner = false;
    this.router.navigate(["/fichaDesignaciones"]);
  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.delitosValue = this.delitosValueInicial;
  }

  checkSave() {
    //Comprobamos que el numero de procedimiento tiene el formato adecuado según la institucion
    if (!this.perEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoDefensaJuridica) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
    } else if (this.validarNProcedimiento(this.body.procedimiento)) this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.preDesigna.errorNumProc"));
  //Comprobamos el formato del NIG y al ser un servicio siga, a llamada del metodo de guardado estar en su interior.
    else this.validarNig(this.body.nig)
  }

  save() {
    this.progressSpinner = true;

    this.body.delitos = null;
    this.delitosValue.forEach(delitoEJG => {
      // this.comboDelitos.forEach(delito => {
      //   if (delitoEJG == delito.value) {
      //     if (this.body.delitos == null) this.body.delitos = delito.label;
      //     else this.body.delitos = this.body.delitos + ", " + delito.label;
      //   }
      // })
      if (this.body.delitos == null) this.body.delitos = delitoEJG.toString();
           else this.body.delitos = this.body.delitos+","+ delitoEJG.toString();
         
    });

    this.sigaServices.post("gestionejg_updateDatosJuridicos", this.body).subscribe(
      n => {
        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyInicial = this.body;
          this.persistenceService.setDatos(this.body);
          this.getCabecera();
          //this.actualizarDelitosEJG();
          this.progressSpinner = false;
        }
        else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          this.progressSpinner = false;
        }
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  actualizarDelitosEJG() {
    this.progressSpinner = true;
    let peticionDelitos: EJGItem = this.body;
    if (peticionDelitos.delitos != null) peticionDelitos.delitos = this.delitosValue.toString();
    this.sigaServices.post("gestionejg_actualizarDelitosEJG", peticionDelitos).subscribe(
      n => {
        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getEjgItem() {
    this.bodyInicial = this.body;
    //Actualizamos la informacion en el body de la pantalla
    this.sigaServices.post("gestionejg_datosEJG", this.bodyInicial).subscribe(
      n => {
        let ejgObject = JSON.parse(n.body).ejgItems;
        let datosItem = ejgObject[0];
        
        this.persistenceService.setDatos(datosItem);
        this.body = this.persistenceService.getDatos();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  getComboPreceptivo() {
    this.sigaServices.get("filtrosejg_comboPreceptivo").subscribe(
      n => {
        this.comboPreceptivo = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPreceptivo);
      },
      err => {
      }
    );
  }

  getComboRenuncia() {
    this.sigaServices.get("filtrosejg_comboRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboRenuncia);
      },
      err => {
      }
    );
  }

  getComboSituaciones() {
    this.sigaServices.get("gestionejg_comboSituaciones").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboSituacion);
      },
      err => {
      }
    );
  }

  getComboCDetencion() {
    this.sigaServices.get("gestionejg_comboCDetencion").subscribe(
      n => {
        this.comboComisaria = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboComisaria);
        if (this.bodyInicial.comisaria != null) {
          this.comboComisaria.forEach(element => {
            if (element.value == this.bodyInicial.comisaria) this.comisariaCabecera = element.label;
          });
        }
      },
      err => {
      }
    );
  }

  getComboDelitos() {
    this.sigaServices.get("gestionejg_comboDelitos").subscribe(
      n => {
        this.comboDelitos = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboDelitos);
        //Hay un problema con angular que por algún motivo parece que
        //los delitos asociados no se muestran de forma consistente (a veces si, a veces no).
        if (this.designa == null) this.getDelitosEJG();
      },
      err => {
      }, () => {
      }
    );
  }

  getComboCalidad() {
    this.sigaServices.get("gestionejg_comboTipoencalidad").subscribe(
      n => {
        this.comboCalidad = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboCalidad);
        if (this.bodyInicial.calidad != null) {
          //Valor de la cabecera para en calidad de
          this.comboCalidad.forEach(element => {
            if (element.value == this.bodyInicial.calidad) this.calidadCabecera = element.label;
          });
        }

      },
      err => {
      }
    );
  }

  getComboJuzgado() {
    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboJuzgado);
        //Valor de la cabecera para juzagado
        this.comboJuzgado.forEach(element => {
          if (element.value == this.bodyInicial.juzgado) this.juzgadoCabecera = element.label;
        });
      },
      err => {
      }
    );
  }

  getComboProcedimiento() {
    this.sigaServices.post("combo_comboProcedimientosConJuzgadoEjg", this.body)//combo_comboProcedimientosConJuzgado
      .subscribe(
        n => {
          this.comboProcedimiento = JSON.parse(n.body).combooItems;
          this.commonsServices.arregloTildesCombo(this.comboProcedimiento);
          //Valor de la cabecera para procedimiento
          this.comboProcedimiento.forEach(element => {
            if (element.value == this.bodyInicial.idPretension) this.procedimientoCabecera = element.label;
          });
        },
        err => {
        }
      );
  }

  getDelitosEJG() {
    this.sigaServices.post("gestionejg_getDelitosEJG", this.body)
      .subscribe(
        n => {
          let delitosEjg = JSON.parse(n.body).delitosEjgItem;
          delitosEjg.forEach(element => {
            this.delitosValue.push(element.iddelito);
          });
          this.delitosValueInicial = this.delitosValue;
        },
        err => {
        }
      );
  }

  //Cada vez que se cambia el valor del desplegable de turnos
  onChangeJuzgado() {
    this.comboProcedimiento = [];
    this.body.procedimiento = null;

    if (this.body.juzgado != undefined) {
      this.isDisabledProcedimiento = false;
      this.getComboProcedimiento();
    } else {
      this.isDisabledProcedimiento = true;
      //this.body.procedimiento = "";
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  cargarDatosDefensaJuridica() {
		//this.progressSpinner = true;
		let relaciones = [];
    let aux = this.persistenceService.getDatosRelaciones();
    relaciones.push(aux);
		//Comprobamos si entre la relaciones hay una designacion
		let foundDesigna = relaciones.find(element =>
		  element.sjcs == "DESIGNACIÓN"
		)
		if (foundDesigna != undefined) {
		  this.designa.ano = parseInt(foundDesigna.anio.toString());
		  this.designa.codigo = foundDesigna.numero.toString();
	
		  if (this.designa.numColegiado == "") {
        this.designa.numColegiado = null;
		  }
		  this.sigaServices.post("designaciones_busqueda", this.designa).subscribe(
			n => {
			  let datos = JSON.parse(n.body);
			  let error;
	
			  if (datos[0] != null && datos[0] != undefined) {
          if (datos[0].error != null) {
            error = datos[0].error;
          }
			  }
	
			  datos.forEach(designa => {
          designa.factConvenio = designa.ano;
          designa.anio = designa.ano;
          designa.ano = 'D' + designa.ano + '/' + designa.codigo;
          //  element.fechaEstado = new Date(element.fechaEstado);
          designa.fechaEstado = this.formatDate(designa.fechaEstado);
          designa.fechaFin = this.formatDate(designa.fechaFin);
          designa.fechaAlta = this.formatDate(designa.fechaAlta);
          designa.fechaEntradaInicio = this.formatDate(designa.fechaEntradaInicio);
          if (designa.estado == 'V') {
            designa.sufijo = designa.estado;
            designa.estado = 'Activo';
          } else if (designa.estado == 'F') {
            designa.sufijo = designa.estado;
            designa.estado = 'Finalizado';
          } else if (designa.estado == 'A') {
            designa.sufijo = designa.estado;
            designa.estado = 'Anulada';
          }
          designa.nombreColegiado = designa.apellido1Colegiado + " " + designa.apellido2Colegiado + ", " + designa.nombreColegiado;
          if (designa.nombreInteresado != null) {
            designa.nombreInteresado = designa.apellido1Interesado + " " + designa.apellido2Interesado + ", " + designa.nombreInteresado;
          }
          if (designa.art27 == "1") {
            designa.art27 = "Si";
          } else {
            designa.art27 = "No";
          }
    
          const params = {
            anio: designa.factConvenio,
            idTurno: designa.idTurno,
            numero: designa.numero,
            historico: false
          };
    
          this.getDatosAdicionales(designa);
			  });
			},
			err => {
			  //this.progressSpinner = false;
			}
		  );
		}
	  }
	
	
	  getDatosAdicionales(item) {
		//this.progressSpinner = true;
		let designaAdicionales = new DesignaItem();
		let anio = item.ano.split("/");
		designaAdicionales.ano = Number(anio[0].substring(1, 5));
		designaAdicionales.numero = item.numero;
		designaAdicionales.idTurno = item.idTurno;
		this.sigaServices.post("designaciones_getDatosAdicionales", designaAdicionales).subscribe(
		  n => {
	
			let datosAdicionales = JSON.parse(n.body);
			if (datosAdicionales[0] != null && datosAdicionales[0] != undefined) {
			  item.delitos = datosAdicionales[0].delitos;
			  item.fechaOficioJuzgado = datosAdicionales[0].fechaOficioJuzgado;
			  item.observaciones = datosAdicionales[0].observaciones;
			  item.fechaRecepcionColegio = datosAdicionales[0].fechaRecepcionColegio;
			  item.defensaJuridica = datosAdicionales[0].defensaJuridica;
			  item.fechaJuicio = datosAdicionales[0].fechaJuicio;
			}
			this.getDatosPre(item);
	
		  },
		  err => {
			//this.progressSpinner = false;
		  }, () => {
		  }
		);
	  }
	
	  getDatosPre(item) {
		
		let dataProcedimiento: DesignaItem = new DesignaItem();
		dataProcedimiento.ano = item.factConvenio;
		dataProcedimiento.idPretension = item.idPretension;
		dataProcedimiento.idTurno = item.idTurno;
		dataProcedimiento.numero = item.numero;
		this.sigaServices.post("designaciones_busquedaProcedimiento", dataProcedimiento).subscribe(
		  n => {
			let datosProcedimiento = JSON.parse(n.body);
			if (datosProcedimiento.length == 0) {
			  item.nombreProcedimiento = "";
			  item.idProcedimiento = "";
			} else {
			  item.nombreProcedimiento = datosProcedimiento[0].nombreProcedimiento;
			  item.idProcedimiento = dataProcedimiento.idPretension;
			}
	
			let dataModulo = new DesignaItem();
			dataModulo.idProcedimiento = item.idProcedimiento;
			dataModulo.idTurno = item.idTurno;
			dataModulo.ano = item.factConvenio;
			dataModulo.numero = item.numero
			this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
			  n => {
				let datosModulo = JSON.parse(n.body);
				if (datosModulo.length == 0) {
				  item.modulo = "";
				  item.idModulo = "";
				} else {
				  item.modulo = datosModulo[0].modulo;
				  item.idModulo = datosModulo[0].idModulo;
				}
				this.sigaServices.post("designaciones_busquedaJuzgado", item.idJuzgado).subscribe(
				  n => {
					item.nombreJuzgado = n.body;
					//this.progressSpinner = false;
					this.designa = item;
				  },
				  err => {
					item.nombreJuzgado = "";
					//this.progressSpinner = false;
					this.designa = item;
				  });
			  },
			  err => {
				//this.progressSpinner = false;
        this.designa = item;
			  });
		  },
		  err => {
			//this.progressSpinner = false;
      this.designa = item;
		  });
	  }

	  formatDate(date) {
		const pattern = 'dd/MM/yyyy';
		return this.datePipe.transform(date, pattern);
	  }

 }
