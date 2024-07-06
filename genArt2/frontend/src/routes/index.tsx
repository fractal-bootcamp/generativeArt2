import { Link } from "react-router-dom";
import { useState } from "react";

export default function IndexPage() {

  return (
    <>
      <div className="main-box-homePage">
        <h1>The moving gallery</h1>
        <div>
          <ul>

            <li><Link to="/backgrounds">Come to the Background Loft and create new ones</Link></li>
            <li><Link to="/chess">Explore Warnsdorff's algorithm</Link></li>
            <li><Link to="/gallery">Meet our gallery</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};