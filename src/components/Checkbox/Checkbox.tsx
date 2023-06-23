import React from 'react';
import styles from './styles.module.scss';

interface CheckboxProps {
    checked: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    labelText?: string
}

function Checkbox({checked, onChange, labelText}: CheckboxProps) {
    return (
        <div className={styles.container}>
            <input type="checkbox" id={styles.checkbox} checked={checked} onChange={onChange}/>
            {labelText && <label htmlFor={styles.checkbox}>{labelText}</label>}
        </div>
    );
}

export default Checkbox;