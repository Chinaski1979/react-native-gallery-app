import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native';
import { useInfiniteQuery } from "@tanstack/react-query";
import { UNSPLASH_KEY, FILTER_OPTIONS } from "../constants";
import Filter from "../components/Filter";

export interface ISearchParams {
  orientation: string;
  color: string;
}

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

export default function HomeScreen({ navigation }) {
  const [searchParams, setParams] = useState(initialsearchParams);
  const { data, fetchNextPage, refetch, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: ({ pageParam }) => fetchPhotos(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
  });

  useEffect(() => {
    fetchNextPage();
  }, []);

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
            <View style={styles.viewpic}>
              <Image style={styles.image} source={{uri: item?.urls?.small}}/>
            </View>
          )}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewpic: {
    flex: 1,
    flexWrap:'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
    //backgroundColor:
  },
  image: {
    justifyContent: 'center',
    height: 300,
    width: Dimensions.get('window').width,
    margin:6,
    backgroundColor: 'red',
  }
});