export type Asset = {
  _id: string;
  name: string;
  price: number;
  symbol: string;
  image_url: string;
};

export type AssetDaily = {
  _id: string;
  asset: Asset;
  price: number;
  date: Date;
};

export type WalletAssets = {
  _id: string;
  asset: Asset;
  shares: number;
};

export type Wallet = {
  _id: string;
  assets: WalletAssets[];
};

export enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FAILED = "FAILED",
}

export type Order = {
  _id: string;
  asset: Asset;
  shares: number;
  partial: number;
  price: number;
  type: OrderType;
  status: OrderStatus;
};
