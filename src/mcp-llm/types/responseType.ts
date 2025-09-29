export interface ResponseType {
  success: boolean;
  data: any;
  message: null | undefined | string;
  error: string | null;
  history: any[];
}

export interface ResponseError extends ResponseType {
  success: false;
  data: null;
  message: string;
  history: any[];
  error: string;
}

export interface ResponseSuccess extends ResponseType {
  success: true;
  data: any;
  message: null | undefined | string;
  error: null;
  history: any[];
}

