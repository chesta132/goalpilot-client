import { useEffect } from "react";
import { useNavigate } from "react-router";

const Callback = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  useEffect(() => {
    // Clear the URL parameters after retrieving the token
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token) {
      localStorage.setItem("jwt-token", token);
      sessionStorage.removeItem("jwt-token");
      navigate("/");
    } else navigate("/signin");
  }, [navigate, token]);
  return <div></div>;
};

export default Callback;
