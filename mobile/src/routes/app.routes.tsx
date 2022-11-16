import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base'

import { PlusCircle, SoccerBall } from 'phosphor-react-native'

import { New } from '../screens/New';
import { Bets } from '../screens/Bets';
import { Find } from '../screens/Find';
import { Details } from '../screens/Details';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const { colors, sizes } = useTheme();

    const size = sizes[6]

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarLabelPosition: 'beside-icon',
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0,
            },
        }}>
            <Screen 
                name="new"
                component={New}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: 'Novo Bolão'
                }}
            />
            <Screen 
                name="bets"
                component={Bets}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
                    tabBarLabel: 'Meus Bolões'
                }}
            />

            <Screen 
                name="find"
                component={Find}
                //desativando o botão do menu de tab, para acionalo no botão de Bets
                options={{
                    tabBarButton: () => null
                }}
            />
            <Screen 
                name="details"
                component={Details}
                //desativando o botão do menu de tab, para acionalo no botão de Bets
                options={{
                    tabBarButton: () => null
                }}
            />
        </Navigator>
    )

}
