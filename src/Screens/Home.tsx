import { useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useInfiniteQuery } from "@tanstack/react-query";
import { UNSPLASH_KEY, FILTER_OPTIONS } from "../constants";
import Filter from "../components/Filter";
import { IPhoto } from './PhotoDetail';
import { RootStackParamList } from '../../App';

export interface ISearchParams {
  orientation: string;
  color: string;
}

type IProps = NativeStackScreenProps<RootStackParamList, 'Home', 'MyStack'>

const fetchPhotos = async (page: number, params: ISearchParams) => {
  const orientation = params.orientation ? `&orientation=${params.orientation}` : "";
  const color = params.color ? `&color=${params.color}` : "";
  const queryParams = orientation + color;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=${page}&query=dog&client_id=${UNSPLASH_KEY}&${queryParams}`
  );
  return response.json();
};

const initialsearchParams: ISearchParams = {
  orientation: "",
  color: "",
};

export default function HomeScreen({ navigation }: IProps) {
  const [searchParams, setParams] = useState(initialsearchParams);
  const { data, fetchNextPage, refetch, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: ({ pageParam }) => fetchPhotos(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
  });

  useEffect(() => {
    fetchNextPage();
  }, [searchParams.color, searchParams.orientation]);

  const handleImagePress = (photo: IPhoto) => {
    navigation.navigate("PhotoDetail", { ...photo, username: photo.user.username });
  };

  const photos = data?.pages.flatMap((page) => page.results);

  return (
    <View style={styles.container}>
      <Filter currentSearchParams={searchParams} filteringOptions={FILTER_OPTIONS} setQueryParams={setParams} />
      <View>
        <FlatList
          data={photos}
          keyExtractor={(item, index)=> item.id }
          numColumns={1}
          renderItem={({item, index})=>(
            <TouchableOpacity style={styles.viewpic} onPress={() => handleImagePress(item)}>
              <Image style={styles.image} source={{uri: item?.urls?.small}} />
            </TouchableOpacity>
          )}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewpic: {
    flex: 1,
    flexWrap:'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    justifyContent: 'center',
    height: 300,
    width: Dimensions.get('window').width,
    margin:6,
  }
});