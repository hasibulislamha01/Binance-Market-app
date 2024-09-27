import Select from 'react-select'
import PropTypes from 'prop-types'

const options = [
    { value: 'ethusdt', label: 'ETH/USDT' },
    { value: 'bnbusdt', label: 'BNB/USDT' },
    { value: 'dotusdt', label: 'DOT/USDT' },
]
const SelectCoin = ({placeholder, changeHandler}) => {

    const handleChange = (option) => {
        changeHandler(option?.value)
    }

    return (
        <Select
            options={options}
            placeholder={placeholder}
            onChange={handleChange}
            className='my-6 w-[300px] mx-auto'
        />
    );
};


SelectCoin.propTypes = {
    placeholder: PropTypes.string,
    changeHandler: PropTypes.func
}
export default SelectCoin;