import * as React from 'react';
import { MessageDescriptor } from 'react-intl';
/**
 * TODO: A lot of these props should extend `FieldProps`
 */
interface ColorPickerInputProps {
    intlLabel: MessageDescriptor;
    /**
     * TODO: this should be extended from `FieldInputProps['onChange']
     * but that conflicts with it's secondary usage in `HexColorPicker`
     */
    onChange: (event: {
        target: {
            name: string;
            value: string;
            type: string;
        };
    }) => void;
    attribute: {
        type: string;
        [key: string]: unknown;
    };
    name: string;
    description?: MessageDescriptor;
    disabled?: boolean;
    error?: string;
    labelAction?: React.ReactNode;
    required?: boolean;
    value?: string;
}
export declare const ColorPickerInput: React.ForwardRefExoticComponent<ColorPickerInputProps & React.RefAttributes<HTMLButtonElement>>;
export {};
