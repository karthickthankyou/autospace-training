import { Injectable } from '@nestjs/common'
import { FindManyGarageArgs, FindUniqueGarageArgs } from './dto/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateGarageInput } from './dto/create-garage.input'
import { UpdateGarageInput } from './dto/update-garage.input'
import { CreateSlotInputWithoutGarageId } from '../slots/dto/create-slot.input'
import { Prisma } from '@prisma/client'

const groupSlotsByType = (
  slots: CreateSlotInputWithoutGarageId[],
  garageId: number,
): Prisma.SlotCreateManyInput[] => {
  const slotsByType = {}

  slots.forEach(({ count, ...slot }) => {
    if (!slotsByType[slot.type]) {
      slotsByType[slot.type] = []
    }

    for (let i = 0; i < count; i++) {
      slotsByType[slot.type].push({
        ...slot,
        displayName: `${slot.type} ${slotsByType[slot.type].length}`,
        garageId,
      })
    }
  })

  return Object.values(slotsByType)
}

@Injectable()
export class GaragesService {
  constructor(private readonly prisma: PrismaService) {}
  async create({
    address,
    companyId,
    description,
    displayName,
    images,
    slots,
  }: CreateGarageInput & { companyId: number }) {
    const garage = await this.prisma.garage.create({
      data: {
        address: { create: address },
        companyId,
        description,
        displayName,
        images,
      },
    })

    const slotss = groupSlotsByType(slots, garage.id).flat()

    const createSlots = await this.prisma.slot.createMany({ data: slotss })

    return garage
  }

  findAll(args: FindManyGarageArgs) {
    return this.prisma.garage.findMany(args)
  }

  findOne(args: FindUniqueGarageArgs) {
    return this.prisma.garage.findUnique(args)
  }

  update(updateGarageInput: UpdateGarageInput) {
    const { id, address, slots, ...data } = updateGarageInput
    return this.prisma.garage.update({
      where: { id: id },
      data: data,
    })
  }

  remove(args: FindUniqueGarageArgs) {
    return this.prisma.garage.delete(args)
  }
}
