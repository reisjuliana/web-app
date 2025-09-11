export interface UserCreateDTO {
  username: string;
  password: string;
  email: string;
}

export interface UserDTO {
  uid: string;
  username: string;
  email: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginStatus {
  email: string;
  accessToken: string;
  expiresIn: string;
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface RegisterUserDTO {
  username: string;
  password: string;
  email: string;
}
