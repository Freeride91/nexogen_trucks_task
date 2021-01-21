import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";
import { format, eachDayOfInterval, differenceInMinutes, eachHourOfInterval } from "date-fns";
import { SizeContext } from "../App";

type DateWithStartMinute = {
   startDate: Date;
   minutesPosition: number;
};

const TimelineHeader = ({ widthInMinutes, timelineStartDate, timelineEndDate }) => {
   const { pixelsPerMinutes: pixPerMin } = React.useContext(SizeContext);

   const eachDayStartDates: Array<Date> = eachDayOfInterval({ start: timelineStartDate, end: timelineEndDate });
   // removing the first one since it's before the beginning of the timeline
   eachDayStartDates.splice(0, 1);

   let eachDayStartDescriptors: Array<DateWithStartMinute> = eachDayStartDates.map((dayStartDate) => {
      const minute: number = differenceInMinutes(dayStartDate, timelineStartDate);
      return {
         startDate: dayStartDate,
         minutesPosition: minute,
      };
   });

   const eachHourStartDates: Array<Date> = eachHourOfInterval({ start: timelineStartDate, end: timelineEndDate });

   let eachHourStartDescriptors: Array<DateWithStartMinute> = eachHourStartDates.map((hourStartDate) => {
      const minute: number = differenceInMinutes(hourStartDate, timelineStartDate);
      return {
         startDate: hourStartDate,
         minutesPosition: minute,
      };
   });

   const fullHeaderWidth =
      widthInMinutes * pixPerMin +
      defaults.timeStartGutterMinutes * pixPerMin +
      defaults.timeEndGutterMinutes * pixPerMin +
      defaults.timelineHeaderDayLabelWidth;

   const firstDayLabelPos = defaults.timeStartGutterMinutes * pixPerMin;

   return (
      <StyledHeader width={fullHeaderWidth}>
         {/* DAYS ------- */}
         {/* drawing out the first order's start */}
         <DayLabel posLeft={firstDayLabelPos}>
            <span>{format(timelineStartDate, "yyyy.MM.dd. EEEE")}</span>
         </DayLabel>
         {eachDayStartDescriptors.map((start: DateWithStartMinute) => {
            const posLeft = start.minutesPosition * pixPerMin + defaults.timeStartGutterMinutes * pixPerMin;
            return (
               <DayLabel posLeft={posLeft}>
                  <span>{format(start.startDate, "yyyy.MM.dd. EEEE")}</span>
               </DayLabel>
            );
         })}
         {/* HOURS ------- */}
         {eachHourStartDescriptors.map((start: DateWithStartMinute) => {
            const posLeft = start.minutesPosition * pixPerMin + defaults.timeStartGutterMinutes * pixPerMin;
            if (start.startDate.getHours() % 4 === 0) {
               return (
                  <HourLabel posLeft={posLeft}>
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
   background: #fff;
   height: ${defaults.timelineHeaderHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};

   position: relative;
`;

const DayLabel = styled.div<{ posLeft: number }>`
   position: absolute;

   background: #4fb8a2;
   color: #fff;
   font-size: 12px;
   font-weight: bold;

   display: flex;
   justify-content: center;
   flex-direction: column;

   align-items: center;
   border-left: 2px solid black;

   left: ${(props) => props.posLeft}px;
   width: ${defaults.timelineHeaderDayLabelWidth}px;
   height: ${defaults.timelineHeaderHeight / 2 - 2}px;

   /* ::after {
      content: "";

      position: absolute;
      right: -24px;

      width: 0;
      height: 0;
      border-style: solid;
      border-width: 11px 0 11px 22px;
      border-color: transparent transparent transparent #4fb8a2;
   } */
`;

const HourLabel = styled.div.attrs<{ posLeft: number }>((props) => ({
   style: {
      left: props.posLeft + "px",
   },
}))<{ posLeft: number }>`
   position: absolute;

   background: #e9e9e9;
   color: black;
   font-size: 12px;

   display: flex;
   justify-content: center;
   flex-direction: column;

   align-items: center;
   border-left: 2px solid black;

   top: ${defaults.timelineHeaderHeight / 2}px;
   height: ${defaults.timelineHeaderHeight / 2 -4}px;

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
