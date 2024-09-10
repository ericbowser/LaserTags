
import React, { useEffect, useRef } from 'react';
import { SVG } from '@svgdotjs/svg.js';
import image from '../assets/lwede_line.png';

function SvgComponent() {
    const svgRef = useRef(null);

    useEffect(() => {
        const draw = SVG().addTo(svgRef.current).size('100%', '100%');

        // Import high-resolution image
        const image = draw.image('../assets/lwede_line.png').size(3872, 3872);

        // Export or save as SVG
        const exportSvg = () => {
            const svgData = draw.svg();
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.svg';
            a.click();
            URL.revokeObjectURL(url);
        };

        // Add a button to trigger the export
        const button = document.createElement('button');
        button.innerText = 'Export SVG';
        button.onclick = exportSvg;
        svgRef.current.appendChild(button);

    }, []);

    return <div ref={svgRef} style={{ width: '100%', height: '100vh' }}></div>;
}

export default SvgComponent;