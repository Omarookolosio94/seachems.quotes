import { filterQuotationQuery } from "../helpers";
import { apiCall } from "./apiCall";

export const TreatQuotation = (
  request: TreatQuotation,
  quotationId: string
) => {
  return apiCall({
    endpoint: "/quotations",
    param: quotationId,
    body: request,
    method: "PUT",
    auth: true,
  });
};

export const SendQuotation = (request: SendQuotation) => {
  return apiCall({
    endpoint: "/quotations/send",
    body: request,
    method: "POST",
    auth: true,
  });
};

export const GetQuotations = (query: QuotationQuery) => {
  return apiCall({
    endpoint: "/quotations",
    pQuery: filterQuotationQuery(query),
    method: "GET",
    auth: true,
  });
};

export const GetCurrencies = () => {
  return apiCall({
    endpoint: "/quotations/currencies",
    method: "GET",
  });
};

export const GetAnalytics = () => {
  return apiCall({
    endpoint: "/quotations/analytics",
    method: "GET",
    auth: true,
  });
};
