import React from "react";

interface ButtonProps {
    label: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    return (
        <button
            style={{
                padding: "8px 16px",
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "4px",
            }}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;