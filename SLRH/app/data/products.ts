import api from "../../utils/api";

export type Product = {
  id: string;
  title: string;
  price: number;
  image: { uri: string };
  description: string;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get("/products"); // Assuming /products endpoint returns product data
    return data.items.map((item: any) => ({
      id: item._id,
      title: item.title,
      price: item.price,
      image: { uri: item.image }, // Assuming image is a URL string
      description: item.description,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

