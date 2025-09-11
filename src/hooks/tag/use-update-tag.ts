import { createAdminUpdateHook } from "@/utils/mutations/hooks"
import { updateTag, type UpdateTagData } from "@/actions/tag"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type UpdateTagResult = AdminMutationResult & {
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

export const useUpdateTag = createAdminUpdateHook<UpdateTagResult, { id: number; data: UpdateTagData }>(
  tagConfig,
  ({ id, data }) => updateTag(id, data)
)