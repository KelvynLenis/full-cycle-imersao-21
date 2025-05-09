/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import crypto from 'crypto'
import mongoose, { HydratedDocument } from 'mongoose'
import { WalletDocument } from './wallet.entity'
import { Asset, AssetDocument } from 'src/assets/entities/asset.entity'

export type WalletAssetDocument = HydratedDocument<WalletAsset>

@Schema({ timestamps: true, optimisticConcurrency: true })
export class WalletAsset {
  @Prop({ default: () => crypto.randomUUID() })
  _id: string

  @Prop({ type: mongoose.Schema.Types.Int32 })
  shares: number

  @Prop({ type: String, ref: 'Wallet' })
  wallet_id: WalletDocument | string

  @Prop({ type: String, ref: Asset.name })
  asset_id: AssetDocument | string

  createdAt!: Date
  updatedAt!: Date
}

export const WalletAssetSchema = SchemaFactory.createForClass(WalletAsset)

WalletAssetSchema.index({ wallet_id: 1, asset_id: 1 }, { unique: true })
