export type Product = { id:string; name:string; category:"Snack"|"Minuman"; description:string; price:number; weightGram:number; emoji:string; accent:string; badge?:string };
export const products: Product[] = [
{id:"krupuk-bawang",name:"Kerupuk Bawang Renyah",category:"Snack",description:"Gurih ringan, kriuknya tahan lama.",price:18000,weightGram:120,emoji:"🧄",accent:"sun",badge:"Paling laku"},
{id:"kerupuk-seaweed",name:"Kerupuk Seaweed",category:"Snack",description:"Asin umami dengan taburan rumput laut.",price:22000,weightGram:120,emoji:"🌿",accent:"mint"},
{id:"kerupuk-pedas",name:"Kerupuk Pedas Manis",category:"Snack",description:"Pedas ramah, manisnya pas.",price:21000,weightGram:120,emoji:"🌶️",accent:"coral",badge:"Baru"},
{id:"kombucha-lemon",name:"Kombucha Lemon",category:"Minuman",description:"Segar, sparkling, dan sedikit asam.",price:19000,weightGram:350,emoji:"🍋",accent:"lemon"},
{id:"susu-kedelai",name:"Susu Kedelai Original",category:"Minuman",description:"Creamy tanpa rasa enek.",price:16000,weightGram:350,emoji:"🥛",accent:"cream"},
{id:"teh-peach",name:"Sparkling Peach Tea",category:"Minuman",description:"Aroma peach lembut, dingin lebih nikmat.",price:18000,weightGram:350,emoji:"🍑",accent:"peach"}
];
export const formatRupiah=(value:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
