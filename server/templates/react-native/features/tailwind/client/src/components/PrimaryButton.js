import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

export default function PrimaryButton({ onPress, title }) {
    return (
        <StyledButton onPress={onPress} className="bg-blue-500 py-3 px-8 rounded-lg items-center active:bg-blue-600">
            <StyledText className="text-white text-lg font-semibold">{title}</StyledText>
        </StyledButton>
    );
}
