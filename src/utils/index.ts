import { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

export const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: new AxiosHeaders(),
  config: {
    headers: new AxiosHeaders(),
    method: "GET",
    url: "/mock-url",
    data: null,
    params: {},
    timeout: 0,
    transformRequest: [],
    transformResponse: [],
    xsrfCookieName: "",
    xsrfHeaderName: "",
    maxContentLength: -1,
    maxBodyLength: -1,
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
  } as InternalAxiosRequestConfig,
});
