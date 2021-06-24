import { ActuacionAsistenciaItem } from "./ActuacionAsistenciaItem";
import { FiltroAsistenciaItem } from "./FiltroAsistenciaItem";

export class TarjetaAsistenciaItem{
      anio : string;
	  numero: string;
	  anioNumero: string;
	  asistido: string;
	  idDelito: string;
	  observaciones: string;
	  ejgNumero: string;
	  ejgAnio: string;
	  ejgAnioNumero: string;
	  actuaciones : ActuacionAsistenciaItem[];
	  nombre : string;
      sexo : string;
      apellido1 : string;
      apellido2 : string;
      nif  : string;
	  filtro : FiltroAsistenciaItem;
}