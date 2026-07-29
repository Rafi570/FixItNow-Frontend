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