import './Layout.css';

import Corda from '/src/components/Corda/Corda';
import { Outlet } from "react-router";

export default function Layout() {
    return (
        <>
            <Outlet />
            <div className='corda-1'>
                <Corda idx={1} />
            </div>

            <div className='corda-2'>
                <Corda idx={2} />
            </div>

            <div className='corda-3'>
                <Corda idx={3} />
            </div>

            <div className='corda-4'>
                <Corda idx={4} />
            </div>
        </>
    );
}