import React, {useEffect, useRef} from 'react';
import {SVG} from '@svgdotjs/svg.js';
import back from '../assets/circle-scatter-haikei.svg';

function SvgBackground({children}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const draw = SVG().addTo(svgRef.current).size('100vw', '100vh');
    draw.position = 'relative';

    // Import high-resolution image
    const image = draw.image(back).size(draw.image.width, draw.image.height);
  }, []);

  return (
    <div ref={svgRef} className={'w-screen h-screen'}>
        {children}
    </div>
  );
}

export default SvgBackground;