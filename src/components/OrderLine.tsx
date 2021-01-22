import React from "react";
import styled from "styled-components";
import { format, parse } from "date-fns";
import { SizeContext } from "../App";
import { theme } from "../theme/theme";
import { defaults } from "../assets/defaults";

const OrderLine = ({ assignedOrders, widthInMinutes, startDate, endDate, isDarker }) => {
   const { pixelsPerMinutes: pixPerMin, isCompact } = React.useContext(SizeContext);

   const fullLineWidthPx =
      widthInMinutes * pixPerMin +
      theme.size.timeStartGutterMinutes * pixPerMin +
      theme.size.timeEndGutterMinutes * pixPerMin +
      theme.size.timelineHeaderDayLabelWidth;

   return (
      <StyledOrderLine width={fullLineWidthPx} isDarker={isDarker} isCompact={isCompact}>
         {assignedOrders.map((order) => {
            const order_fromDate = parse(order.from, defaults.dateFormatString, new Date());
            const order_toDate = parse(order.to, defaults.dateFormatString, new Date());

            const minuteDifferenceFromStart = Math.round((order_fromDate.getTime() - startDate.getTime()) / 1000 / 60);
            const minuteDuration = Math.round((order_toDate.getTime() - order_fromDate.getTime()) / 1000 / 60);

            const posLeft = minuteDifferenceFromStart * pixPerMin + theme.size.timeStartGutterMinutes * pixPerMin;
            const orderWidth = minuteDuration * pixPerMin;
            return (
               <StyledOrder key={order.id} posLeft={posLeft} width={orderWidth} isCompact={isCompact}>
                  <div className="head">{order.id}</div>
                  {!isCompact && (
                     <div className="dates">
                        {format(order_fromDate, "MM.dd. HH:mm")} - {format(order_toDate, "MM.dd. HH:mm")}
                     </div>
                  )}
               </StyledOrder>
            );
         })}
      </StyledOrderLine>
   );
};

export default OrderLine;

interface OrderLineProps {
   width: number;
   isDarker: boolean;
   isCompact: boolean;
}

const StyledOrderLine = styled.div.attrs<OrderLineProps>((props) => ({
   style: {
      width: props.width + "px",
      background: props.isDarker && theme.colors.lineHighlighter,
   },
}))<OrderLineProps>`
   position: relative;

   height: ${theme.size.lineHeight + theme.size.lineGap}px;
   padding: ${theme.size.lineGap / 2}px 0;

   ${(props) =>
      props.isCompact &&
      `height: ${theme.size.lineHeight_compact + theme.size.lineGap_compact}px;
      padding: ${theme.size.lineGap_compact / 2}px 0;`}
`;

interface OrderItemProps {
   posLeft: number;
   width: number;
   isCompact: boolean;
}

const StyledOrder = styled.div.attrs<OrderItemProps>((props) => ({
   style: {
      left: props.posLeft + "px",
      width: props.width + "px",
   },
}))<OrderItemProps>`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;

   position: absolute;

   height: ${theme.size.lineHeight}px;
   ${props => props.isCompact && `height: ${theme.size.lineHeight_compact}px;`}

   background-color: #fff;
   border: 2px solid ${theme.colors.nexogenBrandDarker};
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
      color: ${theme.colors.nexogenBrandDarker};
      letter-spacing: -0.5px;
   }
`;
