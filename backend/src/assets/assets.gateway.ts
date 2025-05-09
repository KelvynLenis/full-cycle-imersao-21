/* eslint-disable prettier/prettier */
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { AssetsService } from './assets.service'
import { Logger } from '@nestjs/common'
import { AssetPresenter } from './asset.presenter'
import { AssetDailiesService } from './asset-daily.service'

@WebSocketGateway({ cors: true })
export class AssetsGateway implements OnGatewayInit {
  logger = new Logger(AssetsGateway.name)

  constructor(
    private assetsService: AssetsService,
    private assetsDailiesService: AssetDailiesService,
  ) {}

  afterInit(server: Server) {
    this.assetsService.subscribeNewPriceChangedEvents().subscribe((asset) => {
      server
        .to(asset.symbol)
        .emit('assets/price-changed', new AssetPresenter(asset).toJSON())
    })

    this.assetsDailiesService
      .subscribeCreatedEvents()
      .subscribe((assetDaily) => {
        server
          .to(assetDaily.asset.symbol)
          .emit('assets/daily-created', new AssetPresenter(assetDaily).toJSON())
      })
  }

  @SubscribeMessage('joinAssets')
  handleJoinAssets(client: any, payload: { symbols: string[] }) {
    if (!payload.symbols.length) {
      return
    }

    payload.symbols.forEach((symbol) => {
      client.join(symbol)
    })
    this.logger.log(
      `Client ${client.id} joined asset: ${payload.symbols.join(', ')}`,
    )
  }

  @SubscribeMessage('joinAsset')
  handleJoinAsset(client: any, payload: { symbol: string }) {
    client.join(payload.symbol)
    this.logger.log(`Client ${client.id} joined asset: ${payload.symbol}`)
  }

  @SubscribeMessage('leaveAssets')
  handleLeaveAssets(client: any, payload: { symbols: string[] }) {
    if (!payload.symbols.length) {
      return
    }

    payload.symbols.forEach((symbol) => {
      client.leave(symbol)
    })
    this.logger.log(
      `Client ${client.id} left asset: ${payload.symbols.join(', ')}`,
    )
  }

  @SubscribeMessage('leaveAsset')
  handleLeaveAsset(client: any, payload: { symbol: string }) {
    client.leave(payload.symbol)
    this.logger.log(`Client ${client.id} left asset: ${payload.symbol}`)
  }
}
