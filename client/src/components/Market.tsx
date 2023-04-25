import React, {useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'

export const Market = () => {
  return (
    <>
      <div className="text-white p-5">
        <NavLink
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          to="my-listed"
        >
          {' '}
          My Listed Cars
        </NavLink>
      </div>
    </>
  )
}

export default Market
