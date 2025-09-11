import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import { restoreTag } from "@/actions/tag"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type RestoreTagResult = AdminMutationResult & {
  tag?: {
    id: number
    name: string
    description: string
    created_at: Date
    updated_at: Date
    destroyed_at: Date | null
  }
}

const tagConfig = {
  entityName: "Tag",
  queryKey: "tags",
  displayNameFn: (tag: unknown) => (tag as { name: string }).name
}

export const useRestoreTag = createAdminRestoreHook<RestoreTagResult>(
  tagConfig,
  restoreTag
)