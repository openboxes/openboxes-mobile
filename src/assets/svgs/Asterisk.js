import React from 'react';
import Svg, {Text, TSpan, G} from 'react-native-svg';

const Asterisk = ({width,height})=>{
    return(
        <Svg width={width?width:17} height={height?height:17} viewBox="0 0 17 17">
            <G fill="none" fillRule="evenodd"  fontSize="45">
                <G fill="#3F4244">
                    <G>
                        <G>
                            <G>
                                <Text transform="translate(-54 -547) translate(38.5 253) translate(12.5 282)">
                                    <TSpan x=".162" y="44">*</TSpan>
                                </Text>
                            </G>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {Asterisk}
