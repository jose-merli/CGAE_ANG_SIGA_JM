import { Injectable } from "@angular/core";
import { TranslateService } from "../commons/translate/translation.service";
import { ComboItem } from "../models/ComboItem";
import { ControlAccesoDto } from "../models/ControlAccesoDto";
import { NotificationService } from "./notification.service";
import { SigaServices } from "./siga.service";

export enum KEY_CODE {
  ENTER = 13,
}

@Injectable()
export class CommonsService {
  DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private notificationService: NotificationService) {}

  validateEmail(value) {
    //let correo = value;
    //let EMAIL_REGEX = /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    //let EMAIL_REGEX2 = /^[\w]+@{1}[\w]+\.[a-z]{2,3}$/;
    let EMAIL_REGEX3 = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (value != undefined && value != "" && EMAIL_REGEX3.test(value)) {
      return true;
    } else {
      if (value == "") {
        return true;
      } else {
        return false;
      }
    }
  }

  validateWeb(value) {
    let web = value;
    let WEB_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (web != undefined && web != "" && WEB_REGEX.test(web)) {
      return true;
    } else {
      if (web == "") {
        return true;
      } else {
        return false;
      }
    }
  }

  validateTelefono(value) {
    let tlf = value;
    //Teléfonos españoles
    let TLF_REGEX = /^((\+?34([ \t|\-])?)?[9|6|7]((\d{1}([ \t|\-])?[0-9]{3})|(\d{2}([ \t|\-])?[0-9]{2}))([ \t|\-])?[0-9]{2}([ \t|\-])?[0-9]{2})$/;
    //Teléfonos extranjeros
    let TLF_REGEX2 = /^(\(\+?\d{2,3}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){9}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/;

    if (tlf != undefined && tlf != "" && TLF_REGEX2.test(tlf)) {
      return true;
    } else {
      if (tlf == "") {
        return true;
      } else {
        return false;
      }
    }
  }

  validateMovil(value) {
    let mvl = value;
    //Teléfonos españoles
    let MVL_REGEX = /^((\+?34([ \t|\-])?)?[6|7]((\d{1}([ \t|\-])?[0-9]{3})|(\d{2}([ \t|\-])?[0-9]{2}))([ \t|\-])?[0-9]{2}([ \t|\-])?[0-9]{2})$/;
    //Teléfonos extranjeros
    let MVL_REGEX2 = /^(\(\+?\d{2,3}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){9}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/;

    if (mvl != undefined && mvl != "" && MVL_REGEX2.test(mvl)) {
      return true;
    } else {
      if (mvl == "") {
        return true;
      } else {
        return false;
      }
    }
  }

  validateFax(value) {
    //Numeros extranjeros tmbn
    let fax = value;
    let FAX_REGEX = /^(\(\+?\d{2,3}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){9}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/;

    if (fax != undefined && fax != "" && FAX_REGEX.test(fax)) {
      return true;
    } else {
      if (fax == "") {
        return true;
      } else {
        return false;
      }
    }
  }

  validateCodigoPostal(value): boolean {
    return value && typeof value === "string" && /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(value);
  }

  arregloTildesCombo(combo) {
    combo.map((e) => {
      let accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      if (e != null && e.label != null) {
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      }
    });
  }

  arregloTildesContrariaCombo(combo) {
    combo.map((e) => {
      let accents = "ÁÉÍÓÚáéíóú";
      let accentsOut = "ÀÈÌÒÙàèìòù";
      let i;
      let x;
      if (e != null && e.label != null) {
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelTildeContraria = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelTildeContraria;
          }
        }
      }
    });
  }

  getLetrado = () => {
    let isLetrado: ComboItem;
    let respuesta = undefined;

    respuesta = new Promise((resolve, reject) => {
      this.sigaServices.get("getLetrado").subscribe(
        (data) => {
          isLetrado = data;
          if (isLetrado.value == "S") {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (err) => {
          //console.log(err);
          reject(undefined);
        },
      );
    });
    return respuesta;
  };

  checkAcceso = (idProceso) => {
    let activacionEditar = undefined;
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = idProceso;
    let derechoAcceso;

    activacionEditar = new Promise((resolve, reject) => {
      this.sigaServices.post("acces_control", controlAcceso).subscribe(
        (data) => {
          let permisosTree = JSON.parse(data.body);
          let permisosArray = permisosTree.permisoItems;
          derechoAcceso = permisosArray[0].derechoacceso;
        },
        (err) => {
          //console.log(err);
          reject(undefined);
        },
        () => {
          if (derechoAcceso == 3) {
            //permiso total
            resolve(true);
          } else if (derechoAcceso == 2) {
            // solo lectura
            resolve(false);
          } else {
            resolve(undefined);
          }
        },
      );
    });

    return activacionEditar;
  };

  openOutlook(correo) {
    let EMAIL_REGEX = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    if (correo != undefined && correo != "" && EMAIL_REGEX.test(correo)) {
      let href = "mailto:" + correo;
      window.open(href, "_blank");
    }
  }

  scrollTop() {
    let top = document.getElementById("mainContainer");
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  isValidPassport(passport: String): boolean {
    if (!passport || typeof passport !== "string") return false;

    const passportPattern = /^[A-Z]{3}[0-9]{6}[A-Z]?$/;
    return passportPattern.test(passport.toUpperCase());
  }

  isValidNIE(nie: String): boolean {
    if (!nie || typeof nie !== "string") return false;

    const niePattern = /^[XYZ]{1}[0-9]{7}[A-Z]{1}$/;
    if (!niePattern.test(nie.toUpperCase())) return false;

    const letterExt = nie.substr(0, 1).toUpperCase();
    const numberPart = nie.substr(1, 7);
    const letterPart = nie.substr(8, 1).toUpperCase();

    if (parseInt(numberPart, 10) < 0) return false;

    const expectedLetter = this.DNI_LETTERS.charAt(parseInt(numberPart, 10) % 23);
    return letterPart === expectedLetter;
  }

  isValidCIF(cif: String): boolean {
    if (!cif || typeof cif !== "string") return false;

    const cifPattern = /^[ABCDEFGHJKLMNPQRSUVW]{1}[0-9]{7}([0-9A-J]{1})$/;
    return cifPattern.test(cif.toUpperCase());
  }

  isValidDNI(dni: String): boolean {
    if (!dni || typeof dni !== "string") return false;

    const dniPattern = /^[0-9]{8}[A-Z]{1}$/;
    if (!dniPattern.test(dni.toUpperCase())) return false;

    const numberPart = dni.substr(0, 8);
    const letterPart = dni.substr(8, 1).toUpperCase();

    if (parseInt(numberPart, 10) < 0) return false;

    const expectedLetter = this.DNI_LETTERS.charAt(parseInt(numberPart, 10) % 23);

    return letterPart === expectedLetter;
  }

  isValidOtro(otro: String): boolean {
    if (!otro || typeof otro !== "string") return false;

    const otroPattern = /^[A-Z0-9]{1,20}$/;
    return otroPattern.test(otro.toUpperCase());
  }

  showMessage(severity, summary, msg) {
    let msgs = [];
    msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });

    return msgs;
  }

  compruebaDNI(idtipoidentificacion, nif) {
    if (this.isValidDNI(nif)) {
      idtipoidentificacion = "10";
      return idtipoidentificacion;
    } else if (this.isValidPassport(nif)) {
      idtipoidentificacion = "30";
      return idtipoidentificacion;
    } else if (this.isValidNIE(nif)) {
      idtipoidentificacion = "40";
      return idtipoidentificacion;
    } else if (this.isValidCIF(nif)) {
      idtipoidentificacion = "20";
      return idtipoidentificacion;
    } else {
      idtipoidentificacion = "30";
      return idtipoidentificacion;
    }
  }

  checkPermisos(permiso: boolean, historico: boolean) {
    if (!permiso) {
      return this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (historico != undefined && historico) {
        return this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
      } else {
        return undefined;
      }
    }
  }

  checkPermisoAccion() {
    return this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
  }

  checkPermisosService(permiso: boolean, historico?: boolean): boolean {
    let acceso = true;
    if (!permiso) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
      acceso = false;
    } else {
      if (historico != undefined && historico) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
        acceso = false;
      }
    }
    return acceso;
  }

  checkPermisoAccionService() {
    this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
  }

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }

  getLabelbyFilter(string): string {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
	para poder filtrar el dato con o sin estos caracteres*/
    let labelSinTilde = string;
    let accents = "ÀÁÂÃÄÅAàáâãäåÒÓÔÕÕÖOØòóôõöøEÈÉÊËèèéêëðCÇçÐDÌÍÎÏIìíîïUÙÚÛÜùúûüÑñSŠšŸYÿýŽžZ";
    let accentsOut = "aaaaaaaaaaaaaooooooooooooooeeeeeeeeeeecccddiiiiiiiiiuuuuuuuuunnsssyyyyzzz";
    let i;
    let x;
    for (i = 0; i < labelSinTilde.length; i++) {
      if ((x = accents.indexOf(labelSinTilde.charAt(i))) != -1) {
        labelSinTilde = labelSinTilde.replace(labelSinTilde.charAt(i), accentsOut[x]);
      }
    }

    return labelSinTilde;
  }

  getLabelsSinTilde(array) {
    // Recorremos un array (combos) y le ponemos el labelSinTilde para los filtros.
    for (let i in array) {
      array[i].labelSinTilde = this.getLabelbyFilter(array[i].label);
    }
    return array;
  }

  scrollTablaFoco(idFoco) {
    let top = document.getElementById(idFoco);
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  styleObligatorio(evento) {
    if (evento == null || evento == undefined || evento == "") {
      return "camposObligatorios";
    }
  }
}
