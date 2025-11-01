import React from 'react'

const LocationSearchPanel = (props) => {

    console.log(props);

    const locations = [
        "Shree KrishnaSagar Resturant, Channasandra, RajaRajeshwari Nagar",
        "Shree RadheKrishna Resturant, Channasandra, RajaRajeshwari Nagar",
        "Arishi Tea Stall, Channasandra, RajaRajeshwari Nagar",
        "Vrindavan Resturant, RajaRajeshwari Nagar"
    ]

  return (
    <div>
      {/* sample search panel */}
      {
        locations.map((elem, idx)=> {
            return <div key={idx} onClick={()=> {
                props.setVehiclePanel(true)
                props.setPanelOpen(false)
            }} className='flex  border-2 p-3 rounded-xl border-gray-200  active:border-black item-center justify-start my-2'>
            <h2 className='h-10 w-10 rounded-full bg-[#eee] flex items-center justify-center mr-2'>
                <i className="ri-map-pin-line text-xl"></i>
            </h2>
            <h5 className='font-medium'>{elem}</h5>
            </div>
        })
      } 
    </div>
  )
}

export default LocationSearchPanel
