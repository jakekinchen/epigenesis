import React from 'react';
import { motion } from "framer-motion";
import Typewriter from 'typewriter-effect';
import PathMaker from './PathMaker';

const Banner: React.FC = () => {
  return (
    <>
      <section 
        id='home' 
        className='home-section max-w-7xl h-screen mx-auto flex flex-col gap-4 lgl:gap-8 mdl:px-10 xl:px-4 justify-center -mt-24'
      >
        <PathMaker
          uniqueId='home-path'
          startEdge='left'
          startY={65}
          endX={['home', 'left']}
          endY={['home', 'center']}
          strokeColor="#64ffda"
          circleColor="#64ffda"
          strokeWidth={5}
          circleRadius={4}
          animationDuration={8}
          strokeDasharray="4,4"
          hideOnMobile={true}
        />
        
        <motion.h3 
          className='text-xs md:text-lg font-codeFont tracking-wide text-textGreen' 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 2}}
        >
          Hello World, my name is
        </motion.h3>

        <motion.h1 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 2.2}} 
          className='text-3xl md:text-4xl lgl:text-6xl font-titleFont font-semibold flex flex-col'
        >
          Jake Kinchen.{" "}
          <span className='text-lg md:text-2xl lg:text-3xl text-textDark mt-2 lgl:mt-4'>
            <Typewriter 
              options={{
                strings: [
                  ' ',
                  'Full-Stack Developer',
                  'Design Engineer',
                  'Swift Developer',
                  'React Native Developer',
                  'Python Developer',
                  'Web Developer',
                  'Graphic Designer',
                  'Leader',
                ],
                autoStart: true,
                loop: true,
              }} 
            />
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 2.4}} 
          className='text-sm sml:text-base text-textDark font-medium max-w-2xl'
        >
          Born and raised in Baton Rouge, Based in Austin, Texas.<br />
          Software Engineer, with a Bachelors in Computer Science, with experience in Full-Stack Development through various projects and research studies at <em>LSU</em>. Eager to contribute to team success through hard work, attention to detail & creative problem solving. <br /> <br />
          <em>Fully committed to the philosophy of life-long learning.</em> <br />
          <a href="https://www.instagram.com/jakekinchen/">
            <span className='text-textGreen inline-flex relative cursor-pointer h-7 overflow-x-hidden group'>
              Learn More
              <span className='absolute w-full h-[1px] bg-textGreen left-0 bottom-1 translate-x-[110%] group-hover:translate-x-0 transition-transform duration-500'></span>
            </span>
          </a>
        </motion.p>

        <a href="#Experiences">
          <motion.button 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 2.5}} 
            className='w-40 h-10 text-xs sml:w-52 sml:h-14 sml:text-sm font-titleFont border border-textGreen rounded-md text-textGreen tracking-wide hover:bg-hoverColor duration-300'
          >
            Check out my Projects
          </motion.button>
        </a>
      </section>
    </>
  );
};

export default Banner; 