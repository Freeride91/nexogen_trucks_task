import React from "react";
import Autosuggest from "react-autosuggest";

type FilterProps = {
   truckNames: Array<string>;
   onChange: (value: any) => void;
};

type FilterState = {
   value: string;
   suggestions: Array<any>;
};

class FilterInput extends React.Component<FilterProps, FilterState> {
   constructor(props) {
      super(props);

      this.state = {
         value: "",
         suggestions: [],
      };
   }

   escapeRegexCharacters(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
   }

   getSuggestions(value) {
      const escapedValue = this.escapeRegexCharacters(value.trim());
      if (escapedValue === "") {
         return [];
      }
      const regex = new RegExp("^" + escapedValue, "i");
      return this.props.truckNames.filter((name) => regex.test(name));
   }

   getSuggestionValue(suggestion) {
      return suggestion;
   }

   renderSuggestion(suggestion) {
      return <span>{suggestion}</span>;
   }

   onChange = (event, { newValue, method }) => {
      this.setState({
         value: newValue,
      });
      this.props.onChange(newValue);
   };

   onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
         suggestions: this.getSuggestions(value),
      });
   };

   onSuggestionsClearRequested = () => {
      this.setState({
         suggestions: [],
      });
   };

   render() {
      const inputProps = {
         placeholder: "Truck Name",
         value: this.state.value,
         onChange: this.onChange,
      };

      return (
         <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
         />
      );
   }
}

export default FilterInput;
