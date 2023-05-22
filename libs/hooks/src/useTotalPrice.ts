import { useEffect, useState } from 'react'
import { FormTypeBookSlot } from '@autospace-org/forms/src/bookSlot'
import { useWatch } from 'react-hook-form'
import { differenceInTime } from '@autospace-org/util/date'

export type TotalPriceType = {
  pricePerHour?: number
}

export const VALET_CHARGE_PER_METER = 0.02

export const useTotalPrice = ({ pricePerHour }: TotalPriceType) => {
  const { startTime, endTime, valet, services } = useWatch<FormTypeBookSlot>()

  const [parkingCharge, setParkingCharge] = useState(0)
  const [valetChargePickup, setValetChargePickup] = useState(0)
  const [valetChargeDropoff, setValetChargeDropoff] = useState(0)
  const [servicesCharge, setServicesCharge] = useState(0)

  useEffect(() => {
    if (!startTime || !endTime) return
    if (!pricePerHour) return

    const differenceInMilliseconds = differenceInTime({
      startTime: startTime,
      endTime: endTime,
    })
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60)

    const parkingCharge = Math.floor((pricePerHour || 0) * differenceInHours)

    setParkingCharge(parkingCharge)
  }, [pricePerHour, startTime, endTime])

  useEffect(() => {
    const pickupCharge = valet?.pickupInfo?.distance
      ? valet?.pickupInfo?.distance * VALET_CHARGE_PER_METER
      : 0
    const dropoffCharge = valet?.dropoffInfo?.distance
      ? valet.dropoffInfo.distance * VALET_CHARGE_PER_METER
      : 0

    setValetChargePickup(Math.floor(pickupCharge))
    setValetChargeDropoff(
      Math.floor(valet?.differentLocations ? dropoffCharge : pickupCharge),
    )
  }, [valet])

  useEffect(() => {
    const charges =
      services?.reduce((total, curr) => total + (curr?.price || 0), 0) || 0

    setServicesCharge(charges)
  }, [services])

  return {
    parkingCharge,
    valetChargePickup,
    valetChargeDropoff,
    servicesCharge,
  }
}
