export interface ResponseModel<T> {
  message: string;
  content: T;
  statusCode: number;
  error?: string | null;
}
