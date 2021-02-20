import { useEffect, useState } from 'react';

export default function useGeneratorColor() {
    const [color, setColor] = useState({});

    // Regeneruję RGB od (64,64,64) do (192, 192, 192).
    // Aby uniknać czarnych oraz zbyt jasnych kolorów.
    const min = 64, max = 192;

    useEffect(() => {
        const rgb = [];
        let generatedColor = "";
        for (let i = 0; i < 3; i++) {
            let random = Math.floor(Math.random() * (max - min) + min);
            rgb.push(random);
        }
        rgb.forEach(element => {
            let hex = element.toString(16);
            if (hex.length === 1) {
                hex = '0' + hex
            }
            generatedColor += hex;
        })
        setColor("#" + generatedColor);
    }, []);

    return color;
}
