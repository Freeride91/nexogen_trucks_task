import React from "react";
import styled from "styled-components";
import { format, eachDayOfInterval, differenceInMinutes, eachHourOfInterval } from "date-fns";
import { SizeContext } from "../App";
import { theme } from "../theme/theme";

type DateWithStartMinute = {
   startDate: Date;
   minutesPosition: number;
};

const TimelineHeader = ({ timelineStartDate, widthInMinutes, dayStartDescriptors, hourStartDescriptors }) => {
   const { pixelsPerMinutes: pixPerMin } = React.useContext(SizeContext);

   const fullHeaderWidthPx =
      widthInMinutes * pixPerMin +
      theme.size.timeStartGutterMinutes * pixPerMin +
      theme.size.timeEndGutterMinutes * pixPerMin +
      theme.size.timelineHeaderDayLabelWidth;

   const firstDayLabelPos = theme.size.timeStartGutterMinutes * pixPerMin;

   return (
      <StyledHeader width={fullHeaderWidthPx}>
         {/* DAYS ------- */}
         {/* drawing out the first order's start */}
         <DayLabel posLeft={firstDayLabelPos}>
            <span>{format(timelineStartDate, "yyyy.MM.dd. EEEE")}</span>
         </DayLabel>
         {dayStartDescriptors.map((start: DateWithStartMinute, idx) => {
            const posLeft = start.minutesPosition * pixPerMin + theme.size.timeStartGutterMinutes * pixPerMin;
            return (
               <DayLabel posLeft={posLeft} key={idx}>
                  <span>{format(start.startDate, "yyyy.MM.dd. EEEE")}</span>
               </DayLabel>
            );
         })}
         {/* HOURS ------- */}
         {hourStartDescriptors.map((start: DateWithStartMinute) => {
            const posLeft = start.minutesPosition * pixPerMin + theme.size.timeStartGutterMinutes * pixPerMin;
            if (start.startDate.getHours() % 4 === 0) {
               return (
                  <HourLabel posLeft={posLeft} key={posLeft}>
                     <span>{format(start.startDate, "HH:mm")}</span>
                  </HourLabel>
               );
            } else return null;
         })}
      </StyledHeader>
   );
};

export default TimelineHeader;

const StyledHeader = styled.div<{ width?: number }>`
   display: flex;
   background: ${theme.colors.background};
   height: ${theme.size.timelineHeaderHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};

   position: relative;
   z-index: 11;
`;

const DayLabel = styled.div<{ posLeft: number }>`
   position: absolute;

   background: ${theme.colors.nexogenBrand};
   color: #fff;
   font-size: 12px;
   font-weight: bold;

   display: flex;
   justify-content: center;
   flex-direction: column;

   align-items: center;
   border-left: 2px solid black;

   left: ${(props) => props.posLeft}px;
   width: ${theme.size.timelineHeaderDayLabelWidth}px;
   height: ${theme.size.timelineHeaderHeight / 2 - 2}px;
`;

const HourLabel = styled.div.attrs<{ posLeft: number }>((props) => ({
   style: {
      left: props.posLeft + "px",
   },
}))<{ posLeft: number }>`
   position: absolute;

   background: ${theme.colors.nexogenBrandLighter};
   color: black;
   font-size: 12px;
   font-family: "Poppins", sans-serif;
   font-weight: 300;

   display: flex;
   justify-content: center;
   flex-direction: column;

   align-items: center;
   border-left: 2px solid black;

   top: ${theme.size.timelineHeaderHeight / 2}px;
   height: ${theme.size.timelineHeaderHeight / 2 -4}px;

   width: 44px;

   ::after {
      content: "";

      position: absolute;
      bottom: -4px;
      left: -6px;

      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 5px 0 5px;
      border-color: #4fb8a1 transparent transparent transparent;
   }
`;
