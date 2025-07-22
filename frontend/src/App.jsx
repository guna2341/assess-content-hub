import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import {AssessmentDetailPage} from "./pages/students/assessmentPage";
import { AssessmentListPage } from "./pages/students/assessmentList";
import { AssessmentResultPage } from "./pages/students/result";
import { AssessmentResultDetailPage } from "./pages/students/resultDetailPage";
import QuestionCreator from "./pages/question-bank/CreateQuestionBankPage";
import { CommentsPage } from "./pages/commentsPage";
import { ProfilePage } from "./pages/profilePage";
import CreateLearningUnitsPage from "./pages/createLearningUnits";

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  let role = "admin";
  const routes = [
    {
      "admin": ["admin", "reviewer", "student"],
      "reviewer": ["reviewer", "student"],
      "student": ["student"]
    }
  ];
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <div className="h-screen">{children}</div> : <Navigate to="/login" replace />;
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
            {/* Content Management Routes */}
            <Route path="content" element={<ContentListPage />} />
            <Route path="content/create" element={<CreateContentPage />} />
            <Route path="content/:id" element={<ContentViewPage />} />
            <Route path="content/:id/edit" element={<ContentEditPage />} />

            <Route path="/profile" element={<ProfilePage/>} />

            {/* Question Management Routes */}
            <Route path="questions/create" element={
              <TooltipProvider>
              <QuestionCreator />
              </TooltipProvider>
              } />
            <Route path="question-bank" element={
              <QuestionBankPage />
              } />
            <Route path="reviews" element={<ReviewsPage />} />

            {/* Student Routes */}
            <Route path="learn" element={<StudentMaterialsPage />} />
            <Route path="assessments" element={<AssessmentListPage />} />
            <Route path="assessment/:assessmentId" element={<AssessmentDetailPage />}/>
            <Route path="/results" element={<AssessmentResultPage />} />
            <Route path="/assessment-result/:id" element={<AssessmentResultDetailPage />} />
            <Route path="learningUnits" element={<CreateLearningUnitsPage/>} />
            
            {/* Admin Routes */}
            <Route path="users" element={<div>Users Management Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
            <Route path="comments" element={<CommentsPage/>} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
);

export default App;
