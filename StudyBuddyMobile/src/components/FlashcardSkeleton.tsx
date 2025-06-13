import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

export default function FlashcardSkeleton() {
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
      <ContentLoader
        speed={1}
        width={350}
        height={120}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Rect x="0" y="0" rx="4" ry="4" width="80" height="12" />
        <Rect x="0" y="20" rx="4" ry="4" width="300" height="16" />
        <Rect x="0" y="50" rx="4" ry="4" width="80" height="12" />
        <Rect x="0" y="70" rx="4" ry="4" width="250" height="16" />
      </ContentLoader>
    </View>
  );
}
