import { AssetShow } from "@/components/AssetShow";
import { OrderForm } from "@/components/OrderForm";
import { TabsItem } from "@/components/Tabs";
import { OrderType } from "@/models";
import { Card, Tabs } from "flowbite-react";
import { AssetChartComponent } from "./AssetChartComponent";
import { getAsset, getAssetDailies, getMyWallet } from "@/queries/queries";
import { WalletList } from "@/components/WalletList";
import { Time } from "lightweight-charts";

export default async function AssetDashboard({
  params,
  searchParams,
}: {
  params: { assetSymbol: string };
  searchParams: Promise<{ wallet_id: string }>;
}) {
  const { wallet_id } = await searchParams;
  const { assetSymbol } = await params;

  if (!wallet_id) {
    return <WalletList />;
  }

  const wallet = await getMyWallet(wallet_id);

  if (!wallet) {
    return <WalletList />;
  }

  const { wallet_id: walletId } = await searchParams;

  const asset = await getAsset(assetSymbol);

  const assetDailies = await getAssetDailies(assetSymbol);
  const chartData = assetDailies.map((assetDaily) => ({
    time: (Date.parse(assetDaily.date) / 1000) as Time,
    value: assetDaily.price,
  }));

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <div className="flex flex-col space-y-2">
        <AssetShow asset={asset} />

        <div className="ml-2 font-bold text-2xl">R$ {asset.price}</div>
      </div>
      <div className="grid gird-cols-5 flex-grow gap-2">
        <div className="col-span-2">
          <Card>
            <Tabs>
              <TabsItem
                active
                title={<div className="text-blue-700">Comprar</div>}
              >
                <OrderForm
                  assets={asset}
                  wallet_id={walletId}
                  type={OrderType.BUY}
                />
              </TabsItem>
              <TabsItem title={<div className="text-red-700">Vender</div>}>
                <OrderForm
                  assets={asset}
                  wallet_id={walletId}
                  type={OrderType.SELL}
                />
              </TabsItem>
            </Tabs>
          </Card>
        </div>
        <div className="col-span-3 flex flex-grow">
          <AssetChartComponent asset={asset} data={chartData} />
        </div>
      </div>
    </div>
  );
}
