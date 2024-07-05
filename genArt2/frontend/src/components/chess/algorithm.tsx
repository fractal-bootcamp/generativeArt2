

export const warnsdorffsTour = (size: number): number[][] => {
    let board: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
    const moveX: number[] = [2, 1, -1, -2, -2, -1, 1, 2];
    const moveY: number[] = [1, 2, 2, 1, -1, -2, -2, -1];

    let currentX: number = 0, currentY: number = 0;
    board[currentX][currentY] = 0;

    for (let move: number = 1; move < size * size; move++) {
        let min_degree_idx: number = -1, min_deg: number = size + 1, c: number;
        let min_x: number = currentX; // Initialized to currentX as a default
        let min_y: number = currentY; // Initialized to currentY as a default
        let start: number = Math.floor(Math.random() * 8);
        for (let count: number = 0; count < 8; count++) {
            let i: number = (start + count) % 8;
            let nx: number = currentX + moveX[i];
            let ny: number = currentY + moveY[i];
            if (isSafe(nx, ny, board, size) && (c = getDegree(nx, ny, moveX, moveY, board, size)) < min_deg) {
                min_deg = c;
                min_degree_idx = i;
                min_x = nx;
                min_y = ny;
            }
        }

        if (min_degree_idx === -1) return board; // No valid move

        currentX = min_x;
        currentY = min_y;
        board[currentX][currentY] = move;
    }
    return board;
};

const getDegree = (x: number, y: number, moveX: number[], moveY: number[], board: number[][], size: number): number => {
    let count: number = 0;
    for (let i: number = 0; i < 8; i++) {
        let nx: number = x + moveX[i];
        let ny: number = y + moveY[i];
        if (isSafe(nx, ny, board, size)) count++;
    }
    return count;
};

const isSafe = (x: number, y: number, sol: number[][], size: number): boolean => {
    return x >= 0 && x < size && y >= 0 && y < size && sol[x][y] === -1;
};
