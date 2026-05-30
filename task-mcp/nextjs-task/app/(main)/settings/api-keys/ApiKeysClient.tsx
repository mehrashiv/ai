// app/settings/api-keys/ApiKeysClient.tsx
"use client"

import { useState } from "react"
import { createApiKey, deleteApiKey } from "@/lib/apiKeys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Trash2, Plus, Key } from "lucide-react"
import { getApiKeys } from "@/lib/apiKeys"

type ApiKey = {
  id: string
  name: string
  createdAt: Date
  lastUsed: Date | null
  expiresAt: Date | null
}

export function ApiKeysClient({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState(initialKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!newKeyName.trim()) return
    setLoading(true)

    const formData = new FormData()
    formData.append("name", newKeyName)

    const result = await createApiKey(formData)
    setRevealedKey(result.rawKey)
    setNewKeyName("")

    // Fetch real keys from server instead of using a fake entry
    const updated = await getApiKeys()
    setKeys(updated)
    
    setLoading(false)
}

  async function handleDelete(id: string) {
    const formData = new FormData()
    formData.append("id", id)
    await deleteApiKey(formData)
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  async function handleCopy() {
    if (!revealedKey) return
    await navigator.clipboard.writeText(revealedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <p className="text-sm text-muted-foreground">
          Manage API keys for external access via MCP
        </p>
      </div>

      {/* Revealed key banner */}
      {revealedKey && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800">
              API Key Created — Copy it now, it won't be shown again
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-white p-2 text-xs break-all border">
                {revealedKey}
              </code>
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 text-xs text-muted-foreground"
              onClick={() => setRevealedKey(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create new key */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Create New Key</CardTitle>
          <CardDescription>Give it a name so you know what it's for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="keyName" className="sr-only">Key name</Label>
              <Input
                id="keyName"
                placeholder="e.g. OpenWebUI"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
              />
            </div>
            <Button onClick={handleCreate} disabled={loading || !newKeyName.trim()} className="gap-2">
              <Plus className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing keys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <Key className="h-8 w-8" />
              <p className="text-sm">No API keys yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {keys.map(k => (
                <div key={k.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{k.name}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                      {k.lastUsed && (
                        <span>· Last used {new Date(k.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Active</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(k.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}