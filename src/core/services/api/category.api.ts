import { apiCall } from "./apiCall";

export const GetCategories = (businessId: string) => {
  return apiCall({
    endpoint: "/category",
    pQuery: { businessId },
    method: "GET",
  });
};

export const AddUpdateCategory = (
  category: NewCategory,
  categoryId: number
) => {
  var isUpdate = categoryId > 0;

  return apiCall({
    endpoint: "/category",
    param: isUpdate ? `${categoryId}` : "",
    body: { ...category },
    method: isUpdate ? "PUT" : "POST",
    auth: true,
  });
};

export const DeleteCategory = (categoryId: number) => {
  return apiCall({
    endpoint: "/category",
    param: categoryId,
    method: "DELETE",
    auth: true,
  });
};
