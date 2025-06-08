import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Nav from "../../components/Nav/Nav";
import callApi from "../../../utils/callApi";

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
  const [data, setData] = useState(null);
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
        if (error instanceof Error) {
          const response = (error as { response?: { data?: ErrorResponse } })?.response?.data;
          if (response?.code === "TOKEN_EXPIRED") {
            localStorage.removeItem("jwt-token");
            sessionStorage.removeItem("jwt-token");
            navigate("/signin");
          } else if (response?.code === "USER_NOT_FOUND") {
            localStorage.removeItem("jwt-token");
            sessionStorage.removeItem("jwt-token");
            navigate("/signin");
          }
          setError({ title: response?.name, message: response?.message, code: response?.code });
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [navigate]);

  useEffect(() => {
    // Heartbeat to keep the session alive
    const interval = setInterval(() => {
      callApi("/user/heartbeat", { method: "PATCH", token: true });
    }, 50000); // 50 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Nav data={data} param={params.goalId} />
      <div className="h-[200vh]"></div>
    </div>
  );
};

export default Dashboard;
