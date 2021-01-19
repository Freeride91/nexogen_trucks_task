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

function App() {
   const [trucksWithOrders, setTrucksWithOrders] = useState<TruckWithOrders[]>([]);
   const [size, setSize] = useState<number>(300);

   const [startDate, setStartDate] = useState<Date>(getEarliestOrderStartDate(TrucksDataSource.orders));
   const [endDate, setEndDate] = useState<Date>(getLatestOrderEndDate(TrucksDataSource.orders));
   const [minutesRange, setMinutesRange] = useState(0);
   // const [pixelsPerMinutes, setPixelsPerMinutes] = useState(0.5);

   const handleSliderChange = (e, value) => {
      if (value !== size) {
         setSize(value as number);
      }
   };

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

      console.log(minutesRange / 60 / 24);
   }, []);

   return (
      <div>
         <h1>HELLO Nexogen</h1>
         <ControlsWrapper>
            <Slider min={200} max={500} step={5} value={size} onChange={handleSliderChange} />
         </ControlsWrapper>
         <br />

         <MainContainer>
            <StyledTruckLabels>
               <StyledTruckTitle width={defaults.truckLabelWidth}>
                  <span>Trucks</span>
                  <i className="fas fa-angle-down"></i>
               </StyledTruckTitle>

               {trucksWithOrders.map((truckWithOrder, idx) => {
                  return (
                     <StyledTruckLabel key={idx} labelWidth={defaults.truckLabelWidth}>
                        {truckWithOrder.name}
                     </StyledTruckLabel>
                  );
               })}
            </StyledTruckLabels>

            <StyledTimelineContainer>
               <TimelineHeader width={minutesRange * defaults.pixelsPerMinutes} startDate={startDate} endDate={endDate} />
               {trucksWithOrders.map((truckData: TruckWithOrders, idx: number) => (
                  <OrderLineComponent key={idx} assignedOrders={truckData.assignedOrders} width={size} startDate={startDate} endDate={endDate} />
               ))}
            </StyledTimelineContainer>
         </MainContainer>
      </div>
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
   margin-right: 4px;
`;

const StyledTruckLabel = styled.div<{ labelWidth?: number }>`
   display: flex;
   align-items: center;
   justify-content: center;

   flex-shrink: 0;
   width: 100px;
   width: ${(props) => props.labelWidth && `${props.labelWidth}px`};

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

const StyledTruckTitle = styled.div<{ width?: number }>`
   background: black;
   color: white;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   margin-right: 12px;
   height: ${defaults.headerHeight}px;
   ${(props) => props.width && `width: ${props.width}px;`};
`;
