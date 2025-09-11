"use client"

import { deleteStep } from "@/actions/step"
import { createAdminDeleteHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

const stepConfig = {
  entityName: "Step",
  queryKey: "steps",
  displayNameFn: (step: unknown) => {
    const s = step as { order: number; instruction?: string }
    return `Step ${s.order}${s.instruction ? ': ' + s.instruction.substring(0, 50) + '...' : ''}`
  }
}

export type DeleteStepResult = AdminMutationResult & {
  step?: unknown
}

export const useDeleteStep = createAdminDeleteHook<DeleteStepResult>(
  stepConfig,
  deleteStep
)