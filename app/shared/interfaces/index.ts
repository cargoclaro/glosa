import type {
  // Custom,
  CustomGloss,
  CustomGlossAlert,
  CustomGlossFile,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStep,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStepResources,
} from '@prisma/client';

// export interface ICustom extends Custom {
//   users: {
//     userId: string;
//     customId: string;
//     user: IUser;
//   }[];
// }

interface ICustomGloss extends CustomGloss {
  tabs: ICustomGlossTab[];
  files: ICustomGlossFile[];
  alerts: ICustomGlossAlert[];
}

interface ICustomGlossAlert extends CustomGlossAlert {
  customGloss: ICustomGloss;
}

interface ICustomGlossFile extends CustomGlossFile {
  customGloss: ICustomGloss;
}

interface ICustomGlossTab extends CustomGlossTab {
  customGloss: ICustomGloss;
  context: ICustomGlossTabContext[];
  validations: ICustomGlossTabValidationStep[];
}

interface ICustomGlossTabContext extends CustomGlossTabContext {
  customGlossTab: ICustomGlossTab;
  data: ICustomGlossTabContextData[];
}

interface ICustomGlossTabContextData extends CustomGlossTabContextData {
  customGlossTabContext: ICustomGlossTabContext;
}

interface ICustomGlossTabValidationStep
  extends CustomGlossTabValidationStep {
  customGlossTab?: ICustomGlossTab;
  parentStep?: ICustomGlossTabValidationStep;
  steps: ICustomGlossTabValidationStep[];
  resources: ICustomGlossTabValidationStepResources[];
  actionsToTake: ICustomGlossTabValidationStepActionToTake[];
}

interface ICustomGlossTabValidationStepResources
  extends CustomGlossTabValidationStepResources {
  customGlossTabValidationStep: ICustomGlossTabValidationStep;
}

interface ICustomGlossTabValidationStepActionToTake
  extends CustomGlossTabValidationStepActionToTake {
  customGlossTabValidationStep: ICustomGlossTabValidationStep;
}

export interface ISharedState {
  success: boolean;
  message?: string | string[];
}

interface ILoginState extends ISharedState {
  errors?: {
    email?: string;
    password?: string;
  };
}

interface IRegisterState extends ISharedState {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    lastName?: string;
    patentNumber?: string;
    confirmPassword?: string;
  };
}

export interface IGlossAnalysisState extends ISharedState {
  glossId?: string;
  errors?: {
    documents?: string;
  };
}

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}
