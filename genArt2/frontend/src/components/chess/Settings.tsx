

import { useState } from 'react';

interface Props {
    onUpdateSize: (size: number) => void;
}

const Settings = ({ onUpdateSize }: Props) => {
    const [size, setSize] = useState(8);

    return (
        <div>
            <label>
                Board Size:
                <input
                    type="number"
                    min="5"
                    max="12"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                />
            </label>
            <button onClick={() => onUpdateSize(size)}>Update Board</button>
        </div>
    );
};

export default Settings;
