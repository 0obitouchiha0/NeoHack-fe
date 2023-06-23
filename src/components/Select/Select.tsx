import React from 'react';
import Label from '../Label/Label';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { DownOutlined } from '@ant-design/icons';

interface SelectProps {
    labelText: string, 
    options: {value: number | string, text: string}[],
    isRequired: boolean,
    error?: string,
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(({labelText, options, isRequired, error, ...rest}, ref) => {
    return (
        <div className={styles.container} ref={ref}>
            <Label text={labelText} isRequired={isRequired} htmlFor="select"/>
            <select
                {...rest}
                name="select"
                className={clsx(styles.container__select, error && styles['container__select--error'])}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.text}</option>  
                ))}
            </select>
            <DownOutlined className={styles.container__arrow}/>
            {error && <span className={styles.container__error}>{error}</span>}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;