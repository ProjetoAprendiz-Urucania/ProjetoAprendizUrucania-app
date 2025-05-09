import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';

export const Router = () => {
    return <RouterProvider router={routes}/>
}