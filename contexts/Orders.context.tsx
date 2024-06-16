import { Order } from "@/dtos/Order.dto";
import { OrderOrchestrator } from "@/lib";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export type OrdersContextProps = {
  orders: Array<Order>;
  pickup: (order: Order) => void;
};

export const OrdersContext = createContext<OrdersContextProps>(
  {} as OrdersContextProps
);

export type OrdersProviderProps = {
  children: ReactNode;
};

export function OrdersProvider(props: OrdersProviderProps) {
  const [orders, setOrders] = useState<Array<Order>>([]);

  useEffect(() => {
    const orderOrchestrator = new OrderOrchestrator();
    const listener = (order: Order) => {
      setOrders((prev) => [...prev, order]);
    };
    const eventEmitter = orderOrchestrator.run();
    eventEmitter.on("order", listener);

    return () => {
      eventEmitter.off("order", listener);
    };
  }, []);

  const pickup = useCallback((order: Order) => {
    if (order.state === "READY") {
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, state: "DELIVERED" } : o
        )
      );
      alert("Pedido entregado al repartidor");
    } else {
      alert("El pedido aún no está listo");
    }
  }, []);

  const context = useMemo(() => ({ orders, pickup }), [orders, pickup]);

  return (
    <OrdersContext.Provider value={context}>
      {props.children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
