import React, { useState, useEffect } from "react";
import TrucksDataSource from "./assets/trucktimeline.json";
import OrderLine from "./components/OrderLine";
import styled from "styled-components";
import Slider from "@material-ui/core/Slider";
import TimelineHeader from "./components/TimelineHeader";
import { defaults } from "./assets/defaults";
import LicensePlate from "./components/LicensePlate";
import { getEarliestOrderStartDate, getLatestOrderEndDate } from "./utils/dateUtils";

type TruckType = {
   name: string;
   assignedOrderId: Array<string>;
};

export type OrderType = {
   id: string;
   from: string;
   to: string;
};

type TruckWithOrders = TruckType & {
   assignedOrders: Array<OrderType>;
};

interface SizeState {
   pixelsPerMinutes: number;
}

const initialState: SizeState = {
   pixelsPerMinutes: defaults.pixelsPerMinutes,
};

export const SizeContext = React.createContext<SizeState>(initialState);

function App() {
   const [trucksWithOrders, setTrucksWithOrders] = useState<TruckWithOrders[]>([]);

   const [startDate, setStartDate] = useState<Date>(getEarliestOrderStartDate(TrucksDataSource.orders));
   const [endDate, setEndDate] = useState<Date>(getLatestOrderEndDate(TrucksDataSource.orders));
   const [minutesRange, setMinutesRange] = useState<number>(0);
   const [pixelsPerMinutes, setPixelsPerMinutes] = useState<number>(defaults.pixelsPerMinutes);

   useEffect(() => {
      const trucksWithOrders: Array<TruckWithOrders> = TrucksDataSource.trucks.map((truck: TruckType) => {
         let assignedOrders: OrderType[] = [];

         truck.assignedOrderId.forEach((id) => {
            const order: OrderType | undefined = TrucksDataSource.orders.find((order) => order.id === id);
            if (order) {
               assignedOrders.push(order);
            }
         });

         return { ...truck, assignedOrders };
      });

      setTrucksWithOrders(trucksWithOrders);

      const minutesRange = Math.round((endDate!.getTime() - startDate!.getTime()) / 1000 / 60);
      setMinutesRange(minutesRange);
   }, []);

   const handleSliderChange = (e, value) => {
      if (value !== pixelsPerMinutes) {
         setPixelsPerMinutes(value as number);
      }
   };

   return (
      <SizeContext.Provider value={{ pixelsPerMinutes }}>
         <StyledMainContainer>
            <h1 className="center">Nexogen Frontend Task</h1>

            <ControlsWrapper>
               Time size: <Slider min={0.2} max={0.8} step={0.1} value={pixelsPerMinutes} onChange={handleSliderChange} />
            </ControlsWrapper>

            <StyledDataContainer>
               <StyledTrucksColumn>
                  <StyledTitle>
                     <span>Trucks</span>
                     <i className="fas fa-angle-down"></i>
                  </StyledTitle>

                  {trucksWithOrders.map((truckWithOrder, idx) => {
                     return (
                        <StyledLicensePlateWrapper key={idx}>
                           <LicensePlate label={truckWithOrder.name} />
                        </StyledLicensePlateWrapper>
                     );
                  })}
               </StyledTrucksColumn>

               <StyledTimelineContainer>
                  <TimelineHeader widthInMinutes={minutesRange} timelineStartDate={startDate} timelineEndDate={endDate} />
                  {trucksWithOrders.map((truckData: TruckWithOrders, idx: number) => (
                     <OrderLine
                        key={idx}
                        widthInMinutes={minutesRange}
                        assignedOrders={truckData.assignedOrders}
                        startDate={startDate}
                        endDate={endDate}
                     />
                  ))}
               </StyledTimelineContainer>
            </StyledDataContainer>
         </StyledMainContainer>
      </SizeContext.Provider>
   );
}

export default App;


const StyledMainContainer = styled.div`
   padding: 20px;
   background: #F3F5FF;
`;

const ControlsWrapper = styled.div`
   width: 300px;
`;

const StyledDataContainer = styled.div`
   display: flex;
`;

const StyledTrucksColumn = styled.div`
   margin-right: 8px;
`;

const StyledTitle = styled.div<{ width?: number }>`
   background: black;
   color: white;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: ${defaults.timelineHeaderHeight}px;
   width: 200px;
`;

const StyledLicensePlateWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;

   flex-shrink: 0;
   width: 200px;

   height: ${defaults.lineHeight}px;
   background-color: #ccc;

   margin: ${defaults.lineGap}px 0 0 0;
`;

const StyledTimelineContainer = styled.div`
   overflow-y: auto;
   overflow-x: auto;
`;
