import { Injectable } from "@angular/core";
import {
  Http
} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { ControlAccesoDto } from "../models/ControlAccesoDto";
import { SigaServices } from "./siga.service";

@Injectable()
export class CommonsService {

  DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private http: HttpClient,
    handler: HttpBackend,
    private httpbackend: HttpClient,
    private sigaServices: SigaServices
  ) {
    this.httpbackend = new HttpClient(handler);
  }


  validateEmail(value) {
    let correo = value;
    let EMAIL_REGEX = /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    let EMAIL_REGEX2 = /^[\w]+@{1}[\w]+\.[a-z]{2,3}$/;
    let EMAIL_REGEX3 = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (correo != undefined && correo != "" && EMAIL_REGEX3.test(correo)) {
      return true;
    } else {
      if (correo == "") {
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
    return (
      value &&
      typeof value === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(value)
    );
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }

  checkAcceso = (idProceso) => {
    let activacionEditar = undefined;
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = idProceso;
    let derechoAcceso;

    activacionEditar = new Promise((resolve, reject) => {

      this.sigaServices.post("acces_control", controlAcceso).subscribe(
        data => {
          let permisosTree = JSON.parse(data.body);
          let permisosArray = permisosTree.permisoItems;
          derechoAcceso = permisosArray[0].derechoacceso;
        },
        err => {
          console.log(err);
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

        }
      );
    });

    return activacionEditar;

  }

  openOutlook(correo) {

    let EMAIL_REGEX = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    if (correo != undefined && correo != "" && EMAIL_REGEX.test(correo)) {
      let href = "mailto:" + correo;
      window.open(href, "_blank");
    }

  }

  scrollTop() {

    let top = document.getElementById('mainContainer');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
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

  isValidCIF(cif: String): boolean {
    return (
      cif &&
      typeof cif === "string" &&
      /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif)
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

  showMessage(severity, summary, msg) {
    let msgs = [];
    msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });

    return msgs;
  }

  compruebaDNI(idtipoidentificacion, nif) {

    if (idtipoidentificacion != "50") {
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
  }
}
