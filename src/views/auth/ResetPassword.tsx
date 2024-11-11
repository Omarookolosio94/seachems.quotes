import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "core/components/fields/InputField";
import { useBusinessStore } from "core/services/stores/useBusinessStore";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const errors = useBusinessStore((store) => store.errors);
  const updateError = useBusinessStore((store) => store.updateError);
  const getOtpAction = useBusinessStore((state) => state.getOtp);
  const resetPasswordAction = useBusinessStore((state) => state.resetPassword);

  const [resetForm, setResetForm] = useState<ResetPassword>({
    email: "",
    otp: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setResetForm({
      ...resetForm,
      [name]: value,
    });
  };

  const getOtp = async () => {
    if (resetForm?.email == null || resetForm?.email?.length < 1) {
      toast.error("Please input a valid email");
    }
    await getOtpAction(resetForm?.email);
  };

  const resetPassword = async (e: any) => {
    e.preventDefault();

    var status: boolean | any = await resetPasswordAction(resetForm);

    if (status) {
      setResetForm({
        email: "",
        password: "",
        otp: "",
      });

      navigate("/auth");
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Reset Password
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your otp and email to reset password!
        </p>
        <form onSubmit={(e: any) => resetPassword(e)}>
          <InputField
            label="Email*"
            placeholder="business@mail.com"
            id="email"
            type="text"
            name="email"
            value={resetForm?.email}
            onChange={(e: any) => handleChange(e)}
            onFocus={() => {
              if (errors?.email && errors?.email?.length > 0) {
                updateError("Email");
              }
            }}
            error={errors?.Email}
          />

          {/* Password */}
          <InputField
            label="New Password*"
            placeholder=""
            id="newPassword"
            type="password"
            name="password"
            value={resetForm?.password}
            onChange={(e: any) => handleChange(e)}
            onFocus={() => {
              if (errors?.password && errors?.password?.length > 0) {
                updateError("password");
              }
            }}
            error={errors?.NewPassword}
          />

          {/* OTP */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              onClick={() => getOtp()}
            >
              Generate Otp?
            </button>
          </div>

          <InputField
            label="Otp*"
            id="otp"
            placeholder=""
            type="text"
            name="otp"
            value={resetForm?.otp}
            onChange={(e: any) => handleChange(e)}
            onFocus={() => {
              if (errors?.otp && errors?.otp?.length > 0) {
                updateError("Otp");
              }
            }}
            error={errors?.otp}
          />

          <button className="linear mt-2 w-full rounded-md bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Reset Password
          </button>
        </form>

        <div className="mt-4">
          <div>
            <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
              Set up a new business profile?
            </span>
            <Link
              to="/auth/register"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Create an account
            </Link>
          </div>
          <div>
            <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
              All ready have an account?
            </span>
            <Link
              to="/auth/sign-in"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
