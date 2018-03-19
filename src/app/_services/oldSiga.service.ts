import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'

@Injectable()
export class OldSigaServices {

    oldServices = {
        busquedaSanciones: "Dispatcher.do?proceso=566",
        certificadosAca: "Dispatcher.do?proceso=130",
        comisionesCargos: "Dispatcher.do?proceso=48",
        documentacionSolicitudes: "Dispatcher.do?proceso=10",
        mantenimientoGruposFijos: "Dispatcher.do?proceso=993",
        mantenimientoMandatos: "Dispatcher.do?proceso=19",
        nuevaIncorporacion: "Dispatcher.do?proceso=47",
        busquedaColegiados: "Dispatcher.do?proceso=1",
        busquedaNoColegiados: "Dispatcher.do?proceso=2",
        solicitudesEspecificas: "Dispatcher.do?proceso=5",
        solicitudesGenericas: "Dispatcher.do?proceso=4",
        solicitudesIncorporacion: "Dispatcher.do?proceso=3",
        login: "developmentLogin.do"

    }



    getOldSigaUrl(service: string) {
        return environment.oldSigaUrl + this.oldServices[service];
    }

}