export interface AuthenticateUser {
  email: string;
  password: string;
}

export interface SignUpUser{
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ConfirmationOTP{
  username: string;
  otp: string;
}

export interface ResendConfirmation{
  email: string;
}