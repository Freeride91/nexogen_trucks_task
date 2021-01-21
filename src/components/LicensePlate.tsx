import React from "react";
import styled from "styled-components";
import eu from "../assets/eu.png";

const LicensePlate = ({ label }) => {
   return (
      <StyledLicensePlate>
         <div className="left">
            <img src={eu} alt="eu"/>
            <b>H</b>
         </div>
         <div className="right">
            {label.substr(0, 3)} {label.substr(3, 3)}
         </div>
      </StyledLicensePlate>
   );
};

export default LicensePlate;

const StyledLicensePlate = styled.div`
   display: grid;
   grid-template-columns: 1fr 6fr;
   width: 160px;
   height: 40px;
   background-color: #fff;
   
   border: 3px solid #5e5e5e;
   border-radius: 4px;

   .left {
      background: #274490;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
         margin-top: 1px;
         width: 15px;
         height: 15px;
      }
   }

   .right {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: bold;
   }
`;
