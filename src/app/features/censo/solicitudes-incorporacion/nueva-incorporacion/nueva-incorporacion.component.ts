import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "../../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { SolicitudIncorporacionItem } from "../../../../models/SolicitudIncorporacionItem";
import { Location } from "@angular/common";
import { Message } from "primeng/components/common/api";


@Component({
    selector: 'app-nueva-incorporacion',
    templateUrl: './nueva-incorporacion.component.html',
    styleUrls: ['./nueva-incorporacion.component.scss']
})
export class NuevaIncorporacionComponent implements OnInit {

    fichaColegiacion: boolean = false;
    fichaSolicitud: boolean = false;
    fichaPersonal: boolean = false;
    fichaDireccion: boolean = false;
    fichaMutua: boolean = false;
    fichaAbogacia: boolean = false;
    fichaBancaria: boolean = false;
    es: any;
    solicitudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
    progressSpinner: boolean = false;
    comboSexo: any;
    tiposSolicitud: any[];
    estadosSolicitud: any[];
    tipoColegiacion: any[];
    tipoIdentificacion: any[];
    provincias: any[];
    poblaciones: any[];
    modalidadDocumentacion: any[];
    paises: any[];
    tratamientos: any[];
    estadoCivil: any[];
    residente: boolean = false;
    abonoJCS: boolean = false;
    abono: boolean = false;
    cargo: boolean = false;
    formSolicitud: FormGroup;
    estadoSolicitudSelected: any;
    tipoSolicitudSelected: any;
    tipoColegiacionSelected: any;
    msgs: Message[] = [];

    modalidadDocumentacionSelected: any;
    tipoIdentificacionSelected: any;
    tratamientoSelected: any;
    estadoCivilSelected: any;
    paisSelected: any;
    provinciaSelected: any;
    poblacionSelected: any;
    sexoSelected: any;

    private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";


    constructor(private translateService: TranslateService, private sigaServices: SigaServices, private location: Location, private formBuilder: FormBuilder, ) {

    }

    ngOnInit() {

        this.progressSpinner = true;
        this.es = this.translateService.getCalendarLocale();
        this.cargarCombos();

        this.formSolicitud = this.formBuilder.group({
            estado: new FormControl(Validators.required),
            fechaEstado: new FormControl(Validators.required),
            fechaSolicitud: new FormControl(Validators.required),
            observaciones: new FormControl(Validators.required),
            tipoSolicitud: new FormControl(Validators.required),
            modDocumentacion: new FormControl(Validators.required),
            fechaIncorporacion: new FormControl(Validators.required),
            numColegiado: new FormControl(Validators.required),
            tipoIdentificacion: new FormControl(Validators.required),
            numIdentificacion: new FormControl(Validators.required),
            tratamiento: new FormControl(Validators.required),
            nombre: new FormControl(Validators.required),
            apellido1: new FormControl(Validators.required),
            apellido2: new FormControl(Validators.required),
            sexo: new FormControl(Validators.required),
            estadoCivil: new FormControl(Validators.required),
            NaturalDe: new FormControl(Validators.required),
            fechaNac: new FormControl(Validators.required),
            pais: new FormControl(Validators.required),
            direccion: new FormControl(Validators.required),
            cp: new FormControl(Validators.required),
            provincia: new FormControl(Validators.required),
            pobalcion: new FormControl(Validators.required),
            telefono1: new FormControl(Validators.required),
            telefono2: new FormControl(Validators.required),
            fax1: new FormControl(Validators.required),
            fax2: new FormControl(Validators.required),
            movil: new FormControl(Validators.required),
            mail: new FormControl(Validators.required),
            titular: new FormControl(Validators.required),
            iban: new FormControl(Validators.required),
            banco: new FormControl(Validators.required),
        })


        if (sessionStorage.getItem("editar") == "true") {
            this.solicitudEditar = JSON.parse(sessionStorage.getItem("editedSolicitud"));
            this.tratarDatos();
        }


    }

    cargarCombos() {

        this.comboSexo = [
            { value: "H", label: "Hombre" },
            { value: "M", label: "Mujer" }
        ]

        this.sigaServices.get("solicitudInciporporacion_tipoSolicitud").subscribe(result => {
            this.tiposSolicitud = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_estadoSolicitud").subscribe(result => {
            this.estadosSolicitud = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_tratamiento").subscribe(result => {
            this.tratamientos = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_estadoCivil").subscribe(result => {
            this.estadoCivil = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_pais").subscribe(result => {
            this.paises = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_tipoIdentificacion").subscribe(result => {
            this.tipoIdentificacion = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_tipoColegiacion").subscribe(result => {
            this.tipoColegiacion = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("solicitudInciporporacion_modalidadDocumentacion").subscribe(result => {
            this.modalidadDocumentacion = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });

        this.sigaServices.get("integrantes_provincias").subscribe(result => {
            this.provincias = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });


    }

    tratarDatos() {

        if (this.solicitudEditar.residente == "1") {
            this.residente = true;
        } else {
            this.residente = false;
        }

        if (this.solicitudEditar.abonoJCS == "1") {
            this.abonoJCS = true;
        } else {
            this.abonoJCS = false;
        }

        if (this.solicitudEditar.abonoCargo != null) {
            this.cargo = true;
        } else {
            this.cargo = false;
        }

        this.solicitudEditar.fechaSolicitud = new Date(this.solicitudEditar.fechaSolicitud);
        this.solicitudEditar.fechaIncorporacion = new Date(this.solicitudEditar.fechaIncorporacion);
        this.solicitudEditar.fechaEstado = new Date(this.solicitudEditar.fechaEstado);
        this.solicitudEditar.fechaNacimiento = new Date(this.solicitudEditar.fechaNacimiento);

        this.sigaServices.getParam("direcciones_comboPoblacion", "?idProvincia=" + this.solicitudEditar.idProvincia).subscribe(result => {
            this.poblaciones = result.combooItems;
            this.progressSpinner = false;
        }, error => {
            console.log(error);
        });
        this.estadoSolicitudSelected = { value: this.solicitudEditar.idEstado };
        this.tipoSolicitudSelected = { value: this.solicitudEditar.idTipo };
        this.tipoColegiacionSelected = { value: this.solicitudEditar.idTipoColegiacion };
        this.modalidadDocumentacionSelected = { value: this.solicitudEditar.idModalidadDocumentacion };
        this.tipoIdentificacionSelected = { value: this.solicitudEditar.idTipoIdentificacion };
        this.tratamientoSelected = { value: this.solicitudEditar.idTratamiento };
        this.estadoCivilSelected = { value: this.solicitudEditar.idEstadoCivil };
        this.paisSelected = { value: this.solicitudEditar.idPais };
        this.provinciaSelected = { value: this.solicitudEditar.idProvincia };
        this.poblacionSelected = { value: this.solicitudEditar.idPoblacion };
        this.sexoSelected = { value: this.solicitudEditar.sexo };
    }

    onChangeProvincia(event) {

        this.sigaServices.getParam("direcciones_comboPoblacion", "?idProvincia=" + event.value.value).subscribe(result => {
            this.poblaciones = result.combooItems;
            this.progressSpinner = false;
            console.log(this.poblaciones);
        }, error => {
            console.log(error);
        });
    }
    guardar() {
        debugger;
        if (!this.formSolicitud.invalid && this.checkIdentificacion(this.solicitudEditar.numeroIdentificacion)) {
            this.progressSpinner = true;

            this.solicitudEditar.idEstado = this.estadoSolicitudSelected.value;
            this.solicitudEditar.idTipo = this.tipoSolicitudSelected.value;
            this.solicitudEditar.tipoColegiacion = this.tipoColegiacionSelected.value;
            this.solicitudEditar.idModalidadDocumentacion = this.modalidadDocumentacionSelected.value;
            this.solicitudEditar.idTipoIdentificacion = this.tipoIdentificacionSelected.value;
            this.solicitudEditar.tratamiento = this.tratamientoSelected.value;
            this.solicitudEditar.idEstadoCivil = this.estadoCivilSelected.value;
            this.solicitudEditar.idPais = this.paisSelected.value;
            this.solicitudEditar.idProvincia = this.provinciaSelected.value;
            this.solicitudEditar.idPoblacion = this.poblacionSelected.value;

            if (this.residente == true) {
                this.solicitudEditar.residente = "1"
            } else {
                this.solicitudEditar.residente = "0"
            }

            if (this.cargo == true) {
                this.solicitudEditar.abonoCargo = "1"
            } else {
                this.solicitudEditar.abonoCargo = "0"
            }

            if (this.abonoJCS == true) {
                this.solicitudEditar.abonoJCS = "1"
            } else {
                this.solicitudEditar.abonoJCS = "0"
            }

            /*if(this.abono == true){
                this.solicitudEditar. = "1"
            }else{
                this.solicitudEditar.residente = "0"
            }*/

            this.sigaServices.post("solicitudInciporporacion_nuevaSolicitud", this.solicitudEditar).subscribe(result => {
                //this.solicitudEditar = new SolicitudIncorporacionItem();
                console.log("guardado", result);
                this.progressSpinner = false;
                this.msgs = [{ severity: "success", summary: "Éxito", detail: "Solicitud guardada correctamente." }];
            }, error => {
                this.msgs = [{ severity: "error", summary: "Error", detail: "Error al guardar la solicitud." }];
            })
        } else {
            this.msgs = [{ severity: "error", summary: "Incompleto", detail: "Todos los campos deben estar rellenos." }];
        }


    }

    abreCierraFichaColegiacion() {
        this.fichaColegiacion = !this.fichaColegiacion;
    }
    abreCierraFichaSolicitud() {
        this.fichaSolicitud = !this.fichaSolicitud;
    }
    abreCierraFichaPersonal() {
        this.fichaPersonal = !this.fichaPersonal;
    }
    abreCierraFichaDireccion() {
        this.fichaDireccion = !this.fichaDireccion;
    }
    abreCierraFichaBancaria() {
        this.fichaBancaria = !this.fichaBancaria;
    }
    abreCierraFichaMutua() {
        this.fichaMutua = !this.fichaMutua;
    }
    abreCierraFichaAbogacia() {
        this.fichaAbogacia = !this.fichaAbogacia;
    }

    checkIdentificacion(doc: String) {
        if (doc && doc.length > 0 && doc != undefined) {
            if (doc.length == 10) {
                return this.isValidPassport(doc);
            } else {
                if (doc.substring(0, 1) == "1" || doc.substring(0, 1) == "2" || doc.substring(0, 1) == "3" || doc.substring(0, 1) == "4" || doc.substring(0, 1) == "5" || doc.substring(0, 1) == "6"
                    || doc.substring(0, 1) == "7" || doc.substring(0, 1) == "8" || doc.substring(0, 1) == "9" || doc.substring(0, 1) == "0") {
                    return this.isValidDNI(doc);
                } else {
                    return this.isValidNIE(doc);
                }
            }
        } else {
            return true;
        }
    }

    isValidPassport(dni: String): boolean {
        return (
            dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni)
        );
    }

    isValidNIE(nie: String): boolean {
        return (
            nie &&
            typeof nie === "string" &&
            /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie)
        );
    }

    isValidDNI(dni: String): boolean {
        return (
            dni &&
            typeof dni === "string" &&
            /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
            dni.substr(8, 9).toUpperCase() ===
            this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
        );
    }

    backTo() {
        this.location.back();
    }
}
