import React from "react";
import styled from "styled-components";
import { defaults } from "../assets/defaults";

const TimelineHeader = ({width}) => {
   return (
      <StyledHeader width={width}>
         
      </StyledHeader>
   );
};

export default TimelineHeader;

const StyledHeader = styled.div<{width?:number}>`
   display: flex;
   background: red;
   height: ${defaults.headerHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};
`;
