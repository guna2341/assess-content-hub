import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CreateContentPage } from "@/pages/content/CreateContentPage";
import { ContentListPage } from "@/pages/content/ContentListPage";
import { QuestionBankPage } from "@/pages/question-bank/QuestionBankPage";
import { ReviewsPage } from "@/pages/reviews/ReviewsPage";
import { useAuthStore } from "@/stores/authStore";
import "./App.css";
import { ContentViewPage } from "./pages/content/contentViewPage";
import { ContentEditPage } from "./pages/content/ContentEditPage";
import { StudentMaterialsPage } from "./pages/students/learningUnits";
import { AssessmentDetailPage } from "./pages/students/assessmentPage";
import { AssessmentListPage } from "./pages/students/assessmentList";
import { AssessmentResultPage } from "./pages/students/result";
import { AssessmentResultDetailPage } from "./pages/students/resultDetailPage";
import QuestionCreator from "./pages/question-bank/CreateQuestionBankPage";
import { CommentsPage } from "./pages/commentsPage";
import { ProfilePage } from "./pages/profilePage";
import CreateLearningUnitsPage from "./pages/createLearningUnits";
import { UnauthorizedPage } from "./pages/auth/unauthorized";
import { NotFoundPage } from "./pages/auth/notFound";
import './api/interceptors/request'
import './api/interceptors/response';
import './api/utils/handleApiError';

const queryClient = new QueryClient();


function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, token } = useAuthStore();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }
    return <div>{children}</div>;
}



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            <Route path="content" element={
              <ProtectedRoute allowedRoles={["admin","reviewer"]}>
              <ContentListPage />
              </ProtectedRoute>
              } />

            <Route path="content/create" element={
              <ProtectedRoute allowedRoles={["admin"]} >
                <CreateContentPage />
              </ProtectedRoute>}
            />
            <Route path="content/:id" element={
              <ProtectedRoute allowedRoles={["admin","reviewer"]}>
                <ContentViewPage />
              </ProtectedRoute>} />
            <Route path="content/:id/edit" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ContentEditPage />
              </ProtectedRoute>
            } />
            <Route path="questions/create" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TooltipProvider>
                  <QuestionCreator />
                </TooltipProvider>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={<ProfilePage />} />


            <Route path="question-bank" element={
              <ProtectedRoute allowedRoles={["admin","reviewer"]}>
              <QuestionBankPage />
              </ProtectedRoute>
            } />
            <Route path="reviews" element={
              <ProtectedRoute allowedRoles={["admin","reviewer"]}>  
                <ReviewsPage />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="learn" element={<StudentMaterialsPage />} />
            <Route path="assessments" element={<AssessmentListPage />} />
            <Route path="assessment/:assessmentId" element={<AssessmentDetailPage />} />
            <Route path="/results" element={<AssessmentResultPage />} />
            <Route path="/assessment-result/:id" element={<AssessmentResultDetailPage />} />
            <Route path="learningUnits" element={
              <ProtectedRoute allowedRoles={["admin","reviewer"]}>
              <CreateLearningUnitsPage />
              </ProtectedRoute>
              } />

            <Route path="comments" element={
              <ProtectedRoute allowedRoles={["admin","reviewer"]} >
              <CommentsPage />
              </ProtectedRoute>
              } />
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
