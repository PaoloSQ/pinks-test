import s from "./Kanban.module.scss";
import Column from "../Column";
import { useOrders } from "@/contexts/Orders.context";

export default function Kanban() {
  const { orders } = useOrders();

  return (
    <section className={s["pk-kanban"]}>
      <Column
        title="Pendiente"
        orders={orders.filter((i) => i.state === "PENDING")}
        onClick={(order) => (order.state = "IN_PROGRESS")}
      />
      <Column
        title="En preparación"
        orders={orders.filter((i) => i.state === "IN_PROGRESS")}
        onClick={(order) => (order.state = "READY")}
      />
      <Column
        title="Listo"
        orders={orders.filter((i) => i.state === "READY")}
      />
      <Column
        title="Entregados"
        orders={orders.filter((i) => i.state === "DELIVERED")}
      />
    </section>
  );
}
