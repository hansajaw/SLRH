import TopBar from '../../components/TopBar';
import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <>
      <TopBar title="My Profile" />
      <View style={{flex:1, backgroundColor:'#0b0b0b', padding:16}}>
        <Text style={{color:'#fff'}}>Login / Profile details here</Text>
      </View>
    </>
  );
}
