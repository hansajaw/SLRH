export type Product = {
  id: string;
  title: string;
  price: number;      
  image: any;        
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    title: "SLRH Racing Cap",
    price: 2500,
    image: require("../../assets/store/cap.jpg"),
    description: "Official SLRH team cap with embroidered logo and breathable fit.",
  },
  {
    id: "2",
    title: "Limited Edition Jacket",
    price: 9500,
    image: require("../../assets/store/jacket.jpg"),
    description: "Premium windproof jacket for true racing enthusiasts.",
  },
  {
    id: "3",
    title: "Track T-Shirt",
    price: 3200,
    image: require("../../assets/store/shirt.jpg"),
    description: "Soft cotton tee with bold SLRH graphics. Regular fit.",
  },
];
