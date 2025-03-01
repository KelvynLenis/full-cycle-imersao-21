/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { WalletsService } from './wallets.service'
import { WalletsController } from './wallets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetSchema } from 'src/assets/entities/asset.entity'
import { Wallet } from './entities/wallet.entity'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Wallet.name,
        schema: AssetSchema,
      },
    ]),
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
