import { createAdminCreateHook } from "@/utils/mutations/hooks"
import { createTag, type CreateTagData } from "@/actions/tag"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

type CreateTagResult = AdminMutationResult & {
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

export const useCreateTag = createAdminCreateHook<CreateTagResult, CreateTagData>(
  tagConfig,
  createTag
)