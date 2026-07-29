export interface ICategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory[];
}