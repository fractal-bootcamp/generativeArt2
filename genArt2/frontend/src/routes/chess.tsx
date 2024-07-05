
import { useState, useEffect } from 'react';
import Settings from '../components/chess/Settings'
import Board from '../components/chess/Board'
import { warnsdorffsTour } from '../components/chess/algorithm'


const Home = () => {
    const [boardSize, setBoardSize] = useState(8);
    const [path, setPath] = useState<[number, number][]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [gigerMode, setGigerMode] = useState<boolean>(false); // Add gigerMode state

    const handleUpdateSize = (boardSize: number) => {
        setBoardSize(boardSize);
        const tourResult = warnsdorffsTour(boardSize);
        const newPath = extractPathFromTour(tourResult);
        setPath(newPath);
        setCurrentStep(0);  // Reset current step on size change
    };

    const toggleGigerMode = () => {
        console.log('Toggling Giger mode', gigerMode)
        setGigerMode(!gigerMode);
    };


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prevStep) => {
                if (prevStep < path.length - 1) {
                    return prevStep + 1;
                } else {
                    clearInterval(timer);
                    console.log(path)
                    return prevStep;

                }
            });
        }, 10); // Update step every second

        return () => clearInterval(timer); // Clear the timer when component unmounts or path changes
    }, [path]);

    const extractPathFromTour = (tourResult: number[][]): [number, number][] => {
        let path: [number, number][] = [];
        for (let i = 0; i < tourResult.length; i++) {
            for (let j = 0; j < tourResult[i].length; j++) {
                if (tourResult[i][j] !== -1) {
                    path[tourResult[i][j]] = [i, j];
                }
            }
        }
        return path;
    };

    return (
        <div>
            <Settings onUpdateSize={handleUpdateSize} />
            <Board boardSize={boardSize} path={path} currentStep={currentStep} gigerMode={gigerMode} toggleGigerMode={toggleGigerMode} />
        </div>
    );
};

export default Home;
