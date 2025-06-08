import { useState } from "react";
import Input from "../../components/Input.tsx";
import Checkbox from "../../components/Checkbox.tsx";
import GoogleAuth from "../../components/GoogleAuth.tsx";
import { useViewportWidth, useViewportHeight } from "../../../hooks/useViewport.ts";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import ErrorPopUp from "../../components/ErrorPopUp.tsx";
import callApi from "../../../utils/callApi";

type Value = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SetError = React.Dispatch<
  React.SetStateAction<{
    email: string | null;
    password: string | null;
    username: string | null;
    firstName: string | null;
    error: {
      message: string;
      title: string;
    } | null;
  }>
>;

type Error = {
  email: string | null;
  password: string | null;
  username: string | null;
  firstName: string | null;
  error: {
    message: string | undefined;
    title: string | undefined;
  } | null;
};

const validateForm = (value: Value, setError: SetError): boolean | undefined => {
  let err;
  // Custom requires
  if (value.username.includes(" ")) {
    setError((prev) => ({ ...prev, username: "Username can't have spaces" }));
    err = true;
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.email)) {
    setError((prev) => ({ ...prev, email: "Please input a valid email" }));
    err = true;
  }

  if (value.email.includes(" ")) {
    setError((prev) => ({ ...prev, email: "Email can't have spaces" }));
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

  // Validate requires of username
  if (value.username.trim() === "") {
    setError((prev) => ({ ...prev, username: "Username is required" }));
    err = true;
  }

  // Validate requires of first name
  if (value.firstName.trim() === "") {
    setError((prev) => ({ ...prev, firstName: "First name is required" }));
    err = true;
  }

  return err;
};

const SignUp = () => {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<Error>({ email: null, password: null, username: null, firstName: null, error: null });
  const [submiting, setSubmiting] = useState(false);
  const width = useViewportWidth(300);
  const height = useViewportHeight();
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmiting(true);
    setError({ email: null, password: null, username: null, firstName: null, error: null });

    const validate = validateForm(value, setError as SetError);
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
      interface ErrorResponse {
        code?: string;
        message: string;
        name?: string;
      }
      const response: ErrorResponse | undefined = (err as { data?: ErrorResponse })?.data;
      if (response?.code === "EMAIL_UNAVAILABLE") setError((prev) => ({ ...prev, email: response.message }));
      else if (response?.code === "USERNAME_UNAVAILABLE") setError((prev) => ({ ...prev, username: response.message }));
      else if (response) {
        setError((prev) => ({
          ...prev,
          error: { message: response.message, title: response.name ?? "Error" },
        }));
      }
    } finally {
      setSubmiting(false);
    }
  };

  const lists = ["Pick up where you left off", "Access your personalized dashboard", "Continue tracking your progress", "Get AI-powered insights"];
  return (
    <div className="flex flex-row-reverse justify-center lg:justify-between items-center h-full m-0 p-0">
      <div className="flex flex-col justify-center items-center gap-5 py-10" style={{ width: width > 1024 ? "50%" : "100%" }}>
        {error.error && <ErrorPopUp message={error.error.message} title={error.error.title} />}
        <div className="flex flex-col text-center gap-2">
          <h1 className="font-bold text-2xl leading-8">
            <span className="text-(--accent)">Goal</span>Pilot
          </h1>
          <p>Create your account to start achieving your goals</p>
        </div>
        <div className="border-1 bg-(--theme) border-(--theme-darker) pt-5 text-center rounded-[12px] gap-10 flex flex-col justify-center p-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:w-[70%] w-[90%] mb-10">
          <form onSubmit={handleSubmit} className="gap-3.5 flex flex-col justify-center">
            <h1 className="font-bold text-2xl text-(--theme-reverse)">Sign up</h1>
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
                error={error.firstName}
                label={"First Name"}
                type="text"
                onChange={(e) => setValue((prev) => ({ ...prev, firstName: e.target.value }))}
              />
              <Input
                placeholder={"Enter your last name"}
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
            <button disabled={submiting} className="cursor-pointer rounded-[8px] bg-(--accent) text-(--theme) p-3 disabled:opacity-70 disabled:cursor-progress">Create Account</button>
          </form>
          <div className="gap-5 flex flex-col justify-center text-center">
            <div className="flex justify-center relative">
              <div className="relative border w-full border-(--gray)" />
              <p className="absolute left-[50%] top-[50%] -translate-[50%] bg-(--theme) px-1 text-(--gray) text-[13px]">Or continue with</p>
            </div>
            <GoogleAuth label={"Sign up with Google"} />
            <p className="text-(--theme-reverse) text-[13px]">
              Already have account?{" "}
              <a href="/signin" className="text-(--accent) hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* RIGHT IN MD */}
      {width > 768 && (
        <div className="bg-linear-270 from-[#66B2FF] to-[#4F46E5] text-(--white) text-center w-[50%] relative m-0" style={{ height: height }}>
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
