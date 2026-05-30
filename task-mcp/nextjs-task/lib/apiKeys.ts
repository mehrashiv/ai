// lib/actions/apiKeys.ts
"use server"

import { getServerSession } from "@/lib/getServerSession"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { randomBytes, createHash } from "crypto"

function generateKey(): string {
    return `task_${randomBytes(32).toString("hex")}`
}

function hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex")
}

export async function createApiKey(formData: FormData) {
    const session = await getServerSession()
    if (!session?.user) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    if (!name) throw new Error("Name is required")

    const rawKey = generateKey()
    const hashedKey = hashKey(rawKey)

    await prisma.apiKey.create({
        data: {
            key: hashedKey,
            name,
            userId: session.user.id,
        },
    })

    revalidatePath("/settings/api-keys")

    // Return raw key — this is the only time it's available
    return { rawKey }
}

export async function deleteApiKey(formData: FormData) {
    const session = await getServerSession()
    if (!session?.user) throw new Error("Unauthorized")

    const id = formData.get("id") as string

    await prisma.apiKey.delete({
        where: {
            id,
            userId: session.user.id,
        },
    })

    revalidatePath("/settings/api-keys")
}

export async function getApiKeys() {
    const session = await getServerSession()
    if (!session?.user) throw new Error("Unauthorized")

    return prisma.apiKey.findMany({
        where: { userId: session.user.id },
        select: {
            id: true,
            name: true,
            createdAt: true,
            lastUsed: true,
            expiresAt: true,
            // key is intentionally excluded
        },
        orderBy: { createdAt: "desc" },
    })
}