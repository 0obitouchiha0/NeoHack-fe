import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import Label from '../Label/Label';

interface InputProps {
    isRequired: boolean,
    labelText?: string,
    placeholder?: string,
    error?: string,
    type?: string,
}

const Input = React.forwardRef<HTMLDivElement, InputProps>(({labelText, placeholder, isRequired, error, type = 'text', ...rest}, ref) => {
    return (
        <div className={styles.container} ref={ref}>
            <Label text={labelText || ''} isRequired={isRequired} htmlFor="input"/>
            <input
                {...rest}
                type={type}
                name="input" 
                placeholder={placeholder}
                className={clsx(styles.container__input, error && styles['container__input--error'])}
            />
            {error && <span className={styles.container__error}>{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;