import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";
import { format } from "date-fns";
import { SizeContext } from "../App";

const OrderLine = ({ assignedOrders, widthInMinutes, startDate, endDate }) => {
   const { pixelsPerMinutes: pixPerMin } = React.useContext(SizeContext);
   
   const fullLineWidth =
      widthInMinutes * pixPerMin +
      defaults.timeStartGutterMinutes * pixPerMin +
      defaults.timeEndGutterMinutes * pixPerMin +
      defaults.timelineHeaderDayLabelWidth;


   return (
      <StyledOrderLine width={fullLineWidth}>
         {assignedOrders.map((order) => {
            const order_fromDate = new Date(order.from);
            const order_toDate = new Date(order.to);

            const minuteDifferenceFromStart = Math.round((order_fromDate.getTime() - startDate.getTime()) / 1000 / 60);
            const minuteDuration = Math.round((order_toDate.getTime() - order_fromDate.getTime()) / 1000 / 60);

            const posLeft = minuteDifferenceFromStart * pixPerMin + defaults.timeStartGutterMinutes * pixPerMin;
            const orderWidth = minuteDuration * pixPerMin;
            return (
               <StyledOrder key={order.id} posLeft={posLeft} width={orderWidth}>
                  <div className="head">{order.id}</div>
                  <div className="dates">
                     {format(order_fromDate, "MM.dd. HH:mm")} - {format(order_toDate, "MM.dd. HH:mm")}
                  </div>
               </StyledOrder>
            );
         })}
      </StyledOrderLine>
   );
};

export default OrderLine;


interface OrderLineProps {
   width: number;
}

const StyledOrderLine = styled.div.attrs<OrderLineProps>(
   (props) => ({
      style: {
         width: props.width + "px"
      }
   })
)<OrderLineProps>`
   /* background: #fff; */
   height: ${defaults.lineHeight}px;
   margin: ${defaults.lineGap}px 0 0 0;
   position: relative;
`;

interface OrderItemProps {
   posLeft: number;
   width: number;
}

const StyledOrder = styled.div.attrs<OrderItemProps>(
   (props) => ({
      style: {
         left: props.posLeft + "px",
         width: props.width + "px"
      }
   })
)<OrderItemProps>`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;

   position: absolute;

   height: ${defaults.lineHeight}px;

   background-color: #fff;
   border: 2px solid #4fb8a2;
   border-radius: 6px;

   .head {
      color: #4fb8a2;
      font-size: 15px;
      font-weight: bold;
      padding: 2px;
   }

   .dates {
      font-size: 11px;
      color: #6b6b6b;
   }
`;
