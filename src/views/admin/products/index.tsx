/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/style-prop-object */
import { useEffect, useState } from "react";
import SimpleTable from "core/components/table/SimpleTable";
import TableRowData from "core/components/table/TableRowData";
import { expandRow, getDate } from "core/services/helpers";
import Button from "core/components/button/Button";
import ActionRowData from "core/components/table/ActionRowData";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import SubHeader from "core/components/subHeader";
import Card from "core/components/card";
import Modal from "core/components/modal/Modal";
import InputField from "core/components/fields/InputField";
import CheckField from "core/components/fields/CheckField";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsFillCaretDownFill,
  BsFillCaretUpFill,
} from "react-icons/bs";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import SelectField from "core/components/fields/SelectField";
import TextField from "core/components/fields/TextField";
import imgPlaceholder from "assets/svg/defaultProductImg.svg";
import UploadField from "core/components/fields/UploadField";
import { gallery } from "core/const/const";
import { useProductStore } from "core/services/stores/useProductStore";
import { useBusinessStore } from "core/services/stores/useBusinessStore";
import { useCategoryStore } from "core/services/stores/useCategoryStore";
import toast from "react-hot-toast";

const Products = () => {
  // TODO: Add access control
  const [expandedRows, setExpandedRows]: any = useState([]);
  const [expandState, setExpandState] = useState({});

  const [displayedImg, setDisplayedImg] = useState<any>("");
  const [openGallery, setOpenGallery] = useState(false);

  const errors = useProductStore((store) => store.errors);
  const business = useBusinessStore((store) => store.authData);

  const updateError = useProductStore((store) => store.updateError);
  const clearError = useProductStore((store) => store.clearError);

  const productList = useProductStore((store) => store.productPagination);

  const getProducts = useProductStore((store) => store.getProducts);
  const query = useProductStore((store) => store.query);
  const addProductAction = useProductStore((store) => store.addProduct);
  const deleteProductAction = useProductStore((store) => store.deleteProduct);
  const updateGalleryAction = useProductStore(
    (store) => store.updateProductImage
  );
  const updateProductDetailAction = useProductStore(
    (store) => store.updateProductDetail
  );

  const categories = useCategoryStore((store) => store.categories);
  const getCategory = useCategoryStore((store) => store.getCategory);

  const [selected, setSelected] = useState<Product | null>(null);

  const defaultProductDetail: ProductDetail = {
    name: "",
    description: "",
    tags: "",
    comments: "",
    isListed: true,
    categoryId: 0,
    units: "",
  };
  const [productForm, setProductForm] = useState<NewProduct>({
    ...defaultProductDetail,
    images: [],
  });

  const [updateDetailForm, setUpdateDetailForm] = useState<ProductDetail>({
    ...defaultProductDetail,
  });

  const [openAddForm, setOpenAddForm] = useState(false);
  const [openUpdateDetailForm, setOpenUpdateDetailForm] = useState(false);

  const [updateGalleryForm, setUpdateGalleryForm] = useState({
    images: [],
  });

  const onFormChange = (e: any, form: string) => {
    const { name, value } = e.target;
    switch (form) {
      case "product":
        setProductForm({
          ...productForm,
          [name]: name === "isListed" ? value == "true" : value,
        });
        break;
      case "updateDetail":
        setUpdateDetailForm({
          ...updateDetailForm,
          [name]: value,
        });
        break;
      default:
        break;
    }
  };

  const removeImage = (index: number) => {
    setProductForm((state) => ({
      ...state,
      images: [...state?.images?.filter((file, i) => i !== index)],
    }));
  };

  const addProduct = async (e: any) => {
    e.preventDefault();
    var res = await addProductAction({
      ...productForm,
    });

    if (res.status) {
      setProductForm({
        ...defaultProductDetail,
        images: [],
      });
      setOpenAddForm(false);
    }
  };

  const updateProductDetail = async (e: any) => {
    e.preventDefault();
    await updateProductDetailAction(
      {
        ...updateDetailForm,
      },
      selected?.productId
    );
  };

  const updateProductListing = async (product: Product) => {
    await updateProductDetailAction(
      {
        ...product,
        isListed: !product?.isListed,
      },
      product?.productId
    );
  };

  const updateGallery = async (e: any) => {
    e.preventDefault();

    if (updateGalleryForm?.images?.length > 0) {
      if (
        window.confirm(
          "All images in this product gallery, will be updated. Do you still want to proceed"
        )
      ) {
        var res = await updateGalleryAction(
          updateGalleryForm.images,
          selected?.productId
        );

        if (res?.status) {
          setSelected((state: any) => ({
            ...state,
            ...res?.data,
          }));

          setDisplayedImg(res?.data?.gallery[0]?.url);

          setUpdateGalleryForm((state) => ({
            ...state,
            gallery: [],
          }));
        }
      }
    } else {
      toast.error("Please upload images");
    }
  };

  const deleteProduct = async (product: Product) => {
    if (
      window.confirm(
        `"${product?.name}" will be deleted permanently. Do you still want to proceed?`
      )
    ) {
      await deleteProductAction(product?.productId);
    }
  };

  const handleExpandRow = async (event: any, id: string) => {
    var newRows = await expandRow(id, expandedRows);
    setExpandState(newRows?.obj);
    setExpandedRows(newRows?.newExpandedRows);
  };

  const fetchMore = (page: number) => {
    getProducts({
      ...query,
      businessId: business?.businessId,
      pageNumber: page,
    });
  };

  useEffect(() => {
    productList?.items?.length < 1 &&
      getProducts({ ...query, businessId: business?.businessId });
    categories?.length < 1 && getCategory(business.businessId);
  }, []);

  return (
    <div className="mt-3">
      <Card extra={"w-full h-full mx-4 px-6 pb-6 sm:overflow-x-auto"}>
        <SubHeader
          title="Your Products"
          action="Add Product"
          actionFunc={() => setOpenAddForm(true)}
        />

        <SimpleTable
          headers={[
            "SKU",
            "Name",
            "Category",
            "Last Updated",
            "Is Listed",
            "Actions",
          ]}
        >
          {productList != null && productList?.items?.length > 0 ? (
            productList.items.map((product) => (
              <>
                <tr key={product?.productId}>
                  <TableRowData value={product?.sku} />
                  <ActionRowData style="min-w-[200px]">
                    <div
                      className="flex items-center gap-2 hover:cursor-pointer"
                      onClick={() => {
                        setSelected(product);
                        setDisplayedImg(
                          product?.images[0]?.url ?? imgPlaceholder
                        );
                        setOpenGallery(true);
                      }}
                    >
                      <img
                        src={
                          product?.images?.length > 0
                            ? product?.images[0]?.url
                            : imgPlaceholder
                        }
                        alt={product?.sku}
                        className="h-[50px] w-[50px] rounded-[5px]"
                      />
                      <p>{product?.name}</p>
                    </div>
                  </ActionRowData>
                  <TableRowData
                    value={
                      product?.category?.name != null &&
                      product?.category?.name?.length > 0
                        ? product?.category?.name
                        : "no category"
                    }
                  />
                  <TableRowData value={getDate(product?.lastDateUpdated)} />
                  <ActionRowData style="min-w-[50px]">
                    <div
                      className="flex cursor-pointer"
                      onClick={() => {
                        updateProductListing(product);
                      }}
                    >
                      {product?.isListed ? (
                        <>
                          <MdCheckCircle className="mr-1 text-green-500 dark:text-green-300" />
                          <span className="text-xs text-green-600">yes</span>
                        </>
                      ) : (
                        <>
                          <MdCancel className="me-1 text-red-500 dark:text-red-300" />
                          <span className="text-xs text-red-600">no</span>
                        </>
                      )}
                    </div>
                  </ActionRowData>

                  <ActionRowData>
                    <Button
                      style="flex gap-1 justify-items-center items-center bg-gray-500 hover:bg-gray-600 dark:text-white-300"
                      onClick={(e: any) =>
                        handleExpandRow(e, product?.productId)
                      }
                    >
                      {!expandedRows.includes(product?.productId) ? (
                        <>
                          <BsFillCaretDownFill />
                          <span className="text-xs">View</span>
                        </>
                      ) : (
                        <>
                          <BsFillCaretUpFill />
                          <span className="text-xs">Close</span>
                        </>
                      )}
                    </Button>
                    <Button
                      style="flex gap-1 justify-items-center items-center bg-yellow-500 hover:bg-yellow-600 dark:text-white-300"
                      onClick={() => {
                        setSelected({ ...product });
                        setUpdateDetailForm({
                          ...product,
                        });
                        setOpenUpdateDetailForm(true);
                      }}
                    >
                      <AiFillEdit />
                      <span className="text-xs">Edit</span>
                    </Button>

                    <Button
                      style="flex gap-1 justify-items-center items-center bg-red-500 hover:bg-red-600 dark:text-white-300"
                      onClick={() => deleteProduct(product)}
                    >
                      <AiFillDelete />
                      <span className="text-xs">Delete</span>
                    </Button>
                  </ActionRowData>
                </tr>
                {expandedRows.includes(product?.productId) ? (
                  <tr>
                    <td
                      className="border-[1px] border-gray-200 text-sm"
                      colSpan={7}
                    >
                      <ul className="p-5">
                        <li className="mb-5 flex gap-3">
                          <div className="w-1/4">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Date Added:
                            </span>
                            <span>
                              {getDate(product?.dateAdded, true, false)}
                            </span>
                          </div>

                          <div className="w-1/4">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Last Update Date:
                            </span>
                            <span>
                              {getDate(product?.lastDateUpdated, true, false)}
                            </span>
                          </div>
                        </li>
                        <li className="mb-5 flex gap-3">
                          <div className="w-1/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Units:
                            </span>
                            <span>{product?.units || "n/a"}</span>
                          </div>
                        </li>

                        <li className="mb-5 flex gap-3">
                          <div className="w-3/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Description:
                            </span>{" "}
                            <br />
                            <span>
                              {product?.description ?? "no description"}
                            </span>
                          </div>
                        </li>
                        <li className="mb-5 flex gap-3">
                          <div className="w-3/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Comments:
                            </span>{" "}
                            <br />
                            <span>{product?.comments}</span>
                          </div>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ) : (
                  <tr></tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <TableRowData colSpan={7} value="No products yet" />
            </tr>
          )}

          <tr>
            <TableRowData
              colSpan={4}
              value={`Showing ${productList?.items?.length} of ${productList?.totalItem} entries`}
            />
            <ActionRowData colSpan={3}>
              <Button
                disabled={productList?.currentPage === 1}
                style="flex gap-1 justify-items-center items-center"
                onClick={() => {
                  fetchMore(productList.currentPage - 1);
                }}
              >
                <BsChevronDoubleLeft className="" />
                <span className="text-xs">Prev</span>
              </Button>
              <Button style="flex justify-items-center items-center gap-1 bg-green-500 hover:bg-green-600">
                <span className="text-xs">
                  {productList?.currentPage} / {productList?.totalPage}
                </span>
              </Button>
              <Button
                disabled={productList?.currentPage === productList?.totalPage}
                style="flex gap-1 justify-items-center items-center"
                onClick={() => {
                  fetchMore(productList.currentPage + 1);
                }}
              >
                <span className="text-xs">Next</span>
                <BsChevronDoubleRight className="text-xs" />
              </Button>
            </ActionRowData>
          </tr>
        </SimpleTable>
      </Card>

      {openAddForm && (
        <Modal styling="w-3/6 p-5" onClose={() => setOpenAddForm(false)}>
          <form
            onSubmit={(e) => {
              addProduct(e);
              clearError();
            }}
          >
            <p className="text-black mb-5 dark:text-white">
              New Product Information
            </p>

            <InputField
              label="Name*"
              id="name"
              type="text"
              name="name"
              value={productForm?.name}
              onChange={(e: any) => onFormChange(e, "product")}
              onFocus={() => {
                if (errors?.name && errors?.name?.length > 0) {
                  updateError("name");
                }
              }}
              error={errors?.name}
            />

            <TextField
              ref={null}
              extra="mb-3"
              rows={5}
              variant="auth"
              label="Description"
              id="description"
              type="text"
              isRequired={true}
              name="description"
              value={productForm?.description}
              onChange={(e: any) => onFormChange(e, "product")}
              onFocus={() => {
                if (errors?.description && errors?.description?.length > 0) {
                  updateError("description");
                }
              }}
              error={errors?.description}
            />

            <div className="flex gap-3">
              <div className="w-1/3">
                <SelectField
                  label="Choose Category"
                  extra="mb-3"
                  defaultName="Select Product Category"
                  defaultValue="0"
                  name="categoryId"
                  options={
                    categories?.length > 0
                      ? [
                          ...categories?.map((cat: Category) => {
                            return {
                              name: cat?.name,
                              value: cat?.categoryId,
                            };
                          }),
                        ]
                      : []
                  }
                  value={productForm?.categoryId}
                  onChange={(e: any) => onFormChange(e, "product")}
                  showLabel={true}
                />
              </div>
              <div className="w-1/3">
                <InputField
                  label="Units"
                  placeholder=""
                  id="unit"
                  type="text"
                  name="units"
                  value={productForm?.units}
                  onChange={(e: any) => onFormChange(e, "product")}
                />
              </div>
              <div className="w-1/3">
                <InputField
                  label="Tags"
                  placeholder=""
                  id="tags"
                  type="text"
                  name="tags"
                  value={productForm?.tags}
                  onChange={(e: any) => onFormChange(e, "product")}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex w-1/3 flex-col justify-items-center gap-2 dark:text-white">
                <span>Is Listed:</span>
                <span>
                  <CheckField
                    styling="mr-6 inline-block"
                    checked={productForm.isListed === true}
                    sublabel="yes"
                    type="radio"
                    value="true"
                    name="isListed"
                    onChange={(e: any) => onFormChange(e, "product")}
                  />
                  <CheckField
                    styling="inline-block"
                    checked={productForm.isListed === false}
                    sublabel="no"
                    type="radio"
                    value="false"
                    name="isListed"
                    onChange={(e: any) => onFormChange(e, "product")}
                  />
                </span>
              </div>
            </div>

            <TextField
              ref={null}
              extra="mb-3"
              rows={5}
              variant="auth"
              label="Additional Comments"
              id="comments"
              type="text"
              name="comments"
              value={productForm?.comments}
              onChange={(e: any) => onFormChange(e, "product")}
            />

            <UploadField
              boxStyle="mb-[24px]"
              label="Upload picture of products"
              name="images"
              onChange={setProductForm}
            />

            <div className="mb-5 flex flex-wrap gap-2">
              {productForm &&
                productForm?.images?.length > 0 &&
                Array.from(productForm?.images)?.map(
                  (file: any, index: number) => (
                    <div key={file?.name} className="h-[80px] w-[80px]">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`gallery${index}`}
                      />
                    </div>
                  )
                )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setOpenAddForm(false);
                  clearError();
                }}
                style="linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs"
              >
                Cancel
              </Button>
              <button className="linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200">
                Add Product
              </button>
            </div>
          </form>
        </Modal>
      )}

      {openUpdateDetailForm && (
        <Modal
          styling="w-3/6 p-5"
          onClose={() => {
            setOpenUpdateDetailForm(false);
            setSelected(null);
            clearError();
          }}
        >
          <form onSubmit={(e) => updateProductDetail(e)}>
            <p className="text-black mb-5 dark:text-white">
              Update Product Detail
            </p>
            <InputField
              label="Name*"
              id="name"
              type="text"
              name="name"
              value={updateDetailForm?.name}
              onChange={(e: any) => onFormChange(e, "updateDetail")}
              onFocus={() => {
                if (errors?.name && errors?.name?.length > 0) {
                  updateError("name");
                }
              }}
              error={errors?.name}
            />

            <TextField
              ref={null}
              extra="mb-3"
              rows={5}
              variant="auth"
              label="Description"
              id="description"
              type="text"
              name="description"
              isRequired={true}
              value={updateDetailForm?.description}
              onChange={(e: any) => onFormChange(e, "updateDetail")}
            />

            <div className="flex gap-3">
              <div className="w-1/3">
                <SelectField
                  label="Choose Category"
                  extra="mb-3"
                  defaultName="Select Product Category"
                  defaultValue="0"
                  name="categoryId"
                  options={
                    categories?.length > 0
                      ? [
                          ...categories?.map((cat: Category) => {
                            return {
                              name: cat?.name,
                              value: cat?.categoryId,
                            };
                          }),
                        ]
                      : []
                  }
                  value={updateDetailForm?.categoryId}
                  onChange={(e: any) => onFormChange(e, "updateDetail")}
                  showLabel={true}
                />
              </div>
              <div className="w-1/3">
                <InputField
                  label="Units"
                  placeholder=""
                  id="unit"
                  type="text"
                  name="units"
                  value={updateDetailForm?.units}
                  onChange={(e: any) => onFormChange(e, "updateDetail")}
                />
              </div>

              <div className="w-1/3">
                <InputField
                  label="Tags"
                  placeholder=""
                  id="tags"
                  type="text"
                  name="tags"
                  value={updateDetailForm?.tags}
                  onChange={(e: any) => onFormChange(e, "updateDetail")}
                />
              </div>
            </div>

            <TextField
              ref={null}
              extra="mb-3"
              rows={5}
              variant="auth"
              label="Additional Comments"
              id="comments"
              type="text"
              name="comments"
              value={updateDetailForm?.comments}
              onChange={(e: any) => onFormChange(e, "updateDetail")}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setOpenUpdateDetailForm(false);
                  setSelected(null);
                  clearError();
                }}
                style="linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs"
              >
                Cancel
              </Button>
              <button className="linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200">
                Update Detail
              </button>
            </div>
          </form>
        </Modal>
      )}

      {openGallery && (
        <Modal
          styling="w-4/6 p-5"
          onClose={() => {
            setOpenGallery(false);
            setSelected(null);
            clearError();
            setUpdateGalleryForm((state) => ({
              ...state,
              gallery: [],
            }));
          }}
        >
          <div className="mb-5 flex w-full flex-col-reverse gap-3 sm:flex-row">
            <div className="flex w-full justify-center gap-5 sm:block sm:w-[80px]">
              {selected?.images?.length > 0
                ? selected?.images?.map((pic) => (
                    <div
                      key={pic?.logoId}
                      className={`${gallery}`}
                      onClick={() => setDisplayedImg(pic?.url)}
                    >
                      <img
                        src={pic?.url ?? imgPlaceholder}
                        alt={pic?.alt ?? selected?.sku}
                        className="h-2/3 w-2/3"
                      />
                    </div>
                  ))
                : [1, 2, 3, 4].map((count) => (
                    <div
                      key={count}
                      className={`${gallery}`}
                      onClick={() => setDisplayedImg(imgPlaceholder)}
                    >
                      <img
                        src={imgPlaceholder}
                        alt={selected?.sku}
                        className="h-2/3 w-2/3"
                      />
                    </div>
                  ))}
            </div>

            <div className="flex h-[600px] w-full items-center justify-center overflow-y-scroll rounded-[4px] border bg-[#f5f5f5] py-5 sm:py-0">
              <div className="flex items-center justify-center">
                <img src={displayedImg} alt="" className="" />
              </div>
            </div>
          </div>

          <form onSubmit={(e) => updateGallery(e)}>
            <p className="text-black mb-5 font-bold dark:text-white">
              Product Gallery Update
            </p>

            <UploadField
              boxStyle="mb-[24px]"
              label="Upload picture of products"
              name="images"
              onChange={setUpdateGalleryForm}
            />

            <div className="mb-5 flex flex-wrap gap-2">
              {updateGalleryForm &&
                updateGalleryForm?.images?.length > 0 &&
                Array.from(updateGalleryForm?.images)?.map(
                  (file: any, index: number) => (
                    <div
                      key={file?.name}
                      className="h-[80px] w-[80px] overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`logo${index}`}
                      />
                    </div>
                  )
                )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setOpenGallery(false);
                  setSelected(null);
                  clearError();
                  setUpdateGalleryForm((state) => ({
                    ...state,
                    gallery: [],
                  }));
                }}
                style="linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs"
              >
                Cancel
              </Button>
              <button className="linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200">
                Update Gallery
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
