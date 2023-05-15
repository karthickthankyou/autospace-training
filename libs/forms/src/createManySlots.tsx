import { zodResolver } from '@hookform/resolvers/zod'
import { SlotType } from '@autospace-org/network/src/generated'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const createManySlotsFormSchema = z.object({
  pricePerHour: z.number(),
  numberOfSlots: z.number(),
  startingSlotNumber: z.number(),
  height: z.number(),
  width: z.number(),
  length: z.number(),
  type: z.nativeEnum(SlotType),
})

export type FormTypeRegister = z.infer<typeof createManySlotsFormSchema>

export const useFormCreateManySlots = () =>
  useForm<FormTypeRegister>({
    resolver: zodResolver(createManySlotsFormSchema),
  })
