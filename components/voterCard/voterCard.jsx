import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "../card/card.module.css";
import images from "../../assets";
import voterCardStyle from "./voterCard.module.css";

const voterCard = ({voterArray}) => {
  return (
    <div className={Style.card}>
      {voterArray.map((eL, i) => (
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={eL[4]} alt="Profile Photo" />
          </div>
          <div className={Style.card_info}>
            <h2>
              {eL[1]} #{eL[0].toNumber}
            </h2>
            <p>Address: {eL[3].slice(0, 30)}...</p>
            <p>details</p>
            <p className={voterCardStyle.vote_Status}>
              {eL[6] == true ? "You Already Voted" : "Not Voted"}
            </p>
          </div>
        </div>
      ))}
    </div>

    
  )
};

export default voterCard;
