"use client"
import React from 'react'
function error(error) {
    console.log(error)
  return (
    <div>{error.error.message}</div>
  )
}

export default error

