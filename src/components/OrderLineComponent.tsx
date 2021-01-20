import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";
import { format } from "date-fns";
import { SizeContext } from "../App";

const OrderLineComponent = ({ assignedOrders, startDate, endDate }) => {
   const { pixelsPerMinutes: pixPerMin } = React.useContext(SizeContext);
   console.log("RERENDER order");
   return (
      <StyledOrderLine>
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
                  {/* <div className="dates">
                     {format(order_fromDate, "MM.dd. HH:mm")} - {format(order_toDate, "MM.dd. HH:mm")}
                  </div> */}
               </StyledOrder>
            );
         })}
      </StyledOrderLine>
   );
};

export default OrderLineComponent;

const StyledOrderLine = styled.div`
   display: flex;
   align-items: center;
   height: ${defaults.lineHeight}px;
   border-bottom: 1px solid #fff;

   margin: ${defaults.lineGap}px 0;

   position: relative;
`;

interface ItemProps {
   posLeft: number;
   width: number;
}

const StyledOrder = styled.div.attrs<ItemProps>(
   (props) => ({
      style: {
         left: props.posLeft + "px",
         width: props.width + "px"
      }
   })
)<ItemProps>`
   display: flex;
   align-items: center;
   justify-content: center;
   flex-direction: column;

   position: absolute;

   height: 40px;

   background-color: #bebebe;
   color: #fff;
   border: 1px solid white;
   border-radius: 3px;
   padding: 0 4px;

   .head {
      background: white;
      color: #272222;
      padding: 2px;
   }

   .dates {
      font-size: 12px;
   }
`;
