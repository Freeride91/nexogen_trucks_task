import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";

const OrderLineComponent = ({ assignedOrders, width, startDate, endDate }) => {
   return (
      <StyledOrderLine>
         {assignedOrders.map((order, index) => {
            const order_fromDate = new Date(order.from);
            const order_toDate = new Date(order.to);

            const minuteDifferenceFromStart = Math.round((order_fromDate.getTime() - startDate.getTime()) / 1000 / 60);
            const minuteDuration = Math.round((order_toDate.getTime() - order_fromDate.getTime()) / 1000 / 60);

            return (
               <StyledOrder
                  key={order.id}
                  posLeft={minuteDifferenceFromStart * defaults.pixelsPerMinutes}
                  width={minuteDuration * defaults.pixelsPerMinutes}
               >
                  <div className="head">{order.id}</div>
                  <div className="dates">
                     {/* {minuteDuration} */}
                     {order.from} - {order.to}
                  </div>
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

const StyledOrder = styled.div<{ width?: number; posLeft: number }>`
   display: flex;
   align-items: center;
   justify-content: center;
   flex-direction: column;

   position: absolute;
   left: ${(props) => props.posLeft}px;
   width: ${(props) => props.width}px;

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
