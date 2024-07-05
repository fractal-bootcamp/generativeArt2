


const saveBoardState = async (boardState: any, clerkId: string, token: string | null) => {
    // Implement the logic to save the board state to your backend or storage mechanism
    // This might involve making a POST request to your backend API

    const response = await fetch('http://localhost:3002/chess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            clerkId,
            boardState
        })
    });

    if (!response.ok) {
        throw new Error('Failed to save board state');
    }

    return response.json();
};

export default saveBoardState;