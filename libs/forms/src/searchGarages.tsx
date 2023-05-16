import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SlotType } from '@autospace-org/network/src/generated'
import { ReactNode, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const minMaxTuple = z.tuple([z.number(), z.number()])

export const formSchemaSearchGarage = z.object({
  startTime: z.string(),
  endTime: z.string(),
  searchText: z.string().optional(),

  locationInfo: z
    .object({
      placeName: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      zoom: z.number().optional(),
    })
    .optional(),

  locationFilter: z
    .object({
      nw_lat: z.number().optional(),
      nw_lng: z.number().optional(),
      se_lat: z.number().optional(),
      se_lng: z.number().optional(),
    })
    .optional(),

  type: z
    .nativeEnum(SlotType)
    .array()
    .min(1, { message: 'At least one slot type is required' }),

  pricePerHour: minMaxTuple.optional(),
  height: minMaxTuple.optional(),
  width: minMaxTuple.optional(),
  length: minMaxTuple.optional(),

  skip: z.number().optional(),
  take: z.number().optional(),

  garageId: z.number(),
  vehicleNumber: z.string().min(1, { message: 'Vehicle number is required' }),
  selectedType: z.nativeEnum(SlotType, {
    required_error: 'Slot type is required',
  }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
})

export type FormTypeSearchGarage = z.infer<typeof formSchemaSearchGarage>

const isStartTimeValid = (data: FormTypeSearchGarage) => {
  const startDate = new Date(data.startTime)
  const currentDate = new Date()
  return startDate > currentDate
}

const isEndTimeValid = (data: FormTypeSearchGarage) => {
  const startDate = new Date(data.startTime)
  const endDate = new Date(data.endTime)
  return endDate > startDate
}

formSchemaSearchGarage
  .refine(isStartTimeValid, {
    message: 'Start time should be greater than current time',
    path: ['startTime'],
  })
  .refine(isEndTimeValid, {
    message: 'End time should be greater than start time',
    path: ['endTime'],
  })

export const getCurrentTimeAndOneHourLater = () => {
  const startTime = new Date()
  startTime.setMinutes(startTime.getMinutes() + 5)

  startTime.setTime(
    startTime.getTime() - startTime.getTimezoneOffset() * 60 * 1000,
  )

  const endTime = new Date(startTime)
  endTime.setHours(endTime.getHours() + 1)

  return {
    startTime: startTime.toISOString().slice(0, 16),
    endTime: endTime.toISOString().slice(0, 16),
  }
}

export const AllSlotTypes = [
  SlotType.Bicycle,
  SlotType.Bike,
  SlotType.Car,
  SlotType.Heavy,
]

export const formDefaultValuesSearchGarages = {
  pricePerHour: [0, 200] as [number, number],
  width: [0, 20] as [number, number],
  height: [0, 30] as [number, number],
  length: [0, 100] as [number, number],
  type: AllSlotTypes.sort(),
}

export const FormProviderSearchGarage = ({
  children,
}: {
  children: ReactNode
}) => {
  const searchParams = useSearchParams()
  const startTimeParam = searchParams.get('startTime')
  const endTimeParam = searchParams.get('endTime')
  const placeName = searchParams.get('placeName')
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  const type = searchParams.getAll('type') as SlotType[]

  const { startTime: currentTime, endTime: currentTimePlusOneHour } =
    getCurrentTimeAndOneHourLater()
  const methods = useForm<FormTypeSearchGarage>({
    resolver: zodResolver(formSchemaSearchGarage),
    defaultValues: formDefaultValuesSearchGarages,
  })

  useEffect(() => {
    methods.setValue('startTime', startTimeParam || currentTime)
    methods.setValue('endTime', endTimeParam || currentTimePlusOneHour)
    methods.setValue('locationInfo', {
      placeName: placeName || '',
      lat: lat || 0,
      lng: lng || 0,
    })
    methods.setValue('type', type || AllSlotTypes.sort())
  }, [])

  return <FormProvider {...methods}>{children}</FormProvider>
}