import { filterProductQuery } from "../helpers";
import { apiCall } from "./apiCall";

export const AddProduct = (newProduct: NewProduct) => {
  const formData = new FormData();

  // Add basic fields from ProductDetail
  formData.append("name", newProduct.name);
  formData.append("description", newProduct.description);
  formData.append("categoryId", newProduct.categoryId.toString());
  formData.append("tags", newProduct.tags);
  formData.append("units", newProduct.units);
  formData.append("comments", newProduct.comments);
  formData.append("isListed", newProduct.isListed.toString());

  if (newProduct?.images?.length > 0) {
    Array.from(newProduct?.images)?.forEach((file: any, i: any) => {
      formData.append(`Images`, file);
    });
  }

  return apiCall({
    endpoint: "/products",
    body: formData,
    method: "POST",
    multipart: true,
    auth: true,
  });
};

export const UpdateProductDetail = (
  product: ProductDetail,
  productId: string
) => {
  return apiCall({
    endpoint: "/products",
    param: productId,
    body: product,
    method: "PUT",
    auth: true,
  });
};

export const UpdateProductGallery = (images: any[], productId: string) => {
  const formData = new FormData();

  if (images?.length > 0) {
    Array.from(images)?.forEach((file: any, i: any) => {
      formData.append(`Images`, file);
    });
  }

  return apiCall({
    endpoint: "/products",
    param: `${productId}/gallery`,
    body: formData,
    method: "PUT",
    multipart: true,
    auth: true,
  });
};

export const DeleteProduct = (productId: string) => {
  return apiCall({
    endpoint: "/products",
    param: productId,
    method: "DELETE",
    auth: true,
  });
};

export const GetProducts = (query: ProductQuery) => {
  return apiCall({
    endpoint: "/products",
    pQuery: filterProductQuery(query),
    method: "GET",
  });
};

export const GetProductByParam = (sku: string, businessId: string) => {
  return apiCall({
    endpoint: "/products",
    param: `${sku}/${businessId}`,
    method: "GET",
  });
};
