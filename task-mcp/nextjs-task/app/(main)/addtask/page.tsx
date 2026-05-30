import { AddTask } from "@/components/addTask";
import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";
export default async function addTask() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login")
  } else 
  return (
    <div className="min-h-screen flex items-center justify-center">
        <AddTask />
    </div>
  );
}