const API_URL = 'http://localhost:3000'; // Define your backend API URL


const saveBoardState = async (boardSize: number, path: [number, number][], currentStep: number, gigerMode: boolean, clerkId: string, token: string | null) => {
    // Implement the logic to save the board state to your backend or storage mechanism
    // This might involve making a POST request to your backend API

    const response = await fetch(`${API_URL}/chess`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            boardSize,
            path,
            currentStep,
            gigerMode,
            clerkId
        })
    });

    if (!response.ok) {
        throw new Error('Failed to save board state');
    }

    return response.json();
};

export default saveBoardState;