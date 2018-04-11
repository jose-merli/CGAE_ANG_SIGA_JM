export const HTTP_MESSAGES = {
  UNAUTHORIZED_TEXT: 'No está autorizado.',
  INTERNAL_SERVER_ERROR_TEXT:
    'Se ha producido un error no controlado en la aplicación.',
  BAD_REQUEST_TEXT: 'Existió algún error en la acción solicitada.',
  FORBIDDEN_TEXT:
    'Está intentando acceder a una funcionalidad que no tiene autorizada o puede que su sesión haya caducado.',
  DENIED_ACCESS: 'Acceso denegado',
  NO_SESSION: 'Su sesión ha caducado.',
  NO_SEND_PDF: 'Error al enviar el informe'
};

export const VAL_MESSAGES = {
  VAL_EMAIL: 'Formato de mail incorrecto',
  VAL_NULLEMPTY: 'Este campo no puede ser vacío',
  VAL_ONLYNUMBERS: 'Este campo sólo puede contener números',
  VAL_DATEGT: 'La fecha debe ser mayor que la actual',
  VAL_DATELT: 'La fecha debe ser menor que la actual',
  VAL_NULLEMPTYARRAY: 'Debe seleccionar al menos un elemento',
  VAL_LENGTH: 'La longitud es incorrecta',
  VAL_INFO_NOT_LOADED:
    'No se ha realizado ninguna búsqueda. Debe realizar una búsqueda para descargar o enviar la información',
  VAL_IP: 'ErrorIP'
};

export const MSG_LOGIN = {
  LOGIN: 'Autenticación correcta.',
  WELCOME: 'Bienvenido',
  LOGOUT: 'Sesión cerrada correctamente.'
};

export const TRANSACTION_MESSAGES = {
  DONE: 'Hecho!',
  TRANSACTION_OK: 'Operación completada',
  TRANSACITON_KO: 'Oepración no completada'
};
