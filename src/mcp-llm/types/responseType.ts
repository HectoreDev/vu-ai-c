export interface ResponseType {
  success: boolean;
  data: any;
  message: null | undefined | string;
  error: string | null;
  history: any[];
  code: number;
}

export interface ResponseError extends ResponseType {
  success: false;
  data: null;
  message: string;
  code: number;
  history: any[];
  error: string;
}

export interface ResponseSuccess extends ResponseType {
  success: true;
  data: any;
  message: null | undefined | string;
  error: null;
  code: number;
  history: any[];
}

export interface Result<T> {
  success: boolean;
  data: any;
  message: null | undefined | string;
  error: string | null;
  code: number;
  history: any[];
}

