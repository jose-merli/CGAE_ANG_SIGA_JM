import { Injectable } from '../../../node_modules/@angular/core';
import { BotonItem } from '../models/BotonItem';
import { TranslateService } from '../commons/translate/translation.service';

@Injectable()
export class BotoneraService {

    constructor(
        private translateService: TranslateService

    ) { }

    boton(data: String[]) {
        let botones = [];
        for (let i in data) {
            switch (data[i]) {
                case "new":
                    let botonNew = new BotonItem();
                    botonNew.identity = "new";
                    botonNew.icon = "fa fa-plus";
                    botonNew.label = "general.boton.new";
                    botonNew.position = 1;
                    botones.push(botonNew);
                    break;
                case "search":
                    let botonSearch = new BotonItem();
                    botonSearch.identity = "search";
                    botonSearch.icon = "fa fa-search";
                    botonSearch.label = "general.boton.search";
                    botonSearch.position = 2;
                    botones.push(botonSearch);
                    break;
                case "delete":
                    let botonDelete = new BotonItem();
                    botonDelete.identity = "delete";
                    botonDelete.icon = "fa fa-trash-alt";
                    botonDelete.label = "general.boton.eliminar";
                    botonDelete.position = 3;
                    botones.push(botonDelete);
                    break;
                case "desasociar":
                    let botonDesaso = new BotonItem();
                    botonDesaso.identity = "desasociar";
                    botonDesaso.icon = "fa fa-undo";
                    botonDesaso.label = "censo.tipoCuenta.cargo.desasociar";
                    botonDesaso.position = 4;
                    botones.push(botonDesaso);
                    break;
                case "hist":
                    let botonHist = new BotonItem();
                    botonHist.identity = "hist";
                    botonHist.icon = "fa fa-history";
                    botonHist.label = "general.message.mostrarHistorico";
                    botonHist.position = 5;
                    botones.push(botonHist);
                    break;
                case "nohist":
                    let botonNoHist = new BotonItem();
                    botonNoHist.identity = "nohist";
                    botonNoHist.icon = "fa fa-undo";
                    botonNoHist.label = "general.message.ocultarHistorico";
                    botonNoHist.position = 6;
                    botones.push(botonNoHist);
                    break;
                case "save":
                    let botonSave = new BotonItem();
                    botonSave.identity = "save";
                    botonSave.icon = "fa fa-save";
                    botonSave.label = "general.boton.guardar";
                    botonSave.position = 7;
                    botones.push(botonSave);
                    break;
                case "rest":
                    let botonRest = new BotonItem();
                    botonRest.identity = "rest";
                    botonRest.icon = "fa fa-undo";
                    botonRest.label = "general.boton.restablecer";
                    botonRest.position = 8;
                    botones.push(botonRest);
                    break;
                case "clean":
                    let botonClean = new BotonItem();
                    botonClean.identity = "clean";
                    botonClean.icon = "fa fa-eraser";
                    botonClean.label = "general.boton.clear";
                    botonClean.position = 9;
                    botones.push(botonClean);
                    break;
                case "cancel":
                    let botonCancel = new BotonItem();
                    botonCancel.identity = "cancel";
                    botonCancel.icon = "fa fa-close";
                    botonCancel.label = "general.boton.cancel";
                    botonCancel.position = 10;
                    botones.push(botonCancel);
                    break;
                case "back":
                    let botonBack = new BotonItem();
                    botonBack.identity = "back";
                    botonBack.icon = "fa fa-angle-left";
                    botonBack.label = "general.boton.volver";
                    botonBack.position = 11;
                    botones.push(botonBack);
                    break;
                default:
                    break;
            }
        }
        botones.sort(function (a, b) {
            if (a.position < b.position) {
                return 1;
            }
            if (a.position > b.position) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        return botones;
    }
}

