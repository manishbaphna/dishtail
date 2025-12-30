import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
}

const BASE_URL = 'https://www.dishtail.com';
const DEFAULT_TITLE = 'dishtail - Find Recipes by Ingredients';
const DEFAULT_DESCRIPTION = 'Discover delicious recipes using the ingredients you have. dishtail helps you find vegetarian, healthy, and quick recipes tailored to your pantry.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title ? `${title} | dishtail` : DEFAULT_TITLE;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="dishtail" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

// Structured Data Components
export const WebsiteSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'dishtail',
        url: BASE_URL,
        description: DEFAULT_DESCRIPTION,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      })}
    </script>
  </Helmet>
);

export const OrganizationSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'dishtail',
        url: BASE_URL,
        logo: `${BASE_URL}/dishtail-logo.png`,
        sameAs: [],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          url: `${BASE_URL}/contact`,
        },
      })}
    </script>
  </Helmet>
);

interface RecipeSchemaProps {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  isVegetarian?: boolean;
}

export const RecipeSchema = ({
  name,
  description,
  ingredients,
  instructions,
  prepTime,
  cookTime,
  servings,
  isVegetarian,
}: RecipeSchemaProps) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name,
        description,
        recipeIngredient: ingredients,
        recipeInstructions: instructions.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text: step,
        })),
        ...(prepTime && { prepTime: `PT${prepTime}` }),
        ...(cookTime && { cookTime: `PT${cookTime}` }),
        ...(servings && { recipeYield: `${servings} servings` }),
        ...(isVegetarian && {
          suitableForDiet: 'https://schema.org/VegetarianDiet',
        }),
      })}
    </script>
  </Helmet>
);

export default SEO;
