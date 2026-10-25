import type { TypedObject } from '@portabletext/types';

declare global {
  declare type reservationTime = {
    time: string;
    available: boolean;
  };

  declare type purpose = {
    bookPurposeID: number;
    purposeNameId: string;
    purposeNameEn: string;
  };

  declare type reservationPurpose = {
    reservationPurpose: purpose[];
  };

  declare type reservationTimes = {
    reservationTime: reservationTime[];
  };

  declare type CmsImage = {
    url: string | null;
    assetId?: string;
    alt?: string;
    name?: string;
  };

  declare type CmsRichText = string | TypedObject[];

  declare type Happening = {
    slug: string;
    title: string;
    publishedAt?: string;
    category: 'ongoing' | 'upcoming' | 'happy_hours' | 'collaborations';
    thumbnail: CmsImage | null;
    body?: CmsRichText;
  };

  declare type LandingData = {
    heroImage: CmsImage | null;
    socials: Record<string, string>;
    featuredHappening: Happening | null;
    location: { address?: string; lng?: number; lat?: number } | null;
    privateRooms: {
      bloofEye: CmsImage | null;
      bloofBelly: CmsImage | null;
    } | null;
    regulation?: CmsRichText;
  };

  declare type GalleryData = { media: CmsImage[] };

  declare type EventsData = {
    description: CmsRichText;
    brochures: CmsImage[];
    callToAction: string;
    moreDescription: CmsRichText;
  };

  declare type MenuData = {
    subhead: string;
    coverImage: CmsImage | null;
    pdfUrl?: string;
    foodPages: CmsImage[];
    drinkPages: CmsImage[];
    breakfastPages: CmsImage[];
  };
}

export {};
