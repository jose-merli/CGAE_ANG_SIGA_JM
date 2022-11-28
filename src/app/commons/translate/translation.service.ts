import { MenuItem } from "primeng/primeng";
import { SigaServices } from "../../_services/siga.service";
// app/translate/translate.service.ts

import { Injectable, Inject } from "@angular/core";
// import { TranslationClass } from './translation'; // import our opaque token

@Injectable()
export class TranslateService {
  private _currentLang: string;
  private _translations: any;
  menuItem: MenuItem;
  private enCalendar = {
    firstDayOfWeek: 0,
    dayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    today: "Today",
    clear: "Clear"
  };

  private esCalendar = {
    firstDayOfWeek: 1,
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado"
    ],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ],
    monthNamesShort: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ],
    today: "Hoy",
    clear: "Limpiar"
  };

  // inject our translations
  constructor(private service: SigaServices) {
    service.get("usuario").subscribe(response => {
      this._currentLang = response.usuarioItem[0].idLenguaje;
    });
    //service.get("diccionarios").subscribe(response => {
    //  this._translations = response.DiccionarioItems;
    //});
  }

  public get currentLang() {
    return this._currentLang;
  }

  public use(lang: string): void {
    // set current language
    this._currentLang = lang;
  }

  private translate(key: string): string {
    // private perform translation
    let translation = key;
    if (this._translations) {
      for (var cont = 0; cont < this._translations.length; cont++) {
        if (
          this._translations[cont] &&
          this._translations[cont].diccionario[this.currentLang]
        ) {
          return this._translations[cont].diccionario[this.currentLang][key];
        }
      }
    }

    return translation;
  }

  public instant(key: string) {
    // call translation
    return this.translate(key);
  }

  public getCalendarLocale() {
    return this.currentLang === "1" ? this.esCalendar : this.enCalendar;
  }

  public updateTranslations(service: SigaServices): void {
    service.get("diccionarios").subscribe(response => {
      this._translations = response.DiccionarioItems;
    });
  }

  
  // public getTranslations(): any {
  //   this.service.get("diccionarios").subscribe(response => {
  //     this._translations = response.DiccionarioItems;

  //     this.service.get("menu").subscribe(response => {
  //       return response.menuItems;
  //     });

  //   });
  // }


  getTranslations(): Promise<any> {
    return new Promise(async (resolve, reject) => {

      this.service.get("diccionarios").subscribe(response => {
        this._translations = response.DiccionarioItems;

        this.service.get("menu").subscribe(res => {
          resolve(res.menuItems);
        }, err =>{
          //console.log(err);
        });

      });


    });
  }


}
