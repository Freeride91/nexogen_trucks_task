import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { SizeContext } from "../App";
import { theme } from "../theme/theme";

const OrderLine = ({ assignedOrders, widthInMinutes, startDate, endDate }) => {
   const { pixelsPerMinutes: pixPerMin } = React.useContext(SizeContext);
   
   const fullLineWidthPx =
      widthInMinutes * pixPerMin +
      theme.size.timeStartGutterMinutes * pixPerMin +
      theme.size.timeEndGutterMinutes * pixPerMin +
      theme.size.timelineHeaderDayLabelWidth;

   return (
      <StyledOrderLine width={fullLineWidthPx}>
         {assignedOrders.map((order) => {
            const order_fromDate = new Date(order.from);
            const order_toDate = new Date(order.to);

            const minuteDifferenceFromStart = Math.round((order_fromDate.getTime() - startDate.getTime()) / 1000 / 60);
            const minuteDuration = Math.round((order_toDate.getTime() - order_fromDate.getTime()) / 1000 / 60);

            const posLeft = minuteDifferenceFromStart * pixPerMin + theme.size.timeStartGutterMinutes * pixPerMin;
            const orderWidth = minuteDuration * pixPerMin;
            return (
               <StyledOrder key={order.id} posLeft={posLeft} width={orderWidth}>
                  <div className="head">{order.id}</div>
                  {/* <div className="dates">
                     {format(order_fromDate, "MM.dd. HH:mm")} - {format(order_toDate, "MM.dd. HH:mm")}
                  </div> */}
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
   height: ${theme.size.lineHeight}px;
   margin: ${theme.size.lineGap}px 0 0 0;
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

   height: ${theme.size.lineHeight}px;

   background-color: #fff;
   border: 2px solid #39a38c;
   border-radius: 4px;

   z-index: 11;

   .head {
      color: #333;
      font-size: 15px;
      font-weight: bold;
      padding: 2px;
   }

   .dates {
      font-size: 11px;
      color: ${theme.colors.nexogenBrand};
      letter-spacing: -0.5px;
   }
`;
