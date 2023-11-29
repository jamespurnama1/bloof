declare global {

  declare type reservationTime = {
    time: String;
    available: Boolean;
  };

  declare type purpose = {
    bookPurposeID: Number;
    purposeNameId: String;
    purposeNameEn: String;
  };

  declare type reservationPurpose = {
    reservationPurpose: purpose[]
  };

  declare type reservationTimes = {
    reservationTime: reservationTime[];
  };

  declare type media = {
    name?: String;
    url: URL;
    imgix_url: URL;
  };

  declare type extraMetadata = {
    id: String;
    bucket: String;
    created_at: Date;
    modified_at: Date;
    status: 'published' | 'draft';
    thumbnail: URL;
    published_at: Date;
    modified_by: String;
    created_by: String;
    type: String;
  };

  declare type landingData = {
    object: {
      metadata: {
        hero_image: media;
        socials: {[key: string]: String};
        happening: happening & extraMetadata;
        location: { address: String; lng: Number; lat: Number; };
      };
    };
  };

  declare type galleryData = {
    media: media[];
    total: Number;
  };

  declare type eventsData = {
    object: {
      metadata: {
        description: String;
        brochures?: URL[];
        call_to_action: String;
        more_description: String;
      };
    };
  };

  declare type happening = {
    slug: String;
    title: String;
    metadata: {
      thumbnail: media;
      type: {
        key: String;
        value: String;
      };
      post: String;
    };
  };

  declare type happeningsData = {
    objects: happening[];
    total: Number;
  };

  declare type menuData = {
    object: {
      metadata: {
        thumbnail: media;
        pdf: {
          url: URL;
          imgix_url: URL;
        };
      };
    };
  };
};

export {};
