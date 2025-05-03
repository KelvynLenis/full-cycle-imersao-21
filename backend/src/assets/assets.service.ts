/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { CreateAssetDto } from './dto/create-asset.dto'
// import { UpdateAssetDto } from './dto/update-asset.dto'
import { Asset } from './entities/asset.entity'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Observable } from 'rxjs'

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

  subscribeNewPriceChangedEvents(): Observable<Asset> {
    return new Observable((observer) => {
      this.assetSchema
        .watch(
          [
            {
              $match: {
                $or: [
                  {
                    operationType: 'update',
                  },
                  {
                    operationType: 'replace',
                  },
                ],
              },
            },
          ],
          {
            fullDocument: 'updateLookup',
            fullDocumentBeforeChange: 'whenAvailable',
          },
        )
        .on('change', async (data) => {
          if (data.fullDocument.price === data.fullDocumentBeforeChange.price) {
            return
          }

          const asset = await this.assetSchema.findById(data.fullDocument._id)
          observer.next(asset!)
        })
    })
  }

  // update(id: number, updateAssetDto: UpdateAssetDto) {
  //   return `This action updates a #${id} asset`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} asset`
  // }
}
