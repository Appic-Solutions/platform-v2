export interface Response<T> {
  result: T;
  success: boolean;
  message: string;
}
