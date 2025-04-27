import Lottie from 'lottie-react';
import { ArrowLeftIcon } from 'lucide-react';
import error404 from '@/assets/error404.json';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-grow items-center justify-center w-100% bg-lightTheme"
            style={{ height: 'calc(100vh - 66px)' }}
        >
            <div className="text-center">
                <Lottie
                    animationData={error404}
                    loop={true}
                    autoplay={true}
                    className="w-60 h-60 mx-auto"
                />
                <h2 className="text-xl md:text-3xl text-gray-800  font-semibold">
                    Oops! Something went wrong.
                </h2>
                <p className="text-sm md:text-lg text-gray-600 mt-2">
                    The page you are looking for doesn&apos;t exist or has been
                    moved.
                </p>
                <div className="flex flex-col items-center">
                    <Button
                        variant="default"
                        onClick={() => navigate('/')}
                        className="mt-3 flex items-center gap-2"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
