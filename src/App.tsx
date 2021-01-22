import React, { useState, useEffect } from "react";
import TrucksDataSource from "./assets/trucktimeline.json";
import OrderLine from "./components/OrderLine";
import TimelineHeader from "./components/TimelineHeader";
import LicensePlate from "./components/LicensePlate";
import { getEarliestOrderStartDate, getLatestOrderEndDate } from "./utils/dateUtils";
import { ReactComponent as NexogenLogo } from "./assets/nexogen_logo.svg";
import { differenceInMinutes, eachDayOfInterval, eachHourOfInterval } from "date-fns";
import FilterInput from "./components/FilterInput";
import { theme } from "./theme/theme";
import { defaults } from "./assets/defaults";
import {
   StyledMainContainer,
   StyledHeaderWrapper,
   ControlsWrapper,
   NexogenSlider,
   NexogenCheckbox,
   StyledDataContainer,
   StyledTruckNamesColumn,
   StyledCornerTitle,
   StyledLicensePlateWrapper,
   StyledTimelineContainer,
   StyledVerticalLine,
   StyledLoader,
} from "./components/UIComponents/StyledComponents";

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

type DateWithStartMinute = {
   startDate: Date;
   minutesPosition: number;
};

interface SizeState {
   pixelsPerMinutes: number;
   isCompact: boolean;
}
const initialState: SizeState = {
   pixelsPerMinutes: defaults.pixelsPerMinutes,
   isCompact: defaults.isCompactMode,
};
export const SizeContext = React.createContext<SizeState>(initialState);

function App() {
   const [truckNamesForSuggest, setTruckNamesForSuggest] = useState<Array<string>>([]);

   const [trucksWithOrders, setTrucksWithOrders] = useState<TruckWithOrders[]>([]);
   const [filteredTrucksWithOrders, setFilteredTrucksWithOrders] = useState<TruckWithOrders[]>([]);

   const [startDate, setStartDate] = useState<Date>(getEarliestOrderStartDate(TrucksDataSource.orders));
   const [endDate, setEndDate] = useState<Date>(getLatestOrderEndDate(TrucksDataSource.orders));
   const [minutesRange, setMinutesRange] = useState<number>(0);
   const [pixelsPerMinutes, setPixelsPerMinutes] = useState<number>(defaults.pixelsPerMinutes);
   const [dayStartDescriptors, setDayStartDescriptors] = useState<Array<DateWithStartMinute>>([]);
   const [hourStartDescriptors, setHourStartDescriptors] = useState<Array<DateWithStartMinute>>([]);

   const [isCompactMode, setIsCompactMode] = useState<boolean>(defaults.isCompactMode);

   const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setFilteredTrucksWithOrders(trucksWithOrders);

      const truckNames: Array<string> = TrucksDataSource.trucks.map((truck) => truck.name);
      setTruckNamesForSuggest(truckNames);

      const minutesRange = Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60);
      setMinutesRange(minutesRange);

      const eachDayStartDates: Array<Date> = eachDayOfInterval({ start: startDate, end: endDate });
      // removing the first one since it's before the beginning of the timeline
      eachDayStartDates.splice(0, 1);

      let eachDayStartDescriptors: Array<DateWithStartMinute> = eachDayStartDates.map((dayStartDate) => {
         const minute: number = differenceInMinutes(dayStartDate, startDate);
         return {
            startDate: dayStartDate,
            minutesPosition: minute,
         };
      });
      setDayStartDescriptors(eachDayStartDescriptors);

      const eachHourStartDates: Array<Date> = eachHourOfInterval({ start: startDate, end: endDate });

      let eachHourStartDescriptors: Array<DateWithStartMinute> = eachHourStartDates.map((hourStartDate) => {
         const minute: number = differenceInMinutes(hourStartDate, startDate);
         return {
            startDate: hourStartDate,
            minutesPosition: minute,
         };
      });
      setHourStartDescriptors(eachHourStartDescriptors);

      setIsLoading(false);
   }, []);

   const handleSliderChange = (e, value) => {
      if (value !== pixelsPerMinutes) {
         setPixelsPerMinutes(value as number);
      }
   };

   const handleFilterChange = (value) => {
      const filteredTrucksWithOrders = trucksWithOrders.filter((truck) => truck.name.startsWith(value.trim().toUpperCase()));
      setFilteredTrucksWithOrders(filteredTrucksWithOrders);
   };

   if (isLoading)
      return (
         <StyledLoader>
            <h1>Loading...</h1>
         </StyledLoader>
      );

   return (
      <SizeContext.Provider value={{ pixelsPerMinutes, isCompact: isCompactMode }}>
         <StyledMainContainer>
            <StyledHeaderWrapper>
               <NexogenLogo />
               <div className="frontend-task">Frontend Task by András Polyák</div>
            </StyledHeaderWrapper>

            <ControlsWrapper>
               <div className="slider-wrapper">
                  <div className="title">Horizontal Zoom</div>
                  <div className="slider">
                     <i className="fas fa-search-minus"></i>
                     <NexogenSlider min={0.3} max={1} step={0.1} value={pixelsPerMinutes} onChange={handleSliderChange} />
                     <i className="fas fa-search-plus"></i>
                  </div>
               </div>
               <div className="checkbox-wrapper">
                  <div className="title">Compact mode</div>
                  <NexogenCheckbox checked={isCompactMode} onChange={(e) => setIsCompactMode(e.target.checked)} />
               </div>
               <div className="filter-wrapper">
                  <span className="title">Truck&nbsp;Filter</span>
                  <div className="filter">
                     <FilterInput truckNames={truckNamesForSuggest} onChange={handleFilterChange} />
                  </div>
               </div>
            </ControlsWrapper>

            <StyledDataContainer>
               <StyledTruckNamesColumn>
                  <StyledCornerTitle>
                     <span>Trucks</span>
                     <i className="fas fa-angle-down"></i>
                  </StyledCornerTitle>

                  {filteredTrucksWithOrders.map((truckWithOrder, idx) => {
                     return (
                        <StyledLicensePlateWrapper key={truckWithOrder.name} isDarker={idx % 2 === 0} isCompact={isCompactMode}>
                           {isCompactMode ? <b>{truckWithOrder.name}</b> : <LicensePlate label={truckWithOrder.name} />}
                        </StyledLicensePlateWrapper>
                     );
                  })}
               </StyledTruckNamesColumn>

               <StyledTimelineContainer>
                  <TimelineHeader
                     timelineStartDate={startDate}
                     widthInMinutes={minutesRange}
                     dayStartDescriptors={dayStartDescriptors}
                     hourStartDescriptors={hourStartDescriptors}
                  />

                  {filteredTrucksWithOrders.map((truckData: TruckWithOrders, idx: number) => {
                     return (
                        <OrderLine
                           key={idx}
                           isDarker={idx % 2 === 0}
                           widthInMinutes={minutesRange}
                           assignedOrders={truckData.assignedOrders}
                           startDate={startDate}
                           endDate={endDate}
                        />
                     );
                  })}

                  {hourStartDescriptors.map((start: DateWithStartMinute) => {
                     const posLeft = start.minutesPosition * pixelsPerMinutes + theme.size.timeStartGutterMinutes * pixelsPerMinutes;
                     if (start.startDate.getHours() % defaults.hourLabelFrequency === 0) {
                        return <StyledVerticalLine posLeft={posLeft} key={posLeft} />;
                     } else return null;
                  })}
               </StyledTimelineContainer>
            </StyledDataContainer>
         </StyledMainContainer>
      </SizeContext.Provider>
   );
}

export default App;
