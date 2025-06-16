import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./pages/Sign In/SignIn.tsx";
import SignUp from "./pages/Sign Up/SignUp.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Callback from "./pages/Google Callback/Callback.tsx";
import { UserProvider, ThemeProvider, NotificationProvider } from "./contexts/UseContexts.tsx";
import GoalPage from "./pages/Goal Page/GoalPage.tsx";
import Layout from "./Layout.tsx";

const App = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/signin" index element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/google/callback" element={<Callback />} />
                <Route path="/goal/:goalId" element={<GoalPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
