import { useEffect, useState } from 'react';

export default function useGeneratorId() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    let size = 12;
    const [id, setId] = useState({});

    useEffect(() => {
        let generatedId = "";
        for (let i = 0; i < size; i++) {
            let char = "";
            let randomLetter = Math.floor(Math.random() * alphabet.length);
            i % 2 === 0 ? char = alphabet[randomLetter].toUpperCase() : char = alphabet[randomLetter].toLowerCase()
            generatedId += char;
        }
        setId(generatedId);
        console.log('Wygenerowane id: ' + generatedId);
    }, []);

    return id;
}
