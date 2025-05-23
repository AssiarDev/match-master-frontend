import logo from '../../assets/search.png';

// eslint-disable-next-line react/prop-types
export const Input = ({placeholder, value, onChange, type}) => {
    return <div className='relative text-white'>
        <input 
            className="border border-stone-800 placeholder:text-gray-500 focus:border-orange-500 focus:outline focus:outline-orange-500 rounded-sm px-2 py-1 mx-2"
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
        <img src={logo} alt='logo search' className='h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2'/>
    </div>
}