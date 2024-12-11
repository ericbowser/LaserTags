import React, {useEffect, useRef} from 'react';
import {SVG} from '@svgdotjs/svg.js';
import back from '../assets/circle-scatter-haikei.svg';

function SvgBackground({children}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const draw = SVG().addTo(svgRef.current).size('100vw', '100vh');

    // Import high-resolution image
    const image = draw.image(back).size(2560, 1440);
  }, []);

  return (
    <div ref={svgRef} >
      {children}
    </div>
  );
}

export default SvgBackground;