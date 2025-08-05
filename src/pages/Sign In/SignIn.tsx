import React, { useState } from "react";
import Input from "@/components/Inputs/Input";
import Checkbox from "@/components/Inputs/Checkbox";
import GoogleAuth from "@/components/Inputs/GoogleAuth";
import { useViewportWidth, useViewportHeight } from "@/hooks/useViewport";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import callApi from "@/utils/callApi";
import { handleFormError } from "@/utils/errorHandler";
import ButtonV from "@/components/Inputs/ButtonV";
import type { TError, TSignIn } from "@/types/types";
import { useUserData } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";

const defaultError = {
  email: "",
  password: "",
  rememberMe: false,
  error: null,
};

const SignIn = () => {
  const [value, setValue] = useState<TSignIn>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<TSignIn & TError>(defaultError);
  const [submiting, setSubmiting] = useState(false);

  const { handleChangeForm, validateForm } = useValidate(value, error, setValue, setError);
  const { clearError, setData } = useUserData();

  const width = useViewportWidth(300);
  const height = useViewportHeight();
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);
    setError(defaultError);

    const validate = validateForm({ email: { regex: true }, password: { min: 8 } });
    if (validate) {
      setSubmiting(false);
      return;
    }

    try {
      const response = await callApi("/auth/signin", { method: "POST", body: value });
      setData(response.data);
      navigate("/");
    } catch (err) {
      handleFormError(err, setError);
    } finally {
      setSubmiting(false);
      clearError();
    }
  };

  const lists = ["Pick up where you left off", "Access your personalized dashboard", "Continue tracking your progress", "Get AI-powered insights"];
  return (
    <div className="flex justify-center lg:justify-between items-center px-5 lg:px-0 bg-theme text-theme-reverse">
      {/* LEFT IN LG */}
      <div className="my-7 flex flex-col justify-center items-center gap-5" style={{ width: width > 1024 ? "50%" : "100%" }}>
        <div className="flex flex-col text-center gap-2">
          <h1 className="font-bold text-2xl leading-8 font-heading">
            <span className="text-primary">Goal</span>Pilot
          </h1>
          <p>Welcome back! Sign in to continue and achieve your goals</p>
        </div>
        <div className="border-1 bg-theme-dark border-theme-darker pt-5 text-center rounded-[12px] gap-6 flex flex-col justify-center p-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:w-[70%] w-full">
          <h1 className="font-bold text-2xl text-theme-reverse font-heading mb-4">Sign in</h1>
          <div className="gap-5 flex flex-col justify-center text-center">
            <GoogleAuth label={"Sign in with Google"} />
            <div className="flex justify-center relative">
              <div className="relative border w-full border-gray" />
              <p className="absolute left-[50%] top-[50%] -translate-[50%] bg-theme-dark px-1 text-gray text-[13px]">Or continue with</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="gap-5 flex flex-col justify-center">
            <Input
              value={value.email}
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              placeholder={"Enter your email"}
              error={error.email}
              label={"email"}
              type="text"
              onChange={(e) => handleChangeForm({ email: e.target.value }, { regex: true })}
            />
            <Input
              value={value.password}
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              placeholder={"Enter your password"}
              error={error.password}
              label={"password"}
              type="password"
              password
              onChange={(e) => handleChangeForm({ password: e.target.value }, { min: 8 })}
            />
            <div className="flex justify-between">
              <Checkbox
                id={"remember-me"}
                checked={value.rememberMe}
                label={"Remember Me"}
                size={13}
                onChange={(e) => handleChangeForm({ rememberMe: e.target.checked })}
              />
              <a href="/forgot-password" className="text-accent hover:underline text-[13px]">
                Forgot Password?
              </a>
            </div>
            <ButtonV text="Sign In" disabled={submiting} className="!p-3 z-10" />
          </form>
          <p className="text-theme-reverse text-[13px]">
            Don't have an account?{" "}
            <a href="/signup" className="text-accent hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
      {/* RIGHT IN LG */}
      {width > 768 && (
        <div className="bg-linear-90 from-[#66B2FF] to-[#4F46E5] text-white text-center w-[50%] relative" style={{ height: height }}>
          <div className="absolute left-[50%] top-[50%] -translate-[50%] gap-10 w-full items-center flex flex-col">
            <h1 className="text-3xl font-bold leading-7">Welcome Back to GoalPilot</h1>
            <p className="text-[18px] max-w-[80%]">
              Continue your journey towards achieving your goals with personalized AI guidance and smart task management.
            </p>
            <ul className="flex flex-col gap-8">
              {lists.map((list) => (
                <li className="flex gap-4" key={list}>
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
