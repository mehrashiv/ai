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
import { Pencil } from "lucide-react"
import { updateTask } from "@/lib/actions"

export function EditTask({ task }) {
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Pencil className="w-4 h-4 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>
              Make changes to your task  here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <form action={updateTask}>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={task.title} />
            </Field>
            <Field>
              <Label htmlFor="completed">Username</Label>
              <Input id="completed" name="completed" defaultValue={task.completed} />
              <Input type="hidden" name="id" value={task.id} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button type="submit">Save changes</Button>
            </DialogClose>

          </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}
