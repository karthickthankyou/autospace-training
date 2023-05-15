import { Injectable } from '@nestjs/common'
import {
  FindManyVerificationArgs,
  FindUniqueVerificationArgs,
} from './dto/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateVerificationInput } from './dto/create-verification.input'
import { UpdateVerificationInput } from './dto/update-verification.input'

@Injectable()
export class VerificationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createVerificationInput: CreateVerificationInput) {
    return this.prisma.verification.create({
      data: createVerificationInput,
    })
  }

  findAll(args: FindManyVerificationArgs) {
    return this.prisma.verification.findMany(args)
  }

  findOne(args: FindUniqueVerificationArgs) {
    return this.prisma.verification.findUnique(args)
  }

  update(updateVerificationInput: UpdateVerificationInput) {
    const { garageId, ...data } = updateVerificationInput
    return this.prisma.verification.update({
      where: { garageId },
      data: data,
    })
  }

  remove(args: FindUniqueVerificationArgs) {
    return this.prisma.verification.delete(args)
  }
}
