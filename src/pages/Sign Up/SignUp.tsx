import { useState } from "react";
import Input from "@/components/Input.tsx";
import Checkbox from "@/components/Checkbox.tsx";
import GoogleAuth from "@/components/GoogleAuth.tsx";
import { useViewportWidth, useViewportHeight } from "@/hooks/useViewport.ts";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import ErrorPopUp from "@/components/ErrorPopUp.tsx";
import callApi from "@/utils/callApi.ts";
import errorHandler from "@/utils/errorHandler.ts";
import validateForms from "@/utils/validateForms.ts";
import Button from "@/components/Button.tsx";
import type { Error } from "@/utils/types";

type ErrorState = Error & {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string;
};

const SignUp = () => {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<ErrorState>({ email: "", password: "", username: "", firstName: "", error: null });
  const [submiting, setSubmiting] = useState(false);
  const width = useViewportWidth(300);
  const height = useViewportHeight();
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);
    setError({ email: "", password: "", username: "", firstName: "", error: null });

    const validate = validateForms(value, setError, {
      usernameSpace: true,
      regexEmail: true,
      usernameLowerCased: true,
      email: true,
      emailSpace: true,
      password: true,
      username: true,
      firstName: true,
    });
    if (validate) {
      setSubmiting(false);
      return;
    }

    try {
      const response = await callApi("/auth/signup", {
        method: "POST",
        body: { ...value, fullName: `${value.firstName} ${value.lastName}` },
      });
      const form = e.target as HTMLFormElement;
      const rememberMe = form.querySelector<HTMLInputElement>("#remember-me");
      if (rememberMe && rememberMe.checked) {
        localStorage.setItem("jwt-token", response.data.token);
        sessionStorage.removeItem("jwt-token");
      } else {
        sessionStorage.setItem("jwt-token", response.data.token);
        localStorage.removeItem("jwt-token");
      }
      navigate("/");
    } catch (err) {
      errorHandler(err, setError);
    } finally {
      setSubmiting(false);
    }
  };

  const lists = ["Pick up where you left off", "Access your personalized dashboard", "Continue tracking your progress", "Get AI-powered insights"];
  return (
    <div className="flex flex-row-reverse justify-center lg:justify-between items-center h-full m-0 p-0 bg-theme text-theme-reverse">
      <div className="flex flex-col justify-center items-center gap-5 py-10" style={{ width: width > 1024 ? "50%" : "100%" }}>
        {error.error && <ErrorPopUp message={error.error.message} title={error.error.title} showBackToDashboard={false} />}
        <div className="flex flex-col text-center gap-2">
          <h1 className="font-bold text-2xl leading-8 font-heading">
            <span className="text-accent">Goal</span>Pilot
          </h1>
          <p>Create your account to start achieving your goals</p>
        </div>
        <div className="border-1 bg-theme-dark border-theme-darker pt-5 text-center rounded-[12px] gap-6 flex flex-col justify-center p-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:w-[70%] w-[90%] mb-10">
          <h1 className="font-bold text-2xl text-theme-reverse font-heading mb-4">Sign up</h1>
          <div className="gap-5 flex flex-col justify-center text-center">
            <GoogleAuth label={"Sign up with Google"} />
            <div className="flex justify-center relative">
              <div className="relative border w-full border-gray" />
              <p className="absolute left-[50%] top-[50%] -translate-[50%] bg-theme-dark px-1 text-gray text-[13px]">Or continue with</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="gap-3.5 flex flex-col justify-center">
            <Input
              placeholder={"Enter your username"}
              error={error.username}
              label={"Username"}
              type="text"
              onChange={(e) => setValue((prev) => ({ ...prev, username: e.target.value }))}
            />
            <div className="flex flex-1/2 gap-3">
              <Input
                placeholder={"Enter your first name"}
                labelClass="top-4.5 left-3 text-xs text-gray"
                error={error.firstName}
                label={"First Name"}
                type="text"
                onChange={(e) => setValue((prev) => ({ ...prev, firstName: e.target.value }))}
              />
              <Input
                placeholder={"Enter your last name"}
                labelClass="top-4.5 left-3 text-xs text-gray"
                label={"Last Name"}
                optional
                type="text"
                onChange={(e) => setValue((prev) => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
            <Input
              placeholder={"Enter your email"}
              error={error.email}
              label={"Email"}
              type="text"
              onChange={(e) => setValue((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Input
              placeholder={"Enter your password"}
              error={error.password}
              label={"Password"}
              type="password"
              password
              onChange={(e) => setValue((prev) => ({ ...prev, password: e.target.value }))}
            />
            <Checkbox id={"remember-me"} label={"Remember Me"} size={13} />
            <Button text="Create Account" className="!p-3 z-10" disabled={submiting} />
          </form>
          <p className="text-theme-reverse text-[13px]">
            Already have account?{" "}
            <a href="/signin" className="text-accent hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
      {/* RIGHT IN MD */}
      {width > 768 && (
        <div className="bg-linear-270 from-[#66B2FF] to-[#4F46E5] text-white text-center w-[50%] relative m-0" style={{ height: height }}>
          <div className="absolute left-[50%] top-[50%] -translate-[50%] gap-10 w-full items-center flex flex-col">
            <h1 className="text-3xl font-bold leading-7">Achieve Your Goals with AI</h1>
            <p className="text-[18px] max-w-[80%]">
              Join thousands of users who are crushing their goals with personalized AI guidance and smart task management.{" "}
            </p>
            <ul className="flex flex-col gap-8">
              {lists.map((list) => (
                <li className="flex gap-4">
                  <CheckCircleIcon /> {list}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
