import AppRoutes from './routes/Routes';
import { Toaster } from 'sonner';

export default function App() {
    return (
        <>
            <AppRoutes />
            <Toaster richColors position="top-right" />
        </>
    ); // ❌ No <Router> here
}
