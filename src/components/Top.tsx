import React from "react";
import Clock from "./Clock";
import TopBar from "./TopBar";
import Updates from "./../Updates";

export default function Top() {
  return (
    <div className="container">
      <TopBar />
      <Clock />
      <Updates />
    </div>
  );
}
