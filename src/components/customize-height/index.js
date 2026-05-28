import { ReactNode } from 'react';

import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Customize height control component.
 *
 * @param {object} props - Component props.
 * @returns {ReactNode} Component.
 */
const CustomizeHeight = ( props ) => {
	const {
		label = __( 'Minimum height of block', 'hm-immersive-block' ),
		minHeight,
		minHeightUnit,
		setAttributes,
	} = props;

	const isPx = minHeightUnit === 'px';
	const min = isPx ? '100' : '10';
	const units = useCustomUnits( {
		availableUnits: [ 'px', 'vh' ],
		defaultValues: {
			px: 640,
			vh: 100,
		},
	} );

	const handleOnChange = ( unprocessedValue ) => {
		const inputValue =
			unprocessedValue !== ''
				? parseFloat( unprocessedValue )
				: undefined;

		if ( isNaN( inputValue ) && inputValue !== undefined ) {
			return;
		}

		setAttributes( { minHeight: inputValue } );
	};

	const computedValue = useMemo( () => {
		const [ parsedQuantity ] =
			parseQuantityAndUnitFromRawValue( minHeight );
		return [ parsedQuantity, minHeightUnit ].join( '' );
	}, [ minHeight, minHeightUnit ] );

	return (
		<UnitControl
			__unstableInputWidth={ '80px' }
			isResetValueOnUnitChange
			label={ label }
			min={ min }
			units={ units }
			value={ computedValue }
			onChange={ handleOnChange }
			onUnitChange={ ( nextUnit ) =>
				setAttributes( {
					minHeightUnit: nextUnit,
				} )
			}
		/>
	);
};

export default CustomizeHeight;
