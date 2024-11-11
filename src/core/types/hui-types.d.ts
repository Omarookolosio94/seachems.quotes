export {};

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */

  interface RoutesType {
    name: string;
    layout: string;
    component: JSX.Element;
    icon: JSX.Element | string;
    path: string;
    secondary?: boolean;
  }

  interface BusinessLogin {
    email: string;
    password: string;
  }

  interface ResetPassword extends BusinessLogin {
    otp: string;
  }

  interface NewBusiness extends BusinessLogin {
    name: string;
  }

  interface UIResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: any;
  }

  interface BusinessLoginResponse {
    name: string;
    token: string;
    businessId: string;
    email: string;
  }

  interface BusinessProfile extends UpdateProfileRequest {
    businessId: string;
    email: string;
    isVerified: boolean;
  }

  interface UpdateProfileRequest {
    name: string;
    phoneNumber: string;
    address: string;
    websiteUrl: string;
    mailingAccount: string;
    mailingPassword: string;
  }

  type DataListItem = { value: string | number; name: string };
}
