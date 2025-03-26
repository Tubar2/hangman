import Corda0 from '/src/assets/corda/corda-0.svg';
import CordaUL from '/src/assets/corda/corda-ul.png';
import CordaUR from '/src/assets/corda/corda-ur.png';
import CordaDL from '/src/assets/corda/corda-dl.png';
import CordaDR from '/src/assets/corda/corda-dr.png';


export const cordaSprites = [
    Corda0,
    CordaUL,
    CordaUR,
    CordaDL,
    CordaDR,
]

export default function Corda({ idx }) {
    return (
        <img
            
            src={cordaSprites[idx]}
            alt="corda png"
        />
    )
}