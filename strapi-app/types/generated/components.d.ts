import type { Schema, Struct } from '@strapi/strapi';

export interface SharedArrowLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_arrow_links';
  info: {
    description: 'Call-to-action arrow link';
    displayName: 'ArrowLink';
    icon: 'arrowRight';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMediaBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_blocks';
  info: {
    description: 'Flexible media block supporting images and videos';
    displayName: 'MediaBlock';
    icon: 'picture';
  };
  attributes: {
    altText: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    mediaType: Schema.Attribute.Enumeration<['image', 'video']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'image'>;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SharedNavItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_items';
  info: {
    description: 'Navigation menu item';
    displayName: 'NavItem';
    icon: 'link';
  };
  attributes: {
    hasDropdown: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedSeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_metas';
  info: {
    description: 'SEO metadata for pages and content';
    displayName: 'SeoMeta';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media link with icon';
    displayName: 'SocialLink';
    icon: 'earth';
  };
  attributes: {
    ariaLabel: Schema.Attribute.String & Schema.Attribute.Required;
    platform: Schema.Attribute.Enumeration<
      ['x', 'linkedin', 'youtube', 'github', 'dribbble']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    description: 'Reusable label tag for categorization';
    displayName: 'Tag';
    icon: 'hashtag';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['cyan', 'violet', 'green', 'orange', 'default']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.arrow-link': SharedArrowLink;
      'shared.media-block': SharedMediaBlock;
      'shared.nav-item': SharedNavItem;
      'shared.seo-meta': SharedSeoMeta;
      'shared.social-link': SharedSocialLink;
      'shared.tag': SharedTag;
    }
  }
}
