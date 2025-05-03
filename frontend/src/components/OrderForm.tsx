"use client";

import { Asset, Order, OrderType } from "@/models";
import { socket } from "@/socket-io";
import { Button, Label, TextInput } from "flowbite-react";
import { FormEvent } from "react";
import { toast } from "react-toastify";

export function OrderForm(props: {
  assets: Asset;
  wallet_id: string;
  type: OrderType;
}) {
  const color = props.type == OrderType.BUY ? "text-blue-700" : "text-red-700";
  const translatedType = props.type == OrderType.BUY ? "compra" : "venda";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    socket.connect();
    const newOrder: Order = await socket.emitWithAck("orders/create", data);
    toast.success(
      `Ordem de ${translatedType} de ${newOrder.shares} ações de ${props.assets.symbol} criada com sucesso!`
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="assetId" defaultValue={props.assets._id} />
      <input type="hidden" name="walletId" defaultValue={props.wallet_id} />
      <input type="hidden" name="type" defaultValue={props.type} />
      <div>
        <div className="mb-2">
          <Label htmlFor="shares" value="Quantidade" className={color} />
        </div>
        <TextInput
          id="shares"
          name="shares"
          type="number"
          required
          min={1}
          step={1}
          defaultValue={1}
          color={props.type == OrderType.BUY ? "info" : "failure"}
        />
      </div>
      <br />
      <div>
        <div className="mb-2">
          <Label htmlFor="price" value="Preço R$" className={color} />
        </div>
        <TextInput
          id="price"
          name="price"
          type="number"
          required
          min={1}
          step={1}
          defaultValue={1}
          color={props.type == OrderType.BUY ? "info" : "failure"}
        />
      </div>
      <br />
      <div>
        <div className="mb-2">
          <Label htmlFor="shares" value="Quantidade" className={color} />
        </div>
        <TextInput
          id="shares"
          name="shares"
          type="number"
          required
          min={1}
          step={1}
          defaultValue={1}
          color={props.type == OrderType.BUY ? "info" : "failure"}
        />
      </div>
      <Button
        type="submit"
        color={props.type == OrderType.BUY ? "info" : "failure"}
      >
        Confirmar {translatedType}
      </Button>
    </form>
  );
}
