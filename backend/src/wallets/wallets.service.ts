/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { CreateWalletDto } from './dto/create-wallet.dto'
import { Wallet } from './entities/wallet.entity'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { WalletAsset } from './entities/wallet-asset.entity'
// import { UpdateWalletDto } from './dto/update-wallet.dto'

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletSchema: Model<Wallet>,
    @InjectModel(Wallet.name) private walletAssetSchema: Model<WalletAsset>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  create(createWalletDto: CreateWalletDto) {
    return this.walletSchema.create(createWalletDto)
  }

  findAll() {
    return this.walletSchema.find()
  }

  findOne(id: string) {
    return this.walletSchema.findById(id).populate([
      {
        path: 'assets',
        populate: ['assets'],
      },
    ])
  }

  async createWalletAsset(data: {
    wallet_id: string
    asset_id: string
    shares: number
  }) {
    const session = await this.connection.startSession()

    await session.startTransaction()

    try {
      const docs = await this.walletAssetSchema.create(
        [
          {
            wallet: data.wallet_id,
            asset: data.asset_id,
            shares: data.shares,
          },
        ],
        {
          session,
        },
      )

      const walletAsset = docs[0]

      await this.walletSchema.updateOne(
        { _id: data.wallet_id },
        { $push: { assets: walletAsset } },
        { session },
      )

      await session.commitTransaction()
      return walletAsset
    } catch (error) {
      console.error(error)
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  // update(id: number, updateWalletDto: UpdateWalletDto) {
  //   return `This action updates a #${id} wallet`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} wallet`;
  // }
}
