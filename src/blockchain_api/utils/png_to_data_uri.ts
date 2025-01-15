export async function convert_png_to_data_uri(url: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image as a blob
    const blob = await response.blob();

    // Convert the blob to a data URL using FileReader
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // Resolve with the data URL
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Read blob as data URL
    });
  } catch (error) {
    console.error('Error converting PNG to data URL:', error);
    throw error;
  }
}
