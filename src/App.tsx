import React, { useState, useEffect } from "react";
import TrucksDataSource from "./assets/trucktimeline.json";
import OrderLine from "./components/OrderLine";
import styled from "styled-components";
import Slider from "@material-ui/core/Slider";
import TimelineHeader from "./components/TimelineHeader";
import LicensePlate from "./components/LicensePlate";
import { getEarliestOrderStartDate, getLatestOrderEndDate } from "./utils/dateUtils";
import { ReactComponent as NexogenLogo } from "./assets/nexogen_logo.svg";
import { differenceInMinutes, eachDayOfInterval, eachHourOfInterval } from "date-fns";
import FilterInput from "./components/FilterInput";
import { withStyles } from "@material-ui/core/styles";
import { theme } from "./theme/theme";
import { defaults } from "./assets/defaults";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

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
                     if (start.startDate.getHours() % 4 === 0) {
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

const StyledMainContainer = styled.div`
   padding: 0 4px;
`;

const StyledHeaderWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   background: white;
   padding: 20px 0 12px;
   border-bottom: 1px solid #262233;

   .frontend-task {
      font-size: 17px;
      font-family: "Poppins", sans-serif;
      font-weight: 200;
   }
`;

const ControlsWrapper = styled.div`
   width: 100%;
   max-width: 1200px;
   margin: 16px auto 24px;

   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   grid-template-areas: "sli che fil";
   gap: 12px;

   font-family: "Poppins", sans-serif;
   font-weight: 300;

   @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr auto;
      grid-template-areas:
         "sli che"
         "fil fil";
   }

   .slider-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;

      text-align: center;

      .slider {
         display: flex;
         width: 100%;

         i {
            padding: 0 4px;
            color: ${theme.colors.nexogenBrand};
            font-size: 20px;
         }
      }
      grid-area: sli;
   }

   .checkbox-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-area: che;

      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;

      @media (max-width: 768px) {
         align-items: center;
         border-right: none;
      }
   }

   .filter-wrapper {
      grid-area: fil;
      text-align: center;

      @media (max-width: 768px) {
         margin-top: 16px;
         display: flex;
         align-items: center;
         justify-content: flex-end;

         .filter {
            margin-left: 8px;
            flex: 0 0 200px;
         }
      }
   }
`;

const StyledDataContainer = styled.div`
   width: 100%;
   max-width: 1200px;
   margin: 0 auto 16px;

   display: flex;
   border: 1px solid #aaaaaa;
`;

const StyledTruckNamesColumn = styled.div`
   padding-bottom: 16px;
`;

const StyledCornerTitle = styled.div<{ width?: number }>`
   font-family: "Poppins", sans-serif;
   font-weight: 200;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: ${theme.size.timelineHeaderHeight}px;

   font-size: 18px;
   font-weight: bold;
   i,
   span {
      color: #2a303e;
   }
`;

const StyledLicensePlateWrapper = styled.div<{ isDarker: boolean; isCompact: boolean }>`
   display: flex;
   align-items: center;
   justify-content: center;

   height: ${theme.size.lineHeight + theme.size.lineGap}px;
   padding: ${theme.size.lineGap / 2}px 8px;

   ${(props) =>
      props.isCompact &&
      `height: ${theme.size.lineHeight_compact + theme.size.lineGap_compact}px;
      padding: ${theme.size.lineGap_compact / 2}px 8px;`}

   background: ${(props) => props.isDarker && theme.colors.lineHighlighter};
`;

const StyledTimelineContainer = styled.div`
   overflow-y: auto;
   overflow-x: auto;
   position: relative;
   padding-bottom: 16px;
`;

const StyledVerticalLine = styled.div.attrs<{ posLeft: number }>((props) => ({
   style: {
      left: props.posLeft + "px",
   },
}))<{ posLeft: number }>`
   position: absolute;
   content: "";
   border-left: 1px solid rgba(0, 0, 0, 0.2);
   top: 0;
   height: 100%;
   z-index: 10;
`;

const NexogenSlider = withStyles({
   root: {
      color: theme.colors.nexogenBrand,
      height: 0,
      padding: "4px",
      margin: "4px 8px 0",
   },
   thumb: {
      height: 16,
      width: 16,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      marginTop: -5,
      marginLeft: -6,
      "&:focus, &:hover, &$active": {
         boxShadow: "inherit",
      },
   },
   active: {},
   valueLabel: {
      left: "calc(-50% + 4px)",
   },
   track: {
      height: 8,
      borderRadius: 4,
   },
   rail: {
      height: 8,
      borderRadius: 4,
   },
})(Slider);

const NexogenCheckbox = withStyles({
   root: {
      color: theme.colors.nexogenBrand,
      "&$checked": {
         color: theme.colors.nexogenBrand,
      },
      padding: "0 8px",
   },
   checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
