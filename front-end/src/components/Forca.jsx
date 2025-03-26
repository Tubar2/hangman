import Forca0 from '/src/assets/forca/forca-0.svg';
import Forca1 from '/src/assets/forca/forca-1.svg';
import Forca2 from '/src/assets/forca/forca-2.svg';
import Forca3 from '/src/assets/forca/forca-3.svg';
import Forca4 from '/src/assets/forca/forca-4.svg';
import Forca5 from '/src/assets/forca/forca-5.svg';
import Forca6 from '/src/assets/forca/forca-6.svg';

export const forcaSprites = [
    Forca0,
    Forca1,
    Forca2,
    Forca3,
    Forca4,
    Forca5,
    Forca6,
]

export default function Forca({ wrongLetters }) {
    return (
        <img src={forcaSprites[wrongLetters.length]} alt="forca svg" />
    )
}