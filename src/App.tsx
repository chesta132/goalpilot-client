import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./pages/Sign In/SignIn.tsx";
import SignUp from "./pages/Sign Up/SignUp.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Callback from "./pages/Google Callback/Callback.tsx";
import { UserProvider, ThemeProvider, NotificationProvider, GoalProvider, TaskProvider } from "./contexts/UseContexts.tsx";
import GoalPage from "./pages/Goal Pages/GoalPage.tsx";
import Layout from "./Layout.tsx";
import { EditGoalPage } from "./pages/Goal Pages/EditGoalPage.tsx";
import { EditTaskPage } from "./pages/Task Pages/EditTaskPage.tsx";
import { CreateTaskPage } from "./pages/Task Pages/CreateTaskPage.tsx";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <ThemeProvider>
          <GoalProvider>
            <TaskProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/signin" index element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />

                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/google/callback" element={<Callback />} />

                    <Route path="/goal/:goalId" element={<GoalPage />} />
                    <Route path="/goal/:goalId/edit" element={<EditGoalPage />} />

                    <Route path="/task/create" element={<CreateTaskPage />} />
                    <Route path="/task/:taskId/edit" element={<EditTaskPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TaskProvider>
          </GoalProvider>
        </ThemeProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
