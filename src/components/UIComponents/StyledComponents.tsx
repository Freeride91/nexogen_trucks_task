import styled from "styled-components";
import Slider from "@material-ui/core/Slider";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import { theme } from "../../theme/theme";

export const StyledLoader = styled.div`
   height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
   h1 {
      font-size: 24px;
      font-family: "Poppins", sans-serif;
      font-weight: 400;
   }
`;

export const StyledMainContainer = styled.div`
   padding: 0 4px;
`;

export const StyledHeaderWrapper = styled.div`
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

export const ControlsWrapper = styled.div`
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
         justify-content: flex-end;
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

export const StyledDataContainer = styled.div`
   width: 100%;
   max-width: 1200px;
   margin: 0 auto 16px;

   display: flex;
   border: 1px solid #aaaaaa;
`;

export const StyledTruckNamesColumn = styled.div`
   padding-bottom: 16px;
`;

export const StyledCornerTitle = styled.div<{ width?: number }>`
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

export const StyledLicensePlateWrapper = styled.div<{ isDarker: boolean; isCompact: boolean }>`
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

export const StyledTimelineContainer = styled.div`
   overflow-y: auto;
   overflow-x: auto;
   position: relative;
   padding-bottom: 16px;
`;

export const StyledVerticalLine = styled.div.attrs<{ posLeft: number }>((props) => ({
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

export const NexogenSlider = withStyles({
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

export const NexogenCheckbox = withStyles({
   root: {
      color: theme.colors.nexogenBrand,
      "&$checked": {
         color: theme.colors.nexogenBrand,
      },
      padding: "0 8px",
   },
   checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
