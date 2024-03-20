import { View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { ISearchParams } from '../Screens/Home';

interface IProps {
  currentSearchParams: ISearchParams;
  filteringOptions: {options: string[], name: string}[];
  setQueryParams: (params: any) => void;
}

const Dropdown = ({currentSearchParams, filteringOptions, setQueryParams}: IProps) => {
  const handleSelect = (filteringOption: string, value: string) => {
    setQueryParams({
      ...currentSearchParams,
      [filteringOption]: value,
    })
  }

  return (
    <View>
      {filteringOptions.map((option) => {
        return (<SelectDropdown
          data={option.options}
          onSelect={(selectedItem, index) => handleSelect(option.name, selectedItem)}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />);
      })}
    </View>
  );
};

export default Dropdown;