import { apiCall } from "./apiCall";

export const RegisterBusiness = (newBusiness: NewBusiness) =>
  apiCall({
    endpoint: "/business",
    body: newBusiness,
    method: "POST",
  });

export const LoginBusiness = (auth: BusinessLogin) =>
  apiCall({
    endpoint: "/business/auth",
    body: auth,
    method: "POST",
  });

export const GetOtp = (email: string) =>
  apiCall({
    endpoint: "/business/otp",
    body: { email },
    method: "POST",
  });

export const ResetPassword = (request: ResetPassword) =>
  apiCall({
    endpoint: "/business/password",
    body: request,
    method: "PUT",
  });

export const GetBusinessProfile = () =>
  apiCall({
    endpoint: "/business",
    method: "GET",
    auth: true,
  });

export const UpdateBusinessProfile = (profile: UpdateProfileRequest) =>
  apiCall({
    endpoint: "/business",
    method: "PUT",
    body: profile,
    auth: true,
  });
