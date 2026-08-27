import React from 'react'

const LocationSearchPanel = ({ suggestions = [],
   setVehiclePanel, 
   setPanelOpen, 
   setPickup, 
   setDestination, 
   activeField}) => {

    

const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion.formatted)
        } else if (activeField === 'destination') {
            setDestination(suggestion.formatted)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }

  return (
    <div>
      {
        suggestions.map((elem, idx)=> {
            return <div key={idx} onClick={()=> handleSuggestionClick(elem)} className='flex  border-2 p-3 rounded-xl border-gray-200  active:border-black item-center justify-start my-2'>
            <h2 className='h-10 w-10 rounded-full bg-[#eee] flex items-center justify-center mr-2'>
                <i className="ri-map-pin-line text-xl"></i>
            </h2>
            <h5 className='font-medium'>{elem.formatted}</h5>
            </div>
        })
      } 
    </div>
  )
}

export default LocationSearchPanel
