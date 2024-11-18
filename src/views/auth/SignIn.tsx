import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import InputField from "core/components/fields/InputField";
import {useBusinessStore} from "core/services/stores/useBusinessStore";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const error = useBusinessStore((store) => store.errors);
    const loginUser = useBusinessStore((store) => store.login);
    const updateError = useBusinessStore((store) => store.updateError);
    const recaptcha = useRef(null);

    const login = async (e: any) => {
        e.preventDefault();

        const captchaValue = recaptcha.current.getValue()

        if (!captchaValue) {
            return toast.error('Please verify the reCAPTCHA!')
        }

        var res = await loginUser({email, password});

        if (res?.status) {
            navigate("/admin/dashboard");
        }
    };

    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <>
            <div
                className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
                {/* Sign in section */}
                <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                    <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                        Sign In
                    </h4>
                    <p className="mb-9 ml-1 text-base text-gray-600">
                        Enter your email and password to sign in!
                    </p>

                    <form onSubmit={(e) => login(e)} autoComplete="on">
                        {/* Email */}
                        <InputField
                            label="Email*"
                            placeholder="mail@simmmple.com"
                            id="email"
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e: any) => {
                                setEmail(e.target?.value);
                            }}
                            onFocus={() => {
                                if (error?.email && error?.email?.length > 0) {
                                    updateError("email");
                                }
                            }}
                            error={error?.email}
                        />

                        {/* Password */}
                        <InputField
                            label="Password*"
                            placeholder=""
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e: any) => {
                                setPassword(e.target?.value);
                            }}
                            onFocus={() => {
                                if (error?.password && error?.password?.length > 0) {
                                    updateError("password");
                                }
                            }}
                            error={error?.password}
                        />

                        <div className="mt-10 w-full">
                            <ReCAPTCHA
                                style={{width: "100%", margin: "10px 0"}}
                                sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY} ref={recaptcha}/>
                        </div>

                        <button
                            className="linear mt-3 w-full rounded-md bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-5 flex items-center justify-between">
                        <Link
                            to="/auth/reset-password"
                            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="">
            <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
              Set up a new business profile?
            </span>
                        <Link
                            to="/auth/register"
                            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                        >
                            Create business account
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
