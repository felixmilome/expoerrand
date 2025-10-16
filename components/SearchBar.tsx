import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "@/store/uberSlices";
import { GOOGLE_API_KEY } from "@/config";

// ✅ Debounce Hook
function useDebouncedCallback<T extends (...args: any[]) => void>(cb: T, wait = 400) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debounced = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = (setTimeout(() => cb(...args), wait) as unknown) as number;
  }, [cb, wait]);

  return debounced;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchPredictions = async (input: string) => {
    if (!input.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
        params: {
          input,
          key: GOOGLE_API_KEY,
          language: "en",
          components: "country:ke", // limit to Kenya, change if needed
        },
      });
      console.log(res?.data)
      setPredictions(res.data.predictions || []);
    } catch (err) {
      console.error("Google Autocomplete Error:", err);
    } finally {
      setLoading(false);
      
    }
  };

  const debouncedSearch = useDebouncedCallback(fetchPredictions, 400);

  const handleSelect = async (place: any) => {
    try {
      const details = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
        params: {
          place_id: place.place_id,
          key: GOOGLE_API_KEY,
          fields: "geometry,name,formatted_address",
        },
      });
      console.log(details?.data)

      const location = details.data.result.geometry.location;

      dispatch(
        setOrigin({
          location,
          description: place.description,
        })
      );
      dispatch(setDestination(null));
      setQuery(place.description);
      setPredictions([]);
    } catch (err) {
      console.error("Place details error:", err);
    }
  };

  const onChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Where From?"
        value={query}
        onChangeText={onChangeText}
      />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} size="small" />}
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelect(item)}>
            <Text style={styles.suggestionText}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    flex: 0,
    borderRadius: 10,
    padding: 10,
  },
  textInput: {
    fontSize: 18,
    backgroundColor: "#DDDDDD20",
    borderWidth: 1,
    borderColor: "#00000050",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default SearchBar;
