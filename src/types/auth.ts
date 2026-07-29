export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  statusCode?: number;
}



export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfileResponse;
}

export interface ActionResponse {
  success: boolean;
  message: string;
}