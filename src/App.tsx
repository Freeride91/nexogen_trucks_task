import React, { useState, useEffect } from "react";
import TrucksDataSource from "./assets/trucktimeline.json";
import OrderLineComponent from "./components/OrderLineComponent";
import styled from "styled-components";
import Slider from "@material-ui/core/Slider";
import { isBefore, isAfter } from "date-fns";
import TimelineHeader from "./components/TimelineHeader";
import { defaults } from "./assets/defaults";

type TruckType = {
   name: string;
   assignedOrderId: Array<string>;
};

type OrderType = {
   id: string;
   from: string;
   to: string;
};

type TruckWithOrders = TruckType & {
   assignedOrders: Array<OrderType>;
};

function getEarliestOrderStartDate(orders: Array<OrderType>): Date {
   let startDates = orders.map((order) => new Date(order.from));
   let orderedStartDates = startDates.sort((a, b) => {
      if (isBefore(a, b)) return -1;
      if (isAfter(a, b)) return 1;
      else return 0;
   });
   return orderedStartDates[0];
}
function getLatestOrderEndDate(orders: Array<OrderType>): Date {
   let endDates = orders.map((order) => new Date(order.to));
   let orderedEndDates = endDates.sort((a, b) => {
      if (isBefore(a, b)) return -1;
      if (isAfter(a, b)) return 1;
      else return 0;
   });
   return orderedEndDates[endDates.length - 1];
}

interface SizeState {
   pixelsPerMinutes: number;
};

const initialState: SizeState = {
   pixelsPerMinutes: defaults.pixelsPerMinutes,
};
export const SizeContext = React.createContext<SizeState>(initialState);


function App() {
   const [trucksWithOrders, setTrucksWithOrders] = useState<TruckWithOrders[]>([]);

   const [startDate, setStartDate] = useState<Date>(getEarliestOrderStartDate(TrucksDataSource.orders));
   const [endDate, setEndDate] = useState<Date>(getLatestOrderEndDate(TrucksDataSource.orders));
   const [minutesRange, setMinutesRange] = useState(0);
   const [pixelsPerMinutes, setPixelsPerMinutes] = useState<number>(defaults.pixelsPerMinutes);

   useEffect(() => {
      const trucksWithOrders = TrucksDataSource.trucks.map((truck: TruckType) => {
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
         <h1>HELLO Nexogen</h1>
         <ControlsWrapper>
            <Slider min={0.2} max={0.8} step={0.1} value={pixelsPerMinutes} onChange={handleSliderChange} />
         </ControlsWrapper>
         <br />

         <MainContainer>
            <StyledTruckLabels>
               <StyledTruckTitle width={defaults.truckNameLabelWidth}>
                  <span>Trucks</span>
                  <i className="fas fa-angle-down"></i>
               </StyledTruckTitle>

               {trucksWithOrders.map((truckWithOrder, idx) => {
                  return (
                     <StyledTruckLabel key={idx} labelWidth={defaults.truckNameLabelWidth}>
                        {truckWithOrder.name}
                     </StyledTruckLabel>
                  );
               })}
            </StyledTruckLabels>

            <StyledTimelineContainer>
               <TimelineHeader widthInMinutes={minutesRange} timelineStartDate={startDate} timelineEndDate={endDate} />
               {trucksWithOrders.map((truckData: TruckWithOrders, idx: number) => (
                  <OrderLineComponent key={idx} assignedOrders={truckData.assignedOrders} startDate={startDate} endDate={endDate} />
               ))}
            </StyledTimelineContainer>
         </MainContainer>
      </SizeContext.Provider>
   );
}

export default App;

const ControlsWrapper = styled.div`
   width: 300px;
`;

const MainContainer = styled.div`
   display: flex;
`;

const StyledTruckLabels = styled.div`
   margin-right: 8px;
`;

const StyledTruckTitle = styled.div<{ width?: number }>`
   background: black;
   color: white;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: ${defaults.headerHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};
`;

const StyledTruckLabel = styled.div<{ labelWidth: number }>`
   display: flex;
   align-items: center;
   justify-content: center;

   flex-shrink: 0;
   width: ${(props) => props.labelWidth}px;

   height: 40px;
   background-color: #333;
   color: #fff;
   border: 1px solid white;

   margin: ${defaults.lineGap}px 0;
`;

const StyledTimelineContainer = styled.div`
   background: #e7f6fa;
   overflow-y: auto;
   overflow-x: auto;
`;
