import axios from "axios";
import toast from "react-hot-toast";
import { clearSessionAndLogout } from "../helpers";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

export const apiCall = async ({
  endpoint = "",
  extra = null,
  method = "GET",
  body = null,
  pQuery = "",
  param = "",
  multipart = false,
  responseType = null,
  auth = false,
}: {
  endpoint: string;
  extra?: any;
  method: string;
  body?: any;
  pQuery?: any;
  param?: string | number;
  multipart?: boolean;
  responseType?: any;
  auth?: boolean;
}) => {
  const headers: any = {
    "Content-Type": multipart ? "multipart/form-data" : "application/json",
  };

  let url = endpoint;

  if (extra) {
    url += `/${extra}`;
  }

  if (param) {
    url += `/${param}`;
  }

  if (pQuery) {
    let paramsArray = Object.keys(pQuery).map(
      (key: any) =>
        pQuery[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(pQuery[key])}`
    );

    paramsArray = paramsArray.filter((item) => item);
    url += `?${paramsArray.join("&")}`;
  }

  if (auth) {
    var token = localStorage.getItem("token");
    if (token != null && token?.length > 0) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options: any = {
    url,
    method,
    headers,
  };

  if (responseType) {
    options.responseType = responseType;
  }

  if (body) {
    options.data = body;
  }

  return axios(options)
    .then((response) => response?.data)
    .catch((error) => {
      if (error?.message === "Network Error") {
        return {
          success: false,
          statusCode: 500,
          message: "Please check you have an internet connection",
          data: {},
        };
      } else if (error?.response?.status === 401) {
        toast.error("Please logout and sign in again");
        clearSessionAndLogout();
        return error?.response?.data;
      } else {
        return error?.response?.data;
      }
    });
};
