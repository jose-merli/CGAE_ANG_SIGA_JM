import { Injectable } from "@angular/core";
import {
  Http
} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { HttpBackend, HttpClient } from "../../../node_modules/@angular/common/http";

@Injectable()
export class CommonsService {

  constructor(
    private http: HttpClient,
    handler: HttpBackend,
    private httpbackend: HttpClient
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

  scrollTablaFoco(idFoco) {
    let top = document.getElementById(idFoco);
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  } 
}
