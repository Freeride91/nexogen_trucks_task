import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";
import { format, eachDayOfInterval, differenceInMinutes } from "date-fns";
import { SizeContext } from "../App";

type DateWithStartMinute = {
   dayStartDate: Date;
   minutesPosition: number;
};

const TimelineHeader = ({ widthInMinutes, timelineStartDate, timelineEndDate }) => {
   const { pixelsPerMinutes: pixPerMin } = React.useContext(SizeContext);

   const eachDayStartDate: Array<Date> = eachDayOfInterval({ start: timelineStartDate, end: timelineEndDate });
   // removing the first one since it's before the beginning of the timeline
   eachDayStartDate.splice(0, 1);

   let eachDayStartDescriptor: Array<DateWithStartMinute> = eachDayStartDate.map((dayStartDate) => {
      const minute: number = differenceInMinutes(dayStartDate, timelineStartDate);
      return {
         dayStartDate,
         minutesPosition: minute,
      };
   });

   const fullHeaderWidth = widthInMinutes * pixPerMin + defaults.timeStartGutterMinutes * pixPerMin + defaults.timeEndGutterMinutes * pixPerMin + defaults.timelineHeaderDayLabelWidth;

   return (
      <StyledHeader width={fullHeaderWidth}>
         {eachDayStartDescriptor.map((dayStart) => {
            const posLeft = dayStart.minutesPosition * pixPerMin + defaults.timeStartGutterMinutes * pixPerMin;
            return (
               <DayLabel posLeft={posLeft}>
                  <span>{format(dayStart.dayStartDate, "yyyy.MM.dd. ")}</span>
                  <span>{format(dayStart.dayStartDate, "HH:mm")}</span>
               </DayLabel>
            );
         })}
      </StyledHeader>
   );
};

export default TimelineHeader;

const StyledHeader = styled.div<{ width?: number }>`
   display: flex;
   background: red;
   height: ${defaults.headerHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};

   position: relative;
`;

const DayLabel = styled.div<{ posLeft: number }>`
   position: absolute;

   background: white;
   color: black;
   font-size: 12px;

   display: flex;
   justify-content: center;
   flex-direction: column;

   align-items: center;
   border-left: 2px solid black;

   left: ${(props) => props.posLeft}px;
   width: ${defaults.timelineHeaderDayLabelWidth}px;
`;
