import { cx } from "core/services/helpers";

interface Props {
  pagination?: Pagination<any[]>;
  onFetch?: any;
}

export default function Pagination({
  pagination = {
    currentPage: 1,
    items: [],
    totalItem: 0,
    totalPage: 0,
  },
  onFetch = () => {},
}: Props) {
  const btn =
    "flex items-center justify-center gap-2 px-[10px] sm:px-[32px] py-[10px] text-[14px] rounded-[4px] transition duration-300 ease-in-out disabled:cursor-not-allowed";

  return (
    <div className="flex w-full items-center justify-center gap-3 sm:w-2/3 lg:w-1/2">
      <button
        className={cx(btn, "!w-1/3 bg-brand-100 text-[12px] text-white")}
        onClick={() => onFetch(pagination.currentPage - 1)}
        disabled={pagination.totalPage === 0 || pagination.currentPage === 1}
      >
        <span>Prev</span>
      </button>

      <div className={`${btn} bg-shade !w-1/3 text-[12px]`}>
        {pagination.currentPage} / {pagination.totalPage}
      </div>

      <button
        disabled={
          pagination.totalPage === 0 ||
          pagination.currentPage === pagination.totalPage
        }
        onClick={() => onFetch(pagination.currentPage + 1)}
        className={cx(btn, "!w-1/3 bg-brand-300 text-[12px] text-white")}
      >
        <span>Next</span>
      </button>
    </div>
  );
}
