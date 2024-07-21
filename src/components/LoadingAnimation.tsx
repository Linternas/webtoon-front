import React from 'react';
import ReactLoading from 'react-loading';

type LoadingType = 'blank' | 'balls' | 'bars' | 'bubbles' | 'cubes' | 'cylon' | 'spin' | 'spinningBubbles' | 'spokes';

const LoadingAnimation: React.FC<{ type: LoadingType; color?: string }> = ({ type = 'bubbles', color = '#000' }) => <ReactLoading type={type} color={color} />;

export default LoadingAnimation;
