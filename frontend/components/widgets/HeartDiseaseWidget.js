"use client";
import { useEffect } from "react";

const HeartDiseaseWidget = () => {
  useEffect(() => {
    // Dynamically import the heart disease simulation script
    const script = document.createElement("script");
    script.src = "/heart-simulation.js";
    script.type = "module";
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div className="w-full h-[80vh] relative">
      <div id="heart-widget-overlay" className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"></div>
    </div>
  );
};

export default HeartDiseaseWidget;
