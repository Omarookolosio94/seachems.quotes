import { useState } from "react";
import { FiCamera } from "react-icons/fi";

function UploadField({
  boxStyle = "",
  name = "",
  onChange = () => {},
  label = "",
  isRequired = false,
}: {
  boxStyle?: string;
  name: string;
  isRequired?: boolean;
  onChange?: any;
  label?: string;
}) {
  const [inputError, setError] = useState("");

  const onFileChange = (e: any) => {
    const { name, files } = e?.target;

    setError(""); // Reset the error message

    if (files) {
      const uploadedFiles: File[] = Array.from(files); // Convert FileList to an array

      // Check if the uploaded files exceed the limit
      if (uploadedFiles.length > 4) {
        setError("You can only upload up to 4 files.");
        return;
      }

      // If the file count is valid, pass them to the parent component
      onChange((state: any) => ({
        ...state,
        [name]: uploadedFiles,
      }));
    }
  };

  return (
    <div className={`${boxStyle}`}>
      {label && label?.length > 0 && (
        <label htmlFor={name} className="text-brandgray mb-2 block text-[14px]">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <div>
        <label
          htmlFor={name}
          className="border-brandgray text-brandgray mt-2 flex h-12 w-full items-center justify-between rounded-[5px] border border-[1px] bg-white p-3 text-sm outline-none"
        >
          <span>Upload image</span>
          <FiCamera />
        </label>
        <input
          type="file"
          id={name}
          name={name}
          onChange={onFileChange}
          className="hidden"
          multiple={true}
        />
      </div>
      {/* Display error message if any */}
      <span className="text-[14px] text-red-500">{inputError}</span>
    </div>
  );
}

export default UploadField;
