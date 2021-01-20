import { isBefore, isAfter } from "date-fns";
import { OrderType } from "../App";

export function getEarliestOrderStartDate(orders: Array<OrderType>): Date {
   let startDates = orders.map((order) => new Date(order.from));
   let orderedStartDates = startDates.sort((a, b) => {
      if (isBefore(a, b)) return -1;
      if (isAfter(a, b)) return 1;
      else return 0;
   });
   return orderedStartDates[0];
}
export function getLatestOrderEndDate(orders: Array<OrderType>): Date {
   let endDates = orders.map((order) => new Date(order.to));
   let orderedEndDates = endDates.sort((a, b) => {
      if (isBefore(a, b)) return -1;
      if (isAfter(a, b)) return 1;
      else return 0;
   });
   return orderedEndDates[endDates.length - 1];
}