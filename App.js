import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Animated,
  ScrollView,
  Linking,
} from "react-native";

const App = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    searchImages();
  }, [currentPage]);

  const searchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&page=${currentPage}&client_id=5yD5kmi5coQhIw2NHxPJcl_5dwnLJ1TffUzBj8UupMY`
      );

      const data = await response.json();
      setImages(data.results);
      setLoading(false);
      setTotalPages(data.total_pages);

      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error searching images:", error);
      setLoading(false);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.urls.regular }} style={styles.image} />
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => downloadImage(item.links.download)}
      >
        <Text style={styles.downloadButtonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  const downloadImage = (downloadLink) => {
    Linking.openURL(downloadLink);
  };

  const renderLoader = () => <ActivityIndicator size="large" color="#0000ff" />;

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages / 10; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={styles.paginationButton}
          onPress={() => goToPage(i)}
        >
          <Text style={styles.paginationButtonText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return buttons;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Search Images</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for images"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" style={styles.sch} onPress={searchImages} />
      {loading ? (
        renderLoader()
      ) : (
        <Animated.View style={{ opacity: animation, flex: 1 }}>
          <FlatList
            data={images}
            keyExtractor={(item) => item.id}
            renderItem={renderImageItem}
          />
        </Animated.View>
      )}
      <View style={styles.paginationContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.paginationContainer}
        >
          {renderPaginationButtons()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: "rgb(247 254 231)",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  imageContainer: {
    marginBottom: 10,
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
    width: 390,
  },
  image: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    overflow: "hidden",
  },
  paginationButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "rgb(31 41 55)",
    borderRadius: 5,
  },
  paginationButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  downloadButton: {
    position: "absolute",
    bottom: 2,
    // right: 20,
    left: 280,
    backgroundColor: "rgba(0,0.2,0.2,0.3)",
    padding: 8,
    borderRadius: 10,
  },
  downloadButtonText: {
    color: "#fff",
  },
});

export default App;
