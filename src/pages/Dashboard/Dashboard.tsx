import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Nav from "../../components/Nav/Nav";
import callApi from "../../../utils/callApi";
import ErrorPopup from "../../components/ErrorPopUp";
import type { UserData } from "../../../utils/types";
import Loading from "../../components/Loading";

type ErrorResponse = {
  title: string;
  message: string;
  code: string;
  name: string;
};

type Error = {
  title?: string;
  message?: string;
  code?: string;
} | null;

const Dashboard = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // Fetch data for the dashboard
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await callApi(`/user`, { method: "PATCH", token: true });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        const response = (error as { data?: ErrorResponse })?.data;
        setError({ title: response?.name, message: response?.message, code: response?.code });
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [navigate]);

  const errorAuth = error?.code === "TOKEN_EXPIRED" || error?.code === "USER_NOT_FOUND" || error?.code === "INVALID_AUTH";

  const handleBackToLoginPage = () => {
    sessionStorage.removeItem("jwt-token");
    localStorage.removeItem("jwt-token");
    navigate("/signin");
  };

  useEffect(() => {
    // Heartbeat to keep the session alive
    const interval = setInterval(() => {
      callApi("/user/heartbeat", { method: "PATCH", token: true });
    }, 50000); // 50 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Nav data={data} param={params.goalId} />
      {error && (
        <ErrorPopup
          title={error.title}
          message={error.message}
          showBackToDashboard={!errorAuth}
          showBackToLoginPage={errorAuth}
          onBackToLoginPage={handleBackToLoginPage}
        />
      )}
    </div>
  );
};

export default Dashboard;
