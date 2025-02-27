import type {
  User,
  // Custom,
  CustomGloss,
  CustomGlossFile,
  CustomGlossAlert,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStepResources,
  CustomGlossTabValidationStep,
} from "@prisma/client";

export interface IUser extends User {
  // customs: {
  //   userId: string;
  //   customId: string;
  //   // custom: ICustom;
  // }[];
  glosses: ICustomGloss[];
}

// export interface ICustom extends Custom {
//   users: {
//     userId: string;
//     customId: string;
//     user: IUser;
//   }[];
// }

export interface ICustomGloss extends CustomGloss {
  user: IUser;
  // custom: ICustom;
  tabs: ICustomGlossTab[];
  files: ICustomGlossFile[];
  alerts: ICustomGlossAlert[];
}

export interface ICustomGlossAlert extends CustomGlossAlert {
  customGloss: ICustomGloss;
}

export interface ICustomGlossFile extends CustomGlossFile {
  customGloss: ICustomGloss;
}

export interface ICustomGlossTab extends CustomGlossTab {
  customGloss: ICustomGloss;
  context: ICustomGlossTabContext[];
  validations: ICustomGlossTabValidationStep[];
}

export interface ICustomGlossTabContext extends CustomGlossTabContext {
  customGlossTab: ICustomGlossTab;
  data: ICustomGlossTabContextData[];
}

export interface ICustomGlossTabContextData extends CustomGlossTabContextData {
  customGlossTabContext: ICustomGlossTabContext;
}

export interface ICustomGlossTabValidationStep
  extends CustomGlossTabValidationStep {
  customGlossTab?: ICustomGlossTab;
  parentStep?: ICustomGlossTabValidationStep;
  steps: ICustomGlossTabValidationStep[];
  resources: ICustomGlossTabValidationStepResources[];
  actionsToTake: ICustomGlossTabValidationStepActionToTake[];
}

export interface ICustomGlossTabValidationStepResources
  extends CustomGlossTabValidationStepResources {
  customGlossTabValidationStep: ICustomGlossTabValidationStep;
}

export interface ICustomGlossTabValidationStepActionToTake
  extends CustomGlossTabValidationStepActionToTake {
  customGlossTabValidationStep: ICustomGlossTabValidationStep;
}

export interface ISharedState {
  success: boolean;
  message?: string;
}

export interface ILoginState extends ISharedState {
  errors?: {
    email?: string;
    password?: string;
  };
}

export interface IRegisterState extends ISharedState {
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
