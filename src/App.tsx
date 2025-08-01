import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./pages/Sign In/SignIn.tsx";
import SignUp from "./pages/Sign Up/SignUp.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import { UserProvider, ThemeProvider, NotificationProvider, GoalProvider, TaskProvider, SearchProvider } from "./contexts/UseContexts.tsx";
import GoalPage from "./pages/Goal Pages/GoalPage.tsx";
import Layout from "./Layout/Layout.tsx";
import { EditGoalPage } from "./pages/Goal Pages/EditGoalPage.tsx";
import { EditTaskPage } from "./pages/Task Pages/EditTaskPage.tsx";
import { CreateTaskPage } from "./pages/Task Pages/CreateTaskPage.tsx";
import SidebarGoalLayout from "./Layout/SidebarGoalLayout.tsx";
import SidebarUserLayout from "./Layout/SidebarUserLayout.tsx";
import { CreateGoalPage } from "./pages/Goal Pages/CreateGoalPage.tsx";
import { SettingsPage } from "./pages/Settings/SettingsPage.tsx";
import SidebarTaskLayout from "./Layout/SidebarTaskLayout.tsx";
import { InfoTaskPage } from "./pages/Task Pages/InfoTaskPage.tsx";
import { InfoGoalPage } from "./pages/Goal Pages/InfoGoalPage.tsx";
import { Profile } from "./pages/Profile/Profile.tsx";
import { SearchPage } from "./pages/Search/SearchPage.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const API_URL = import.meta.env.VITE_API_URL_DEV_LOCAL;

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <GoalProvider>
          <ThemeProvider>
            <TaskProvider>
              <SearchProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/signin" index element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    <Route path="/" element={<Layout />}>
                      <Route path="/" element={<SidebarUserLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/goal/create" element={<CreateGoalPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/search" element={<SearchPage />} />
                      </Route>

                      <Route path="/" element={<SidebarGoalLayout />}>
                        <Route path="/goal/:goalId/info" element={<InfoGoalPage />} />
                        <Route path="/goal/:goalId" element={<GoalPage />} />
                        <Route path="/goal/:goalId/edit" element={<EditGoalPage />} />
                        <Route path="/task/create" element={<CreateTaskPage />} />
                      </Route>

                      <Route path="/" element={<SidebarTaskLayout />}>
                        <Route path="/task/:taskId/edit" element={<EditTaskPage />} />
                        <Route path="/task/:taskId/info" element={<InfoTaskPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </SearchProvider>
            </TaskProvider>
          </ThemeProvider>
        </GoalProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
