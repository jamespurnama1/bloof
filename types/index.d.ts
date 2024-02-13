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
    reservationPurpose: purpose[]
  };

  declare type reservationTimes = {
    reservationTime: reservationTime[];
  };

  declare type media = {
    name?: string;
    original_name?: string;
    metadata?: {
      name: string;
    };
    url: url;
    imgix_url: url;
  };

  declare type extraMetadata = {
    id: string;
    bucket: string;
    created_at: date;
    modified_at: date;
    status: 'published' | 'draft';
    thumbnail: url;
    published_at: date;
    modified_by: string;
    created_by: string;
    type: string;
  };

  declare type landingData = {
    hero_image: media;
    socials: {[key: string]: string};
    happening: happening & extraMetadata;
    location: { address: string; lng: number; lat: number; };
    menu: {
      metadata: menuData;
    };
    private_rooms: {
      bloof_eye: media;
      bloof_belly: media;
    };
    regulation: string;
  };

  declare type photosData = {
    media: media[];
    total: number;
  };

  declare type eventsData = {
    description: string;
    brochures?: url[];
    call_to_action: string;
    more_description: string;
  };

  declare type happening = {
    slug: string;
    title: string;
    published_at?: date;
    metadata: {
      thumbnail: media;
      type: {
        key: string;
        value: string;
      };
      post: string;
    };
  };

  declare type happeningsData = {
    objects: happening[];
    total: number;
  };

  declare type menuData = {
    thumbnail: media;
    pdf: {
      url: url;
      imgix_url: url;
    };
  };
};

export {};