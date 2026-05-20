import ButtonAppBar from "./components/ButtonAppBar";
import DashboardCard from "./components/DashboardCard";
import BasicTable from "./components/BasicTable";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PendingFeesTable from "./components/PendingFeesTable";
import StudentDetailsPage from "./components/StudentDetailsPage";
import Login from "./Login";
import Signup from "./Signup";
import VerifyEmail from "./VerifyEmail";
import { ToastProvider } from "./components/ToastProvider";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ButtonAppBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardCard />
              </PrivateRoute>
            }
          />

          <Route
            path="/students"
            element={
              <PrivateRoute>
                <BasicTable />
              </PrivateRoute>
            }
          />

          <Route
            path="/pending"
            element={
              <PrivateRoute>
                <PendingFeesTable />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/:id"
            element={
              <PrivateRoute>
                <StudentDetailsPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
