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
  files: CustomGlossFile[];
  alerts: CustomGlossAlert[];
  tabs: ICustomGlossTab[];
}

export interface ICustomGlossTab extends CustomGlossTab {
  context: ICustomGlossTabContext[];
  validations: ICustomGlossTabValidation[];
}

export interface ICustomGlossTabContext extends CustomGlossTabContext {
  data: CustomGlossTabContextData[];
}

export interface ICustomGlossTabValidation
  extends CustomGlossTabValidationStep {
  resources: CustomGlossTabValidationStepResources[];
  actionsToTake: CustomGlossTabValidationStepActionToTake[];
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
