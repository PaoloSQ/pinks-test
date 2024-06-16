import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useOrders } from "./Orders.context";
import { getRandomInterval } from "@/lib/utils";
import { Rider } from "@/dtos/Rider.dto";

export type RidersContextProps = {
  riders: Array<Rider>;
};

export const RidersContext = createContext<RidersContextProps>(
  {} as RidersContextProps
);

export type RidersProviderProps = {
  children: ReactNode;
};

export function RidersProvider(props: RidersProviderProps) {
  const [riders, setRiders] = useState<Array<Rider>>([]);
  const [assignedOrders, setAssignedOrders] = useState<Set<string>>(new Set());
  const { orders, pickup } = useOrders();

  useEffect(() => {
    const unassignedOrder = orders.find(
      (order) => !assignedOrders.has(order.id)
    );
    if (unassignedOrder) {
      const timeoutId = setTimeout(() => {
        setAssignedOrders((prev) => {
          const newSet = new Set(prev);
          newSet.add(unassignedOrder.id);
          return newSet;
        });
        setRiders((prev) => [
          ...prev,
          {
            orderWanted: unassignedOrder.id,
            pickup: () => {
              pickup(unassignedOrder);
            },
          },
        ]);
      }, getRandomInterval(4000, 10000));

      return () => clearTimeout(timeoutId);
    }
  }, [orders, assignedOrders, pickup]);

  useEffect(() => {
    const updatedRiders = riders.filter((rider) =>
      orders.some(
        (order) => order.id === rider.orderWanted && order.state !== "DELIVERED"
      )
    );
    setRiders(updatedRiders);
  }, [orders]);

  const context = useMemo(() => ({ riders }), [riders]);

  return (
    <RidersContext.Provider value={context}>
      {props.children}
    </RidersContext.Provider>
  );
}

export const useRiders = () => useContext(RidersContext);
