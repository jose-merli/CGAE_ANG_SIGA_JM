import { RelacionesItem } from "../sjcs/RelacionesItem";
import { ActuacionAsistenciaItem } from "./ActuacionAsistenciaItem";
import { ContrarioItem } from "./ContrarioItem";
import { FiltroAsistenciaItem } from "./FiltroAsistenciaItem";

export class TarjetaAsistenciaItem{
      anio : string;
	  numero: string;
	  fechaAsistencia : string;
	  fechaEstado: string;
	  fechaSolicitud : string;
	  fechaCierre : string;
	  idTipoAsistenciaColegio : string;
	  idLetradoGuardia : string;
	  idSolicitudCentralita : string;
	  descripcionEstado : string;
	  descripcionTurno : string;
	  descripcionTipoAsistenciaColegio : string;
	  validada : string;
	  numeroActuaciones : string;
	  estado : string;
	  idTurno : string;
	  idGuardia : string;
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
	  numeroColegiado : string;
	  nombreColegiado : string;
	  descripcionGuardia : string;
	  fechaGuardia : string;
	  idPersonaJg : string;
	  numContrarios : string;
	  primerContrario : ContrarioItem;
	  primeraRelacion : RelacionesItem;
	  nig : string;
	  juzgado : string;
	  comisaria : string;
	  numProcedimiento : string;
	  idProcedimiento : string;
	  numDiligencia : string;
	  delitos : string [];
}