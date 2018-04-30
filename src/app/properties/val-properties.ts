import { VAL_MESSAGES } from "./message-properties";
import { Validators } from "@angular/forms";

export const LOGIN_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["uid", false],
  ["pass", false]
]);
export const LOGINBEAN: Map<string, Array<string>> = new Map([
  ["uid", ["notNullOrEmpty"]],
  ["pass", ["notNullOrEmpty"]]
]);

export const USUARIOBEAN: Map<string, Array<string>> = new Map([
  ["cdgoTipUsu", ["notNullOrEmpty"]],
  ["cdgoRolUsu", ["notNullOrEmpty"]],
  ["uid", ["notNullOrEmpty"]],
  ["txtoEmail", ["emailFormat"]]
]);
export const USUARIO_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoTipUsu", false],
  ["cdgoRolUsu", false],
  ["uid", false],
  ["txtoEmail", false]
]);

export const TIPOUSUARIOBEAN: Map<string, Array<string>> = new Map([
  ["cdgoTipUsu", ["notNullOrEmpty"]],
  ["txtoTipUsu", ["notNullOrEmpty"]]
]);

export const TIPOUSUARIO_VALIDATIONFIELDSCONTROL: Map<
  string,
  boolean
  > = new Map([["cdgoTipUsu", false], ["txtoTipUsu", false]]);

export const TIPOFUNCBEAN: Map<string, Array<string>> = new Map([
  ["tipoFunc", ["notNullOrEmpty"]],
  ["txtoFunc", ["notNullOrEmpty"]]
]);

export const TIPOFUNC_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["tipoFunc", false],
  ["txtoFunc", false]
]);

export const FUNCBEAN: Map<string, Array<string>> = new Map([
  ["cdgoFuncAcc", ["notNullOrEmpty"]],
  ["txtoFuncAcc", ["notNullOrEmpty"]],
  ["tipoFunc", ["notNullOrEmpty"]],
  ["mrcaAudit", ["notNullOrEmpty"]]
]);

export const FUNC_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoFuncAcc", false],
  ["txtoFuncAcc", false],
  ["tipoFunc", false],
  ["mrcaAudit", false]
]);

export const ROLBEAN: Map<string, Array<string>> = new Map([
  ["cdgoRolUsu", ["notNullOrEmpty"]],
  ["txtoRolUsu", ["notNullOrEmpty"]]
]);
export const ALARMBEAN: Map<string, Array<string>> = new Map([
  ["txtoAlarma", ["notNullOrEmpty"]],
  ["limit", ["notNullOrEmpty"]]
]);
export const ALARM_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["txtoAlarma", false],
  ["limit", false]
]);
export const ROL_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoRolUsu", false],
  ["txtoRolUsu", false]
]);

export const RELROLBEAN: Map<string, Array<string>> = new Map([
  ["cdgoRolUsu", ["notNullOrEmpty"]]
]);

export const RELROL_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoRolUsu", false]
]);

export const MAILBEAN: Map<string, Array<string>> = new Map([
  ["txtoMailList", ["notNullOrEmpty"]]
]);

export const MAIL_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["txtoMailList", false]
]);

export const FBCNSKBEAN: Map<string, Array<string>> = new Map([
  ["cdgoBookClass", ["notNullOrEmpty"]],
  ["cdgoClass", ["notNullOrEmpty"]],
  ["cdgoFbc", ["notNullOrEmpty"]],
  ["txtoTarifWSO", ["notNullOrEmpty"]]
]);

export const FBC_NSK_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoBookClass", false],
  ["cdgoClass", false],
  ["cdgoFbc", false],
  ["txtoTarifWSO", false]
]);

export const STATIONSBEAN: Map<string, Array<string>> = new Map([
  ["cdgoEstaNSK", ["notNullOrEmpty"]],
  ["txtoDesc", ["notNullOrEmpty"]]
]);

export const STATIONS_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoEstaNSK", false],
  ["txtoDesc", false],
  ["cdgoEstaRenf", false]
]);

export const TRAINSTATUSBEAN: Map<string, Array<string>> = new Map([
  ["cdgoEstadODS", ["notNullOrEmpty"]],
  ["cdgoTipoAcce", ["notNullOrEmpty"]],
  ["txtoDesc", ["notNullOrEmpty"]],
  ["txtoNombre", ["notNullOrEmpty"]]
]);

export const TRAINS_STATUS_VALIDATIONFIELDSCONTROL: Map<
  string,
  boolean
  > = new Map([
    ["cdgoEstadODS", false],
    ["cdgoTipoAcce", false],
    ["txtoDesc", false],
    ["txtoNombre", false]
  ]);

export const EQUIPMENTRELATIONSHIPBEAN: Map<string, Array<string>> = new Map([
  ["cdgoTipoTren", ["notNullOrEmpty"]],
  ["nmroCoche", ["notNullOrEmpty"]],
  ["nmroClase", ["notNullOrEmpty"]],
  ["cdgoComCoche", ["notNullOrEmpty"]],
  ["cdgoPlazNSK", ["notNullOrEmpty"]],
  ["cdgoPlazRenf", ["notNullOrEmpty"]],
  ["cdgoFbc", ["notNullOrEmpty"]]
]);

export const EQ_REL_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["cdgoTipoTren", false],
  ["nmroCoche", false],
  ["nmroClase", false],
  ["cdgoComCoche", false],
  ["cdgoComCoche", false],
  ["cdgoPlazRenf", false],
  ["cdgoFbc", false]
]);

export const SEATPREFERENCEBEAN: Map<string, Array<string>> = new Map([
  ["cdgoPreferenc", ["notNullOrEmpty"]],
  ["txtoDesc", ["notNullOrEmpty"]]
]);

export const SEAT_PREFS_VALIDATIONFIELDSCONTROL: Map<
  string,
  boolean
  > = new Map([["cdgoPreferenc", false], ["txtoDesc", false]]);

export const TRAINRELATIONSHIPBEAN: Map<string, Array<string>> = new Map([
  ["cdgoTrenNSK", ["notNullOrEmpty"]],
  ["cdgoTrenRenf", ["notNullOrEmpty"]],
  ["cdgoTipTRen", ["notNullOrEmpty"]]
]);

export const TRAINS_REL_VALIDATIONFIELDSCONTROL: Map<
  string,
  boolean
  > = new Map([
    ["cdgoTrenNSK", false],
    ["cdgoTrenRenf", false],
    ["cdgoTipTRen", false]
  ]);

export const TRAINROUTENSKBEAN: Map<string, Array<string>> = new Map([
  ["cdgoEstaDest", ["notNullOrEmpty"]],
  ["cdgoEstaOrig", ["notNullOrEmpty"]],
  ["cdgoTipoTren", ["notNullOrEmpty"]],
  ["cdgoTrenNSK", ["notNullOrEmpty"]],
  ["txtoCriterio", ["notNullOrEmpty"]],
  ["txtoRuta", ["notNullOrEmpty"]],
  ["txtoSentido", ["notNullOrEmpty"]],
  ["txtoTime3Env", ["notNullOrEmpty"]]
]);

export const TRAINS_ROUTE_VALIDATIONFIELDSCONTROL: Map<
  string,
  boolean
  > = new Map([
    ["cdgoEstaDest", false],
    ["cdgoEstaOrig", false],
    ["cdgoTipoTren", false],
    ["cdgoTrenNSK", false],
    ["txtoCriterio", false],
    ["txtoRuta", false],
    ["txtoSentido", false],
    ["txtoTime3Env", false]
  ]);

export const FULL_OCCU_BEAN: Map<string, Array<string>> = new Map([
  ["date", ["notNullOrEmpty"]],
  ["train", ["notNullOrEmpty"]],
  ["begin", ["notNullOrEmpty"]],
  ["end", ["notNullOrEmpty"]]
]);

export const OCCU_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["date", false],
  ["train", false],
  ["begin", false],
  ["end", false]
]);

export const SBQ_BEAN: Map<string, Array<string>> = new Map([
  ["date", ["notNullOrEmpty"]]
]);

export const SBQ_VALIDATIONFIELDSCONTROL: Map<string, boolean> = new Map([
  ["date", false]
]);

export const MATRIX: Map<String, Map<string, Array<string>>> = new Map([
  // Bean structures
  ["LoginBean", LOGINBEAN],
  ["UsuarioBean", USUARIOBEAN],
  ["TipoUsuarioBean", TIPOUSUARIOBEAN],
  ["TipoFuncBean", TIPOFUNCBEAN],
  ["FuncBean", FUNCBEAN],
  ["RolBean", ROLBEAN],
  ["RelRolBean", RELROLBEAN],
  ["MailBean", MAILBEAN],
  ["FbcNSKBean", FBCNSKBEAN],
  ["StationRelationshipBean", STATIONSBEAN],
  ["TrainStatusODSBean", TRAINSTATUSBEAN],
  ["EquipmentRelationshipBean", EQUIPMENTRELATIONSHIPBEAN],
  ["SeatPreferenceBean", SEATPREFERENCEBEAN],
  ["TrainRelationshipBean", TRAINRELATIONSHIPBEAN],
  ["TrainRouteNSKBean", TRAINROUTENSKBEAN],
  ["FilterOccupancyBean", FULL_OCCU_BEAN],
  ["FilterGoingOnOffRemBean", SBQ_BEAN]
]);

export const USUARIO_VALIDATIONS: Map<string, any[]> = new Map([
  ["uid", [Validators.required, Validators.maxLength(20)]],
  ["cdgoTipUsu", [Validators.required, Validators.maxLength(20)]],
  ["cdgoRolUsu", [Validators.required, Validators.maxLength(20)]],
  ["txtoUsuario", [Validators.required, Validators.maxLength(20)]],
  ["txtoEmail", [Validators.required, Validators.email]]
]);

export const USUARIO_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "uid",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoTipUsu",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoRolUsu",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoUsuario",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoEmail",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["email", VAL_MESSAGES.VAL_EMAIL]
    ])
  ]
]);

export const TIPO_USUARIO_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoTipUsu", [Validators.required, Validators.maxLength(2)]],
  ["txtoTipUsu", [Validators.required, Validators.maxLength(35)]],
  ["cdgoUsuSist", [Validators.required, Validators.maxLength(35)]],
  ["passUsuSist", [Validators.required]]
]);

export const TIPO_USUARIO_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoTipUsu",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoTipUsu",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoUsuSist",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["passUsuSist", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const OCCU_VALIDATIONS: Map<string, any[]> = new Map([
  ["date", [Validators.required]],
  ["train", [Validators.required]],
  ["begin", [Validators.required]],
  ["end", [Validators.required]]
]);

export const OCCU_VAL_MSG: Map<string, Map<string, string>> = new Map([
  ["date", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  ["train", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  ["begin", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  ["end", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const SBQ_VALIDATIONS: Map<string, any[]> = new Map([
  ["date", [Validators.required]]
]);

export const SBQ_VAL_MSG: Map<string, Map<string, string>> = new Map([
  ["date", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const FUNC_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoFuncAcc", [Validators.required, Validators.maxLength(3)]],
  ["txtoFuncAcc", [Validators.required, Validators.maxLength(40)]],
  ["tipoFunc", [Validators.required]],
  ["txtoServRest", [Validators.required, Validators.maxLength(40)]]
]);

export const FUNC_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoFuncAcc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoFuncAcc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["tipoFunc", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  [
    "txtoServRest",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const TIPOFUNC_VALIDATIONS: Map<string, any[]> = new Map([
  ["tipoFunc", [Validators.required, Validators.maxLength(2)]],
  ["txtoFunc", [Validators.required]]
]);

export const TIPOFUNC_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "tipoFunc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["txtoFunc", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const ROL_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoRolUsu", [Validators.required, Validators.maxLength(2)]],
  ["txtoRolUsu", [Validators.required]]
]);

export const ROL_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoRolUsu",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["txtoRolUsu", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const RELROL_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoRolUsu", [Validators.required]]
]);

export const RELROL_VAL_MSG: Map<string, Map<string, string>> = new Map([
  ["cdgoRolUsu", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const TRAIN_ROUTE_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoTrenNSK", [Validators.required, Validators.maxLength(4)]],
  ["txtoRuta", [Validators.required, Validators.maxLength(30)]],
  ["txtoSentido", [Validators.required, Validators.maxLength(3)]],
  ["txtoTime3Env", [Validators.required]],
  ["cdgoEstaOrig", [Validators.required, Validators.maxLength(3)]],
  ["cdgoEstaDest", [Validators.required, Validators.maxLength(3)]],
  ["cdgoTipoTren", [Validators.required, Validators.maxLength(10)]],
  ["txtoCriterio", [Validators.required, Validators.maxLength(30)]]
]);

export const TRAIN_ROUTE_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoTrenNSK",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoRuta",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoSentido",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["txtoTime3Env", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  [
    "cdgoEstaOrig",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoEstaDest",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoTipoTren",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoCriterio",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const TRAINS_REL_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoTrenNSK", [Validators.required, Validators.maxLength(4)]],
  ["cdgoTrenRenf", [Validators.required, Validators.maxLength(5)]],
  ["cdgoTipTRen", [Validators.required, Validators.maxLength(10)]]
]);

export const TRAINS_REL_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoTrenNSK",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoTrenRenf",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoTipTRen",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const STATIONS_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoEstaNSK", [Validators.required, Validators.maxLength(3)]],
  ["cdgoEstaRenf", [Validators.maxLength(5)]],
  ["txtoPais", [Validators.required, Validators.maxLength(2)]],
  ["esFrontera", [Validators.maxLength(6)]],
  ["txtoDesc", [Validators.required, Validators.maxLength(30)]]
]);

export const STATIONS_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoEstaNSK",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["cdgoEstaRenf", new Map([["maxlength", VAL_MESSAGES.VAL_LENGTH]])],
  [
    "txtoPais",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["esFrontera", new Map([["maxlength", VAL_MESSAGES.VAL_LENGTH]])],
  [
    "txtoDesc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const EQ_REL_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoTipoTren", [Validators.required, Validators.maxLength(6)]],
  ["nmroClase", [Validators.required, Validators.maxLength(5)]],
  ["nmroCoche", [Validators.required, Validators.maxLength(5)]],
  ["cdgoComCoche", [Validators.required, Validators.maxLength(5)]],
  ["cdgoPlazNSK", [Validators.required, Validators.maxLength(5)]],
  ["cdgoPlazRenf", [Validators.required, Validators.maxLength(5)]],
  ["cdgoFbc", [Validators.required, Validators.maxLength(10)]]
]);

export const EQ_REL_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoTipoTren",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "nmroClase",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "nmroCoche",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoComCoche",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoPlazNSK",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoPlazRenf",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoFbc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const SEAT_PREFS_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoPreferenc", [Validators.required, Validators.maxLength(15)]],
  ["txtoDesc", [Validators.required]]
]);

export const SEAT_PREFS_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoPreferenc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["txtoDesc", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const FBC_NSK_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoFbc", [Validators.required, Validators.maxLength(7)]],
  ["cdgoClass", [Validators.required, Validators.maxLength(2)]],
  ["cdgoBookClass", [Validators.required, Validators.maxLength(2)]],
  ["txtoTarifWSO", [Validators.required, Validators.maxLength(10)]]
]);

export const FBC_NSK_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoFbc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoClass",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoBookClass",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoTarifWSO",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const TRAINS_STATUS_VALIDATIONS: Map<string, any[]> = new Map([
  ["cdgoEstadODS", [Validators.required, Validators.maxLength(1)]],
  ["txtoNombre", [Validators.required, Validators.maxLength(20)]],
  ["txtoDesc", [Validators.required, Validators.maxLength(60)]],
  ["cdgoTipoAcce", [Validators.required, Validators.maxLength(1)]]
]);

export const TRAINS_STATUS_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "cdgoEstadODS",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoNombre",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoDesc",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "cdgoTipoAcce",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ]
]);

export const ALARM_VALIDATIONS: Map<string, any[]> = new Map([
  ["txtoAlarma", [Validators.required, Validators.maxLength(60)]],
  ["txtoServicio", [Validators.required, Validators.maxLength(60)]],
  ["limit", [Validators.required]],
  ["idMailList", [Validators.required]]
]);

export const ALARM_VAL_MSG: Map<string, Map<string, string>> = new Map([
  [
    "txtoAlarma",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  [
    "txtoServicio",
    new Map([
      ["required", VAL_MESSAGES.VAL_NULLEMPTY],
      ["maxlength", VAL_MESSAGES.VAL_LENGTH]
    ])
  ],
  ["limit", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  ["idMailList", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const MAIL_VALIDATIONS: Map<string, any[]> = new Map([
  ["txtoMailList", [Validators.required]]
]);

export const MAIL_VAL_MSG: Map<string, Map<string, string>> = new Map([
  ["txtoMailList", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const LOGIN_VALIDATIONS: Map<string, any[]> = new Map([
  ["uid", [Validators.required]],
  ["pass", [Validators.required]]
]);

export const LOGIN_VAL_MSG: Map<string, Map<string, string>> = new Map([
  ["uid", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])],
  ["pass", new Map([["required", VAL_MESSAGES.VAL_NULLEMPTY]])]
]);

export const USER_VALIDATIONS: Map<string, any[]> = new Map([
  ["codigoExterno", [Validators.maxLength(10)]],
  ["idGrupo", [Validators.required, Validators.maxLength(3)]],
  ["descripcionGrupo", [Validators.required]]
]);

export const USER_VAL_MSG: Map<string, Map<string, string>> = new Map([
  ["codigoExterno", new Map([["maxlength", VAL_MESSAGES.VAL_LENGTH]])],
  ["idGrupo", new Map([["maxlength", VAL_MESSAGES.VAL_LENGTH]])]

]);

export const MATRIX_REL: Map<
  Map<string, any[]>,
  Map<string, Map<string, string>>
  > = new Map([
    // Bean structures
    [USER_VALIDATIONS, USER_VAL_MSG]
  ]);
