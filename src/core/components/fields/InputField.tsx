// Custom components
import { cx, numbersOnly } from "core/services/helpers";
import React, { forwardRef, InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  boxClassName?: string;
  isRequired?: boolean;
  instruction?: string;
  error?: string;
  type?: string;
  dataList?: DataListItem[];
  label?: string;
  isNumberOnly?: boolean;
}

const InputField = forwardRef<HTMLInputElement, Props>(function Input(
  {
    type = "text",
    boxClassName = "",
    label = "",
    instruction = "",
    isRequired = false,
    dataList = [],
    error = "",
    isNumberOnly = false,
    children = <></>,
    ...rest
  },
  ref
) {
  const [inputType, setInputType] = useState(type);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isNumberOnly) {
      numbersOnly(event);
    }
  };

  return (
    <fieldset className={cx("mb-3", boxClassName)}>
      {label && label?.length > 0 && (
        <label htmlFor={rest?.id} className="text-black-light text-[14px]">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          autoComplete="on"
          aria-autocomplete="none"
          onKeyDown={handleKeyDown}
          {...rest}
          className={cx(
            "mt-2 flex h-12 w-full items-center justify-center rounded-md border bg-white/0 p-3 text-sm outline-none ",
            rest?.className!
          )}
        />

        {type === "password" && (
          <div className="absolute right-3 top-[10%] hover:cursor-pointer">
            {inputType === "password" ? (
              <button
                type="button"
                className="text-secondary h-10 w-[60px] rounded-[8px] text-[12px]"
                onClick={() => setInputType("text")}
              >
                Show
              </button>
            ) : (
              <button
                type="button"
                className="text-secondary h-10 w-[60px] rounded-md text-[12px]"
                onClick={() => setInputType("password")}
              >
                Hide
              </button>
            )}
          </div>
        )}
      </div>

      {dataList?.length > 0 && (
        <datalist id={rest?.list}>
          {dataList.map((data: any) => (
            <option key={data?.value} value={data?.value}>
              {data?.name}
            </option>
          ))}
        </datalist>
      )}

      {children}

      {instruction && (
        <>
          <span className="text-black-light mb-1 text-[12px] leading-none">
            {instruction}
          </span>{" "}
          <br />
        </>
      )}

      <div className="h-2">
        {error && (
          <span className="text-[12px] leading-none text-red-500">{error}</span>
        )}
      </div>
    </fieldset>
  );
});

export default InputField;
