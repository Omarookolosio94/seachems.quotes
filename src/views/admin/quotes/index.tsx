/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/style-prop-object */
import { useEffect, useState } from "react";
import SimpleTable from "core/components/table/SimpleTable";
import TableRowData from "core/components/table/TableRowData";
import { expandRow, formatNumber, getDate } from "core/services/helpers";
import Button from "core/components/button/Button";
import ActionRowData from "core/components/table/ActionRowData";
import { MdCancel, MdCheckCircle, MdQuestionAnswer } from "react-icons/md";
import SubHeader from "core/components/subHeader";
import Card from "core/components/card";
import Modal from "core/components/modal/Modal";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsShare,
} from "react-icons/bs";
import SelectField from "core/components/fields/SelectField";
import { RiPriceTag3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import TextField from "core/components/fields/TextField";
import InputField from "core/components/fields/InputField";
import { useBusinessStore } from "core/services/stores/useBusinessStore";
import { useQuotationStore } from "core/services/stores/useQuotationStore";
import { QUOTE_STATUS } from "core/const/const";
import imgPlaceholder from "assets/svg/defaultProductImg.svg";
import { AiFillDelete, AiFillPlusCircle } from "react-icons/ai";
import { useProductStore } from "core/services/stores/useProductStore";

const Quotes = () => {
  const [expandedRows, setExpandedRows]: any = useState([]);
  const [expandState, setExpandState] = useState({});
  const navigate = useNavigate();
  const singleProduct = useProductStore((store) => store.product);
  const getProductByParam = useProductStore((store) => store.getProductByParam);
  const resetProduct = useProductStore((store) => store.resetProduct);

  const user = useBusinessStore((store) => store.authData);

  const errors = useQuotationStore((store) => store.errors);
  const updateError = useQuotationStore((store) => store.updateError);
  const clearError = useQuotationStore((store) => store.clearError);

  const currencies = useQuotationStore((store) => store.currencies);
  const getCurrencies = useQuotationStore((store) => store.getCurrencies);

  const quoteList = useQuotationStore((store) => store.quotePagination);
  const query = useQuotationStore((store) => store.query);
  const getQuoteAction = useQuotationStore((store) => store.getQuotes);
  const treatQuoteAction = useQuotationStore((store) => store.treatQuote);
  const sendQuoteAction = useQuotationStore((store) => store.sendQuote);

  const [treatQuoteForm, setTreatQuoteForm] = useState<TreatQuotation>({
    currency: "",
    note: "",
    quotedProducts: [],
    status: "",
  });

  const [sendQuoteForm, setSendQuoteForm] = useState<SendQuotation>({
    customerEmails: [],
    trackerId: "",
  });

  const [selected, setSelected] = useState<Quotation | null>(null);
  const [openTreat, setOpenTreat] = useState(false);
  const [openSend, setOpenSend] = useState(false);

  const fetchMore = (page: number) => {
    getQuoteAction({ ...query, pageNumber: page });
  };

  const onFormChange = (e: any) => {
    const { name, value } = e.target;

    setTreatQuoteForm({
      ...treatQuoteForm,
      [name]: value,
    });
  };

  // State and handler functions
  const handleEmailChange = (e: any, index: number) => {
    const updatedEmails = [...sendQuoteForm.customerEmails];
    updatedEmails[index] = e.target.value;
    setSendQuoteForm((prevForm) => ({
      ...prevForm,
      customerEmails: updatedEmails,
    }));
  };

  const addEmailField = () => {
    setSendQuoteForm((prevForm) => ({
      ...prevForm,
      customerEmails: [...prevForm.customerEmails, ""],
    }));
  };

  const removeEmailField = (index: number) => {
    if (sendQuoteForm.customerEmails.length > 1) {
      // Prevent removal if only one email remains
      setSendQuoteForm((prevForm) => ({
        ...prevForm,
        customerEmails: prevForm.customerEmails.filter((_, i) => i !== index),
      }));
    }
  };

  const sendQuote = async (e: any) => {
    e.preventDefault();
    var res = await sendQuoteAction(sendQuoteForm);
    if (res?.status) {
      setOpenSend(false);
      setSendQuoteForm({
        customerEmails: [],
        trackerId: "",
      });
    }
  };

  const treatQuote = async (e: any) => {
    e.preventDefault();
    var res = await treatQuoteAction(treatQuoteForm, selected.quotationId);

    if (res?.status) {
      setOpenTreat(false);
      setSelected(null);
      setTreatQuoteForm({
        currency: "",
        note: "",
        quotedProducts: [],
        status: "",
      });
    }
  };

  const handleExpandRow = async (event: any, id: string) => {
    var newRows = await expandRow(id, expandedRows);
    setExpandState(newRows?.obj);
    setExpandedRows(newRows?.newExpandedRows);
  };

  // Handlers for updating variations and notes
  const handleVariationChange = (
    productIndex: number,
    variationIndex: number,
    field: string,
    value: string | number
  ) => {
    const updatedProducts: any[] = [...treatQuoteForm.quotedProducts];
    updatedProducts[productIndex].productVariations[variationIndex][field] =
      value;
    setTreatQuoteForm({ ...treatQuoteForm, quotedProducts: updatedProducts });
  };

  const handleNoteChange = (index: number, value: string | number) => {
    const updatedProducts: any[] = [...treatQuoteForm.quotedProducts];
    updatedProducts[index].note = value;
    setTreatQuoteForm({ ...treatQuoteForm, quotedProducts: updatedProducts });
  };

  // Function to add a variation for a specific product
  const addVariation = (productIndex: number) => {
    const updatedProducts = [...treatQuoteForm.quotedProducts];
    updatedProducts[productIndex].productVariations.push({
      unitOfMeasurement: "",
      price: 0,
    });
    setTreatQuoteForm({ ...treatQuoteForm, quotedProducts: updatedProducts });
  };

  // Function to remove a variation from a product
  const removeVariation = (productIndex: number, variationIndex: number) => {
    const updatedProducts = [...treatQuoteForm.quotedProducts];
    updatedProducts[productIndex].productVariations = updatedProducts[
      productIndex
    ].productVariations.filter((_, i) => i !== variationIndex);
    setTreatQuoteForm({ ...treatQuoteForm, quotedProducts: updatedProducts });
  };

  useEffect(() => {
    getQuoteAction(query);
    currencies?.length < 1 && getCurrencies();
  }, []);

  return (
    <div className="mt-3">
      <Card extra={"w-full h-full mx-4 px-6 pb-6 sm:overflow-x-auto"}>
        <SubHeader
          title="Quotations"
          showAction={false}
          icon={<MdQuestionAnswer />}
        />
        <p className="text-sm">
          * Only <span className="font-bold">INVOICED</span> and{" "}
          <span className="font-bold">CLOSED</span> quotes can be sent to
          clients
        </p>
        <p className="text-sm">
          * <span className="font-bold">CLOSED</span> quotes cannot be treated
          again.
        </p>
        <SimpleTable
          headers={[
            "Tracking ID",
            "Customer",
            "Business/Company",
            "Status",
            "Is Sent",
            "Date Requested",
            "Actions",
          ]}
        >
          {quoteList != null && quoteList?.items?.length > 0 ? (
            quoteList.items.map((quote) => (
              <>
                <tr key={quote?.quotationId}>
                  <TableRowData
                    style="min-w-[60px]"
                    value={quote.quotationTrackerId}
                  />
                  <TableRowData
                    style="min-w-[50px]"
                    value={quote?.customerName}
                  />
                  <TableRowData
                    style="min-w-[50px]"
                    value={quote?.customerCompanyName}
                  />

                  <ActionRowData style="min-w-[50px]">
                    <div
                      className={`flex dark:hover:text-white
                      ${
                        quote?.status?.toUpperCase() ==
                          QUOTE_STATUS[0]?.toUpperCase() &&
                        "text-gray-500 hover:text-gray-600"
                      }
                      ${
                        quote?.status?.toUpperCase() ==
                          QUOTE_STATUS[3]?.toUpperCase() &&
                        "text-blue-500 hover:text-blue-600"
                      }
                      ${
                        quote?.status?.toUpperCase() ==
                          QUOTE_STATUS[1]?.toUpperCase() &&
                        "text-yellow-500 hover:text-yellow-600"
                      }
                      ${
                        quote?.status?.toUpperCase() ==
                          QUOTE_STATUS[2]?.toUpperCase() &&
                        "text-red-500 hover:text-red-600"
                      }
                      ${
                        quote?.status?.toUpperCase() ==
                          QUOTE_STATUS[4]?.toUpperCase() &&
                        "text-green-500 hover:text-green-600"
                      }
                      `}
                    >
                      <>
                        <RiPriceTag3Fill className="mr-1" />
                        <span className="text-xs">{quote?.status}</span>
                      </>
                    </div>
                  </ActionRowData>

                  <ActionRowData style="min-w-[50px]">
                    <div className="flex">
                      {quote?.isSent ? (
                        <>
                          <MdCheckCircle className="mr-1 text-green-500 dark:text-green-300" />
                          <span className="text-xs text-green-600">sent</span>
                          <span className="ml-1 text-xs text-green-600">
                            *{quote.noOfTimesSent}
                          </span>
                        </>
                      ) : (
                        <>
                          <MdCancel className="me-1 text-red-500 dark:text-red-300" />
                          <span className="text-xs text-red-600">not sent</span>
                        </>
                      )}
                    </div>
                  </ActionRowData>

                  <TableRowData
                    style="min-w-[50px]"
                    value={getDate(quote?.dateAdded, true, true)}
                  />

                  <ActionRowData>
                    <Button
                      style="flex gap-1 justify-items-center items-center bg-gray-500 hover:bg-gray-600 dark:text-white-300"
                      onClick={(e: any) =>
                        handleExpandRow(e, quote?.quotationId)
                      }
                    >
                      {!expandedRows.includes(quote.quotationId) ? (
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
                      style="flex gap-1 justify-items-center items-center bg-blue-400 hover:bg-blue-600 dark:text-white-300"
                      disabled={
                        ![
                          QUOTE_STATUS[4]?.toUpperCase(),
                          QUOTE_STATUS[3]?.toUpperCase(),
                        ].includes(quote.status?.toUpperCase())
                      }
                      onClick={() => {
                        setSendQuoteForm({
                          trackerId: quote?.quotationTrackerId,
                          customerEmails: [quote?.customerEmail],
                        });
                        setOpenSend(true);
                      }}
                    >
                      <BsShare />
                      <span className="text-xs">Send</span>
                    </Button>

                    <Button
                      style="flex gap-1 justify-items-center items-center bg-green-400 hover:bg-green-600 dark:text-white-300"
                      disabled={[QUOTE_STATUS[4]?.toUpperCase()].includes(
                        quote.status?.toUpperCase()
                      )}
                      onClick={() => {
                        setSelected(quote);
                        setTreatQuoteForm({
                          currency:
                            quote?.currency?.length > 0
                              ? quote?.currency
                              : "NGN",
                          note: quote?.note,
                          status: quote?.status,
                          quotedProducts:
                            quote?.quotedProducts?.length > 0
                              ? [
                                  ...quote.quotedProducts?.map((prod) => {
                                    return {
                                      productSKU: prod?.productSKU,
                                      productVariations:
                                        prod?.productVariations?.length > 0
                                          ? prod?.productVariations
                                          : [
                                              {
                                                unitOfMeasurement: "",
                                                price: 0,
                                              },
                                            ],
                                      note: prod?.note,
                                    };
                                  }),
                                ]
                              : [],
                        });
                        setOpenTreat(true);
                      }}
                    >
                      <BsShare />
                      <span className="text-xs">Treat</span>
                    </Button>
                  </ActionRowData>
                </tr>

                {expandedRows.includes(quote?.quotationId) ? (
                  <tr>
                    <td
                      className="border-[1px] border-gray-200 text-sm"
                      colSpan={8}
                    >
                      <ul className="p-5">
                        <li className="mb-5 flex gap-3">
                          <div className="w-1/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Currency:
                            </span>
                            <span>{quote.currency}</span>
                          </div>

                          <div className="w-1/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Date Added:
                            </span>
                            <span>{getDate(quote?.dateAdded, true, true)}</span>
                          </div>

                          <div className="w-1/4">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Last Update Date:
                            </span>
                            <span>
                              {getDate(quote?.lastDateUpdated, true, true)}
                            </span>
                          </div>
                        </li>

                        <li className="border-gry-500 mb-5 border-b p-1"></li>

                        <li className="mb-5 flex w-full flex-col gap-3 sm:flex-row">
                          <div className="w-full">
                            <span className="mb-3 font-bold text-brand-500 dark:text-white">
                              Quoted Items:
                            </span>
                            <br />
                            {quote?.quotedProducts?.length > 0 &&
                              quote.quotedProducts.map((product) => (
                                <div className="mb-4" key={product.productSKU}>
                                  <div className="flex  w-full items-center gap-3 rounded-lg border p-3 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <img
                                      src={product?.gallery || imgPlaceholder}
                                      alt={product?.productName}
                                      className="h-[50px] w-[50px] rounded-[5px] object-cover"
                                    />
                                    <div>
                                      <p className="font-medium">
                                        {product?.productName}
                                      </p>
                                      {/* Variations Section */}
                                      {product.productVariations &&
                                        product.productVariations.length >
                                          0 && (
                                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {product.productVariations.map(
                                              (variation, index) => (
                                                <div
                                                  key={index}
                                                  className="flex flex-col justify-between"
                                                >
                                                  <span>
                                                    {
                                                      variation?.unitOfMeasurement
                                                    }
                                                  </span>
                                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                    {formatNumber(
                                                      variation?.price
                                                    )}
                                                  </span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  {product?.note?.length > 0 && (
                                    <div>
                                      <span className="font-semibold">
                                        Note:{" "}
                                      </span>
                                      <p>{product?.note}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </li>

                        <li className="border-gry-500 mb-5 border-b p-1"></li>

                        <li className="flex gap-3">
                          <div className="w-3/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Client
                            </span>
                          </div>
                        </li>

                        <li className="mb-5 flex gap-3">
                          <div className="w-1/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Name:
                            </span>
                            <span>{quote?.customerName}</span>
                          </div>
                          <div className="w-1/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Contact Email:
                            </span>
                            <a
                              href={`mailto:${quote?.customerEmail}`}
                              className="text-black underline"
                            >
                              {quote?.customerEmail}
                            </a>
                          </div>

                          <div className="w-1/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Contact Phone:
                            </span>
                            <a
                              href={`tel:${quote?.customerPhoneNumber}`}
                              className="text-black underline"
                            >
                              {quote?.customerPhoneNumber}
                            </a>
                          </div>
                        </li>
                        <li className="mb-5 flex gap-3">
                          <div className="w-3/3">
                            <span className="mr-1 font-bold text-brand-500 dark:text-white">
                              Business/Company
                            </span>
                            <br />
                            <span>{quote.customerCompanyName}</span>
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
              <TableRowData colSpan={7} value="No quotation yet" />
            </tr>
          )}

          <tr>
            <TableRowData
              colSpan={4}
              value={`Showing ${quoteList?.items?.length} of ${quoteList?.totalItem} entries`}
            />
            <ActionRowData colSpan={3}>
              <Button
                disabled={quoteList?.currentPage === 1}
                style="flex gap-1 justify-items-center items-center"
                onClick={() => {
                  fetchMore(quoteList.currentPage - 1);
                }}
              >
                <BsChevronDoubleLeft className="" />
                <span className="text-xs">Prev</span>
              </Button>
              <Button style="flex gap-1 bg-green-500 hover:bg-green-600">
                <span className="text-xs">
                  {quoteList?.currentPage} / {quoteList?.totalPage}
                </span>
              </Button>
              <Button
                disabled={quoteList?.currentPage === quoteList?.totalPage}
                style="flex gap-1 justify-items-center items-center"
                onClick={() => fetchMore(quoteList.currentPage + 1)}
              >
                <span className="text-xs">Next</span>
                <BsChevronDoubleRight className="text-xs" />
              </Button>
            </ActionRowData>
          </tr>
        </SimpleTable>
      </Card>
      {openSend && (
        <Modal
          styling="w-2/6 p-5"
          onClose={() => {
            setOpenSend(false);
            setSelected(null);
            clearError();
            setSendQuoteForm({
              customerEmails: [],
              trackerId: "",
            });
          }}
        >
          <form onSubmit={(e) => sendQuote(e)}>
            <p className="text-black mb-5 font-bold dark:text-white">
              Send Quote To Client
            </p>

            <InputField
              label="Tracker ID*"
              id="trackerId"
              type="text"
              name="trackerId"
              disabled
              value={sendQuoteForm.trackerId}
            />

            <p className="text-black mb-2 font-bold dark:text-white">
              Customer Emails*
            </p>
            {sendQuoteForm.customerEmails.map((email, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <div className="w-full">
                  <InputField
                    id={`customerEmail-${index}`}
                    type="text"
                    className="w-full"
                    name={`customerEmails[${index}]`}
                    value={email}
                    onChange={(e) => handleEmailChange(e, index)}
                    onFocus={() => {
                      if (
                        errors != null &&
                        errors[`customerEmails[${index}]`] &&
                        errors[`customerEmails[${index}]`]?.length > 0
                      ) {
                        updateError(`customerEmails[${index}]`);
                      }
                    }}
                    error={errors != null && errors[`customerEmails[${index}]`]}
                  />
                </div>
                {index > 0 && ( // Allow removing only if it's not the first email
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="text-red-500"
                  >
                    <AiFillDelete />
                  </button>
                )}
              </div>
            ))}

            <div className="flex w-full justify-end">
              <Button
                type="button"
                onClick={addEmailField}
                className="linear mb-5 mt-3 w-full rounded-md bg-blue-500 py-[12px] text-xs font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-400 dark:text-white dark:hover:bg-blue-300 dark:active:bg-blue-200"
              >
                <AiFillPlusCircle />
                Add
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setOpenSend(false);
                  setSelected(null);
                  setSendQuoteForm({
                    customerEmails: [],
                    trackerId: "",
                  });
                  clearError();
                }}
                style="linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs"
              >
                Cancel
              </Button>
              <button className="linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:active:bg-green-200">
                Share Quote
              </button>
            </div>
          </form>
        </Modal>
      )}

      {openTreat && (
        <Modal
          styling="w-2/6 p-5"
          onClose={() => {
            setOpenTreat(false);
            setSelected(null);
            setTreatQuoteForm({
              currency: "",
              note: "",
              quotedProducts: [],
              status: "",
            });
            clearError();
          }}
        >
          <form onSubmit={(e) => treatQuote(e)}>
            <p className="text-black mb-5 font-bold dark:text-white">
              Treat Quote - {selected?.quotationTrackerId}
            </p>

            {/* Status Select */}
            <SelectField
              label=""
              extra="mb-3"
              defaultName="Select Status"
              name="status"
              options={QUOTE_STATUS.map((stat) => ({
                name: stat,
                value: stat,
              }))}
              value={treatQuoteForm.status}
              onChange={(e: any) =>
                setTreatQuoteForm({ ...treatQuoteForm, status: e.target.value })
              }
            />

            {/* Currency Select */}
            <SelectField
              label=""
              extra="mb-3"
              defaultName="Select Currency"
              name="currency"
              options={currencies.map((currency) => ({
                name: currency.name,
                value: currency.code,
              }))}
              value={treatQuoteForm.currency}
              onChange={(e: any) =>
                setTreatQuoteForm({
                  ...treatQuoteForm,
                  currency: e.target.value,
                })
              }
            />

            {/* Product Fields */}
            {treatQuoteForm.quotedProducts.map((product, productIndex) => (
              <div key={productIndex} className="mb-5">
                {/* Product SKU - Disabled */}
                <div className="mb-3 w-full">
                  <button
                    type="button"
                    className="mt-2 flex h-12 w-full items-center justify-between rounded-md border !bg-white/0 p-3 text-sm outline-none "
                    id={`quotedProducts[${productIndex}].ProductSKU`}
                    onClick={() => {
                      if (
                        singleProduct == null &&
                        singleProduct?.sku != product?.productSKU
                      ) {
                        getProductByParam(
                          product?.productSKU,
                          user?.businessId
                        );
                      } else {
                        resetProduct();
                      }
                    }}
                  >
                    <p>{product?.productSKU}</p>
                    <div>
                      {singleProduct == null ||
                      singleProduct?.sku != product?.productSKU ? (
                        <>
                          <BsFillCaretDownFill className="inline-block text-green-500" />
                          <span className="inline-block text-xs text-green-500">
                            View
                          </span>
                        </>
                      ) : (
                        <>
                          <BsFillCaretUpFill className="inline-block text-red-500" />
                          <span className="inline-block text-xs text-red-500">
                            Close
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {singleProduct != null &&
                  singleProduct?.sku == product?.productSKU && (
                    <div className="mb-3 rounded-lg border p-3 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                      <div className="mb-3 flex w-full items-center gap-3">
                        <img
                          src={singleProduct?.images[0]?.url || imgPlaceholder}
                          alt={singleProduct?.name}
                          className="h-[50px] w-[50px] rounded-[5px] object-cover"
                        />
                        <div>
                          <p className="font-medium">{singleProduct?.name}</p>

                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Category</span>
                              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
                                {singleProduct?.category?.name}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>Tags</span>
                              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
                                {singleProduct?.tags || "n/a"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {singleProduct?.description?.length > 0 && (
                        <div className="mb-3 text-gray-700">
                          <span className="font-semibold ">Description: </span>
                          <p>{singleProduct?.description}</p>
                        </div>
                      )}

                      {singleProduct?.comments?.length > 0 && (
                        <div className="text-gray-700">
                          <span className="font-semibold">Note: </span>
                          <p>{singleProduct?.comments}</p>
                        </div>
                      )}
                    </div>
                  )}

                <TextField
                  ref={null}
                  extra="mb-3"
                  rows={3}
                  variant="auth"
                  label="Product Note"
                  id={`quotedProducts[${productIndex}].Note`}
                  type="text"
                  name="note"
                  value={product.note}
                  onChange={(e: any) =>
                    handleNoteChange(productIndex, e.target.value)
                  }
                />

                {/* Product Variations */}
                {product.productVariations.map((variation, variationIndex) => (
                  <div key={variationIndex}>
                    <div>
                      <InputField
                        label="Unit of Measurement"
                        id={`quotedProducts[${productIndex}].ProductVariations[${variationIndex}].UnitOfMeasurement`}
                        type="text"
                        name={`quotedProducts[${productIndex}].ProductVariations[${variationIndex}].UnitOfMeasurement`}
                        value={variation.unitOfMeasurement}
                        onChange={(e) =>
                          handleVariationChange(
                            productIndex,
                            variationIndex,
                            "unitOfMeasurement",
                            e.target.value
                          )
                        }
                        onFocus={() => {
                          if (
                            errors != null &&
                            errors[
                              `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].UnitOfMeasurement`
                            ] &&
                            errors[
                              `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].UnitOfMeasurement`
                            ]?.length > 0
                          ) {
                            updateError(
                              `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].UnitOfMeasurement`
                            );
                          }
                        }}
                        error={
                          errors != null &&
                          errors[
                            `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].UnitOfMeasurement`
                          ]
                        }
                      />
                    </div>

                    <div>
                      <InputField
                        label="Price"
                        id={`quotedProducts[${productIndex}].ProductVariations[${variationIndex}].Price`}
                        type="number"
                        name={`quotedProducts[${productIndex}].ProductVariations[${variationIndex}].Price`}
                        value={variation.price}
                        onChange={(e) =>
                          handleVariationChange(
                            productIndex,
                            variationIndex,
                            "price",
                            e.target.value
                          )
                        }
                        onFocus={() => {
                          if (
                            errors != null &&
                            errors[
                              `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].Price`
                            ] &&
                            errors[
                              `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].Price`
                            ]?.length > 0
                          ) {
                            updateError(
                              `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].Price`
                            );
                          }
                        }}
                        error={
                          errors != null &&
                          errors[
                            `quotedProducts[${productIndex}].ProductVariations[${variationIndex}].Price`
                          ]
                        }
                      />
                    </div>

                    {variationIndex > 0 && ( // Allow removing only if it's not the first email
                      <button
                        type="button"
                        onClick={() =>
                          removeVariation(productIndex, variationIndex)
                        }
                        className="text-red-500"
                      >
                        <AiFillDelete />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex w-full justify-end">
                  <Button
                    type="button"
                    onClick={() => addVariation(productIndex)}
                    className="linear mb-5 mt-3 w-full rounded-md bg-blue-500 py-[12px] text-xs font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-400 dark:text-white dark:hover:bg-blue-300 dark:active:bg-blue-200"
                  >
                    <AiFillPlusCircle />
                    Add Variation
                  </Button>
                </div>
              </div>
            ))}

            {/* Extra Note */}
            <TextField
              ref={null}
              extra="mb-3"
              rows={5}
              variant="auth"
              label="Extra Note"
              id="note"
              type="text"
              name="note"
              value={treatQuoteForm.note}
              onChange={(e: any) =>
                setTreatQuoteForm({ ...treatQuoteForm, note: e.target.value })
              }
            />

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setOpenSend(false);
                  setSelected(null);
                  clearError();
                  setTreatQuoteForm({
                    currency: "",
                    note: "",
                    quotedProducts: [],
                    status: "",
                  });
                }}
                style="linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs"
              >
                Cancel
              </Button>
              <button className="linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200">
                Treat Quote
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Quotes;
