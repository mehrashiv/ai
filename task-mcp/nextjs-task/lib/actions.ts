"use server"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";
import { getServerSession } from "./getServerSession";
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function signUpUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    })
    redirect('/');
}

export async function signInUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    })
    redirect('/');
}

export async function addTask(formData: FormData) {
    const session = await getServerSession();
    if (!session?.user) throw new Error("Unauthorized");

    const data = {
        task_name: formData.get("title"),
        task_completed: formData.get("completed") == "true",
    };

    const task = await prisma.task.create({
        data: {
            title: data.task_name as string,
            completed: data.task_completed as boolean,
            userId: session.user.id,
        },
    });

    // revalidatePath('/')
    redirect('/');
}

export async function getTasks() {
    const session = await getServerSession();
    if (!session?.user) throw new Error("Unauthorized");
    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
                },
            orderBy: {
                createdAt: "desc",
                },
        })

        return tasks
    } catch (error) {
        console.error("Error fetching tasks:", error)
        throw new Error("Failed to fetch tasks")
        }
    }

export async function updateTask(formData: FormData) {
    const session = await getServerSession();
    if (!session?.user) throw new Error("Unauthorized");
    const data = {
        task_name: formData.get("title"),
        task_completed: formData.get("completed") == "true",
        task_id: formData.get("id") as string,
    };

    const task = await prisma.task.update({
        where: { 
            id: data.task_id,
            userId: session.user.id,
        },
        data: {
            title: data.task_name as string,
            completed: data.task_completed as boolean,
        },
    });

    revalidatePath('/')
}

export async function deleteTask(formData: FormData) {
    const session = await getServerSession();
    if (!session?.user) throw new Error("Unauthorized");

    await prisma.task.delete({
        where: {
            id: formData.get("id") as string,
            userId: session.user.id,
        },
    });

    revalidatePath('/');
}