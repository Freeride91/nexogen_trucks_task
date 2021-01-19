import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";
import { format } from "date-fns";

const TimelineHeader = ({ width, startDate, endDate }) => {
   return (
      <StyledHeader width={width}>
         <DividerWithLabel>
            <span>{format(startDate, "yyyy.MM.dd.")}</span>
            <span>{format(startDate, "HH:mm")}</span>
         </DividerWithLabel>
      </StyledHeader>
   );
};

export default TimelineHeader;

const StyledHeader = styled.div<{ width?: number }>`
   display: flex;
   background: red;
   height: ${defaults.headerHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};
`;

const DividerWithLabel = styled.div`
   background: white;
   color: black;
   font-size: 12px;

   display: flex;
   justify-content: center;
   flex-direction: column;

   align-items: center;
   border-left: 1px solid black;
`;
