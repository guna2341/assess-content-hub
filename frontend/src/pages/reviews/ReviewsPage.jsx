import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ContentReviewsPage } from './ContentReviewsPage';
import { QuestionBankPage } from './questionsReviewPage';

export const ReviewsPage = () => {
  return (
    <Tabs defaultValue="reviews" className="w-full">
      <div className="flex items-center justify-between pb-4 w-full">
        <TabsList className="w-full">
          <TabsTrigger value="reviews" className="w-full">Content Reviews</TabsTrigger>
          <TabsTrigger value="questionBank" className="w-full">Question Bank</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="reviews">
        <ContentReviewsPage />
      </TabsContent>

      <TabsContent value="questionBank">
        <QuestionBankPage />
      </TabsContent>
    </Tabs>
  )
}