import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addTask } from "@/lib/actions"

export function AddTask() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Add Task</CardTitle>
        <CardDescription>
          Add your tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={addTask}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                type="text"
                placeholder="Set up a meeting with John"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="completed">Completed</Label>
              </div>
              <Input name="completed" id="completed" type="boolean" required />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </div>
          </div>
            </div>
        </form>
      </CardContent>
    </Card>
  )
}
