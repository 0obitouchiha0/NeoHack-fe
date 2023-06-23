import React from 'react';
import styles from './styles.module.scss';

interface LabelProps {
    text: string,
    htmlFor: string,
    isRequired: boolean
}

function Label({text, htmlFor, isRequired}: LabelProps) {
    return (
        <label htmlFor={htmlFor} className={styles.label}>{text} {isRequired && <span data-testid="labelRequiredStar">*</span>}</label>
    );
}

export default Label; 
