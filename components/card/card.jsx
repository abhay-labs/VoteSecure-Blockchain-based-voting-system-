
import React from "react";
import Image from "next/image";

//INTERNAL IMPORT

import Style from "../card/card.module.css";
import images from "../../assets";



const card = ({candidateArray, giveVote,}) => {
  return (
    <div className={Style.card}>
      {candidateArray.map((eL, i) => (
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={eL[3]} alt="profile" />
          </div>
          <div className={Style.card_info}>
            <h2>
              {eL[1] } #{[2].toNumber()}
            </h2>
            <p>{eL[0]}</p>
            <p>Address: {eL[6].slice(0,30)}...</p>
            <p className={Style.total}>Total Votes</p>
          </div>
          <div className={Style.card_vote}>
            <p>{eL[4].toNumber()}</p>
          </div>
          <div className={Style.card_button}>
            <button onClick={() => giveVote({id: eL[2].toNumber(), address: eL[6]})}> Give Vote</button>
          </div>
        </div>
      ))}
    </div>
  )
};

export default card;

