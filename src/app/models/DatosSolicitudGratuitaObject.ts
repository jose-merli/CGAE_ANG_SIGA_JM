import { DatosPersonaItem } from "./DatosPersonaItem";
import { DatosDireccionItem } from "./DatosDireccionItem";
import { DatosBancariosMutualidadItem } from "./DatosBancariosMutualidadItem";
import { DatosPolizaMutualidadItem } from "./DatosPolizaMutualidadItem";
import { DatosBeneficiarioMutualidadItem } from "./DatosBeneficiarioMutualidadItem";

export class DatosSolicitudGratuitaObject {
  datosPersona: DatosPersonaItem;
  datosDireccion: DatosDireccionItem;
  datosBancarios: DatosBancariosMutualidadItem;
  datosPoliza: DatosPolizaMutualidadItem;
  datosBeneficiario: DatosBeneficiarioMutualidadItem;

  constructor() {}
}
