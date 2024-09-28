import Select from 'react-select'
import PropTypes from 'prop-types'

const colors = {
    amber: '#fbbf24',
    slate: '#111827',
}

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: colors.amber,  // Background of the select input
        borderColor: colors.amber,  // Border color when focused
        boxShadow: state.isFocused ? '0 0 0 2px #007bff' : null,  // Box-shadow when focused
        '&:hover': {
            borderColor: '#fbbf24'  // Border color on hover
        },
    }),

    // these styles wil be added to the dropdown menu
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? colors.amber : colors.amber,  // Background color is amber but when hovered the bakcground is slate
        color: colors.slate,  // Text color
        '&:hover': {
            backgroundColor: colors.slate,  // Background color on hover
            color: colors.amber  // Text color on hover
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: colors.slate,  // Text color of the selected option
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: colors.slate,  // Background of the dropdown menu
    }),
    placeholder: (provided) => ({
        ...provided,
        color: colors.slate,  // Color of the placeholder text
        fontStyle: 'italic',  // You can add font style or other properties
    })
};



const SelectOption = ({ placeholder, changeHandler, options }) => {

    const handleChange = (option) => {
        changeHandler(option?.value)
    }

    return (
        <Select
            options={options}
            placeholder={placeholder}
            onChange={handleChange}
            className='my-6 w-[300px]'
            styles={customStyles}
        />
    );
};


SelectOption.propTypes = {
    placeholder: PropTypes.string,
    changeHandler: PropTypes.func,
    options: PropTypes.array,
}
export default SelectOption;