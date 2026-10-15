"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const OnBoarding = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-600">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 1, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex justify-center items-center h-screen"
      >
        <Image
          src="/onboard.svg"
          alt="Logo"
          width={300}
          height={100}
          className="min-w-full"
        />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
