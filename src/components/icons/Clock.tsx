import React from 'react'

const Clock = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 18 18"
        >
            <g clipPath="url(#clip0_99_2383)">
                <path
                    fill="#002047"
                    d="M9 0C4.037 0 0 4.037 0 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9zm3 9.75H9A.75.75 0 018.25 9V4.5a.75.75 0 111.5 0v3.75H12a.75.75 0 110 1.5z"
                ></path>
            </g>
            <defs>
                <clipPath id="clip0_99_2383">
                    <path fill="#fff" d="M0 0H18V18H0z"></path>
                </clipPath>
            </defs>
        </svg>
    )
}

export default Clock