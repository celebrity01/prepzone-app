// Static images for scenarios
// Images are loaded from external sources as needed

// Helper function to get a random image for a scenario type
export const getScenarioImage = (scenarioKey: string): string => {
  const images = imageManifest[scenarioKey];
  if (!images || images.length === 0) {
    // Fallback image
    return (
      "data:image/svg+xml;base64," +
      btoa(`
      <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#374151"/>
        <text x="50%" y="50%" font-family="Arial" font-size="32" fill="#9CA3AF" text-anchor="middle" dy=".3em">
          Scenario Image
        </text>
      </svg>
    `)
    );
  }

  // Return the first image for now, or implement random selection
  return images[0];
};

export const imageManifest: Record<string, string[]> = {
  urbanFire: [
    "https://cdn.builder.io/api/v1/image/assets%2Fa9faa7076079432384633c394d2f8bdf%2Fcf08bfc4cb5c43ebb6b000532d477851?format=webp&width=800",
    "https://picsum.photos/seed/urbanFire2/1280/720",
    "https://picsum.photos/seed/urbanFire3/1280/720",
  ],
  floodResponse: [
    "https://cdn.builder.io/api/v1/image/assets%2Fa9faa7076079432384633c394d2f8bdf%2F20e0b30108fe41ed8ce145efe4e495ea?format=webp&width=800",
    "https://picsum.photos/seed/floodResponse2/1280/720",
    "https://picsum.photos/seed/floodResponse3/1280/720",
  ],
  roadAccident: [
    "https://cdn.builder.io/api/v1/image/assets%2Fa9faa7076079432384633c394d2f8bdf%2Fe763a03a5a3047a98f242060d9ba1ef7?format=webp&width=800",
    "https://picsum.photos/seed/roadAccident2/1280/720",
    "https://picsum.photos/seed/roadAccident3/1280/720",
  ],
  marketplaceStampede: [
    "https://cdn.builder.io/api/v1/image/assets%2Fa9faa7076079432384633c394d2f8bdf%2Fcfcb4cd5c5314c9dbf95628cf366db0c?format=webp&width=800",
    "https://picsum.photos/seed/marketplaceStampede2/1280/720",
    "https://picsum.photos/seed/marketplaceStampede3/1280/720",
  ],
};
