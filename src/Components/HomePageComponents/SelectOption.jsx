import Select from 'react-select'
import PropTypes from 'prop-types'


const SelectOption = ({placeholder, changeHandler, options}) => {

    const handleChange = (option) => {
        changeHandler(option?.value)
    }

    return (
        <Select
            options={options}
            placeholder={placeholder}
            onChange={handleChange}
            className='my-6 w-[300px]'
        />
    );
};


SelectOption.propTypes = {
    placeholder: PropTypes.string,
    changeHandler: PropTypes.func,
    options: PropTypes.array,
}
export default SelectOption;