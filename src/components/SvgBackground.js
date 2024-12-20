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
    <div ref={svgRef} style={{position: 'relative', width: '100wh', height: '100vh'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: '100wh', height: '100vh'}}>
        {children}
      </div>
    </div>
  );
}

export default SvgBackground;