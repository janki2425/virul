import React from "react";
import styles from "../styles/CustomLoader.module.css";

const CustomLoader = () => {
  return (
    <div className="px-4 mt-13 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-[600]">Upcoming Events</h2>
      </div>
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default CustomLoader;
