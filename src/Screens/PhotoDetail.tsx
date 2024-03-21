import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

export interface IPhoto {
  id: string;
  urls: {
    small: string;
    full: string;
  };
  username: string;
  description: string;
  user: any;
}
interface IProps {
  route: any;
  photo: IPhoto;
}

export default function PhotoDetail({ route }: IProps) {
  console.log('route', route.params.photo);
  const { photo } = route.params;
  
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: photo?.urls?.full }} />
      <Text>{ photo.username }</Text>
      <Text>{ photo.description }</Text>
      <Text>{ `Likes ${photo.likes}` }</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    justifyContent: 'center',
    height: 400,
    width: Dimensions.get('window').width,
    margin: 6,
  }
});