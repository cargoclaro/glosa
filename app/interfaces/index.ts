import type { User } from "@prisma/client";

// export interface IUser extends User {}

export type IUser = User;

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

export interface IGenericIcon {
  size?: string;
  customClass?: string;
  strokeWidth?: number;
  isFilled?: boolean;
}
