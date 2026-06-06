// src/App.tsx

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { JobListPage } from "./pages/jobs/JobListPage";
import { JobDetailPage } from "./pages/jobs/JobDetailPage";
import { CreateJobPage } from "./pages/recruiter/CreateJobPage";
import { UserRole } from "./types/auth.types";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getCurrentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // ✅ Check authentication on app mount
    const token = localStorage.getItem("token");

    if (token && !isInitialized) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isInitialized]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Navigate to="/jobs" replace />
            </Layout>
          }
        />

        <Route
          path="/jobs"
          element={
            <Layout>
              <JobListPage />
            </Layout>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <Layout>
              <JobDetailPage />
            </Layout>
          }
        />

        {/* Recruiter routes */}
        <Route
          path="/recruiter/jobs/create"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Recruiter, UserRole.Admin]}>
              <Layout>
                <CreateJobPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to jobs */}
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
