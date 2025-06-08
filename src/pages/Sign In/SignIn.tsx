import React, { useState } from "react";
import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import GoogleAuth from "../../components/GoogleAuth";
import { useViewportWidth, useViewportHeight } from "../../../hooks/useViewport";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import ErrorPopUp from "../../components/ErrorPopUp";
import callApi from "../../../utils/callApi";
import errorHandler from "../../../utils/errorHandler";

type Value = {
  email: string;
  password: string;
};

type Error = {
  email: string | null;
  password: string | null;
  error: {
    message: string | undefined;
    title: string | undefined;
  } | null;
};

const validateForm = (value: Value, setError: React.Dispatch<React.SetStateAction<Error>>) => {
  let err;
  // Custom requires
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.email)) {
    setError((prev) => ({ ...prev, email: "Please input a valid email" }));
    err = true;
  }

  //  Validate requires of email
  if (value.email.trim() === "") {
    setError((prev) => ({ ...prev, email: "Email is required" }));
    err = true;
  }
  //  Validate requires of password
  if (value.password.trim() === "") {
    setError((prev) => ({ ...prev, password: "Password is required" }));
    err = true;
  }

  return err;
};

const SignIn = () => {
  const [value, setValue] = useState<Value>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Error>({ email: null, password: null, error: null });
  const [submiting, setSubmiting] = useState(false);
  const width = useViewportWidth(300);
  const height = useViewportHeight();
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);
    setError({ email: null, password: null, error: null });

    const validate = validateForm(value, setError);
    if (validate) {
      setSubmiting(false);
      return;
    }

    try {
      const response = await callApi("/auth/signin", { method: "POST", body: value });
      const form = e.target as HTMLFormElement;
      const rememberMe = form.querySelector<HTMLInputElement>("#remember-me");
      if (rememberMe?.checked) {
        localStorage.setItem("jwt-token", response.data.token);
        sessionStorage.removeItem("jwt-token");
      } else {
        sessionStorage.setItem("jwt-token", response.data.token);
        localStorage.removeItem("jwt-token");
      }
      navigate("/");
    } catch (err) {
      errorHandler(err, setError)
    } finally {
      setSubmiting(false);
    }
  };

  const lists = ["Pick up where you left off", "Access your personalized dashboard", "Continue tracking your progress", "Get AI-powered insights"];
  return (
    <div className="flex justify-center lg:justify-between items-center">
      {error.error && <ErrorPopUp message={error.error.message} title={error.error.title} />}
      {/* LEFT IN LG */}
      <div className="my-7 flex flex-col justify-center items-center gap-5" style={{ width: width > 1024 ? "50%" : "100%" }}>
        <div className="flex flex-col text-center gap-2">
          <h1 className="font-bold text-2xl leading-8">
            <span className="text-(--accent)">Goal</span>Pilot
          </h1>
          <p>Welcome back! Sign in to continue and achieve your goals</p>
        </div>
        <div className="border-1 bg-(--theme) border-(--theme-darker) pt-5 text-center rounded-[12px] gap-10 flex flex-col justify-center p-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:w-[70%] w-full">
          <form onSubmit={handleSubmit} className="gap-5 flex flex-col justify-center">
            <h1 className="font-bold text-2xl text-(--theme-reverse)">Sign in</h1>
            <Input
              placeholder={"Enter your email"}
              error={error.email}
              label={"email"}
              type="text"
              onChange={(e) => setValue((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Input
              placeholder={"Enter your password"}
              error={error.password}
              label={"password"}
              type="password"
              password
              onChange={(e) => setValue((prev) => ({ ...prev, password: e.target.value }))}
            />
            <div className="flex justify-between">
              <Checkbox id={"remember-me"} label={"Remember Me"} size={13} />
              <a href="/forgot-password" className="text-(--accent) hover:underline text-[13px]">
                Forgot Password?
              </a>
            </div>
            <button disabled={submiting} className="cursor-pointer rounded-[8px] bg-(--accent) text-(--theme) p-3 disabled:opacity-70 disabled:cursor-progress">Sign In</button>
          </form>
          <div className="gap-5 flex flex-col justify-center text-center">
            <div className="flex justify-center relative">
              <div className="relative border w-full border-(--gray)" />
              <p className="absolute left-[50%] top-[50%] -translate-[50%] bg-(--theme) px-1 text-(--gray) text-[13px]">Or continue with</p>
            </div>
            <GoogleAuth label={"Sign in with Google"} />
            <p className="text-(--theme-reverse) text-[13px]">
              Don't have an account?{" "}
              <a href="/signup" className="text-(--accent) hover:underline">
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* RIGHT IN LG */}
      {width > 768 && (
        <div className="bg-linear-90 from-[#66B2FF] to-[#4F46E5] text-(--white) text-center w-[50%] relative" style={{ height: height }}>
          <div className="absolute left-[50%] top-[50%] -translate-[50%] gap-10 w-full items-center flex flex-col">
            <h1 className="text-3xl font-bold leading-7">Welcome Back to GoalPilot</h1>
            <p className="text-[18px] max-w-[80%]">
              Continue your journey towards achieving your goals with personalized AI guidance and smart task management.
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

export default SignIn;
