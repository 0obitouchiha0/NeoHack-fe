import clsx from 'clsx';
import React from 'react';
import Label from '../Label/Label';
import styles from './styles.module.scss';

interface DatePickerProps {
    labelText?: string,
    isRequired: boolean,
    error?: string,
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(({labelText, isRequired, error, ...rest}, ref) => {
    return (
        <div className={styles.container} ref={ref}>
            <Label text={labelText || ''} isRequired={isRequired} htmlFor="input"/>
            <input
                {...rest}
                type="date"
                name="input"
                className={clsx(styles.container__input, error && styles['container__input--error'])}
            />
            {error && <span className={styles.container__error}>{error}</span>}
        </div>
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;