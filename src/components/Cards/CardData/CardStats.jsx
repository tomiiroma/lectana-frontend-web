import { FaUserGraduate } from "react-icons/fa"
import "./CardStats.css"

import React from 'react'

function CardStats({icon, number, label}) {
  return (
    <>
        <div className="stat-card stat-card-orange">
                 <div className="stat-icon">
                          {icon}
                        </div>
            <div className="stat-number">{number}</div>
            <div className="stat-label">{label}</div>
        </div>
    </>
  )
}

export default CardStats