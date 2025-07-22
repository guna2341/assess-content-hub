// components/TopicModal.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, FolderPlus } from "lucide-react";

export function TopicModal({
  isOpen,
  onClose,
  onSubmit,
  topicName,
  setTopicName,
  isSubTopic = false,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSubTopic ? (
              <>
                <FolderPlus className="h-5 w-5" />
                Add New Subtopic
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add New Topic
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic-name">
              {isSubTopic ? "Subtopic Name" : "Topic Name"}
            </Label>
            <Input
              id="topic-name"
              placeholder={`Enter ${isSubTopic ? "subtopic" : "topic"} name...`}
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!topicName.trim()}>
              {isSubTopic ? "Add Subtopic" : "Add Topic"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
