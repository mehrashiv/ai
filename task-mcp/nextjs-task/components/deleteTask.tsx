import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { deleteTask } from "@/lib/actions"

export function DeleteTask({ task }) {
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete task</DialogTitle>
            <DialogDescription>
              Delete the task
            </DialogDescription>
          </DialogHeader>
          <form action={deleteTask}>
          <FieldGroup>
            Are you sure you want to delete the task
            <Field>
              <Input type="hidden" name="id" value={task.id} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="submit">Delete</Button>
            </DialogClose>

          </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}
