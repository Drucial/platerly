"use client"

import { restoreStep } from "@/actions/step"
import { createAdminRestoreHook } from "@/utils/mutations/hooks"
import type { AdminMutationResult } from "@/utils/mutations/mutations"

const stepConfig = {
  entityName: "Step",
  queryKey: "steps",
  displayNameFn: (step: unknown) => {
    const s = step as { order: number; instruction?: string }
    return `Step ${s.order}${s.instruction ? ': ' + s.instruction.substring(0, 50) + '...' : ''}`
  }
}

export type RestoreStepResult = AdminMutationResult & {
  step?: unknown
}

export const useRestoreStep = createAdminRestoreHook<RestoreStepResult>(
  stepConfig,
  restoreStep
)