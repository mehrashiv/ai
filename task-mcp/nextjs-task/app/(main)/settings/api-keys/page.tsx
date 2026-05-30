// app/settings/api-keys/page.tsx
import { getApiKeys } from "@/lib/apiKeys"
import { ApiKeysClient } from "./ApiKeysClient"

export default async function ApiKeysPage() {
  const apiKeys = await getApiKeys()
  return <ApiKeysClient initialKeys={apiKeys} />
}