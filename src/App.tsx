import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./pages/Sign In/SignIn.tsx";
import SignUp from "./pages/Sign Up/SignUp.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import { UserProvider, ThemeProvider, NotificationProvider, GoalProvider, TaskProvider } from "./contexts/UseContexts.tsx";
import GoalPage from "./pages/Goal Pages/GoalPage.tsx";
import Layout from "./Layout/Layout.tsx";
import { EditGoalPage } from "./pages/Goal Pages/EditGoalPage.tsx";
import { EditTaskPage } from "./pages/Task Pages/EditTaskPage.tsx";
import { CreateTaskPage } from "./pages/Task Pages/CreateTaskPage.tsx";
import SidebarGoalLayout from "./Layout/SidebarGoalLayout.tsx";
import SidebarUserLayout from "./Layout/SidebarUserLayout.tsx";
import { CreateGoalPage } from "./pages/Goal Pages/CreateGoalPage.tsx";
import { SettingsPage } from "./pages/Settings/SettingsPage.tsx";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <GoalProvider>
          <ThemeProvider>
            <TaskProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/signin" index element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />

                  <Route path="/" element={<Layout />}>
                    <Route path="/" element={<SidebarUserLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="/goal/create" element={<CreateGoalPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/task/:taskId/edit" element={<EditTaskPage />} />
                    </Route>

                    <Route path="/" element={<SidebarGoalLayout />}>
                      <Route path="/goal/:goalId" element={<GoalPage />} />
                      <Route path="/goal/:goalId/edit" element={<EditGoalPage />} />
                      <Route path="/task/create" element={<CreateTaskPage />} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </TaskProvider>
          </ThemeProvider>
        </GoalProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
