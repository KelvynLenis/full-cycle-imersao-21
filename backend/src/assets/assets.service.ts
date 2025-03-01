/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { CreateAssetDto } from './dto/create-asset.dto'
// import { UpdateAssetDto } from './dto/update-asset.dto'
import { Asset } from './entities/asset.entity'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AssetsService {
  constructor(@InjectModel(Asset.name) private assetSchema: Model<Asset>) {}

  create(createAssetDto: CreateAssetDto) {
    return this.assetSchema.create(createAssetDto)
  }

  findAll() {
    return this.assetSchema.find()
  }

  findOne(symbol: string) {
    return this.assetSchema.findOne({ symbol })
  }

  // update(id: number, updateAssetDto: UpdateAssetDto) {
  //   return `This action updates a #${id} asset`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} asset`
  // }
}
