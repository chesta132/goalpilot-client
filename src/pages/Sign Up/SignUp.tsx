import { useState } from "react";
import Input from "@/components/Inputs/Input";
import Checkbox from "@/components/Inputs/Checkbox";
import GoogleAuth from "@/components/Inputs/GoogleAuth";
import { useViewportWidth, useViewportHeight } from "@/hooks/useViewport.ts";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import ErrorPopUp from "@/components/Popups/ErrorPopup";
import callApi from "@/utils/callApi.ts";
import { handleFormError } from "@/utils/errorHandler.ts";
import ButtonV from "@/components/Inputs/ButtonV";
import type { TSignUp, TError } from "@/types/types";
import { useUserData } from "@/contexts/UseContexts";
import useValidate from "@/hooks/useValidate";

const defaultValue = { username: "", email: "", password: "", firstName: "", lastName: "", rememberMe: false, verifyPassword: "" };
const defaultError = { ...defaultValue, error: null };

const SignUp = () => {
  const [value, setValue] = useState<TSignUp>(defaultValue);
  const [error, setError] = useState<TSignUp & TError>(defaultError);
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

    const validate = validateForm({
      email: { regex: true },
      password: { min: 8 },
      username: { noSpace: true, isLower: true },
      firstName: true,
      verifyPassword: true,
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
    <div className="flex flex-row-reverse justify-center lg:justify-between items-center h-full m-0 p-0 bg-theme text-theme-reverse">
      <div className="flex flex-col justify-center items-center gap-5 py-10" style={{ width: width > 1024 ? "50%" : "100%" }}>
        {error.error && <ErrorPopUp error={error} showBackToDashboard={false} showBackToLoginPage={false} />}
        <div className="flex flex-col text-center gap-2">
          <h1 className="font-bold text-2xl leading-8 font-heading">
            <span className="text-primary">Goal</span>Pilot
          </h1>
          <p>Create your account to start achieving your goals</p>
        </div>
        <div className="border-1 bg-theme-dark border-theme-darker text-center rounded-[12px] gap-6 flex flex-col justify-center py-8 px-4 md:px-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:w-[70%] w-[90%] mb-10">
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
              value={value.username}
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              placeholder={"Enter your username"}
              error={error.username}
              label={"Username"}
              type="text"
              onChange={(e) => handleChangeForm({ username: e.target.value }, { isLower: true, noSpace: true })}
            />
            <div className="flex flex-1/2 gap-3">
              <Input
                value={value.firstName}
                labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
                placeholder={"Enter your first name"}
                labelClass="top-4.5 left-3 text-xs text-gray"
                error={error.firstName}
                label={"First Name"}
                type="text"
                onChange={(e) => handleChangeForm({ firstName: e.target.value })}
              />
              <Input
                value={value.lastName}
                labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
                placeholder={"Enter your last name"}
                labelClass="top-4.5 left-3 text-xs text-gray"
                label={"Last Name"}
                optional
                type="text"
                onChange={(e) => handleChangeForm({ lastName: e.target.value })}
              />
            </div>
            <Input
              value={value.email}
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              placeholder={"Enter your email"}
              error={error.email}
              label={"Email"}
              type="text"
              onChange={(e) => handleChangeForm({ email: e.target.value }, { regex: true })}
            />
            <Input
              value={value.password}
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              placeholder={"Enter your password"}
              error={error.password}
              label={"Password"}
              type="password"
              password
              onChange={(e) => handleChangeForm({ password: e.target.value }, { min: 8 })}
            />
            <Input
              value={value.verifyPassword}
              labelFocus="-top-2.5 left-3 text-xs text-accent font-medium bg-theme-dark px-1"
              placeholder={"Verify your password"}
              error={error.verifyPassword}
              label={"Verify Password"}
              type="password"
              onChange={(e) => handleChangeForm({ verifyPassword: e.target.value })}
            />
            <Checkbox
              className="w-fit"
              id={"remember-me"}
              label={"Remember Me"}
              checked={value.rememberMe}
              size={13}
              onChange={(e) => handleChangeForm({ rememberMe: e.target.checked })}
            />
            <ButtonV text="Create Account" className="!p-3 z-10" disabled={submiting} />
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

export default SignUp;
