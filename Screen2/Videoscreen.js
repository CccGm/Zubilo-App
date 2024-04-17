import React, { useState } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import Video from 'react-native-video';

export default function Videoscreen() {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const data = [
    { id: '1', url: require('../images/Rating.mp4') },
    { id: '2', url: require('../images/Rating.mp4') },
    // Add more videos if needed
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        onScroll={e => {
          const index = Math.round(e.nativeEvent.contentOffset.y / Dimensions.get('window').height);
          setSelectedIndex(index);
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}>
            <Video
              paused={selectedIndex !== index}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
              resizeMode={'cover'}
              source={item.url}
            />
            <TouchableOpacity
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
              }}
              onPress={() => setSelectedIndex(selectedIndex === index ? -1 : index)}>
              {selectedIndex === index ? (
                <Image
                 
                />
              ) : <Image
              // source={require()}
              style={{
                width: 50,
                height: 50,
                backgroundColor: '#fff',
                borderRadius: 25,
              }}
            />}
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
