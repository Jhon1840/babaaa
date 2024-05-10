import {AnimationObject} from 'lottie-react-native';

export interface OnboardingDataI {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const OnboardingData: OnboardingDataI[] = [
  {
    id: 1,
    animation: require('../assets/animations/LottieHealth.json'),
    text: 'Visualiza el estado de Salud',
    textColor: '#009',
    backgroundColor: '#bae4fd',
  },
  {
    id: 2,
    animation: require('../assets//animations/LottieLocation.json'),
    text: 'Conoce la ubicacion en Tiempo Real',
    textColor: '#1e2169',
    backgroundColor: '#baf8fd',
  },
  {
    id: 3,
    animation: require('../assets//animations/LottieAlert.json'),
    text: 'Alertas Inteligentes',
    textColor: '#009',
    backgroundColor: '#bae2fc',
  },
];

export default OnboardingData;