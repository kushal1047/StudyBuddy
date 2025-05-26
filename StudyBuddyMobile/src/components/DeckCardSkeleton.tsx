import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function DeckCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <SkeletonPlaceholder>
        <View>
          <View
            style={{ width: 200, height: 20, borderRadius: 4, marginBottom: 8 }}
          />
          <View
            style={{
              width: 150,
              height: 16,
              borderRadius: 4,
              marginBottom: 12,
            }}
          />
          <View style={{ width: 80, height: 24, borderRadius: 12 }} />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}
