import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart = () => {
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "ROBE SCULPTURALE NOIR",
      category: "HAUTE COUTURE",
      price: 26600,
      image: "/robe-noir.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "SAC SCULPTÉ CUIR",
      category: "ACCESSOIRES",
      price: 28000,
      image: "/sac-en-cuir.jpg",
      quantity: 1,
    },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemsCount={cartItems.length} onCartClick={() => { }} />

      {/* HERO */}
      <section className="relative h-[60vh] flex items-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-section-un.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 container mx-auto px-8">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
            Votre Panier
          </h1>
          <p className="text-sm tracking-widest uppercase text-white/70">
            Vérifiez vos sélections
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24">
        <div className="container mx-auto px-8 grid lg:grid-cols-3 gap-16">
          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-12">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row gap-8 border-b pb-12"
              >
                {/* Image */}
                <div className="w-full md:w-48 h-[280px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <h3 className="text-2xl font-light mb-4">
                      {item.name}
                    </h3>
                    <p className="text-lg">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center border px-4 py-2">
                      <button className="px-2 text-lg">−</button>
                      <span className="px-4">{item.quantity}</span>
                      <button className="px-2 text-lg">+</button>
                    </div>

                    <button className="text-xs tracking-widest uppercase text-gray-500 hover:text-black transition">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="border p-10 h-fit">
            <h2 className="text-2xl font-light mb-8">
              Récapitulatif
            </h2>

            <div className="space-y-4 text-sm tracking-widest uppercase">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
            </div>

            <div className="border-t mt-8 pt-6 flex justify-between text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <a
              href="/checkout"
              className="block mt-10 text-center border border-black py-4 rounded-full text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              Passer au paiement
            </a>

            <a
              href="/"
              className="block mt-6 text-center text-xs tracking-widest uppercase text-gray-500 hover:text-black transition"
            >
              Continuer vos achats
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
