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

  interface NewCategory {
    name: string;
    description: string;
  }

  interface Category {
    categoryId: number;
    businessId: string;
    name: string;
    description: string;
    addedBy: string;
    updatedBy: string;
    dateAdded: string;
    lastDateUpdated: string;
  }

  interface Pagination<T> {
    items: T[];
    totalPage: number;
    currentPage: number;
    totalItem: number;
  }

  interface Product {
    images: Image[];
    productId: string;
    sku: string;
    name: string;
    description: string;
    categoryId: null | number;
    category: Category | null;
    tags: null | string;
    qrCodeUrl: string;
    units: null | string;
    comments: null | string;
    isListed: boolean;
    businessId: string;
    dateAdded: string;
    lastDateUpdated: string;
  }

  interface Image {
    logoId: string;
    name: string;
    url: string;
    alt: string;
  }

  interface NewProduct extends ProductDetail {
    images: any[];
  }

  interface ProductDetail {
    name: string;
    description: string;
    categoryId: number | string;
    tags: string;
    units: string;
    comments: string;
    isListed: boolean;
  }

  interface ProductQuery {
    businessId: string;
    categoryId: string;
    listedOnly: boolean;
    pageNumber: number;
    pageSize: number;
  }

  interface Quotation {
    attachments: any[];
    quotedProducts: QuotedProduct[];
    quotationId: string;
    quotationTrackerId: string;
    businessId: string;
    customerName: string;
    customerEmail: string;
    customerPhoneNumber: string;
    customerCompanyName: string;
    status: string;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    currency: string;
    note: string;
    customerNote: string;
    isSent: boolean;
    noOfTimesSent: number;
    expirationDate: string;
    lastSentDate: null | string;
    dateAdded: string;
    lastDateUpdated: string;
  }

  interface QuotedProduct extends TreatQuotedProduct {
    productName: string;
    gallery: string;
  }

  interface ProductVariation {
    unitOfMeasurement: string;
    price: number;
  }

  interface Currency {
    code: string;
    name: string;
  }

  interface TreatQuotation {
    status: string;
    currency: string;
    note: string;
    quotedProducts: TreatQuotedProduct[];
  }

  interface TreatQuotedProduct {
    productSKU: string;
    productVariations: ProductVariation[];
    note: string;
  }

  interface SendQuotation {
    trackerId: string;
    customerEmails: string[];
  }

  interface QuotationQuery {
    customerEmail: string;
    frequency: string;
    pageNumber: number;
    pageSize: number;
  }

  interface Analytics {
    totalQuotations: number;
    totalQuotationsSent: number;
    quotationsByStatus: QuotationsByStatus | null;
    topQuotedProducts: string[];
    quotationsExpiringSoon: number;
  }

  interface QuotationsByStatus {
    Draft: number;
    Pending: number;
    Cancelled: number;
    Invoiced: number;
    Closed: number;
  }

  type DataListItem = { value: string | number; name: string };
}
