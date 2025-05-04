/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from './entities/order.entity'
import { OrdersGateway } from './orders.gateway'
import { Asset, AssetSchema } from 'src/assets/entities/asset.entity'
import {
  AssetDaily,
  AssetDailySchema,
} from 'src/assets/entities/asset-daily.entity'
import { Wallet, WalletSchema } from 'src/wallets/entities/wallet.entity'
import {
  WalletAsset,
  WalletAssetSchema,
} from 'src/wallets/entities/wallet-asset.entity'
import { OrdersConsumer } from './orders.consumer'
import { Trade, TradeSchema } from './entities/trade.entity'
import * as kafkaLib from '@confluentinc/kafka-javascript'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Trade.name,
        schema: TradeSchema,
      },
      { name: Asset.name, schema: AssetSchema },
      { name: AssetDaily.name, schema: AssetDailySchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletAsset.name, schema: WalletAssetSchema },
    ]),
  ],
  controllers: [OrdersController, OrdersConsumer],
  providers: [
    OrdersService,
    OrdersGateway,
    {
      provide: kafkaLib.KafkaJS.Kafka,
      useFactory() {
        return new kafkaLib.KafkaJS.Kafka({
          'bootstrap.servers': 'localhost:9094',
        })
      },
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
