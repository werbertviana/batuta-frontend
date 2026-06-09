import React, { useEffect } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Awesome from 'react-native-vector-icons/FontAwesome5';

import { useAuth } from '../contexts/AuthContext';
import { preloadAllTutorialImages } from '../screens/tutorial/TutorialScreen';

import Home from '../pages/home/Home';
import Profile from '../pages/profile/Profile';
import Elos from '../pages/elos/Elos';

const EloIcon = require('../assets/icons/elo.png');
const ProfileIcon = require('../assets/icons/profile.png');

const Tab = createBottomTabNavigator();

const TabIconBox = ({ children }) => (
  <View
    style={{
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {children}
  </View>
);

function TabNavigation() {
  const { hasSeenTutorial } = useAuth();

  useEffect(() => {
    preloadAllTutorialImages();
  }, []);

  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor="#757575"
        barStyle="light-content"
      />

      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#8f8f8f',
          tabBarStyle: {
            height: 60,
            borderTopWidth: 1,
            borderTopColor: '#D2D3D5',
          },
          tabBarIconStyle: {
            flex: 1,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <TabIconBox>
                <Awesome name="home" color={color} size={32} />
              </TabIconBox>
            ),
          }}
        />

        <Tab.Screen
          name="Elos"
          component={Elos}
          listeners={({ navigation }) => ({
            tabPress: e => {
              if (hasSeenTutorial('elos')) return;

              e.preventDefault();

              navigation.navigate('Tutorial', {
                tutorialKey: 'elos',
                returnTo: 'Tab',
                returnParams: {
                  screen: 'Elos',
                },
                resetAfterFinish: true,
              });
            },
          })}
          options={{
            tabBarIcon: ({ color }) => (
              <TabIconBox>
                <Image
                  source={EloIcon}
                  resizeMode="contain"
                  style={{
                    width: 38,
                    height: 38,
                    tintColor: color,
                  }}
                />
              </TabIconBox>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          listeners={({ navigation }) => ({
            tabPress: e => {
              if (hasSeenTutorial('profile')) return;

              e.preventDefault();

              navigation.navigate('Tutorial', {
                tutorialKey: 'profile',
                returnTo: 'Tab',
                returnParams: {
                  screen: 'Profile',
                },
                resetAfterFinish: true,
              });
            },
          })}
          options={{
            tabBarIcon: ({ color }) => (
              <TabIconBox>
                <Image
                  source={ProfileIcon}
                  resizeMode="contain"
                  style={{
                    width: 36,
                    height: 36,
                    tintColor: color,
                  }}
                />
              </TabIconBox>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default TabNavigation;