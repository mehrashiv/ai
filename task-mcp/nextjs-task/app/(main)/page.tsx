import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";
import { getTasks } from "@/lib/actions";
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditTask } from "@/components/editTask";
import { DeleteTask } from "@/components/deleteTask";
import { Badge } from "@/components/ui/badge"
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



export default async function Home() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login")
  }
  const tasks = await getTasks();

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your work
          </p>
        </div>
        <Link href="/addtask">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      {/* Task Table */}
      <div>
        <Table>
          <TableCaption>All your tasks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Task Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={task.completed ? "secondary" : "default"}>
                      {task.completed ? "Done" : "In progress"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="flex justify-end gap-3">
                  <EditTask task={task}/>
                  <DeleteTask task={task}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>  
      </div>
    </div>
  );
}