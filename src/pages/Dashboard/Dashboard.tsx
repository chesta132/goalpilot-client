import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Nav from "../../components/Nav/Nav";
import callApi from "../../../utils/callApi";
import ErrorPopup from "../../components/ErrorPopUp";
import type { UserData } from "../../../utils/types";
import Loading from "../../components/Loading";
import { Plus } from "lucide-react";
import AddGoalPopup from "../../components/Add Goal Popup/AddGoalPopup";
import Button from "../../components/Button";
import errorHandler from "../../../utils/errorHandler";

type Error = {
  error: {
    title?: string;
    message?: string;
    code?: string;
  };
} | null;

type CreateGoalValue = {
  title: string;
  description: string;
  targetDate: Date | string;
  isPublic: boolean;
};

const Dashboard = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>(null);
  const [addNewGoalOpen, setAddNewGoalOpen] = useState(false);
  const [createGoalValue, setCreateGoalValue] = useState<CreateGoalValue>({ title: "", description: "", isPublic: true, targetDate: "" });
  const [createGoalSubmit, setCreateGoalSUbmit] = useState(0);

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
        errorHandler(error, setError);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [navigate]);

  useEffect(() => {
    const addData = async () => {
      if (createGoalValue.title) {
        const response = await callApi("/goal", { method: "POST", token: true, body: createGoalValue });
        setCreateGoalValue({ title: "", description: "", isPublic: true, targetDate: "" });
        setData((prev) => prev && { ...prev, goals: [response.data, ...prev.goals] });
      }
    };
    addData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGoalSubmit]);

  const errorAuth = error?.error.code === "TOKEN_EXPIRED" || error?.error.code === "USER_NOT_FOUND" || error?.error.code === "INVALID_AUTH";

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

  const existingGoals = data?.goals.filter((goal) => !goal.isRecycled);

  return (
    <div>
      <Nav data={data} param={params.goalId} />
      {error && (
        <ErrorPopup
          title={error.error.title}
          message={error.error.message}
          showBackToDashboard={!errorAuth}
          showBackToLoginPage={errorAuth}
          onBackToLoginPage={handleBackToLoginPage}
        />
      )}
      <div className="lg:pl-[22%] pt-22 px-6">
        <div>
          {existingGoals && existingGoals.length > 0 && (
            <>
              <h1 className="text-2xl font-bold p-3">My Goals</h1>
              <div className="flex flex-col gap-5">
                {existingGoals.map((goal) => (
                  <Link
                    to={`/goal/${goal._id}`}
                    key={goal._id}
                    className="w-full bg-(--theme) px-4 py-6 gap-5 flex flex-col border-(--gray) border rounded-md shadow-lg"
                  >
                    <div className="flex justify-between">
                      <h2>{goal.title}</h2>
                      <h2>{goal.progress}% Completed</h2>
                    </div>
                    <div className="bg-(--theme-darker) h-1.5 rounded-2xl">
                      <div className="bg-(--accent) h-1.5 rounded-2xl" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </Link>
                ))}
              </div>
            </>
            // tambahin kalo gada goalnya
          )}
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <Button text="Create New Goal" icon={<Plus />} onClick={() => setAddNewGoalOpen(true)} className="close-goal-popup-exception" />
        {addNewGoalOpen && (
          <AddGoalPopup
            setToClose={() => setAddNewGoalOpen(false)}
            submit={() => setCreateGoalSUbmit((prev) => (prev += 1))}
            value={createGoalValue}
            setValue={setCreateGoalValue}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
