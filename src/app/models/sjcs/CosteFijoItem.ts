import { ComboItem } from '../../features/administracion/parametros/parametros-generales/parametros-generales.component';
export class CosteFijoItem {
  idCosteFijo: string;
  descripcion: string;
  idInstitucion: string;
  fechaModificacion: string;
  fechaBaja: string;
  importe: string;
  idTipoAsistencia: string;
  idTipoActuacion: string;
  tipoAsistencia: string;
  tipoActuacion: string;
  opcionTipoActuacion: ComboItem[];

  idCosteFijoOld: string;
	idTipoAsistenciaOld: string;
	idTipoActuacionOld: string;
  constructor() { }
}


