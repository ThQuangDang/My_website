import React, { useEffect, useState } from "react";
import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  UserOutlined
} from "@ant-design/icons";
import "./DashBoard.css";
import axios from "axios"
import ChartDashBoard from "./ChartDashBoard";

export default function DashBoard() {

  return (
    <section id="dashboard">
      <div className="dashboard">
        <div className="dashboard-top">
          <div className="dashboard-top-search">
            <form>
              <input placeholder="Search ..."></input>
              <span>
                <SearchOutlined></SearchOutlined>
              </span>
            </form>
          </div>
          <div className="dashboard-top-content">
            <li className="dashboard-top-content-avatar">
              <img src="https://res.cloudinary.com/thaiquangdang/image/upload/v1713002411/pbndnuh1bqv3yrm5w9ob.png"></img>
              <span>Dang Quang Thai</span>
            </li>
            <li className="dashboard-top-content-bell">
              <BellOutlined></BellOutlined>
            </li>
          </div>
        </div>

        <ChartDashBoard></ChartDashBoard>

        <div className="dashboard-new">
          <div className="dashboard"></div>
          <div className="dashboard"></div>
        </div>
      </div>
    </section>
  );
}
