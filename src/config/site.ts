export type ProductKind = 'robe' | 'ensemble';

export type ProductConfig = {
  order: number;
  title?: string;
  kind?: ProductKind;
  price?: number;
};

export const DEFAULT_PRICE = 50;

export type CollectionConfig = {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  products?: ProductConfig[];
};

export const siteConfig = {
  name: 'Heritage Dresses by Hady',
  shortName: 'Heritage Dresses',
  tagline: 'Haute couture africaine, livree en France',
  description:
    'Heritage Dresses by Hady — creations exclusives de robes et ensembles africains. Tissus premium, confection soignee, livraison en France.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://heritagedressesbyhady.com',
  location: 'France',
  countryCode: 'FR',
  phone: '+33763954075',
  snapchat: 'heritagedresses',
  instagram: 'heritagedresses',
  keywords: [
    'tenue africaine France',
    'robe africaine',
    'boubou femme',
    'ensemble wax',
    'mode africaine France',
    'tenue africaine femme',
    'robe wax France',
    'collection africaine elegante',
  ],
  social: {
    whatsapp: 'https://wa.me/33763954075',
    instagram: 'https://www.instagram.com/heritagedresses/',
    snapchat: 'https://www.snapchat.com/add/heritagedresses',
  },
  navigation: [
    { href: '/', label: 'Accueil' },
    { href: '/collections', label: 'Collections' },
    { href: '/contact', label: 'Contact' },
  ],
  collections: [
    {
      slug: 'asmaw',
      name: 'Asmaw',
      description: 'Des robes fluides aux tons terre et prune, mariees a des ensembles amples d\'une elegance intemporelle. La collection star de la maison.',
      shortDescription: 'Elegance intemporelle, tons terre et prune.',
      products: [
        { order: 1, kind: 'robe' },
        { order: 2, kind: 'robe' },
        { order: 3, kind: 'robe' },
        { order: 4, kind: 'ensemble' },
        { order: 5, kind: 'ensemble' },
        { order: 6, kind: 'ensemble' },
        { order: 7, kind: 'robe' },
        { order: 8, kind: 'ensemble' },
        { order: 9, kind: 'ensemble' },
        { order: 10, kind: 'ensemble' },
        { order: 11, kind: 'robe' },
        { order: 12, kind: 'ensemble' },
        { order: 13, kind: 'robe' },
        { order: 14, kind: 'ensemble' },
        { order: 15, kind: 'ensemble' },
        { order: 16, kind: 'ensemble' },
        { order: 17, kind: 'robe' },
        { order: 18, kind: 'robe' },
        { order: 19, kind: 'robe' },
        { order: 20, kind: 'robe' },
        { order: 21, kind: 'robe' },
        { order: 22, kind: 'robe' },
        { order: 23, kind: 'robe' },
      ],
    },
    {
      slug: 'adja',
      name: 'Adja',
      description: 'Des drapes majestueux et des coupes structurees qui epousent le corps avec grace. Pour celles qui aiment l\'audace maitrisee.',
      shortDescription: 'Drapes majestueux et coupes structurees.',
      products: [
        { order: 1, kind: 'robe' },
        { order: 2, kind: 'robe' },
        { order: 3, kind: 'ensemble' },
        { order: 4, kind: 'robe' },
        { order: 5, kind: 'robe' },
        { order: 6, kind: 'robe' },
        { order: 7, kind: 'robe' },
        { order: 8, kind: 'robe' },
        { order: 9, kind: 'robe' },
        { order: 10, kind: 'ensemble' },
        { order: 11, kind: 'robe' },
        { order: 12, kind: 'ensemble' },
        { order: 13, kind: 'ensemble' },
        { order: 14, kind: 'ensemble' },
        { order: 15, kind: 'ensemble' },
      ],
    },
    {
      slug: 'zeynah',
      name: 'Zeynah',
      description: "Des ensembles coordonnes aux coupes genereuses et motifs graphiques. L'assurance d'un look remarque a chaque occasion.",
      shortDescription: 'Coupes genereuses et motifs graphiques.',
      products: [
        { order: 1, kind: 'ensemble' },
        { order: 2, kind: 'ensemble' },
        { order: 3, kind: 'ensemble' },
        { order: 4, kind: 'ensemble' },
        { order: 5, kind: 'ensemble' },
        { order: 6, kind: 'ensemble' },
        { order: 7, kind: 'ensemble' },
        { order: 8, kind: 'ensemble' },
        { order: 9, kind: 'ensemble' },
        { order: 10, kind: 'ensemble' },
      ],
    },
    {
      slug: 'diama',
      name: 'Diama',
      description: 'Une piece unique, ample et drapee, qui incarne l\'essence meme de Heritage Dresses. Edition limitee.',
      shortDescription: 'Piece unique en edition limitee.',
      products: [{ order: 1, kind: 'robe' }],
    },
    {
      slug: 'safa',
      name: 'Safa',
      description: 'Des ensembles satines aux couleurs vibrantes, parfaits pour les grandes occasions. Le raffinement a l\'etat pur.',
      shortDescription: 'Satine vibrant pour grandes occasions.',
      products: [
        { order: 1, kind: 'ensemble' },
        { order: 2, kind: 'ensemble' },
        { order: 3, kind: 'ensemble' },
        { order: 4, kind: 'ensemble' },
      ],
    },
    {
      slug: 'rita',
      name: 'Rita',
      description: 'Des robes longues boutonnees aux coupes fluides et manches papillon, declinees dans des teintes elegantes. La feminite dans toute sa simplicite raffinee.',
      shortDescription: 'Robes boutonnees fluides et manches papillon.',
      products: [
        { order: 1, kind: 'robe', price: 35 },
        { order: 2, kind: 'robe', price: 35 },
        { order: 3, kind: 'robe', price: 35 },
      ],
    },
    {
      slug: 'maria',
      name: 'Maria',
      description: 'Une collection elegante aux lignes epurees et au raffinement discret. Des pieces pensees pour sublimer chaque silhouette.',
      shortDescription: 'Lignes epurees et raffinement discret.',
      products: [
        { order: 1, kind: 'ensemble', price: 45 },
        { order: 2, kind: 'ensemble', price: 45 },
        { order: 3, kind: 'ensemble', price: 45 },
        { order: 4, kind: 'ensemble', price: 45 },
        { order: 5, kind: 'ensemble', price: 45 },
      ],
    },
    {
      slug: 'safia',
      name: 'Safia',
      description: 'Des creations delicates aux finitions soignees, entre tradition et modernite. Pour une allure elegante en toute occasion.',
      shortDescription: 'Finitions soignees, entre tradition et modernite.',
      products: [
        { order: 1, kind: 'robe', price: 35 },
        { order: 2, kind: 'robe', price: 35 },
      ],
    },
    {
      slug: 'summer',
      name: 'Summer',
      description: 'Des pieces legeres et lumineuses, ideales pour les beaux jours. La fraicheur et l\'elegance reunies.',
      shortDescription: 'Pieces legeres et lumineuses pour les beaux jours.',
      products: [
        { order: 1, kind: 'robe', price: 35 },
        { order: 2, kind: 'robe', price: 35 },
      ],
    },
    {
      slug: 'souad',
      name: 'Souad',
      description: 'Une collection pleine de caractere aux coupes affirmees et aux details soignes. L\'elegance pour les femmes qui s\'assument.',
      shortDescription: 'Coupes affirmees et details soignes.',
      products: [
        { order: 1, kind: 'ensemble', price: 45 },
        { order: 2, kind: 'ensemble', price: 45 },
        { order: 3, kind: 'ensemble', price: 45 },
      ],
    },
    {
      slug: 'racky',
      name: 'Racky',
      description: 'Une collection pleine de caractere, melant modernite et heritage africain. Des pieces uniques pensees pour les femmes qui osent.',
      shortDescription: 'Modernite et heritage africain meles.',
      products: [
        { order: 1, kind: 'ensemble', price: 45 },
        { order: 2, kind: 'ensemble', price: 45 },
        { order: 3, kind: 'ensemble', price: 45 },
        { order: 4, kind: 'ensemble', price: 45 },
        { order: 5, kind: 'ensemble', price: 45 },
        { order: 6, kind: 'ensemble', price: 45 },
        { order: 7, kind: 'ensemble', price: 45 },
        { order: 8, kind: 'ensemble', price: 45 },
        { order: 9, kind: 'ensemble', price: 45 },
        { order: 10, kind: 'ensemble', price: 45 },
        { order: 11, price: 45 },
      ],
    },
  ] satisfies CollectionConfig[],
} as const;

export const collectionSlugMap = new Map(
  siteConfig.collections.map((collection) => [collection.slug.toLowerCase(), collection]),
);
