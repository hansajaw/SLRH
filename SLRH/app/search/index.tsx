import TopBar from '../../components/TopBar';
import { View, Text } from 'react-native';

export default function Search() {
  return (
    <>
      <TopBar title="Search" />
      <View style={{flex:1, backgroundColor:'#0b0b0b', padding:16}}>
        <Text style={{color:'#fff'}}>Search UI goes here</Text>
      </View>
    </>
  );
}
