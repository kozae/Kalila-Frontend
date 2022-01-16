import React from "react";
import {motion} from "framer-motion";


export const withTransition = (OriginalComponent: React.JSXElementConstructor<any>, props: any, className: string | undefined = undefined) => {
  return () => {
    return (
      <motion.div
        className={className}
        initial={{opacity: 0, y: 100}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: 100}}
        transition={{duration: 0.5, ease: "easeIn"}}>
        <OriginalComponent {...props}/>
      </motion.div>

    );
  }
};
