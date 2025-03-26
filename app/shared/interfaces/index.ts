import type {
  CustomGlossAlertTable,
  CustomGlossFileTable,
  CustomGlossTabContextDataTable,
  CustomGlossTabContextTable,
  CustomGlossTabTable,
  CustomGlossTabValidationStepActionToTakeTable,
  CustomGlossTabValidationStepResourcesTable,
  CustomGlossTabValidationStepTable,
  // Custom,
  CustomGlossTable,
} from '~/db/schema';

// export interface ICustom extends Custom {
//   users: {
//     userId: string;
//     customId: string;
//     user: IUser;
//   }[];
// }

interface ICustomGloss extends CustomGlossTable {
  tabs: ICustomGlossTab[];
  files: ICustomGlossFile[];
  alerts: ICustomGlossAlert[];
}

interface ICustomGlossAlert extends CustomGlossAlertTable {
  customGloss: ICustomGloss;
}

interface ICustomGlossFile extends CustomGlossFileTable {
  customGloss: ICustomGloss;
}

interface ICustomGlossTab extends CustomGlossTabTable {
  customGloss: ICustomGloss;
  context: ICustomGlossTabContext[];
  validations: ICustomGlossTabValidationStep[];
}

interface ICustomGlossTabContext extends CustomGlossTabContextTable {
  customGlossTab: ICustomGlossTab;
  data: ICustomGlossTabContextData[];
}

interface ICustomGlossTabContextData extends CustomGlossTabContextDataTable {
  customGlossTabContext: ICustomGlossTabContext;
}

interface ICustomGlossTabValidationStep
  extends CustomGlossTabValidationStepTable {
  customGlossTab?: ICustomGlossTab;
  parentStep?: ICustomGlossTabValidationStep;
  steps: ICustomGlossTabValidationStep[];
  resources: ICustomGlossTabValidationStepResources[];
  actionsToTake: ICustomGlossTabValidationStepActionToTake[];
}

interface ICustomGlossTabValidationStepResources
  extends CustomGlossTabValidationStepResourcesTable {
  customGlossTabValidationStep: ICustomGlossTabValidationStep;
}

interface ICustomGlossTabValidationStepActionToTake
  extends CustomGlossTabValidationStepActionToTakeTable {
  customGlossTabValidationStep: ICustomGlossTabValidationStep;
}

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}
