import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  // Palette de couleurs
  const colors = {
    black: '#000000',
    mediumGray: '#333333',
    lightGray: '#666666',
    white: '#ffffff'
  };

  const footerColumns = [
    {
      title: 'Collections',
      items: ['Haute Couture', 'Prêt-à-porter', 'Accessoires', 'Bijoux']
    },
    {
      title: 'Services',
      items: ['Sur Mesure', 'Location', 'Essayage Privé', 'Conseil Stylisme']
    },
    {
      title: 'Information',
      items: ['Contact', 'Livraison', 'Retours', 'CGV']
    }
  ];

  const socialIcons = [
    { icon: <FaInstagram className="h-5 w-5" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaFacebook className="h-5 w-5" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTiktok className="h-5 w-5" />, href: 'https://tiktok.com', label: 'Tiktok' }
  ];

  return (
    <footer className="py-16" style={{ backgroundColor: colors.black, color: colors.white }}>
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-sm tracking-widest uppercase mb-6">CAPRICE</h3>
            <p className="text-sm mb-6" style={{ color: colors.lightGray }}>
              Maison de couture contemporaine. Créations exclusives depuis 2010.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column, index) => (
            <div key={index}>
              <h4 className="text-sm tracking-widest uppercase mb-6">{column.title}</h4>
              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                      className="text-sm hover:text-gray-400 transition-colors"
                      style={{ color: colors.lightGray }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8" style={{ borderColor: colors.mediumGray }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0" style={{ color: colors.lightGray }}>
              © {new Date().getFullYear()} CAPRICE. Tous droits réservés.
            </p>
            <div className="text-sm" style={{ color: colors.lightGray }}>
              <p>Cote d'ivoire • Abidjan</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;