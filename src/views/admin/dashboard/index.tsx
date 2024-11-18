import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import Widget from "core/components/widget/Widget";
import Card from "core/components/card";
import TableRowData from "core/components/table/TableRowData";
import SimpleTable from "core/components/table/SimpleTable";
import { useEffect, useState } from "react";
import { formatNumber, getDate } from "core/services/helpers";
import { useNavigate } from "react-router-dom";
import Button from "core/components/button/Button";
import { useQuotationStore } from "core/services/stores/useQuotationStore";
import { useBusinessStore } from "core/services/stores/useBusinessStore";
import ActionRowData from "core/components/table/ActionRowData";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { useProductStore } from "core/services/stores/useProductStore";
import imgPlaceholder from "assets/svg/defaultProductImg.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const analytics = useQuotationStore((state) => state.analytics);
  const getAnalytics = useQuotationStore((state) => state.getAnalytics);
  const user = useBusinessStore((store) => store.authData);

  const product = useProductStore((store) => store.product);
  const resetProduct = useProductStore((store) => store.resetProduct);
  const getProducts = useProductStore((store) => store.getProductByParam);

  const [expandedRows, setExpandedRows]: any = useState([]);

  const handleExpandRow = async (event: any, id: string) => {
    if (expandedRows?.includes(id)) {
      setExpandedRows([]);
    } else {
      if (product == null || product.sku != id) {
        await getProducts(id, user.businessId);
      }
      setExpandedRows([id]);
    }
  };

  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate(-1);
    } else {
      getAnalytics();
    }
  }, []);

  return (
    <div>
      <div className="ml-5 mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-5">
        <Widget
          icon={<MdBarChart className="h-5 w-5" />}
          title={"Total Quotations"}
          subtitle={formatNumber(analytics?.totalQuotations)}
        />
        <Widget
          icon={<IoDocuments className="h-5 w-5" />}
          title={"Total Quotation Sent"}
          subtitle={formatNumber(analytics?.totalQuotationsSent)}
        />
        <Widget
          icon={<MdBarChart className="h-5 w-5" />}
          title={"Quotations Expiring Soon"}
          subtitle={formatNumber(analytics?.quotationsExpiringSoon)}
        />
        <Widget
          icon={<MdDashboard className="h-5 w-5" />}
          title={"Pending"}
          subtitle={formatNumber(analytics?.quotationsByStatus?.Pending)}
        />
        <Widget
          icon={<MdBarChart className="h-5 w-5" />}
          title={"Drafts"}
          subtitle={formatNumber(analytics?.quotationsByStatus?.Draft)}
        />
        <Widget
          icon={<MdBarChart className="h-5 w-5" />}
          title={"Cancelled"}
          subtitle={formatNumber(analytics?.quotationsByStatus?.Cancelled)}
        />
        <Widget
          icon={<MdBarChart className="h-5 w-5" />}
          title={"Invoiced"}
          subtitle={formatNumber(analytics?.quotationsByStatus?.Invoiced)}
        />
        <Widget
          icon={<MdBarChart className="h-5 w-5" />}
          title={"Closed"}
          subtitle={formatNumber(analytics?.quotationsByStatus?.Closed)}
        />
      </div>

      <Card extra={"mt-[35px] w-full h-full mx-5 px-6 pb-6 sm:overflow-x-auto"}>
        <h2 className="mt-5 text-lg font-bold text-navy-700 dark:text-white">
          Top Quoted Products
        </h2>

        <SimpleTable headers={["SKU", "Action"]}>
          {analytics != null && analytics?.topQuotedProducts?.length > 0 ? (
            analytics.topQuotedProducts.map((sku) => (
              <>
                <tr key={sku}>
                  <TableRowData value={sku} />

                  <ActionRowData>
                    <Button
                      style="flex gap-1 justify-items-center items-center bg-gray-500 hover:bg-gray-600 dark:text-white-300"
                      onClick={(e: any) => handleExpandRow(e, sku)}
                    >
                      {!expandedRows.includes(sku) ? (
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
                  </ActionRowData>
                </tr>
                {expandedRows.includes(sku) ? (
                  <tr>
                    <td
                      className="border-[1px] border-gray-200 text-sm"
                      colSpan={2}
                    >
                      {product != null && product?.sku == sku && (
                        <ul className="p-5">
                          <li className="mb-5">
                            <div className="flex items-center gap-2 hover:cursor-pointer">
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
                          </li>

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
                                Category:
                              </span>
                              <span>{product?.category?.name || "n/a"}</span>
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
                              <span className="whitespace-pre-wrap">
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
                              <span className="whitespace-pre-wrap">{product?.comments}</span>
                            </div>
                          </li>
                        </ul>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr></tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <TableRowData colSpan={2} value="No quoted product" />
            </tr>
          )}
        </SimpleTable>
      </Card>
    </div>
  );
};

export default Dashboard;
