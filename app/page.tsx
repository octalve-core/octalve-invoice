"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-600">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/full_logo.svg"
          alt="Logo"
          width={200}
          height={100}
          className=""
        />
      </motion.div>
    </div>
  );
}
