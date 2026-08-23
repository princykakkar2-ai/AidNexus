import React from "react";
import "./StatusBadge.css";

function StatusBadge({ status }) {
  if (!status) return null;

  const className = status.toLowerCase().replace(/\s+/g, "-");

  return <span className={`status-badge ${className}`}>{status}</span>;
}

export default StatusBadge;
