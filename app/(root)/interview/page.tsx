import Agent from '@/components/Agent'
import React from 'react'

const page = () => {
  return (
    <div>
      <h3>
        InterView Generation 
      </h3>
      <Agent userName='John Doe' userId="12345" type='genrate'/>
    </div>
  )
}

export default page
