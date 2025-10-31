import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Container from "./Container";
import Title from "./Title";
import tw from "twrnc";
import axios from "axios";
import { GOOGLE_API_KEY } from "@/config";
import { useDispatch } from "react-redux";
import { setDestination } from "@/store/uberSlices";
import NavFavorite from "./NavFavourite";
import { TabBarIcon } from "./navigation/TopBarIcon";
import RiderCard from "./RiderCard";

// ✅ Debounce Hook
function useDebouncedCallback<T extends (...args: any[]) => void>(cb: T, wait = 400) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = (setTimeout(() => cb(...args), wait) as unknown) as number;
    },
    [cb, wait]
  );

  return debounced;
}

const NavigateCard = () => {
  const [showRider, setShowRider] = useState(false);
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
          components: "country:ke",
        },
      });
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

      const location = details?.data?.result?.geometry?.location;

      dispatch(
        setDestination({
          location,
          description: place?.description,
        })
      );

      setQuery(place.description);
      setPredictions([]);
      setShowRider(true);
    } catch (err) {
      console.error("Place details error:", err);
    }
  };

  const onChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <Container>
      {showRider ? (
        <RiderCard setShowRider={setShowRider} />
      ) : (
        <>
          <Title className="text-xl text-center">Hello, Noor</Title>
          <View>
            {/* ✅ Custom Autocomplete Input */}
            <View style={inputBoxStyles.container}>
              <TextInput
                style={inputBoxStyles.textInput}
                placeholder="Where From?"
                value={query}
                onChangeText={onChangeText}
              />
              {loading && <ActivityIndicator style={{ marginTop: 8 }} size="small" />}
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={inputBoxStyles.suggestionItem}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={inputBoxStyles.suggestionText}>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <NavFavorite />

            <View
              style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-t-gray-200`}
            >
              <TouchableOpacity
                onPress={() => setShowRider(true)}
                style={tw`flex-row items-center justify-between bg-black w-24 px-4 py-3 rounded-full`}
              >
                <TabBarIcon name="car" color={"white"} size={20} />
                <Text style={tw`text-white`}>Rides</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex flex-row items-center justify-between w-24 px-4 py-3 rounded-full border border-gray-300`}
              >
                <TabBarIcon name="fast-food-outline" color="black" size={20} />
                <Text style={tw`text-center ml-1`}>Eats</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </Container>
  );
};

const inputBoxStyles = StyleSheet.create({
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

export default NavigateCard;
