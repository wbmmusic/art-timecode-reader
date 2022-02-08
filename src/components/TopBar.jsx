import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";

export default function TopBar() {
  return (
    <div className="topBar">
      <div className="topBarDrag">
        artTimecode Reader v{window.electron.ver()}
      </div>
      <div className="topBarHover">
        <div className="minimize" onClick={() => window.electron.send("min")}>
          <MinimizeIcon style={iconStyle} />
        </div>
        <div className="close" onClick={() => window.electron.send("close")}>
          <CloseIcon style={iconStyle} />
        </div>
      </div>
    </div>
  );
}

const iconStyle = {
  fontSize: "14px",
};
